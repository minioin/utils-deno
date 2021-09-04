import { ld as _ } from "https://x.nest.land/deno-lodash@1.0.0/mod.ts";
import { _mergeArrays } from "./utils.ts";
import { join } from "https://deno.land/std/path/mod.ts";
import { ensureDir } from "https://deno.land/std/fs/mod.ts";
import { stringify } from "https://deno.land/std/encoding/yaml.ts";

export * from "./grafana.ts";
export * from "./ingress-www-redirect.ts";
export * from "./config.ts";
export * from "./pingjob.ts";

export function merge(...objs: Array<unknown>) {
  const result = {};
  objs.forEach((obj) =>
    _.mergeWith(result, obj as Record<string, unknown>, _mergeArrays)
  );
  return result;
}

export function render(...objs: Array<unknown>) {
  return objs.map((value) => stringify(value as Record<string, unknown>))
    .join("\n---\n");
}

interface MetadataName {
  metadata: {
    name: string;
  };
}

let _buildDir = "build/";

export function buildDir(dir: string) {
  _buildDir = dir;
  return ensureDir(_buildDir);
}

export function toFile(input: unknown, file?: string) {
  if (!file) {
    const meta = input as MetadataName;
    file = join(_buildDir, meta.metadata.name + ".json");
  }
  return Deno.writeTextFile(
    file,
    render(input),
  );
}
