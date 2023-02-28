import { merge } from "@/lib/mergeyaml.ts";

async function main() {
  const contents = await Promise.all(
    Deno.args.map((file) => Deno.readTextFile(file)),
  );
  console.log(merge(...contents));
}

if (import.meta.main) {
  main();
}
