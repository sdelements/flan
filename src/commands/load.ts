/* eslint-disable no-console */
import { flags } from "@oclif/command";
import path from "path";
import execa from "execa";
import os from "os";

import FlanCommand from "../FlanCommand";
import { checkDumpNameForTag } from "../utils";

export default class Load extends FlanCommand {
  static description = "load database from dump";

  static examples = ["$ flan load myDB", "$ flan load --drop-db --quiet myDB"];

  static flags = {
    ...FlanCommand.flags,
    "drop-db": flags.boolean({
      default: false,
      description: "Drops and re-creates the DB before restoring it's data",
    }),
    quiet: flags.boolean({
      default: false,
      description: "Supress errors from pg_restore",
    }),
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

    const { args, flags } = this.parse(Load);
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

    if (flags["drop-db"] && this.localConfig.database.user) {
      this.log(`recreating ${this.localConfig.database.db}`);
      const dropDbArgs = [
        "postgres",
        "-U",
        this.localConfig.database.user as string,
        "-c",
      ];
      await execa("psql", [
        ...dropDbArgs,
        `DROP DATABASE ${this.localConfig.database.db}`,
      ]);
      await execa("psql", [
        ...dropDbArgs,
        `CREATE DATABASE ${this.localConfig.database.db}`,
      ]);
    }

    console.time("pg_restore");
    try {
      await execa("pg_restore", [
        "--clean",
        "--if-exists",
        "--no-owner",
        `--jobs=${Math.floor(os.cpus().length / 2)}`,
        ...this.getPgConnectionArgs(),
        path.resolve(loadPath, input),
      ]);
    } catch (error) {
      if (
        !flags.quiet &&
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
