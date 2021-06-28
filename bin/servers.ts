import { parse as parseCsv } from "https://deno.land/std/encoding/csv.ts";
import Denomander from "https://deno.land/x/denomander/mod.ts";
import { exec, OutputMode } from "https://deno.land/x/exec/mod.ts";

const sshConfig =
  "-o StrictHostKeyChecking=no -o BatchMode=yes -o ConnectTimeout=5";

const program = new Denomander({
  app_name: "Servers",
  app_description: "Manage your servers",
  app_version: "1.0.0",
});

program
  .command("copy-id", "Copy your ssh id")
  .option("-i --identity", "Identity")
  .option("-s --serversFile", "Servers list", undefined, "servers.csv")
  .command("status", "Check status")
  .action(async () => {
    const servers = await getServers(program.serversFile);
    servers.forEach(async ({ name, ipaddress }: ServerConfig) => {
      const res = await exec(`ssh ${sshConfig} ${name} 'true'`, {
        output: OutputMode.Capture,
      });
      statusLine({ code: res.status.code, name: name ?? ipaddress });
    });
  })
  .command("ssh [cmd?]", "Run SSH commands")
  .action(async () => {
    const servers = await getServers(program.serversFile);
    servers.forEach(async ({ name, ipaddress }: ServerConfig) => {
      const res = await exec(`ssh ${sshConfig} ${name} ${program.cmd}`, {
        output: OutputMode.Capture,
      });
      statusLine({
        code: res.status.code,
        name: name ?? ipaddress,
        output: res.output,
      });
    });
  })
  .command("ssh-config", "Generate SSH configuration file")
  .option("-o --output", "Output file")
  .action(async () => {
    const servers = await getServers(program.serversFile);
    servers.forEach(({ name, user, ipaddress, port }: ServerConfig) => {
      // TODO: Redirect output to file if option provided
      console.log(
        `Host ${name}\n\tHostname ${ipaddress}\n\tPort ${port}\n\tUser ${user}\n`,
      );
    });
  })
  .command("copy-id", "Add a ssh id to remote server")
  .action(async () => {
    const servers = await getServers(program.serversFile);
    servers.forEach(async ({ name, password, ipaddress }: ServerConfig) => {
      const res = await exec(
        `sshpass -p '${password}' ssh-copy-id ${sshConfig} ${name}`,
        {
          output: OutputMode.Capture,
        },
      );
      statusLine({
        code: res.status.code,
        name: name ?? ipaddress,
        message: res.status.code ? "failure" : "success",
      });
    });
  })
  .command(
    "copy-authority [publicKeyfile]",
    "Add a ssh authority to remote server",
  )
  .action(async ({ publicKeyfile = "servers.csv" }: ProgramConfig) => {
    const publicKey = await Deno.readTextFile(publicKeyfile);
    const servers = await getServers(program.serversFile);
    servers.forEach(async ({ name, ipaddress }: ServerConfig) => {
      const res = await exec(
        `ssh ${sshConfig} ${name} 'echo "cert-authority ${publicKey}" >> .ssh/authorized_keys '`,
        { output: OutputMode.Capture },
      );
      statusLine({
        code: res.status.code,
        name: name ?? ipaddress,
        output: res.output,
      });
    });
  })
  .parse(Deno.args);

async function getServers(file: string): Promise<ServerConfig[]> {
  const rawText = await Deno.readTextFile(file);
  const content = await parseCsv(rawText, {
    separator: ",",
    skipFirstRow: true,
  });
  return content as ServerConfig[];
}

function statusLine({ code, name, message = "", output = "" }: StatusInput) {
  console.log(
    `${code.toString().padStart(3, " ")} ${
      name?.slice(0, 20).padEnd(20, " ")
    } ${message}${output ? `\n${output}` : ""}`,
  );
}

interface StatusInput {
  code: number;
  name: string;
  message?: string;
  output?: string;
}

interface ProgramConfig {
  cmd?: string[];
  publicKeyfile?: string;
}

interface ServerConfig {
  name?: string;
  ipaddress: string;
  port?: number;
  user?: string;
  password?: string;
}
