import { isGlob } from "@std/path/is_glob";
export function expand(i: string) {
  const result = [];
  // Does not support wildcard
  i = i.replaceAll("*", "");
  if (isGlob(i)) {
    // TODO Extrac glob parts and create permutation of them
  } else {
    result.push(i);
  }
  return result;
}

// Recursively permute each group of string with other
// Input args: [[], [], []]
export function expandEach(
  joiner: string,
  ...args: Array<unknown>
): Array<string> {
  let [first, ...rest] = args;

  // Argument should be string or array
  if (typeof first !== "string" && !Array.isArray(first)) {
    return [];
  }

  let firstArray: Array<string> = [];
  if (typeof first === "string") {
    firstArray = [first];
  } else if (Array.isArray(first)) {
    firstArray = first;
  }

  if (!rest || rest.length === 0) {
    return firstArray;
  }

  const res = [];
  rest = expandEach(joiner, ...rest);
  for (const f of firstArray) {
    for (const r of rest) {
      res.push(f + joiner + r);
    }
  }
  return res;
}
