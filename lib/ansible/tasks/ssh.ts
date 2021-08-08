import { command } from "./command.ts";

export function setPort(port: number | string) {
  return {
    name: `Set ssh port: ${port}`,
    lineinfile: {
      dest: "/etc/ssh/sshd_config",
      regexp: "^Port",
      line: `Port {{ sshd_port | default('${port}')}}`,
      state: "present",
    },
  };
}

export function permitRootLogin(value: "yes" | "no" = "no") {
  const expr = `{{ ssh_root_login | default('${value}') }}`;
  return {
    name: `Permit root login: ${expr}`,
    lineinfile: {
      dest: "/etc/ssh/sshd_config",
      regexp: "^PermitRootLogin",
      line: `PermitRootLogin ${expr}`,
      state: "present",
    },
  };
}

export function permitPasswordLogin(value: "yes" | "no" = "no") {
  const expr = `{{ ssh_password_login | default('${value}') }}`;

  return {
    name: `Permit password login: ${expr}`,
    lineinfile: {
      dest: "/etc/ssh/sshd_config",
      regexp: "^#?PasswordAuthentication",
      line: `PasswordAuthentication ${expr}`,
      state: "present",
    },
  };
}

export function sshCopyId(file?: string) {
  return command(
    `SSH copy id: ${file ?? ""}`,
    `command ssh-copy-id -o StrictHostKeyChecking=no ${
      file ? `-i ${file}` : ""
    } {{ inventory_hostname }}`,
  );
}

export function addAuthorizedKey(
  user = "root",
  file = "id_ed25519",
) {
  return {
    name: `Set authorized key for ${user} from file ${file}`,
    authorized_key: {
      user,
      state: "present",
      key: `{{ lookup('file', '~/.ssh/${file}.pub') }}`,
    },
  };
}
