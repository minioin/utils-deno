export function fetch(name: string, src: string, dest: string, flat = true) {
  return {
    name,
    fetch: {
      src,
      dest,
      flat,
    },
  };
}
