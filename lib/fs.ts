import { walk, WalkEntry } from "https://deno.land/std/fs/mod.ts";

export async function walkParallel(
  dir: string,
  cb: (entry: WalkEntry) => unknown,
) {
  const promises = [];
  for await (const entry of walk(dir)) {
    promises.push(cb(entry));
  }
  return Promise.all(promises);
}
