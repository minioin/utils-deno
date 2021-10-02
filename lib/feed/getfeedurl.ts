const knownPatterns: Array<PatternMatcher> = [];

interface PatternMatcher {
  pattern: URLPattern;
  fn: PatternMapper;
}

type PatternMapper = (
  p: URLPatternResult,
  m: MatchResult,
) => string | { [key: string]: string };

function removeEndingSlash(input: string) {
  return input.endsWith("/") ? input.substring(0, input.length - 1) : input;
}

export function pattern(baseURL: string, pathname: string, fn: PatternMapper) {
  knownPatterns.push({
    pattern: new URLPattern({
      baseURL,
      pathname: removeEndingSlash(pathname),
    }),
    fn,
  });
}

export interface MatchResult {
  match: URLPatternResult;
  pattern: PatternMatcher;
  url?: URL;
}

export function match(url: string): MatchResult | undefined {
  const u = new URL(url);
  for (const pattern of knownPatterns) {
    const match = pattern.pattern.exec(
      removeEndingSlash(u.origin + u.pathname),
    );
    if (match) {
      return {
        pattern,
        match,
        url: u,
      };
    }
  }
}

export function apply(url: string) {
  const m = match(url);
  if (m) {
    return m.pattern.fn(m.match, m);
  }
}
