import { walk } from "https://deno.land/std/fs/mod.ts";
import { basename } from "https://deno.land/std/path/mod.ts";

export async function configDir(dir: string) {
  const files: Record<string, string> = {};
  for await (const entry of walk(dir)) {
    if (entry.isFile) {
      files[basename(entry.path)] = await Deno.readTextFile(entry.path);
    }
  }
  return files;
}

export function configMap(name: string, data: Record<string, string>) {
  return {
    apiVersion: "v1",
    kind: "ConfigMap",
    metadata: {
      name,
    },
    data,
  };
}

export function opaqueSecret(
  name: string,
  data: Record<string, string>,
  namespace = "default",
) {
  return {
    apiVersion: "v1",
    kind: "Secret",
    metadata: {
      name,
      namespace,
    },
    type: "Opaque",
    data,
  };
}

export function opaqueSecretString(
  name: string,
  stringData: Record<string, string>,
  namespace = "default",
) {
  return {
    apiVersion: "v1",
    kind: "Secret",
    metadata: {
      name,
      namespace,
    },
    type: "Opaque",
    stringData,
  };
}
