import Denomander from "denomander";
import { opn } from "opn";
import GetPocket, { GetResponse } from "../lib/getpocket.ts";
import { link } from "x/cliffy/ansi/ansi_escapes.ts";

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
  .option("--site", "Filter by site")
  .option("-q --query", "Search the feeds")
  .option("--archived", "Select archived items")
  .option("--all", "Select all items")
  .option("--video", "Select videos")
  .option("--article", "Select articles")
  .option("--image", "Select images")
  .option("-t --tag", "Tags")
  .option("-o --open", "Open those urls")
  .option("-v --view", "View those urls on console.")
  .action(() => {
    const count = (program.number && Number.parseInt(program.number)) || 10;
    const offset = (program.skip && Number.parseInt(program.skip)) || 0;
    const {
      open,
      view,
      archive,
      site,
      query,
      tag,
      all,
      archived,
      video,
      article,
      image,
      since,
    } = program;
    const archivedOrUnread = archived ? "archive" : "unread";
    const state = all ? "all" : archivedOrUnread;

    const options = {
      open,
      view,
      archive,
      domain: site,
      search: query,
      tag,
      state,
    };

    if (video) {
      options.contentType = "video";
    }

    if (article) {
      options.contentType = "article";
    }

    if (image) {
      console.log("image");
      options.contentType = "image";
      console.log(options);
    }

    return get(offset, count, options);
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
    const { open, view, archive, contentType, tag, query } = program;
    return get(offset, count, {
      open,
      view,
      archive,
      site,
      contentType,
      tag,
      query,
    });
  })
  .parse(Deno.args);

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

interface ProgramOptions {
  open: boolean;
  view: boolean;
  archive: boolean;
  domain?: string;
}
async function get(offset: number, count: number, options: ProgramOptions) {
  const pocket = new GetPocket(consumerKey, accessToken);
  try {
    const { open, view, archive, domain, contentType, tag, search, query } =
      options;
    const res: GetResponse = await pocket.get({
      count,
      offset,
      domain,
      query,
      contentType,
      tag,
      search,
    });

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
    console.error(e.message, e);
  }
}
