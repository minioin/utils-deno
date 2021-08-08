export function lineinfile(
  name: string,
  dest: string,
  regexp: string,
  line: string,
  state: "present" | "absent" = "present",
) {
  return {
    name,
    lineinfile: {
      regexp,
      line,
      state,
      dest,
    },
  };
}

export function removeInFile(
  name: string,
  dest: string,
  regexp: string,
) {
  return {
    name,
    lineinfile: {
      regexp,
      state: "absent",
      dest,
    },
  };
}
