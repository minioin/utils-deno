import { Role } from "../role.ts";
import { buildRoles } from "./mod.ts";
import {
  autoremove,
  changeReleaseSource,
  distUpgrade,
  update,
  upgrade,
} from "../tasks/apt.ts";
import { reboot, rebootRequiredDebian } from "../tasks/reboot.ts";
import { when } from "../tasks/utils.ts";
import { waitForConnection } from "../tasks/wait.ts";

export function systemUpgrade() {
  return new Role(`system-upgrade`).tasks([
    upgrade(),
  ]);
}

export function systemUpdate() {
  return new Role(`system-update`).tasks([
    update(),
  ]);
}

export function systemDistUpgrade() {
  return new Role(`system-distupgrade`).tasks([
    distUpgrade(),
    autoremove(),
  ]);
}

export function systemReboot() {
  return new Role("system-reboot").tasks([
    reboot(),
    waitForConnection(),
  ]);
}

export function rebootIfNeeded() {
  return new Role("system-reboot-if-needed").tasks([
    rebootRequiredDebian("reboot_required"),
    when("reboot_required.stat.exists", reboot()),
    waitForConnection(),
  ]);
}

/**
 * deb http://deb.debian.org/debian-security bullseye-security main contrib non-free
 */
export function changeSystemRelease(old: string, newRelease: string) {
  return new Role("system-change-release").tasks([
    changeReleaseSource(old, newRelease),
    changeReleaseSource(`${old}/updates`, `${newRelease}-security`),
  ]);
}

export default function (buildDir?: string) {
  buildRoles([
    systemUpgrade(),
    systemUpdate(),
    systemDistUpgrade(),
    systemReboot(),
    changeSystemRelease("buster", "bullseye"),
    rebootIfNeeded(),
  ], buildDir);
}
