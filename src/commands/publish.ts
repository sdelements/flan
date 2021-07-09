import cli from "cli-ux";

import TartCommand from "../TartCommand";
import {
  createExecaCommand,
  parseFlagFromGitOutput,
  GIT_FLAGS,
} from "../utils";

export default class Publish extends TartCommand {
  static description = "publish specified dump file to a remote repository";

  static examples = [`$ tart publish filename`];

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
    await this.runHook("beforePublish");

    const { args } = this.parse(Publish);
    const { file } = args;
    const repository = this.localConfig.repository;

    this.log(`file: ${file} || repo: ${repository}`);

    const git = createExecaCommand("git", {
      cwd: this.localConfig.repoDir,
    });

    // check that tag exists locally
    try {
      await git(["rev-parse", `${file}^{tag}`]);
    } catch (err) {
      this.error(
        `${file} is not a valid file in the repo. Try:\n   tart save ${file}@\n   tart publish ${file}@`
      );
    }

    // try git push <repo url> <tag name>
    try {
      const { stderr } = await git(["push", "--verbose", repository, file]);

      const flag = parseFlagFromGitOutput(stderr);
      if (flag === GIT_FLAGS.UP_TO_DATE) {
        this.log("File is up to date in remote repo.");
      } else if (flag === GIT_FLAGS.ADD) {
        this.log("Success, file added to remote repo.");
      }
    } catch (err) {
      // if error, tag exists. ask if they want to force. if yes:
      // git push -f <repo url> <tag name>
      if (parseFlagFromGitOutput(err.stderr) === GIT_FLAGS.REJECT) {
        if (
          await cli.confirm(
            "The file already exists in the remote repo, do you want to override? [y/n]"
          )
        ) {
          this.log("Overriding...");

          const { stderr } = await git([
            "push",
            "-f",
            "--verbose",
            repository,
            file,
          ]);

          if (parseFlagFromGitOutput(stderr) === GIT_FLAGS.FORCE_ADD) {
            this.log("File overriden in remote repo.");
          }
        }
      } else {
        this.error("Could not publish to remote repo.\n" + err);
      }
    }

    await this.runHook("afterPublish");
  }
}
