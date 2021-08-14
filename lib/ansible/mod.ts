export * as tasks from "./tasks/mod.ts";
export * from "./block.ts";
export * from "./playbook.ts";
export * from "./role.ts";
export * from "./toyaml.ts";

export let buildDir = "playbooks";

export function setBuildDir(input: string) {
  buildDir = input;
}
