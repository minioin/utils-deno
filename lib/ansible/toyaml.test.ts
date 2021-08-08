import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { toYaml } from "./toyaml.ts";

const output = `
---
hello: world
bool: false
boolstring: "false"

`;
Deno.test("test yaml output", () => {
  assertEquals(
    output,
    toYaml({
      hello: "world",
      test: undefined,
      bool: false,
      boolstring: "false",
    }),
  );
});
