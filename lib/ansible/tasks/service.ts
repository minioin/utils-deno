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
