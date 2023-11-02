import { parse as parseCsv } from "https://deno.land/std/csv/parse.ts";

export async function fromCSV(
  file: string,
  { skipFirstRow = true, separator = "," } = {}
): Promise<unknown[]> {
  const content = await Deno.readTextFile(file);
  return fromCSVContent(content, { separator, skipFirstRow });
}

export function fromCSVContent(
  content: string,
  { skipFirstRow = true, separator = "," } = {}
): Promise<unknown[]> {
  return parseCsv(content, {
    separator,
    skipFirstRow,
  });
}
