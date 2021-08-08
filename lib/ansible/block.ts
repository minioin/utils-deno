import { identityFunction } from "./utils.ts";

export interface BlockInterface {
  name: string;
  become: boolean;
  hosts: string;
  serial?: number;
  throttle?: number;
  tasks?: Array<Record<string, unknown>>;
  roles?: Array<StringOrRoleImport>;
  handlers?: Array<Record<string, unknown>>;
}

export interface RoleImport {
  name: string;
  vars: Record<string, unknown>;
}

type StringOrRoleImport = string | RoleImport;

export class Block {
  name: string;
  #become = false;
  #hosts = "all";
  #serial: number | undefined;
  strategy?: "free" | "debug" | number;
  #throttle: number | undefined;
  #tasks?: Array<Record<string, unknown>>;
  #roles?: Array<StringOrRoleImport>;
  #handlers?: Array<Record<string, unknown>>;

  constructor(name: string, tasks: Array<Record<string, unknown>> = []) {
    this.name = name;
    this.#tasks = tasks;
  }

  tasks(tasks: Array<Record<string, unknown>>) {
    this.#tasks = tasks;
    return this;
  }

  roles(roles: Array<StringOrRoleImport>) {
    this.#roles = roles;
    return this;
  }

  throttle(n: number) {
    this.#throttle = n;
    return this;
  }
  hosts(hosts: string) {
    this.#hosts = hosts;
    return this;
  }

  serial(serial = 1) {
    this.#serial = serial;
    return this;
  }

  become(become: boolean) {
    this.#become = become;
    return this;
  }

  handlers(handlers: Array<Record<string, unknown>>) {
    this.#handlers = handlers;
    return this;
  }

  build(builder = identityFunction): BlockInterface {
    const { name } = this;
    return builder({
      name,
      become: this.#become,
      hosts: this.#hosts,
      serial: this.#serial,
      tasks: this.#tasks,
      throttle: this.#throttle,
      roles: this.#roles,
      handlers: this.#handlers,
    });
  }
}
