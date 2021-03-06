import cli from "cli-ux";

import FlanCommand from "../FlanCommand";
import {
  createExecaCommand,
  parseFlagFromGitOutput,
  GIT_FLAGS,
} from "../utils";

export default class Fetch extends FlanCommand {
  static description = "fetch specified dump file from a remote repository";

  static examples = [`$ flan fetch filename`];

  static flags = {
    ...FlanCommand.flags,
  };

  static args = [
    {
      name: "file",
      required: true,
      description: "name of the file",
    },
  ];

  async run() {
    await this.runHook("beforeFetch");

    const { args } = this.parse(Fetch);
    const { file } = args;
    const repository = this.localConfig.repository;

    const git = createExecaCommand("git", {
      cwd: this.localConfig.repoDir,
    });

    this.log(`file: ${file} || repo: ${repository}`);

    const { stdout } = await git(["ls-remote", "--tags", repository || ""]);
    const remoteTagsRegex = new RegExp(`refs/tags/${file}$`, "m");
    if (!remoteTagsRegex.test(stdout)) {
      this.error(`${file} does not exist in the remote repository`);
    }

    // git fetch --dry-run --verbose ../remote_repo/.git/ tag hobi@ --no-tags

    try {
      const { stderr } = await git([
        "fetch",
        "--verbose",
        repository,
        "tag",
        file,
        "--no-tags",
      ]);

      const flag = parseFlagFromGitOutput(stderr);
      if (flag === GIT_FLAGS.UP_TO_DATE) {
        this.log("File is up to date.");
      } else if (flag === GIT_FLAGS.ADD) {
        this.log("Success, file added.");
      }
    } catch (error) {
      if (parseFlagFromGitOutput(error.stderr) === GIT_FLAGS.REJECT) {
        if (
          await cli.confirm(
            "The file already exists in your local repo, do you want to override? [y/n]"
          )
        ) {
          const { stderr } = await git([
            "fetch",
            "-f",
            "--verbose",
            repository,
            "tag",
            file,
            "--no-tags",
          ]);

          const flag = parseFlagFromGitOutput(stderr);
          if (flag === GIT_FLAGS.TAG_FORCE_ADD) {
            this.log("File overriden.");
          }
        }
      } else {
        this.error("Could not fetch from remote repo.\n" + error);
      }
    }

    await this.runHook("afterFetch");
  }
}
