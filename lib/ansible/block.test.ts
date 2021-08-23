import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { Block } from "./block.ts";

Deno.test("test task output", () => {
  assertEquals({
    become: false,
    hosts: "all",
    name: "hello",
    tasks: [],
    throttle: undefined,
    serial: undefined,
    handlers: undefined,
    roles: undefined,
  }, new Block("hello").build());
});
