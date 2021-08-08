export function enableCompress() {
  return {
    name: "Logrotate compress",
    lineinfile: {
      dest: "/etc/logrotate.conf",
      regexp: "^#?compress",
      line: "compress",
      state: "present",
    },
  };
}

export function disableCompress() {
  return {
    name: "Logrotate compress",
    lineinfile: {
      dest: "/etc/logrotate.conf",
      regexp: "^#?compress",
      line: "#compress",
      state: "present",
    },
  };
}
