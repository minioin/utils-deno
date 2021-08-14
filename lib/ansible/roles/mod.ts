export * from "./swap.ts";
import { Role } from "../role.ts";

export function buildRoles(roles: Role[], buildDir?: string) {
  roles.forEach((role: Role) => {
    role.build(buildDir);
  });
}
