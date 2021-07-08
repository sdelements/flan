import cli from "cli-ux";

import TartCommand from "../TartCommand";
import {
  createExecaCommand,
  parseFlagFromGitOutput,
  GIT_FLAGS,
} from "../utils";

export default class Unpublish extends TartCommand {
  static description =
    "unpublish specified database dump from a remote repository";

  static examples = [`$ tart unpublish myDB@1.0.0`];

  static flags = {
    ...TartCommand.flags,
  };

  static args = [
    {
      name: "file",
      required: true,
      description: "name of the file",
    },
  ];

  async run() {
    await this.runHook("beforeUnpublish");

    const { args } = this.parse(Unpublish);
    const { file } = args;
    const url = this.localConfig.repository;
    if (!url) {
      this.error("You must set a remote repository to unpublish.");
    }

    this.log(`file: ${file} || repo: ${url}`);

    const git = createExecaCommand("git", {
      cwd: this.localConfig.repoDir,
    });

    // check that tag exists in remote
    const { stdout } = await git(["ls-remote", "--tags", url]);
    const remoteTagsRegex = new RegExp(`refs/tags/${file}$`, "m");
    if (!remoteTagsRegex.test(stdout)) {
      this.log(`${file} does not exist in the remote repository`);
      return;
    }

    if (
      await cli.confirm(
        `${file} will be removed from the remote repository, continue? Warning: this is permanent [y/n]`
      )
    ) {
      const { stderr } = await git([
        "push",
        "--delete",
        "--verbose",
        url,
        file,
      ]);

      const flag = parseFlagFromGitOutput(stderr);
      if (flag === GIT_FLAGS.REMOVE) {
        this.log("Success, file unpublished from the remote repo.");
      }
    }

    await this.runHook("afterUnpublish");
  }
}
