import Denomander from "https://deno.land/x/denomander/mod.ts";
import { apply, fetchParallel, pattern, UPattern } from "../lib/feed/mod.ts";

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
  .command("url [urls...]")
  .action(() => {
    program["urls..."].forEach((url: string) => {
      try {
        console.info(apply(url));
      } catch (e) {
        console.error(e.message, url);
      }
    });
  })
  .command("fetch")
  .action(async () => {
    const url = apply("https://github.com/minioin") as string;
    const feed = await fetchParallel([url], 10);
    console.log(feed);
  })
  .parse(Deno.args);
