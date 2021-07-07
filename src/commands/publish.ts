import TartCommand from "../TartCommand";
import { parseGitOutput, GIT_FLAGS } from "../utils";
import * as execa from "execa";
import * as path from "path";
import cli from "cli-ux";

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
    const resRepoDir = path.resolve(this.localConfig.saveDir + "/repo");

    // TODO change this to come from some config file
    const url = "../remote_repo/.git/";

    this.log(`file: ${file} || repo: ${url}`);

    // check that tag exists locally
    const { stdout } = await execa("git", ["tag"], { cwd: resRepoDir });
    if (!stdout.includes(file)) {
      this.log(
        `${file} is not a valid file in the repo. Try:\n   tart save ${file}@\n   tart publish ${file}@`
      );
      return;
    }

    // try git push <repo url> <tag name>
    try {
      const { stderr } = await execa("git", ["push", "--verbose", url, file], {
        cwd: resRepoDir,
      });

      const flag = parseGitOutput(stderr);
      if (flag === GIT_FLAGS.UP_TO_DATE) {
        this.log("File is up to date in remote repo.");
      } else if (flag === GIT_FLAGS.ADD) {
        this.log("Success, file added to remote repo.");
      }
    } catch (err) {
      // if error, tag exists. ask if they want to force. if yes:
      // git push -f <repo url> <tag name>
      if (
        parseGitOutput(err.stderr) === GIT_FLAGS.REJECT &&
        (await cli.confirm(
          "The file already exists in the remote repo, do you want to override? [y/n]"
        ))
      ) {
        this.log("Overriding...");

        const { stderr } = await execa(
          "git",
          ["push", "-f", "--verbose", url, file],
          { cwd: resRepoDir }
        );

        if (parseGitOutput(stderr) === GIT_FLAGS.FORCE_ADD) {
          this.log("File overriden in remote repo.");
        }
      }
    }

    await this.runHook("afterPublish");
  }
}
