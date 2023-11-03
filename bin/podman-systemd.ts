#!/usr/bin/env -S deno run --unstable -A

import { ensureDir } from "https://deno.land/std@0.205.0/fs/ensure_dir.ts";
import { parseAll } from "https://deno.land/std@0.205.0/yaml/mod.ts";
import Denomander from "https://deno.land/x/denomander/mod.ts";
import dir from "https://deno.land/x/dir/mod.ts";
import { stringify } from "https://deno.land/x/ini/mod.ts";
import { z } from "https://deno.land/x/zod/mod.ts";

const program = new Denomander({
  app_name: "podman-systemd",
  app_description: "Run deployments as systemd services",
  app_version: "0.1",
});

const TargetEnum = z.array(z.enum(["default", "multi-user", "local-fs"]));
type TargetEnum = z.infer<typeof TargetEnum>;

const homeConfigDir = `${dir("config")}/containers/systemd`;
program
  .command("install [file]", "Install the kube <file> as podman .kube service")
  .option("-e --etc", "Install on /etc/containers/systemd")
  .option("--usr", "Install on /usr/share/containers/systemd")
  .option("-d --dir", "Install on target dir", (i) => i, homeConfigDir)
  .option(
    "-t --target",
    "Installation target: default, multi-user, local-fs",
    (i) => i,
    "default"
  )
  .option("--multi-user", "Install on multi-user target")
  .action(async ({ file }) => {
    const content = await Deno.readTextFile(file);
    const yaml = parseAll(content);
    const name = yaml?.[0]?.metadata.name;
    let dir = program.dir;
    if (program.etc) {
      dir = `/etc/containers/systemd`;
    } else if (program.usr) {
      dir = `/usr/share/containers/systemd`;
    }

    TargetEnum.parse(program.target);

    const destinationYamlFile = `${dir}/deployments/${name}.yaml`;
    const destinationKubeFile = `${dir}/${name}.kube`;

    const kube = {
      Unit: {
        Description: `${name} service`,
      },
      Kube: {
        Yaml: destinationYamlFile,
      },
      Install: {
        WantedBy: program.target.map((i) => `${i}.target`).join(" "),
      },
    };

    await ensureDir(`${dir}/deployments/`);
    await Deno.copyFile(file, destinationYamlFile);
    await Deno.writeTextFile(destinationKubeFile, stringify(kube));
  });

program.parse(Deno.args);

async function main() {
  const fileName = Deno.args[0];

  if (!fileName) {
    return;
  }

  const content = await Deno.readTextFile(fileName);
  const yaml = parse(content);
  const name = yaml.metadata.name;
  const destinationYamlFile = `/etc/containers/systemd/deployments/${name}.yaml`;
  const destinationKubeFile = `/etc/containers/systemd/${name}.kube`;

  const kube = {
    Unit: {
      Description: `${name} service`,
    },
    Kube: {
      Yaml: destinationYamlFile,
    },
    Install: {
      WantedBy: "multi-user.target default.target",
    },
  };

  await ensureDir(`/etc/containers/systemd/deployments/`);
  await Deno.copyFile(fileName, destinationYamlFile);
  await Deno.writeTextFile(destinationKubeFile, stringify(kube));
}
