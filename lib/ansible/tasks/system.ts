const when = 'ansible_os_family == "Debian"';

export function debian(input: Record<string, unknown>) {
  return {
    ...input,
    when,
  };
}

export function hostname(name: string) {
  return {
    name: `Update hostname of {{ inventory_hostname }} to ${name}`,
    hostname: {
      name,
    },
  };
}
