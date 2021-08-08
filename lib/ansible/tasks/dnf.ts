export function dnf(name: string, state: "present") {
  return {
    name: `dnf install ${name}.`,
    dnf: {
      name,
      state,
    },
    when: 'ansible_os_family == "Redhat"',
  };
}
