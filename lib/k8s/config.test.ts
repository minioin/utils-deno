import { configMap, opaqueSecret, opaqueSecretString } from "./config.ts";
import { removeUndefined } from "../testutils.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

Deno.test("secret string", () => {
  assertEquals(
    removeUndefined(opaqueSecretString("secret", {
      password: "password",
    })),
    {
      apiVersion: "v1",
      kind: "Secret",
      metadata: {
        name: "secret",
        namespace: "default",
      },
      stringData: {
        password: "password",
      },
      type: "Opaque",
    },
  );
});

Deno.test("secret", () => {
  assertEquals(
    removeUndefined(opaqueSecret("secret", {
      password: "password",
    })),
    {
      apiVersion: "v1",
      kind: "Secret",
      metadata: {
        name: "secret",
        namespace: "default",
      },
      data: {
        password: "password",
      },
      type: "Opaque",
    },
  );
});

Deno.test("configmap", () => {
  assertEquals(
    removeUndefined(configMap("config", {
      password: "password",
    })),
    {
      apiVersion: "v1",
      kind: "ConfigMap",
      metadata: {
        name: "config",
        namespace: "default",
      },
      data: {
        password: "password",
      },
    },
  );
});
