import { parse, stringify } from "https://deno.land/std/encoding/yaml.ts";
import { ld as _ } from "https://x.nest.land/deno-lodash@1.0.0/mod.ts";

function mergeArrays(objValue: unknown, srcValue: unknown) {
  if (_.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}

export function merge(...contents: Array<string>) {
  const objs = contents.map((content) => parse(content));
  const result = {};
  objs.forEach((obj) => _.mergeWith(result, obj, mergeArrays));
  return stringify(result);
}
