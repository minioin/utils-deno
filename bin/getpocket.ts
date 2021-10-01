import Denomander from "denomander";
import { opn } from "opn";
import GetPocket, { GetResponse } from "/lib/getpocket.ts";
import { link } from "stdx/cliffy/ansi/ansi_escapes.ts";

const consumerKey = Deno.env.get("POCKET_CONSUMER_KEY") || "";
const accessToken = Deno.env.get("POCKET_ACCESS_TOKEN") || "";

if (consumerKey === "" || accessToken === "") {
  console.error("Couldn't find POCKET_CONSUMER_KEY or POCKET_ACCESS_TOKEN.");
}

interface Options {
  open: boolean;
  archive: boolean;
  delete: boolean;
}

const program = new Denomander({
  app_name: "Pockety",
  app_description: "Pockety pocket",
  app_version: "1.0.0",
});

program
  .command("get", "Get urls")
  .option("-a --archive", "Archive those urls")
  .option("-n --number", "Fetch n number of items", undefined, "10")
  .option("-s --skip", "Skip first n items")
  .option("-o --open", "Open those urls")
  .option("-v --view", "View those urls on console.")
  .action(() => {
    const count = (program.number && Number.parseInt(program.number)) || 10;
    const offset = (program.skip && Number.parseInt(program.skip)) || 0;
    const { open, view, archive } = program;
    return get(offset, count, { open, view, archive });
  })
  .command("random", "Get random article")
  .option("-a --archive", "Archive those urls")
  .option("-n --number", "Fetch n number of items", undefined, "1")
  .option("-r --range", "Skip first n items", undefined, "0:100")
  .option("-o --open", "Open those urls")
  .option("-v --view", "View those urls on console.")
  .action(() => {
    let [min, max] = program.range.split(":").map(Number.parseInt);
    min = min || 0;
    max = max || 100;
    const count = (program.number && Number.parseInt(program.number)) || 1;
    const offset = randomIntFromInterval(min, max);
    const { open, view, archive } = program;
    return get(offset, count, { open, view, archive });
  })
  .parse(Deno.args);

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

interface ProgramOptions {
  open: boolean;
  view: boolean;
  archive: boolean;
}
async function get(offset: number, count: number, options: ProgramOptions) {
  const pocket = new GetPocket(consumerKey, accessToken);
  try {
    const res: GetResponse = await pocket.get({ count, offset });
    const { open, view, archive } = options;

    if (view || !(open || archive)) {
      const list = res.list;
      for (const key in res.list) {
        console.log(
          link(key, "https://getpocket.com/read/" + key),
          link(list[key].resolved_title.slice(0, 60), list[key].resolved_url),
        );
      }
    }

    if (archive) {
      const items = [];
      for (const key in res.list) {
        items.push({ item_id: Number.parseInt(res.list[key].item_id) });
      }
      const _resa = await pocket.archive(items);
    }

    if (open) {
      const promises = [];
      for (const key in res.list) {
        promises.push(opn(res.list[key].resolved_url));
      }
      await Promise.all(promises);
    }
  } catch (e) {
    console.error(e.message);
  }
}
