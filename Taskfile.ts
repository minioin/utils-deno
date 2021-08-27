import { cmd, pipeline, task } from "./lib/taskutils.ts";
export { clean } from "./lib/taskutils.ts";

export const fmt = task(
  cmd("deno fmt ."),
);

export const lint = task(
  cmd("deno lint ."),
);

export const test = task(
  cmd("deno --unstable test"),
);

export const roles = task(
  cmd("deno run --unstable -A examples/ansible.ts"),
);

export const build = pipeline(
  fmt,
  lint,
  test,
  roles,
);
