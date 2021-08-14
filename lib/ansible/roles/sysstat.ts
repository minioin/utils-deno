import { aptInstall } from "../tasks/apt.ts";
import { Role } from "../role.ts";

export function configureSystat(enabled = true) {
  return new Role(`sysstat-enable`).tasks([
    aptInstall("sysstat"),
    lineinfile(
      "update config",
      "/etc/default/sysstat",
      "^ENABLED=",
      `ENABLED="${enabled ? "true" : "false"}"`,
      "present",
    ),
  ]);
}
