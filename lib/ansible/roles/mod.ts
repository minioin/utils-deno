export * from "./containers.ts";
export * from "./servertune.ts";
export * from "./ssh.ts";
export * from "./swap.ts";
export * from "./sysstat.ts";
export * from "./system.ts";
export * from "./ufw.ts";
export * from "./user.ts";

import { Role } from "../role.ts";

export function buildRoles(roles: Role[], buildDir?: string) {
  roles.forEach((role: Role) => {
    role.build(buildDir);
  });
}
