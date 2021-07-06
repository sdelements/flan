import TartCommand from "../TartCommand";
import * as execa from "execa";
import * as fs from "fs";
import * as nodegit from "nodegit";
import * as path from "path";

export default class Save extends TartCommand {
  static description = "describe the command here";

  static examples = [`$ tart save`];

  static flags = {
    ...TartCommand.flags,
  };

  static args = [
    {
      name: "output",
      required: false,
      description: "name of output file",
      default: "dbdump",
    },
  ];

  async run() {
    const { args } = this.parse(Save);

    const output = args.output;
    this.log(`output file name: ${output}`);

    const saveDir = this.localConfig?.saveDir || ".tart";

    // git checkout master
    // git update-ref -d HEAD
    // git reset --hard
    // do save
    // git add filename
    // git commit -a -m "saved.. $DATE"
    // git tag filename

    if (output.includes("@")) {
      this.log("doing repo save");
      const repoDir = saveDir + "/repo";
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
  }

  async simpleSave(output: string, repoDir: string) {
    const pgArgs = ["-Fc", "-Z", "9", "--file", path.resolve(repoDir, output)];
    this.localConfig?.database.user &&
      pgArgs.push("-U", this.localConfig?.database.user);

    await execa("pg_dump", [
      ...pgArgs,
      this.localConfig?.database.db as string,
    ]);
  }
}
