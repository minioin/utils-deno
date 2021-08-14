import { debian } from "./system.ts";

export function reboot() {
  return {
    name: "Rebooting",
    reboot: {},
  };
}

export function rebootRequiredDebian(variable = "reboot_required_file") {
  return debian({
    name: "Check if reboot is required",
    stat: {
      path: "/var/run/reboot-required",
    },
    register: variable,
  });
}
