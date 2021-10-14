import { expandEach } from "./glob.ts";
import { assertArrayIncludes, test } from "./testing.ts";

test("glob expansion", () => {
  assertArrayIncludes(expandEach(".", ["a", "b"], ["b"]), ["a.b", "b.b"]);
});

test("double expansion", () => {
  assertArrayIncludes(expandEach(".", ["a", "b"], ["b", "c"]), [
    "a.b",
    "b.b",
    "a.c",
    "b.c",
  ]);
});
