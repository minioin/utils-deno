import { merge } from "./mergeyaml.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

Deno.test("merge test", () => {
  assertEquals(merge("a: a", "b: b"), "a: a\nb: b\n");
});

// Doesn't currently support comments and whitespaces
// Deno.test("comment test", () => {
//     assertEquals(merge("a: a", "#comment", "b: b"), "a: a\n#comment\nb: b\n");
// });

// Deno.test("whitespace test", () => {
//     assertEquals(merge("a: a", "b: b\n\nc: c"), "a: a\nb: b\n\nc: c\n");
// });
