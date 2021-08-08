export function template(name: string, src: string, dest: string) {
  return {
    name,
    template: {
      src,
      dest,
    },
  };
}
