import { grafanaDashboard } from "./grafana.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

Deno.test("dashboard test", () => {
  assertEquals(grafanaDashboard({}), {
    apiVersion: "integreatly.org/v1alpha1",
    kind: "GrafanaDashboard",
    metadata: {
      labels: {
        app: "grafana",
      },
      name: "0--",
      namespace: "grafana-operator",
    },
    spec: {
      json: "{}",
    },
  });
});
