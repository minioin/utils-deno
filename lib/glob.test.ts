import { expandEach } from "./glob.ts";
import { assertArrayIncludes } from "https://deno.land/std/testing/asserts.ts";

Deno.test("glob expansion", () => {
  assertArrayIncludes(expandEach(".", ["a", "b"], ["b"]), ["a.b", "b.b"]);
});

Deno.test("double expansion", () => {
  assertArrayIncludes(expandEach(".", ["a", "b"], ["b", "c"]), [
    "a.b",
    "b.b",
    "a.c",
    "b.c",
  ]);
});
