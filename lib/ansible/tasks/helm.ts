export function install(
  name: string,
  chart: string,
  values: Record<string, unknown>,
  namespace = "default",
) {
  return {
    name: `install helm chart: ${chart} as ${name}`,
    "community.kubernetes.helm": {
      name,
      "chart_ref": chart,
      "release_namespace": namespace,
      values,
    },
  };
}

export function remove(
  name: string,
) {
  return {
    name: `remove helm release: ${name}`,
    "community.kubernetes.helm": {
      name,
      state: "absent",
      wait: true,
    },
  };
}

export function repo(name: string, repo: string) {
  return {
    name: `add helm repo: ${name}`,
    "community.kubernetes.helm_repository": {
      name,
      "repo_url": repo,
    },
  };
}
