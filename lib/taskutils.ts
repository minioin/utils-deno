import { $ } from "https://deno.land/x/deno_dx/mod.ts";

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
export const kaf = (file: string) => () => $`kubectl apply -f ${file}`;
export const kdf = (file: string) => () => $`kubectl delete -f ${file}`;

export function cmd(cmd: string, silent = false) {
  return () => {
    try {
      (silent || log(cmd)());
      return $`${cmd}`;
    } catch (e) {
      console.error(`Error running: ${cmd}. ${JSON.stringify(e)}`);
    }
  };
}

export const clean = run(
  log("Cleaning build dirs"),
  cmd("rm -rf build/ target/ dist/", true),
  cmd("rm -rf cache/ .cache/", true),
  cmd("rm -rf tmp/  **/*.pyc", true),
);
