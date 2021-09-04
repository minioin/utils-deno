import { env2List } from "./utils.ts";
import * as BatchV1 from "https://deno.land/x/kubernetes_apis@v0.3.1/builtin/batch@v1/structs.ts";

export function PingJob(
  name: string,
  schedule: string,
  url: string,
  env: Record<string, string> = {},
) {
  return BatchV1.fromCronJob({
    metadata: {
      name,
    },
    spec: {
      schedule,
      concurrencyPolicy: "Allow",
      jobTemplate: {
        spec: {
          template: {
            spec: {
              containers: [
                {
                  name: "cron",
                  image: "curlimages/curl",
                  imagePullPolicy: "IfNotPresent",
                  args: [url],
                  env: env2List(env),
                },
              ],
              restartPolicy: "OnFailure",
            },
          },
        },
      },
    },
  });
}
