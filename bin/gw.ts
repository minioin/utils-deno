import {
  dirname,
  join,
  normalize,
  parse,
  resolve,
} from "https://deno.land/std@0.99.0/path/mod.ts";

const GRADLEW = "gradlew";

function generatePaths(cwd: string) {
  cwd = resolve(cwd);
  const { root } = parse(cwd);
  const paths = [];
  while (cwd !== root) {
    paths.push(join(cwd, "build.gradle"));
    paths.push(join(cwd, "build.gradle.kts"));
    cwd = normalize(join(cwd, ".."));
  }
  paths.push(join(cwd, "build.gradle"));
  paths.push(join(cwd, "build.gradle.kts"));
  return paths;
}

async function main() {
  try {
    const [path, _statinfo] = await Promise.any(
      generatePaths(".").map(async (path) => [path, await Deno.stat(path)]),
    );
    const basedir = dirname(path);
    const exe = join(basedir, GRADLEW);
    await execute(exe, ".", Deno.args);
  } catch (_e) {
    console.info("No gradle wrapper found. Executing gradle");
    await execute("gradle", ".", Deno.args);
  }
}
main();

async function execute(gradlePath: string, cwd: string, args: string[]) {
  const p = await Deno.run({
    cmd: [
      gradlePath,
      ...args,
    ],
    cwd,
  });
  await p.status();
}
