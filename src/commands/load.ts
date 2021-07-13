/* eslint-disable no-console */
import path from "path";
import execa from "execa";
import os from "os";
import cli from "cli-ux";

import TartCommand from "../TartCommand";

import Fetch from "./fetch";

import { createExecaCommand, checkDumpNameForTag } from "../utils";

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

    const git = createExecaCommand("git", {
      cwd: this.localConfig.repoDir,
    });

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
        const { stdout } = await git([
          "ls-remote",
          "--tags",
          this.localConfig.repository || "",
        ]);

        const remoteTagsRegex = new RegExp(`refs/tags/${input}$`, "m");

        if (remoteTagsRegex.test(stdout)) {
          if (
            await cli.confirm(`${input} was found on remote, attempt to fetch?`)
          ) {
            await Fetch.run([input]);
          } else {
            this.exit(1);
          }
        } else {
          this.error(`${input} does not exist in any repository`);
        }
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
        "-U",
        this.localConfig.database.user as string,
        `--dbname=${this.localConfig.database.db as string}`,
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
