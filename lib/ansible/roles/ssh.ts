import { Role } from "../role.ts";
import { permitPasswordLogin, permitRootLogin, setPort } from "../tasks/ssh.ts";
import { restartService } from "../tasks/service.ts";

export function configureSSH() {
  return new Role("ssh-config").tasks([
    setPort(22),
    permitPasswordLogin("no"),
    permitRootLogin("no"),
    restartService("sshd"),
  ]);
}
