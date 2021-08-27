import { $ } from "https://raw.githubusercontent.com/linux-china/dx/master/mod.ts";
import { red, yellow } from "https://deno.land/std/fmt/colors.ts";
export function defer(fn: (...args: unknown[]) => unknown) {
  return (...args: unknown[]) => {
    return () => {
      fn(...args);
    };
  };
}

export function task(...args: (() => void)[]) {
  return async () => {
    for (const arg of args) {
      try {
        await arg();
      } catch (e) {
        console.error(red(`[Error]`), e.code, ":", e.message);
        throw e;
      }
    }
    return args;
  };
}

export const log = defer((...args: unknown[]) => console.log(...args));
export const kaf = (...files: string[]) => kf("apply", ...files);
export const kdf = (...files: string[]) => kf("delete", ...files);
export const kak = (...files: string[]) => kk("apply", ...files);
export const kdk = (...files: string[]) => kk("delete", ...files);

export function kk(action: "apply" | "delete", ...files: string[]) {
  return cmd(`kubectl ${action} -k ${files.join(" -f ")}`);
}

export function kf(action: "apply" | "delete", ...files: string[]) {
  return cmd(`kubectl ${action} -f ${files.join(" -f ")}`);
}

export function cmd(cmd: string, silent = false, silentOnError = false) {
  return async () => {
    try {
      (silent || log(yellow(`[Run]`), cmd)());
      const res = await $`${cmd}`;
      (silent || (res && log(res)()));
      return res;
    } catch (e) {
      if (!silentOnError) {
        throw {
          code: e.exitCode,
          message: e.stderr,
        };
      }
    }
  };
}

export const clean = task(
  cmd("rm -rf build/ target/ dist/", true, true),
  cmd("rm -rf cache/ .cache/", true, true),
  cmd("rm -rf tmp/  **/*.pyc", true, true),
);
