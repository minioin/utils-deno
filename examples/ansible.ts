import { block, serial } from "../lib/ansible/block.ts";
import { playbook } from "../lib/ansible/playbook.ts";
import { setBuildDir } from "../lib/ansible/mod.ts";
import { configureSSH } from "../lib/ansible/roles/ssh.ts";
import { createSwap, deleteSwap } from "../lib/ansible/roles/swap.ts";
import { ufwConfig } from "../lib/ansible/roles/ufw.ts";
import systemRoles from "../lib/ansible/roles/system.ts";
import containerRoles from "../lib/ansible/roles/containers.ts";
import {
  sudoNoPassword,
  sudoNoPasswordGroup,
} from "../lib/ansible/roles/user.ts";

setBuildDir("build/playbooks");
systemRoles();
containerRoles();
createSwap("mkswap", "/swapfile").build();
deleteSwap("delswap", "/swapfile").build();
configureSSH().build();
sudoNoPassword("root").build();
sudoNoPasswordGroup("sudo").build();
ufwConfig("ufw-config").build();

const play = (
  name: string,
  hosts: string,
  roles: Array<string>,
  become = false,
) =>
  block(`${name}: ${hosts}`).hosts(hosts).become(become).roles(roles)
    .build();

const playAll = (name: string, roles: Array<string>, become = false) =>
  play(name, "all", roles, become);

const playSerially = (
  name: string,
  hosts: string,
  roles: Array<string>,
  become = false,
) =>
  serial(`Serial ${name}: ${hosts}`).hosts(hosts).become(become).roles(roles)
    .build();

// Playbooks
playbook("nopasswd", [
  playAll("update", ["nopasswd-sudo", "nopasswd-root"], true),
]).build();

playbook("system-distupgrade", [
  playAll("update", [
    "system-upgrade",
    "system-change-release",
    "system-update",
  ], true),
  playAll("upgrade", [
    "system-upgrade",
  ], true),
  playSerially("reboot", "all", ["system-reboot-if-needed"], true),
]).vars({
  "old_release": "buster",
  "new_release": "bullseye",
}).build();

playbook("system-upgrade", [
  playAll("upgrade", [
    "system-upgrade",
    "system-reboot-if-needed",
  ], true),
]).build();

playbook("system-reboot", [
  playAll("reboot", [
    "system-reboot",
  ], true),
]).build();

playbook("system-upgrade-reboot", [
  playAll("upgrade", [
    "system-upgrade",
    "system-reboot",
  ], true),
]).build();

playbook("system-upgrade-reboot-serially").tasks([
  playSerially("reboot", "all", [
    "system-upgrade",
    "system-reboot",
  ], true),
]).build();
