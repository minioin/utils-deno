import { PingJob } from "./pingjob.ts";
import { assertObjectMatch } from "https://deno.land/std/testing/asserts.ts";

const removeUndefined = (i: unknown) => JSON.parse(JSON.stringify(i));

Deno.test("test", () => {
  assertObjectMatch(
    removeUndefined(PingJob("job", "@daily", "https://google.com", {})),
    {
      apiVersion: "batch/v1",
      kind: "CronJob",
      metadata: {
        name: "job",
      },
      spec: {
        concurrencyPolicy: "Allow",
        jobTemplate: {
          spec: {
            template: {
              spec: {
                containers: [
                  {
                    args: [
                      "https://google.com",
                    ],
                    env: [],
                    image: "curlimages/curl",
                    imagePullPolicy: "IfNotPresent",
                    name: "cron",
                  },
                ],
                restartPolicy: "OnFailure",
              },
            },
          },
        },
        schedule: "@daily",
      },
    },
  );
});
