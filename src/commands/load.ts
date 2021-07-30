/* eslint-disable no-console */
import path from "path";
import execa from "execa";
import os from "os";

import FlanCommand from "../FlanCommand";
import { checkDumpNameForTag } from "../utils";

export default class Load extends FlanCommand {
  static description = "load database from dump";

  static examples = ["$ flan load myDB"];

  static flags = {
    ...FlanCommand.flags,
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

    console.time("pg_restore");
    if (this.localConfig.database.user) {
      execa("psql", [
        "-U",
        this.localConfig.database.user as string,
        "-c",
        "DROP SCHEMA public CASCADE; CREATE SCHEMA public",
      ]);
    }

    try {
      await execa("pg_restore", [
        "--clean",
        `--jobs=${Math.floor(os.cpus().length / 2)}`,
        "--schema=public",
        ...this.getPgConnectionArgs(),
        path.resolve(loadPath, input),
      ]);
    } catch (error) {
      if (
        !/pg_restore: warning: errors ignored on restore: \d+\s*$/gim.test(
          error.stderr
        )
      ) {
        this.error(error.stderr || error.message);
      }
    }
    console.timeEnd("pg_restore");

    await this.runHook("afterLoad");
  }
}
