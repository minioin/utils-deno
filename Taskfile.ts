import {
  build as oBuild,
  cmd,
  format as fmt,
  pipeline,
  task,
  test as oTest,
} from "./lib/taskutils.ts";
export { clean, run } from "./lib/taskutils.ts";

export const format = pipeline(fmt, task(cmd("deno fmt .")));
export const lint = task(cmd("deno lint --unstable ."));
export const test = pipeline(oTest, task(cmd("deno --unstable test -j 8")));
export const roles = task(cmd("deno run --unstable -A examples/ansible.ts"));
export const build = pipeline(oBuild, format, lint, test, roles);
