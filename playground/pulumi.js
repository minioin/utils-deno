import * as k8s from "https://esm.sh/@pulumi/kubernetes";
import * as kx from "https://esm.sh/@pulumi/kubernetesx";

const provider = new k8s.Provider("render-yaml", {
  renderYamlToDirectory: "rendered",
});

const pvc = new kx.PersistentVolumeClaim("data", {
  spec: {
    accessModes: ["ReadWriteOnce"],
    resources: { requests: { storage: "1Gi" } },
  },
}, { provider });

const cm = new kx.ConfigMap("cm", {
  data: { "config": "very important data" },
}, { provider });

const secret = new kx.Secret("secret", {
  stringData: {
    "password": new random.RandomPassword("pw", {
      length: 12,
    }).result,
  },
}, { provider });

const pb = new kx.PodBuilder({
  containers: [{
    env: {
      CONFIG: cm.asEnvValue("config"),
      PASSWORD: secret.asEnvValue("password"),
    },
    image: "nginx",
    ports: { http: 8080 },
    volumeMounts: [pvc.mount("/data")],
  }],
});

const deployment = new kx.Deployment("nginx", {
  spec: pb.asDeploymentSpec({ replicas: 3 }),
}, { provider });

deployment.createService({
  type: kx.types.ServiceType.LoadBalancer,
});
