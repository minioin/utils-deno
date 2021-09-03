import { Role } from "../role.ts";
import { command } from "../tasks/command.ts";
import { buildRoles } from "./mod.ts";

export function dockerInstall() {
  return new Role("docker-install").tasks([
    command("install", `bash -c "curl -fsSL https://get.docker.com | sh - "`),
  ]);
}

export function rancherInstall() {
  return new Role("rancher-install").tasks([
    command("install", `bash -c "curl -fsSL https://get.rancher.io | sh - "`),
  ]);
}

export function rancherUninstall() {
  return new Role("rancher-uninstall").tasks([
    command("uninstall", `rancherd-uninstall.sh`),
  ]);
}

export function rke2Install() {
  return new Role("rancher-install").tasks([
    command("install", pipeToSh(`https://get.rke2.io`)),
  ]);
}

export function pipeToSh(url: string) {
  return command(`bash -c 'curl -fsSL "${url}" | sh - '`);
}

export function rke2Uninstall() {
  return new Role("rancher-uninstall").tasks([
    command("uninstall", `rke2-uninstall.sh`),
  ]);
}

export default function (buildDir?: string) {
  buildRoles([
    dockerInstall(),
    rancherInstall(),
    rancherUninstall(),
  ], buildDir);
}
