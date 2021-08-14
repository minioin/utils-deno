interface Sysctl {
  [name: string]: string;
}

export function sysctl(input: Sysctl, reload: "yes" | "no" = "yes") {
  const sysctl = Object.entries(input).map(([name, value]) => {
    return { name, value };
  });
  return {
    name: `[sysctl] Set values`,
    sysctl,
    reload,
  };
}
