import { Role } from "../role.ts";
import { enableUfw, ufwLogging } from "../tasks/ufw.ts";

export function ufwConfig(name: string) {
  return new Role(name).tasks([
    ufwLogging(),
    enableUfw(),
  ]);
}
