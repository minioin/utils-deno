export async function downloadFile(
  url: string,
  path: string,
  fetchOptions = {},
) {
  const res = await fetch(url, fetchOptions);
  if (res.status < 200 || res.status >= 400 || !res.body) {
    throw new Error("Error downloading" + res.status);
  }
  const file = await Deno.open(path, { create: true, write: true });
  return res.body.pipe(file.writer);
}
