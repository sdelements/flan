/* eslint-disable no-console */
import path from "path";
import execa from "execa";
import fs from "fs-extra";
import os from "os";

import TartCommand from "../TartCommand";
import { createExecaCommand, checkDumpNameForTag } from "../utils";

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

    if (checkDumpNameForTag(output)) {
      await this.dumpWithRepo({ output });
    } else {
      await this.dump(path.resolve(this.localConfig.saveDir, output));
    }

    await this.runHook("afterSave");
  }

  async dumpWithRepo({ output }: { output: string }) {
    // git checkout master
    // git update-ref -d HEAD
    // git reset --hard
    // do save
    // git add filename
    // git commit -a -m "saved.. $DATE"
    // git tag filename
    this.log("doing repo save");

    const git = createExecaCommand("git", {
      cwd: this.localConfig.repoDir,
    });

    // git checkout master TODO add check to see if master is there and toggle -b
    try {
      await git(["checkout", "master"]);
    } catch (error) {
      await git(["checkout", "-b", "master"]);
    }

    this.log("checked out master");

    await git(["update-ref", "-d", "HEAD"]);
    await git(["reset", "--hard"]);

    this.log("cleaned repo");

    // save file
    await this.dump(path.resolve(this.localConfig.repoDir, output));

    this.log("saved new file");

    // git add file
    await git(["add", output]);
    await git(["commit", "-a", "-m", `saved... ${output}`]);

    this.log("git commit done");

    // git tag -a -m "file" file
    await git(["tag", "-a", "-f", "-m", output, output]);

    this.log("git tag done");
  }

  async dump(dir: string) {
    if (await fs.pathExists(path.resolve(dir, "./toc.dat"))) {
      await fs.remove(path.resolve(dir));
    }

    const pgArgs = [
      `--dbname=${this.localConfig.database.db as string}`,
      `--jobs=${os.cpus().length}`,
      "--compress=9",
      "--format=directory",
      "--no-owner",
      `--file=${dir}`,
    ];

    if (this.localConfig.database.user) {
      pgArgs.push(`--username=${this.localConfig.database.user}`);
    }

    console.time("pg_dump");
    await execa("pg_dump", pgArgs);
    console.timeEnd("pg_dump");
  }
}
