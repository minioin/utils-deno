import { URLPattern } from "https://dev.jspm.io/urlpattern-polyfill";
const knownPatterns: Array<PatternMatcher> = [];

interface PatternMatcher {
  pattern: URLPattern;
  fn: PatternMapper;
}

type PatternMapper = (p: UPattern) => string | { [key: string]: string };

export interface UPattern {
  input: string;
  pathname: { input: string; groups: { [s: string]: string } };
}

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

interface MatchResult {
  match: UPattern;
  pattern: PatternMatcher;
}

export function match(url: string): MatchResult | undefined {
  for (const pattern of knownPatterns) {
    const match = pattern.pattern.exec(removeEndingSlash(url)) as UPattern;
    if (match) {
      return {
        pattern,
        match,
      };
    }
  }
}

export function apply(url: string) {
  const m = match(url);
  if (m) {
    return m.pattern.fn(m.match);
  }
}
