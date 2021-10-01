import { slugify } from "https://deno.land/x/slugify/mod.ts";
import { SEP } from "https://deno.land/std@0.106.0/path/separator.ts";

export interface GrafanaDashboard {
  apiVersion: string;
  kind: "GrafanaDashboard";
  metadata: {
    labels: {
      app: string;
    };
    name: string;
    namespace: string;
  };
  spec: {
    json: string;
  };
}

export function grafanaDashboard(dashboard: Record<string, unknown>) {
  const { gnetId, uid, title } =
    (dashboard as { gnetId: number; uid: string; title: string });
  const sanitizedTitle = slugify(title?.replaceAll(SEP, "") ?? "")
    .toLowerCase();
  const name = `${gnetId ?? uid}-${sanitizedTitle}`.toLowerCase();
  return {
    apiVersion: "integreatly.org/v1alpha1",
    kind: "GrafanaDashboard",
    metadata: {
      labels: {
        app: "grafana",
      },
      name,
      namespace: "grafana-operator",
    },
    spec: {
      json: JSON.stringify(dashboard, null, 2),
    },
  };
}
