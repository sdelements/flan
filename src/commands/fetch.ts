import TartCommand from "../TartCommand";
import * as execa from "execa";
import * as path from "path";
import * as os from "os";

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

    // check that tag exists locally

    // try git push <repo url> <tag name>

    // git fetch --dry-run --verbose ../remote_repo/.git/ tag hobi@ --no-tags

    try {
      const { stdout } = await execa(
        "git",
        ["push", "--porcelain", "--dry-run", url, file],
        { cwd: resRepoDir }
      );

      const successCode = stdout.split(os.EOL)[1][0];
      if (successCode === "=") {
        this.log("File is up to date in remote repo.");
      } else if (successCode === "*") {
        this.log("Success, file added to remote repo.");
      }
    } catch (err) {
      // if error tag exists ask if they want to force if yes:
      // git push -f <repo url> <tag name>
      const errorCode = err.stdout.split(os.EOL)[1][0];
      if (errorCode === "!") {
        this.log("The file already exists in the remote repo, overriding...");
      }

      const { stdout } = await execa(
        "git",
        ["push", "-f", "--porcelain", "--dry-run", url, file],
        { cwd: resRepoDir }
      );

      const successCode = stdout.split(os.EOL)[1][0];
      if (successCode === "+") {
        this.log("File overriden in remote repo.");
      }
    }

    await this.runHook("afterPublish");
  }
}
