export const sysctl = (name: string, value: string) => {
  return {
    name: `[sysctl] ${name}=${value}`,
    sysctl: {
      name,
      value,
    },
  };
};
