import {
  deserializeFeed,
  FeedType,
  JsonFeed,
} from "https://deno.land/x/rss/mod.ts";

function toCanonicalUrl(url: string): string {
  return url.replace("http://", "").replace("https://", "");
}

function chunkArray(
  myArray: Array<string>,
  chunkSize: number,
): Array<Array<string>> {
  const results = [];

  while (myArray.length) {
    results.push(myArray.splice(0, chunkSize));
  }

  return results;
}

function fetchBuilder() {
  return async (url: string): Promise<JsonFeed | undefined> => {
    const canonicalUrl = toCanonicalUrl(url);
    try {
      const response = await fetch(url);
      const contentType = response.headers.get("content-type");
      if (response.status < 200 || response.status >= 400) {
        throw new Error("Wrong Status code: " + response.status);
      }
      if (response.status === 304) {
        console.info(url, 304, "Not Modified");
        return undefined;
      }

      const content = await response.text();
      if (contentType && contentType.includes("json")) {
        const feed: JsonFeed = JSON.parse(content);
        await saveFeed(canonicalUrl, feed);
        return feed;
      } else {
        const { feed } = await deserializeFeed(
          content,
          { outputJsonFeed: true },
        ) as unknown as {
          feed: JsonFeed;
          feedType: FeedType;
          originalFeedType: string;
        };
        await saveFeed(canonicalUrl, feed);
        return feed;
      }
    } catch (e) {
      console.error(`Error fetching ${url}.`, e);
    }
  };
}

function saveFeed(url: string, feed: JsonFeed) {
  return localStorage.setItem(url, JSON.stringify(feed));
}

export async function fetchParallel(
  items: Array<string>,
  n: number,
): Promise<Array<JsonFeed>> {
  const chunks = chunkArray(items, n);
  let res: Array<JsonFeed> = [];
  for (const chunk of chunks) {
    const promises = chunk.map(fetchBuilder());
    const values = await Promise.all(promises);
    // We remove undefined values
    const filtered: Array<JsonFeed> = values.filter((v) => !!v) as Array<
      JsonFeed
    >;
    res = [...res, ...filtered];
  }
  return res;
}
