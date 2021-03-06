import execa from "execa";

export const createExecaCommand =
  (command: string, config: {}) => async (params: string[]) =>
    execa(command, params, config);

export const checkDumpNameForTag = (name: string) => {
  return /^[a-z_-]+@(\d+.)?.?(\d+.)?.?(\d+)$/i.test(name);
};

export const parseFlagFromGitOutput = (str?: string) => {
  if (!str) return "";

  const gitOutRegex = /^ (?<flag>[\!\+\*\=t]) (\[(?<summary>[a-z ]+)\])?/im;
  const match = str.match(gitOutRegex);
  if (!match || !match.groups) return "";

  return match.groups.flag;
};

export const GIT_FLAGS = {
  UP_TO_DATE: "=",
  ADD: "*",
  REJECT: "!",
  FORCE_ADD: "+",
  TAG_FORCE_ADD: "t",
  REMOVE: "-",
};
