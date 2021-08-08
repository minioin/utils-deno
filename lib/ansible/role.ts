import { writeMainYaml } from "./utils.ts";

export function role(
  name: string,
  tasks: Array<Record<string, unknown>>,
) {
  return new Role(name).tasks(tasks).build();
}

export class Role {
  name: string;
  #tasks: Array<Record<string, unknown>> = [];
  #handlers: Array<Record<string, unknown>> = [];

  constructor(name: string) {
    this.name = name;
  }

  tasks(tasks: Array<Record<string, unknown>>) {
    this.#tasks = tasks;
    return this;
  }

  handlers(handlers: Array<Record<string, unknown>>) {
    this.#handlers = handlers;
    return this;
  }

  async build(dir = "playbooks") {
    dir = `${dir}/roles/${this.name}`;
    await writeMainYaml(dir + "/meta", {
      "galaxy_info": { author: "" },
    });
    await writeMainYaml(dir + "/tasks", this.#tasks);
    await writeMainYaml(dir + "/handlers", this.#handlers);
  }
}
