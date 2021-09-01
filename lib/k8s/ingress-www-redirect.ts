import {
  Ingress,
  toIngress,
} from "https://deno.land/x/kubernetes_apis@v0.3.1/builtin/networking.k8s.io@v1/structs.ts";

interface RedirectToWWWInput {
  name?: string;
  serviceName: string;
  servicePort: number;
  hostname: string;
  tlsSecretName: string;
}

export function nginxRedirectToWWW(
  {
    hostname,
    tlsSecretName,
    serviceName,
    servicePort,
    name,
  }: RedirectToWWWInput,
): Ingress {
  name = name ?? "redirect-to-www-" + hostname;
  return toIngress({
    metadata: {
      name,
      annotations: {
        "nginx.ingress.kubernetes.io/from-to-www-redirect": "true",
      },
    },
    spec: {
      tls: [
        {
          hosts: [
            "www." + hostname,
            hostname,
          ],
          secretName: tlsSecretName,
        },
      ],
      rules: [
        {
          host: "www." + hostname,
          http: {
            paths: [
              {
                path: "/",
                pathType: "Prefix",
                backend: {
                  service: {
                    name: serviceName,
                    port: {
                      number: servicePort,
                    },
                  },
                },
              },
            ],
          },
        },
      ],
    },
  });
}
