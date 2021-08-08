export function reboot(async?: number, poll?: number, ignoreErrors = false) {
  return {
    name: "Rebooting now",
    shell: "shutdown -r now",
    async,
    poll,
    "ignore_errors": ignoreErrors,
  };
}
