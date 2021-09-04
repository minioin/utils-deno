import { ld as _ } from "https://x.nest.land/deno-lodash@1.0.0/mod.ts";
import * as CoreV1 from "https://deno.land/x/kubernetes_apis@v0.3.1/builtin/core@v1/structs.ts";

export function _mergeArrays(objValue: unknown, srcValue: unknown) {
  if (_.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}

export function env2List(
  input: Record<string, string> = {},
): CoreV1.EnvVar[] {
  return Object.entries(input).map(([name, value]: [string, string]) => {
    return CoreV1.toEnvVar({
      name,
      value,
    });
  }).filter((i) => !!i);
}
