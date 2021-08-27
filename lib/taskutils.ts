import { $ } from "https://raw.githubusercontent.com/linux-china/dx/master/mod.ts";
import { red, yellow } from "https://deno.land/std/fmt/colors.ts";
export function defer(fn: (...args: unknown[]) => unknown) {
  return (...args: unknown[]) => {
    return () => {
      fn(...args);
    };
  };
}

export function run(...args: (() => void)[]) {
  return async () => {
    for (const arg of args) {
      try {
        await arg();
      } catch (e) {
        console.error(`Error while running ${arg}`);
        console.error(`Error: `, e);
      }
    }
    return args;
  };
}

export const log = defer((...args: unknown[]) => console.log(...args));
export const kaf = (...files: string[]) => kf("apply", ...files);
export const kdf = (...files: string[]) => kf("delete", ...files);

export function kf(action: "apply" | "delete", ...files: string[]) {
  return cmd(`kubectl ${action} -f ${files.join(" -f ")}`);
}

export function cmd(cmd: string, silent = false) {
  return async () => {
    try {
      (silent || log(yellow(`[Run]`), cmd)());
      const res = await $`${cmd}`;
      (silent || (res && log(res)()));
      return res;
    } catch (e) {
      console.error(
        red(`[Error(${e.exitCode})]`),
        `${cmd}. ${e.stderr}`,
      );
    }
  };
}

export const clean = run(
  log("Cleaning build dirs"),
  cmd("rm -rf build/ target/ dist/", true),
  cmd("rm -rf cache/ .cache/", true),
  cmd("rm -rf tmp/  **/*.pyc", true),
);
