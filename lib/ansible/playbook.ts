import { toYaml } from "./toyaml.ts";
import { ensureDir } from "https://deno.land/std/fs/mod.ts";
import { BlockInterface } from "./block.ts";
import { buildDir } from "./mod.ts";

export class Playbook {
  name: string;
  #tasks?: Array<BlockInterface>;
  #vars: Record<string, unknown> = {};

  constructor(name: string, tasks: Array<BlockInterface> = []) {
    this.name = name;
    this.#tasks = tasks;
  }

  tasks(tasks: Array<BlockInterface>) {
    this.#tasks = tasks;
    return this;
  }
  vars(vars: Record<string, unknown>) {
    this.#vars = vars;
    return this;
  }

  build(folder: string = buildDir) {
    return ensureDir(folder).then(() =>
      Deno.writeTextFile(
        `${folder}/${this.name}.yaml`,
        toYaml(this.#tasks),
      )
    );
  }
}

export function playbook(name: string, tasks: Array<BlockInterface> = []) {
  return new Playbook(name, tasks);
}
