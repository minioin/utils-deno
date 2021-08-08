import { Block } from "../lib/ansible/block.ts";
import { Playbook } from "../lib/ansible/playbook.ts";
import {
  rancherInstall,
  rancherUninstall,
} from "../lib/ansible/roles/containers.ts";
import { dockerInstall } from "../lib/ansible/roles/containers.ts";
import { configureSSH } from "../lib/ansible/roles/ssh.ts";
import { createSwap, deleteSwap } from "../lib/ansible/roles/swap.ts";
import { ufwConfig } from "../lib/ansible/roles/ufw.ts";
import {
  sudoNoPassword,
  sudoNoPasswordGroup,
} from "../lib/ansible/roles/user.ts";
import { apt } from "../lib/ansible/tasks/apt.ts";
import { dnf } from "../lib/ansible/tasks/dnf.ts";
import { enableService, startService } from "../lib/ansible/tasks/service.ts";

const buildDir = "build/playbooks";

createSwap("mkswap", "/swapfile").build(buildDir);
deleteSwap("delswap", "/swapfile").build(buildDir);
configureSSH().build(buildDir);
sudoNoPassword("root").build(buildDir);
sudoNoPasswordGroup("sudo").build(buildDir);

ufwConfig("ufw-config").build(buildDir);
dockerInstall().build(buildDir);
rancherInstall().build(buildDir);
rancherUninstall().build(buildDir);

const play = (
  name: string,
  hosts: string,
  roles: Array<string>,
  become = false,
) =>
  new Block(`${name}: ${hosts}`).hosts(hosts).become(become).roles(roles)
    .build();

const playAll = (name: string, roles: Array<string>, become = false) =>
  play(name, "all", roles, become);

const playSerially = (
  name: string,
  hosts: string,
  roles: Array<string>,
  become = false,
) =>
  new Block(`Serial ${name}: ${hosts}`).hosts(hosts).become(become).roles(roles)
    .serial(1).build();

// Playbooks
new Playbook("reboot-serially", [
  playSerially("reboot", "all", ["reboot"], true),
]).build(buildDir);

new Playbook("reboot", [
  playAll("reboot", ["reboot"], true),
]).build(buildDir);

new Playbook("nopasswd", [
  playAll("update", ["nopasswd-sudo", "nopasswd-root"], true),
]).build(buildDir);
