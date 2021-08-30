import { Err, Ok, Result } from "./result.ts";
import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std/testing/asserts.ts";

Deno.test("ok unwrap test", () => {
  const ok: Result<string, string> = Ok("Ok");
  assertEquals(ok.isOk(), true);
  assertEquals(ok.isErr(), false);
  assertEquals(ok.unwrap(), "Ok");

  const err: Result<string, string> = Err("Error");
  assertEquals(err.isOk(), false);
  assertEquals(err.isErr(), true);
  assertThrows(() => err.unwrap());
});
