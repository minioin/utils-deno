import { assertEquals, assertThrows, test } from "./testing.ts";
import { Err, Ok, Result } from "./result.ts";

test("ok unwrap test", () => {
  const ok: Result<string, string> = Ok("Ok");
  assertEquals(ok.isOk(), true);
  assertEquals(ok.isErr(), false);
  assertEquals(ok.unwrap(), "Ok");

  const err: Result<string, string> = Err("Error");
  assertEquals(err.isOk(), false);
  assertEquals(err.isErr(), true);
  assertThrows(() => err.unwrap());
});
