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

export default function (buildDir?: string) {
  buildRoles([
    dockerInstall(),
    rancherInstall(),
    rancherUninstall(),
  ], buildDir);
}
