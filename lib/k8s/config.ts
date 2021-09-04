import { walk } from "https://deno.land/std/fs/mod.ts";
import { basename } from "https://deno.land/std/path/mod.ts";
import * as CoreV1 from "https://deno.land/x/kubernetes_apis@v0.3.1/builtin/core@v1/structs.ts";

export async function configDir(dir: string) {
  const files: Record<string, string> = {};
  for await (const entry of walk(dir)) {
    if (entry.isFile) {
      files[basename(entry.path)] = await Deno.readTextFile(entry.path);
    }
  }
  return files;
}

export function configMap(
  name: string,
  data: Record<string, string>,
  namespace = "default",
) {
  return CoreV1.fromConfigMap({
    apiVersion: "v1",
    kind: "ConfigMap",
    metadata: {
      name,
      namespace,
    },
    data,
  });
}

export async function configDirMap(name: string, dir: string) {
  return configMap(name, await configDir(dir));
}

export function opaqueSecret(
  name: string,
  data: Record<string, string>,
  namespace = "default",
) {
  return CoreV1.fromSecret({
    metadata: {
      name,
      namespace,
    },
    type: "Opaque",
    data,
  });
}

export function opaqueSecretString(
  name: string,
  stringData: Record<string, string>,
  namespace = "default",
) {
  return CoreV1.fromSecret({
    metadata: {
      name,
      namespace,
    },
    type: "Opaque",
    stringData,
  });
}
