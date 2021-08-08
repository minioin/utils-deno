import { Role } from "../role.ts";
import { reboot } from "../tasks/reboot.ts";
import { waitForConnection } from "../tasks/wait.ts";

export function configureSSH() {
  return new Role("reboot").tasks([
    reboot(1, 0, true),
    waitForConnection(),
  ]);
}
