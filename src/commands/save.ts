import * as path from "path";
import * as execa from "execa";

import TartCommand from "../TartCommand";
import { createExecaCommand } from "../utils";

export default class Save extends TartCommand {
  static description = "save current database to dump";

  static examples = ["$ tart save myDB"];

  static flags = {
    ...TartCommand.flags,
  };

  static args = [
    {
      name: "output",
      required: true,
      description: "name of output file",
    },
  ];

  async run() {
    await this.runHook("beforeSave");

    const { args } = this.parse(Save);
    const { output } = args;

    this.log(`output file name: ${output}`);

    const saveDir = this.localConfig.saveDir;

    // git checkout master
    // git update-ref -d HEAD
    // git reset --hard
    // do save
    // git add filename
    // git commit -a -m "saved.. $DATE"
    // git tag filename

    const git = createExecaCommand("git", {
      cwd: this.localConfig.repoDir,
    });

    if (output.includes("@")) {
      this.log("doing repo save");

      // git checkout master TODO add check to see if master is there and toggle -b
      try {
        await git(["checkout", "master"]);
      } catch (e) {
        await git(["checkout", "-b", "master"]);
      }

      this.log("orphan checked master");

      await git(["update-ref", "-d", "HEAD"]);
      await git(["reset", "--hard"]);

      this.log("reset dir");

      // save file
      await this.simpleSave(output, this.localConfig.repoDir);

      this.log("saved new file");

      // git add file
      await git(["add", output]);
      await git(["commit", "-a", "-m", `saved... ${output}`]);

      this.log("git commit done");

      // git tag -a -m "file" file
      await git(["tag", "-a", "-f", "-m", output, output]);

      this.log("git tag done");
    } else {
      this.simpleSave(output, this.localConfig.saveDir);
    }

    await this.runHook("afterSave");
  }

  async simpleSave(output: string, repoDir: string) {
    const pgArgs = ["-Fc", "-Z", "9", "--file", path.resolve(repoDir, output)];
    this.localConfig?.database.user &&
      pgArgs.push("-U", this.localConfig?.database.user);

    if (this.localConfig.database.user) {
      pgArgs.push("-U", this.localConfig.database.user);
    }

    await execa("pg_dump", [...pgArgs, this.localConfig.database.db as string]);
  }
}
