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

function ifFileExists(file: string, command: string, silent = true) {
  const silentArgs = " || exit 0";
  return cmd(
    `[ -f "${file}" ] && (${command}) ${silent ? silentArgs : ""}`,
    true,
  );
}

// TODO: Refactor dx to select following set of tasks automatically if no task file exists
export const run = task(
  ifFileExists("Cargo.toml", "cargo run"),
  ifFileExists("package.json", "npm run start"),
  // TODO Use maven wrapper instead of mvn/gradle
  ifFileExists("build.gradle", "gradle run"),
  ifFileExists("pom.xml", "mvn run"),
  ifFileExists("Makefile", "make run"),
);

export const lint = task(
  ifFileExists("Cargo.toml", "cargo lint"),
  ifFileExists("package.json", "npm run lint"),
  // TODO Use maven wrapper instead of mvn/gradle
  ifFileExists("build.gradle", "gradle lint"),
  ifFileExists("pom.xml", "mvn lint"),
  ifFileExists("Makefile", "make lint"),
);

// TODO: Refactor dx to select following set of tasks automatically if no task file exists
export const format = task(
  ifFileExists("Cargo.toml", "cargo fmt"),
  ifFileExists("package.json", "npm run format || npm run fmt"),
  ifFileExists(
    ".prettierrc.json",
    "npm run format || npm run fmt || prettier --write . || npx prettier --write .",
  ),
  // TODO Use maven wrapper instead of mvn
  ifFileExists("build.gradle", "gradle format"),
  ifFileExists("pom.xml", "mvn formatter:format"),
  ifFileExists("Makefile", "make format"),
);

export const test = task(
  ifFileExists("Cargo.toml", "cargo test"),
  ifFileExists("package.json", "npm run test"),
  // TODO Use maven wrapper instead of mvn
  ifFileExists("pom.xml", "mvn test"),
  ifFileExists("Makefile", "make test"),
  ifFileExists("build.gradle", "gradle test"),
);

export const build = task(
  ifFileExists("Cargo.toml", "cargo build"),
  ifFileExists("package.json", "npm run build"),
  // TODO Use maven wrapper instead of mvn
  ifFileExists("pom.xml", "mvn package"),
  ifFileExists("Makefile", "make build"),
  ifFileExists("build.gradle", "gradle build"),
);

export const clean = task(
  cmd("rm -rf build/ target/ dist/", true, true),
  cmd("rm -rf cache/ .cache/", true, true),
  cmd("rm -rf tmp/  **/*.pyc", true, true),
);

export const prune = pipeline(
  clean,
  task(cmd("rm -rf node_modules", false, true))
);
