import { json2yaml } from "https://deno.land/x/json2yaml/mod.ts";
import { ensureDir } from "https://deno.land/std/fs/mod.ts";

const registeredTasks: Record<string, unknown> = {};

export function command(
  name: string,
  command: string,
): Record<string, unknown> {
  return {
    name,
    command,
  };
}

export function localAction(
  name: string,
  localAction: string,
): Record<string, unknown> {
  return {
    name,
    "local_action": localAction,
  };
}

export function toYaml(input: unknown) {
  const jsonString = JSON.stringify(input);
  return "---\n" + json2yaml(jsonString);
}

interface GalaxyInfo {
  author?: string;
  description?: string;
  license?: string;
  "min_ansible_version"?: number;
  "galaxy_tags"?: string[];
}

export async function writeMainYaml(path: string, info: unknown) {
  await ensureDir(path);
  return Deno.writeTextFile(path + "/main.yaml", toYaml(info));
}

export async function role(name: string, task: Array<Record<string, unknown>>) {
  const dir = `roles/${name}`;
  await writeMainYaml(dir + "/meta", {
    "galaxy_info": { author: "" },
  });
  await writeMainYaml(dir + "/tasks", task);
}

export async function playbook(
  name: string,
  tasks: Array<Record<string, unknown>>,
) {
  await ensureDir("build/playbooks");
  return Deno.writeTextFile(`build/playbooks/${name}.yaml`, toYaml(tasks));
}

export function apt(name: string, state: "present", updateCache = true) {
  return {
    name: `apt install ${name}.`,
    apt: {
      name,
      state,
      "update_cache": updateCache,
    },
    when: 'ansible_os_family == "Debian"',
  };
}

export function dnf(name: string, state: "present") {
  return {
    name: `dnf install ${name}.`,
    dnf: {
      name,
      state,
    },
    when: 'ansible_os_family == "Redhat"',
  };
}

export function reboot(async?: number, poll?: number, ignoreErrors = false) {
  return {
    name: "Rebooting now",
    shell: "shutdown -r now",
    async,
    poll,
    "ignore_errors": ignoreErrors,
  };
}

export function waitForConnection() {
  return {
    name: "Waiting for hosts",
    wait_for_connection: {
      connect_timeout: 20,
      sleep: 5,
      delay: 10,
      timeout: 300,
    },
  };
}

export function enableService(name: string) {
  return {
    name: `Enable ${name}`,
    service: {
      name,
      enabled: "yes",
    },
  };
}

export function disableService(name: string) {
  return {
    name: `Disable ${name}`,
    service: {
      name,
      enabled: "no",
    },
  };
}

export function service(
  name: string,
  state: "started" | "restarted" | "stopped",
) {
  return {
    name: `${name} ${state}`,
    service: {
      name,
      state,
    },
  };
}

export const startService = (name: string) => service(name, "started");
export const stopService = (name: string) => service(name, "stopped");
export const restartService = (name: string) => service(name, "restarted");

export function fetch(name: string, src: string, dest: string, flat = true) {
  return {
    name,
    fetch: {
      src,
      dest,
      flat,
    },
  };
}

export function template(name: string, src: string, dest: string) {
  return {
    name,
    template: {
      src,
      dest,
    },
  };
}

export function lineinfile(
  name: string,
  dest: string,
  regexp: string,
  line: string,
  state: "present",
) {
  return {
    name,
    lineinfile: {
      regexp,
      line,
      state,
      dest,
    },
  };
}

export function registerTask(
  name: string,
  tasks: Array<Record<string, unknown>>,
) {
  registeredTasks[name] = tasks;
}

export function useTask(name: string, hosts: string, become = false) {
  return {
    name,
    hosts,
    tasks: registeredTasks[name],
    become,
  };
}

export function task(
  name: string,
  hosts: string,
  tasks: Array<Record<string, unknown>>,
  become = false,
) {
  return {
    name,
    hosts,
    tasks,
    become,
  };
}
