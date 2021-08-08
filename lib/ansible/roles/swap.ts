import { Role } from "../role.ts";
import { command } from "../tasks/command.ts";
import { lineinfile, removeInFile } from "../tasks/lineinfile.ts";
import { sysctl } from "../tasks/sysctl.ts";

export function createSwap(name: string, file = "/swapfile") {
  file = `{{ swap_file | default('${file}') }}`;
  return new Role(name).tasks([
    command(file, `dd if=/dev/zero of=${file} bs=1M count=512`),
    command("chmod", `chmod 0600 ${file}`),
    command("mkswap", `mkswap ${file}`),
    lineinfile(
      "fstab",
      "/etc/fstab",
      file,
      `${file} none swap sw 0 0`,
      "present",
    ),
    command("swapon", "swapon -a"),
    sysctl("vm.vfs_cache_pressure", "50"),
    sysctl("vm.swappiness", "1"),
  ]);
}

export function deleteSwap(name: string, file = "{{ swap_file }}") {
  return new Role(name).tasks([
    command("disable", `swapoff ${file}`),
    removeInFile(
      "fstab",
      file,
      file,
    ),
  ]);
}
