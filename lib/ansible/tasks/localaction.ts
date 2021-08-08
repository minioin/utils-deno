export function localAction(
  name: string,
  localAction: string,
): Record<string, unknown> {
  return {
    name,
    "local_action": localAction,
  };
}
