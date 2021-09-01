import { ld as _ } from "https://x.nest.land/deno-lodash@1.0.0/mod.ts";

export function _mergeArrays(objValue: unknown, srcValue: unknown) {
  if (_.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}
