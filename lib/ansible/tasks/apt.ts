export function upgrade() {
  return {
    name: `apt upgrade`,
    apt: {
      upgrade: "full",
    },
    when: 'ansible_os_family == "Debian"',
  };
}

export function apt(name: string, state: "present", updateCache = true) {
  return {
    name: `apt install ${name}.`,
    apt: {
      name,
      state,
      "update_cache": updateCache,
    },
    when: 'ansible_os_family == "Debian"',
  };
}
