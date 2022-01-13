import { dirname, join, normalize, parse, resolve } from "path/mod.ts";

const GRADLEW = "gradlew";

function generatePaths(cwd: string): Array<string> {
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
    const generatedPaths: Array<string> = generatePaths(".");
    // FIXME: this can sometimes select upper directory instead of lower one.
    const {path } = await Promise.any(
      generatedPaths.map(async (path) => { return {path, stat: await Deno.stat(path)}}),
    );
    console.log(path)
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
