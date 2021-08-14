const when = 'ansible_os_family == "Debian"';

export function debian(input: Record<string, unknown>) {
  return {
    ...input,
    when,
  };
}
