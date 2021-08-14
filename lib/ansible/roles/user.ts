import { Role } from "../role.ts";
import { lineinfile } from "../tasks/replace.ts";

export function sudoNoPassword(user = "root") {
  const nuser = `{{ user | default('${user}') }}`;
  return new Role("nopasswd-" + user).tasks([
    lineinfile(
      nuser,
      "/etc/sudoers",
      `^${nuser}`,
      `${nuser} ALL=(ALL) NOPASSWD: ALL`,
      "present",
      "visudo -cf %s",
    ),
  ]);
}

export function sudoNoPasswordGroup(group = "sudo") {
  const ngroup = `{{ group |  default('${group}') }}`;
  return new Role("nopasswd-" + group).tasks([
    lineinfile(
      ngroup,
      "/etc/sudoers",
      `^%${ngroup}`,
      `%${ngroup} ALL=(ALL) NOPASSWD: ALL`,
      "present",
    ),
  ]);
}
