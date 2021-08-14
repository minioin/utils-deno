import { debian } from "./system.ts";
import { replace } from "./replace.ts";

export function update() {
  return debian({
    name: `apt update`,
    apt: {
      "update_cache": "yes",
    },
  });
}

export function autoremove() {
  return debian({
    name: `apt autoremove`,
    apt: {
      "autoremove": "yes",
    },
  });
}

export function upgrade() {
  return debian({
    name: `apt full-upgrade`,
    apt: {
      upgrade: "full",
      "update_cache": "yes",
    },
  });
}

export function distUpgrade() {
  return debian({
    name: `dist dist-upgrade`,
    apt: {
      upgrade: "dist",
    },
  });
}

export function apt(
  name: string,
  state: "present" | "absent",
  updateCache = true,
) {
  return debian({
    name: `apt install ${name}.`,
    apt: {
      name,
      state,
      "update_cache": updateCache,
    },
  });
}

export function changeReleaseSource(oldRelease: string, newRelease: string) {
  return debian(
    replace(
      "/etc/apt/sources.list",
      `{{old_release | default('${oldRelease}')}}`,
      `{{new_release | default('${newRelease}') }}`,
    ),
  );
}

export const aptInstall = (pkg: string, updateCache = true) =>
  apt(pkg, "present", updateCache);
export const aptRemove = (pkg: string, updateCache = true) =>
  apt(pkg, "absent", updateCache);
