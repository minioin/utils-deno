export function when(when: string, input: Record<string, unknown>) {
  return {
    when,
    ...input,
  };
}
