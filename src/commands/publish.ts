import TartCommand from "../TartCommand";
import * as execa from "execa";
import * as path from "path";
import * as os from "os";
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
    const gitOutRegex = new RegExp(/\s([\s!+#*-=])\s/gm);

    // TODO change this to come from some config file
    const url = "../remote_repo/.git/";

    this.log(`file: ${file} || repo: ${url}`);

    // check that tag exists locally
    const { all } = await execa("git", ["tag"], { all: true, cwd: resRepoDir });
    if (!all.includes(file)) {
      this.log(
        `${file} is not a valid file in the repo. Try:\n   tart save ${file}@\n   tart publish ${file}@`
      );
      return;
    }

    // try git push <repo url> <tag name>
    try {
      const { all } = await execa(
        "git",
        ["push", "--verbose", "--dry-run", url, file],
        { all: true, cwd: resRepoDir }
      );

      const match = gitOutRegex.exec(all);
      if (match == null) return;

      if (match[1] === "=") {
        this.log("File is up to date in remote repo.");
      } else if (match[1] === "*") {
        this.log("Success, file added to remote repo.");
      }
    } catch (err) {
      // if error tag exists ask if they want to force if yes:
      // git push -f <repo url> <tag name>
      const match = gitOutRegex.exec(err);
      if (
        match != null &&
        match[1] === "!" &&
        (await cli.confirm(
          "The file already exists in the remote repo, do you want to override? [y/n]"
        ))
      ) {
        this.log("Overriding...");

        const { all } = await execa(
          "git",
          ["push", "-f", "--verbose", "--dry-run", url, file],
          { all: true, cwd: resRepoDir }
        );

        const match = gitOutRegex.exec(all);
        this.log(match);
        if (match != null && match[1] === "+") {
          this.log("File overriden in remote repo.");
        }
      }
    }

    await this.runHook("afterPublish");
  }
}
