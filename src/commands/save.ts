import TartCommand from "../TartCommand";
import * as execa from "execa";
import * as path from "path";
import * as fs from "fs-extra";

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

    if (output.includes("@")) {
      this.log("doing repo save");
      const repoDir = saveDir + "/remote_repo";
      const resRepoDir = path.resolve(repoDir);

      // git checkout master TODO add check to see if master is there and toggle -b
      try {
        await execa("git", ["checkout", "master"], {
          cwd: resRepoDir,
        });
      } catch (e) {
        await execa("git", ["checkout", "-b", "master"], {
          cwd: resRepoDir,
        });
      }

      this.log("orphan checked master");

      await execa("git", ["update-ref", "-d", "HEAD"], {
        cwd: resRepoDir,
      });

      await execa("git", ["reset", "--hard"], {
        cwd: resRepoDir,
      });

      this.log("reset dir");

      // save file
      await this.simpleSave(output, repoDir);

      this.log("saved new file");

      // git add file
      await execa("git", ["add", output], {
        cwd: resRepoDir,
      });

      await execa("git", ["commit", "-a", "-m", "saved... " + output], {
        cwd: resRepoDir,
      });

      this.log("git commit done");

      // git tag -a -m "file" file
      await execa("git", ["tag", "-a", "-f", "-m", output, output], {
        cwd: resRepoDir,
      });
      this.log("git tag done");
    } else {
      this.simpleSave(output, this.localConfig?.saveDir || ".tart");
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
