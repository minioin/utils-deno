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

// Pipeline consists of one of more tasks. and as such does
// not log the output itself.
export function pipeline(...args: (() => void)[]) {
  return async () => {
    for (const arg of args) {
      try {
        await arg();
      } catch (e) {
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
      silent || log(yellow(`[Run]`), cmd)();
      const res = await $`${cmd}`;
      silent || (res && log(res)());
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

function runIfExists(file: string, command: string, silent = true) {
  const silentArgs = " || exit 0";
  return cmd(
    `[ -f "${file}" ] && (${command}) ${silent ? silentArgs : ""}`,
    true,
  );
}

// TODO: Refactor dx to select following set of tasks automatically if no task file exists
export const run = task(
  runIfExists("Cargo.toml", "cargo run"),
  runIfExists("package.json", "npm run start"),
  // TODO Use maven wrapper instead of mvn/gradle
  runIfExists("build.gradle", "gradle run"),
  runIfExists("pom.xml", "mvn run"),
  runIfExists("Makefile", "make run"),
);

export const lint = task(
  runIfExists("Cargo.toml", "cargo lint"),
  runIfExists("package.json", "npm run lint"),
  // TODO Use maven wrapper instead of mvn/gradle
  runIfExists("build.gradle", "gradle lint"),
  runIfExists("pom.xml", "mvn lint"),
  runIfExists("Makefile", "make lint"),
);

// TODO: Refactor dx to select following set of tasks automatically if no task file exists
export const format = task(
  runIfExists("Cargo.toml", "cargo fmt"),
  runIfExists("package.json", "npm run format || npm run fmt"),
  runIfExists(
    ".prettierrc.json",
    "npm run format || npm run fmt || prettier --write . || npx prettier --write .",
  ),
  // TODO Use maven wrapper instead of mvn
  runIfExists("build.gradle", "gradle format"),
  runIfExists("pom.xml", "mvn formatter:format"),
  runIfExists("Makefile", "make format"),
);

export const test = task(
  runIfExists("Cargo.toml", "cargo test"),
  runIfExists("package.json", "npm run test"),
  // TODO Use maven wrapper instead of mvn
  runIfExists("pom.xml", "mvn test"),
  runIfExists("Makefile", "make test"),
  runIfExists("build.gradle", "gradle test"),
);

export const build = task(
  runIfExists("Cargo.toml", "cargo build"),
  runIfExists("package.json", "npm run build"),
  // TODO Use maven wrapper instead of mvn
  runIfExists("pom.xml", "mvn package"),
  runIfExists("Makefile", "make build"),
  runIfExists("build.gradle", "gradle build"),
);

export const clean = task(
  cmd("rm -rf build/ target/ dist/", true, true),
  cmd("rm -rf cache/ .cache/", true, true),
  cmd("rm -rf tmp/  **/*.pyc", true, true),
);

export const prune = task(cmd("rm -rf node_modules", false, true));
