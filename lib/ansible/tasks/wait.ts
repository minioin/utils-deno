export function waitForConnection() {
  return {
    name: `Waiting for connection`,
    wait_for_connection: {
      connect_timeout: 10,
      sleep: 1,
      delay: 0,
      timeout: 600,
    },
  };
}
