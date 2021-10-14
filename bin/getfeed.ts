import Denomander from "https://deno.land/x/denomander/mod.ts";
import { apply, fetchParallel, MatchResult, pattern } from "@/lib/feed/mod.ts";

function gitHubUserFeed(p: URLPatternResult) {
  return `https://github.com/${p.pathname.groups?.username}.atom`;
}

function gitHubRepoFeed(p: URLPatternResult) {
  const repo = `https://github.com/${p.pathname.groups?.username}/${p.pathname
    .groups?.repo}`;
  return {
    releases: repo + "/releases.atom",
    commits: repo + "/commits.atom",
    tags: repo + "/tags.atom",
  };
}

function getHNUserfeed(_p: URLPatternResult, m: MatchResult) {
  const url = new URLSearchParams(m.url?.search || "");
  return `https://hnrss.org/user?id=` + url?.get("id");
}

pattern("https://github.com", "/:username/:repo", gitHubRepoFeed);
pattern("https://github.com", "/:username/", gitHubUserFeed);
pattern("https://news.ycombinator.com", "/user", getHNUserfeed);

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
