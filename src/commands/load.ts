/* eslint-disable no-console */
import * as path from "path";
import * as execa from "execa";
import * as os from "os";

import TartCommand from "../TartCommand";
import { checkDumpNameForTag } from "../utils";

export default class Load extends TartCommand {
  static description = "load database from dump";

  static examples = ["$ tart load myDB"];

  static flags = {
    ...TartCommand.flags,
  };

  static args = [
    {
      name: "input",
      required: true,
      description: "name of input file",
    },
  ];

  async run() {
    await this.runHook("beforeLoad");

    const { args } = this.parse(Load);
    const { input } = args;

    this.log(`input file name: ${input}`);

    let loadPath = this.localConfig.saveDir;

    if (checkDumpNameForTag(input)) {
      loadPath = this.localConfig.repoDir;

      try {
        await execa("git", ["rev-parse", `${input}^{tag}`], {
          cwd: loadPath,
        });
      } catch (error) {
        this.error(`${input} does not exist in the local repository`);
      }

      await execa("git", ["checkout", input], {
        cwd: loadPath,
      });
    }

    const pgArgs = [
      "--clean",
      `--jobs=${os.cpus().length}`,
      "--schema=public",
      `--dbname=${this.localConfig.database.db as string}`,
      path.resolve(loadPath, input),
    ];

    if (this.localConfig.database.user) {
      pgArgs.push("-U", this.localConfig.database.user);
    }

    console.time("pg_restore");
    await execa("pg_restore", pgArgs);
    console.timeEnd("pg_restore");

    await this.runHook("afterLoad");
  }
}
