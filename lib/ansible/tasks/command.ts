export function command(
  name: string,
  command: string,
): Record<string, unknown> {
  return {
    name,
    command,
  };
}
