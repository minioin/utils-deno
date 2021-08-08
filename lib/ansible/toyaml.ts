import { json2yaml } from "https://deno.land/x/json2yaml/mod.ts";

export function toYaml(input: unknown) {
  const jsonString = JSON.stringify(input);
  return "\n---\n" + json2yaml(jsonString) + "\n";
}
