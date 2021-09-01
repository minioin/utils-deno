import { merge } from "./mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

Deno.test("merge test", () => {
  assertEquals(merge({ a: "a" }, { b: "b" }), { a: "a", b: "b" });
  assertEquals(merge({ a: ["a"] }, { a: ["b"] }), { a: ["a", "b"] });
  assertEquals(merge({ c: { a: ["a"] } }, { c: { a: ["b"] } }), {
    c: { a: ["a", "b"] },
  });
});
