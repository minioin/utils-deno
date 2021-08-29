import Denomander from "stdx/denomander/mod.ts";
import { apply, pattern, UPattern } from "/lib/getfeedurl.ts";

function gitHubUserFeed(p: UPattern) {
  return `https://github.com/${p.pathname.groups?.username}.atom`;
}

function gitHubRepoFeed(p: UPattern) {
  const repo = `https://github.com/${p.pathname.groups?.username}/${p.pathname
    .groups?.repo}`;
  return {
    releases: repo + "/releases.atom",
    commits: repo + "/commits.atom",
    tags: repo + "/tags.atom",
  };
}

pattern("https://github.com", "/:username/:repo", gitHubRepoFeed);
pattern("https://github.com", "/:username/", gitHubUserFeed);

const program = new Denomander({
  app_name: "getfeed",
  app_description: "Get Feed",
  app_version: "1.0.0",
});

program
  .defaultCommand("[urls...]")
  .option("-a --archive", "Archive those urls")
  .option("-n --number", "Fetch n number of items", undefined, "10")
  .option("-s --skip", "Skip first n items")
  .option("-o --open", "Open those urls")
  .option("-v --view", "View those urls on console.")
  .action(() => {
    program["urls..."].forEach((url: string) => {
      try {
        console.info(apply(url));
      } catch (e) {
        console.error(e.message, url);
      }
    });
  })
  .parse(Deno.args);
