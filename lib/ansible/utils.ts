import { ensureDir } from "https://deno.land/std/fs/mod.ts";
import { toYaml } from "./toyaml.ts";

export function identityFunction<T>(i: T): T {
  return i;
}

export async function writeMainYaml(path: string, info: unknown) {
  await ensureDir(path);
  return Deno.writeTextFile(path + "/main.yaml", toYaml(info));
}
