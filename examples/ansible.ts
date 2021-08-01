import {
  apt,
  command,
  dnf,
  enableService,
  playbook,
  reboot,
  startService,
  task,
  waitForConnection,
} from "../lib/ansible.ts";

// Tasks
playbook("qemu-guest-agent-install", [
  task("install-agent", "*", [
    apt("qemu-guest-agent", "present"),
    dnf("qemu-guest-agent", "present"),
  ]),
  task("start and enable servie", "*", [
    enableService("qemu-guest-agent"),
    startService("qemu-guest-agent"),
  ]),
]);

playbook("docker-install", [
  task("docker-install-all", "*", [
    command("docker-install", "curl -fsSL https://get.docker.com | sh - "),
    enableService("docker"),
    startService("docker"),
  ], true),
]);

playbook("rancher-install", [
  task("rancher-install-all", "*", [
    command("rancher-install", "curl -sfL https://get.rancher.io | sh - "),
  ]),
]);

playbook("rancher-uninstall", [
  task("rancher-uninstall", "*", [
    command("rancher-uninstall", "rancherd-uninstall.sh"),
  ]),
]);

playbook("reboot-all", [
  task("reboot", "*", [
    reboot(1, 0, true),
    waitForConnection(),
  ]),
]);
