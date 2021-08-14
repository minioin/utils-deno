interface ReplaceOptions {
  after?: string;
  before?: string;
  owner?: string;
  group?: string;
  mode?: string;
  validate?: string;
}

export function replace(
  path: string,
  old: string,
  newString: string,
  options: ReplaceOptions = {},
) {
  return {
    name: `/s/${old}/${newString}/g`,
    replace: {
      path,
      regexp: old,
      replace: newString,
      ...options,
    },
  };
}

export function lineinfile(
  name: string,
  dest: string,
  regexp: string,
  line: string,
  state: "present" | "absent" = "present",
  validate?: string,
) {
  return {
    name,
    lineinfile: {
      regexp,
      line,
      state,
      dest,
      validate,
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
