export function ufwState(state: "enabled" | "disabled" = "enabled") {
  return {
    name: `Set ufw state: ${state}`,
    ufw: {
      state,
    },
  };
}

export const enableUfw = () => ufwState("enabled");
export const disableUfw = () => ufwState("disabled");

export function ufwLogging(logging: "on" | "off" = "on") {
  return {
    name: `Set logging: ${logging}`,
    ufw: {
      logging,
    },
  };
}

export function rule(
  direction: "incoming" | "outgoing",
  policy: "accept" | "reject",
  port?: number,
) {
  return {
    name: `Add rule`,
    ufw: {
      direction,
      policy,
      port,
    },
  };
}
