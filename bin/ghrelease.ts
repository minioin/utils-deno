import { download } from "download";
import { emptyDir, ensureDir } from "std/fs/mod.ts";
import Fuse from "npm:fuse";

const home = Deno.env.get("HOME");

const { args, run: drun, exit, build } = Deno;

for (const repo of args) {
  await install(repo);
}

function run(cmd: Array<string>) {
  return drun({ cmd }).status();
}

function mapName(asset: Asset) {
  return normalizeName(asset.name);
}

function normalizeName(s: string): string {
  return s.toLowerCase().replaceAll("x86_64", "amd64").replaceAll(
    "-lnx",
    "-linux",
  )
    .replaceAll(".", " ")
    .replaceAll("-", " ").replaceAll("_", " ");
}

async function install(repo: string) {
  const apiUrl = `https://api.github.com/repos/${repo}/releases/latest`;
  const res = await fetch(apiUrl);
  const json = await res.json();
  const filtered = json?.assets; //.filter(filterArch)?.filter(filterOS);
  const names = json?.assets?.map(mapName);
  console.info("found versions:", names);

  const fuzzy = new Fuse(names, { threshold: 1.0 });
  const selection = fuzzy.search(normalizeName(build.target))?.[0];

  if (filtered.length === 0) {
    console.log("Couldn't find release for this target");
    exit(0);
  }

  const { id, browser_download_url: browserDownloadUrl, name } = json.assets
    ?.[selection.refIndex];

  const dir = `/tmp/getbin/${id}`;
  const binName = repo.split("/")[1];
  try {
    console.info("Downloading ", browserDownloadUrl);
    await ensureDir(dir);
    const fileObj = await download(browserDownloadUrl, { dir, file: name });
    console.info("Extracting gzip ", fileObj.fullPath);
    const isGz = name.endsWith(".tar.gz") ||
      name.endsWith(".tgz") ||
      name.endsWith(".tar.xz");
    const isZip = name.endsWith(".zip");
    const dirName = name.replace(".tgz", "")
      .replace(".tar.xz", "")
      .replace(".tar.gz", "")
      .replace(".zip", "");

    if (isGz || isZip) {
      const cmd = isGz
        ? ["tar", "-xzf", fileObj.fullPath, "--directory", dir]
        : ["unzip", fileObj.fullPath];
      const res = await run(cmd);
      if (res.success) {
        const promises = [
          ["cp", "-rf", `${dir}/bin`, `${home}/.local/bin/`],
          ["cp", "-rf", `${dir}/${binName}`, `${home}/.local/bin/`],
          ["cp", "-rf", `${dir}/${dirName}/bin`, `${home}/.local/bin/`],
          [
            "cp",
            "-rf",
            `${dir}/${dirName}/${binName}`,
            `${home}/.local/bin/`,
          ],
        ].map(run);
        return Promise.allSettled(promises);
      } else {
        console.error("Couldn't extract " + fileObj.fullPath);
      }
    } else {
      await run(["chmod", "+x", fileObj.fullPath]);
      await run(
        ["cp", "-rf", fileObj.fullPath, `${home}/.local/bin/${binName}`],
      );
    }
  } catch (err) {
    await emptyDir(dir);
    console.log("Error: ", err);
  }
}

interface Asset {
  id: string;
  url: string;
  name: string;
  "content_type": string;
  size: number;
  "browser_download_url": string;
}
