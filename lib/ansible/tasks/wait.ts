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
