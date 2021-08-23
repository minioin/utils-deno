import { cmd, run } from "./lib/taskutils.ts";
export { clean } from "./lib/taskutils.ts";

export const fmt = run(
  cmd("deno fmt ."),
);

export const lint = run(
  cmd("deno lint ."),
);

export const test = run(
  cmd("deno --unstable test"),
);

export const roles = run(
  cmd("deno run --unstable -A examples/ansible.ts"),
);

export const build = run(
  fmt,
  lint,
  test,
  roles,
);
