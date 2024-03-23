import Denomander from "denomander";
import { exec, OutputMode } from "exec";
import { isIP } from "https://deno.land/x/isIP/mod.ts";
import { fromCSV } from "../lib/config.ts";
import { expand as expandGlob } from "../lib/glob.ts";

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
  .option("-s --serversFile", "Servers list", undefined, "hosts.csv")
  .command("status", "Check status")
  .action(async () => {
    const servers = await fromCSV(program.serversFile) as ServerConfig[];
    servers.forEach(async ({ name, ip }: ServerConfig) => {
      const res = await exec(`ssh ${sshConfig} ${name} 'true'`, {
        output: OutputMode.Capture,
      });
      statusLine({ code: res.status.code, name: name ?? ip });
    });
  })
  .command("ssh [cmd?]", "Run SSH commands")
  .action(async () => {
    const servers = await fromCSV(program.serversFile) as ServerConfig[];
    servers.forEach(async ({ name, ip }: ServerConfig) => {
      const res = await exec(`ssh ${sshConfig} ${name} ${program.cmd}`, {
        output: OutputMode.Capture,
      });
      statusLine({
        code: res.status.code,
        name: name ?? ip,
        output: res.output,
      });
    });
  })
  .command("ssh-config", "Generate SSH configuration file")
  .option("-s --serversFile", "Servers list", undefined, "hosts.csv")
  .option("-o --output", "Output file")
  .action(async () => {
    const servers = await fromCSV(program.serversFile) as ServerConfig[];
    servers.forEach(
      ({ name, user = "root", ip, port = 22 }: ServerConfig) => {
        // TODO: Redirect output to file if option provided
        console.log(
          `Host ${name}\n\tHostName ${ip}\n\tPort ${port}\n\tUser ${user}\n`,
        );
      },
    );
  })
  .command("hosts", "Generate SSH configuration file")
  .option("-s --serversFile", "Servers list", undefined, "hosts.csv")
  .action(async () => {
    const servers = await fromCSV(program.serversFile) as ServerConfig[];
    servers.forEach(
      ({ name, ip, dns }: ServerConfig) => {
        ip = ip.trim();
        const version = isIP(ip);
        if (version) {
          const type = version === 4 ? "A" : "AAA";
          dns = dns ?? name ?? "";
          expandGlob(dns).forEach((entry) => {
            console.log(type, entry, ip);
          });
        } else {
          const type = "CNAME";
          console.log(type, name, ip);
        }
      },
    );
  })
  .command("copy-id", "Add a ssh id to remote server")
  .option("-s --serversFile", "Servers list", undefined, "hosts.csv")
  .action(async () => {
    const servers = await fromCSV(program.serversFile) as ServerConfig[];
    servers.forEach(async ({ name, password, ip }: ServerConfig) => {
      const res = await exec(
        `sshpass -p '${password}' ssh-copy-id ${sshConfig} ${name}`,
        {
          output: OutputMode.Capture,
        },
      );
      statusLine({
        code: res.status.code,
        name: name ?? ip,
        message: res.status.code ? "failure" : "success",
      });
    });
  })
  .command(
    "copy-authority [publicKeyfile]",
    "Add a ssh authority to remote server",
  )
  .option("-s --serversFile", "Servers list", undefined, "hosts.csv")
  .action(async ({ publicKeyfile = "servers.csv" }: ProgramConfig) => {
    const publicKey = await Deno.readTextFile(publicKeyfile);
    const servers = await fromCSV(program.serversFile) as ServerConfig[];
    servers.forEach(async ({ name, ip }: ServerConfig) => {
      const res = await exec(
        `ssh ${sshConfig} ${name} 'echo "cert-authority ${publicKey}" >> .ssh/authorized_keys '`,
        { output: OutputMode.Capture },
      );
      statusLine({
        code: res.status.code,
        name: name ?? ip,
        output: res.output,
      });
    });
  })
  .parse(Deno.args);

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
  ip: string;
  port?: number;
  user?: string;
  password?: string;
  dns?: string;
}
