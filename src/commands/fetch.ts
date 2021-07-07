import TartCommand from "../TartCommand";
import { parseGitOutput, GIT_FLAGS } from "../utils";
import * as execa from "execa";
import * as path from "path";
import cli from "cli-ux";

export default class Fetch extends TartCommand {
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

    const { args } = this.parse(Fetch);
    const { file } = args;
    const resRepoDir = path.resolve(this.localConfig.saveDir + "/repo");

    // TODO change this to come from some config file
    const url = "../remote_repo/.git/";

    this.log(`file: ${file} || repo: ${url}`);

    // git fetch --dry-run --verbose ../remote_repo/.git/ tag hobi@ --no-tags

    try {
      const { stderr } = await execa(
        "git",
        ["fetch", "--verbose", url, "tag", file, "--no-tags"],
        { cwd: resRepoDir }
      );

      const flag = parseGitOutput(stderr);
      if (flag === GIT_FLAGS.UP_TO_DATE) {
        this.log("File is up to date.");
      } else if (flag === GIT_FLAGS.ADD) {
        this.log("Success, file added.");
      }
    } catch (err) {
      if (err.exitCode === 128) {
        this.log("The file does not exist in the remote repo.");
      } else if (
        parseGitOutput(err.stderr) === GIT_FLAGS.REJECT &&
        (await cli.confirm(
          "The file already exists in your local repo, do you want to override? [y/n]"
        ))
      ) {
        const { stderr } = await execa(
          "git",
          ["fetch", "-f", "--verbose", url, "tag", file, "--no-tags"],
          { cwd: resRepoDir }
        );

        const flag = parseGitOutput(stderr);
        if (flag === GIT_FLAGS.TAG_FORCE_ADD) {
          this.log("File overriden.");
        }
      }
    }

    await this.runHook("afterPublish");
  }
}
