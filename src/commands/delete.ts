import * as path from "path";
import * as fs from "fs-extra";
import cli from "cli-ux";

import TartCommand from "../TartCommand";
import { createExecaCommand, checkDumpName } from "../utils";

export default class Load extends TartCommand {
  static description = "delete a local database dump";

  static examples = ["$ tart delete myDB"];

  static flags = {
    ...TartCommand.flags,
  };

  static args = [
    {
      name: "deleteFile",
      required: true,
      description: "name of file to delete",
    },
  ];

  async run() {
    await this.runHook("beforeDelete");

    const { args } = this.parse(Load);
    const { deleteFile } = args;

    if (checkDumpName(deleteFile)) {
      await this.deleteGitTag(deleteFile);
    } else {
      await this.deleteLocalFile(deleteFile);
    }

    await this.runHook("afterDelete");
  }

  async deleteGitTag(deleteFile: string) {
    const git = createExecaCommand("git", {
      cwd: this.localConfig.repoDir,
    });
    const { stdout } = await git(["tag"]);
    if (!stdout.includes(deleteFile)) {
      this.error(`This database dump does not exist`);
    }

    if (
      await cli.confirm(
        `Are you sure you wish to delete the local database dump: ${deleteFile}? [y/n]`
      )
    ) {
      await git(["tag", "-d", deleteFile]);

      try {
        await git(["checkout", "master"]);
      } catch (e) {
        await git(["checkout", "-b", "master"]);
      }

      await git(["update-ref", "-d", "HEAD"]);
      await git(["reset", "--hard"]);

      this.log(`Successfully deleted ${deleteFile}`);
    }
  }

  async deleteLocalFile(deleteFile: string) {
    const deleteFilePath = path.resolve(this.localConfig.saveDir, deleteFile);
    if (!(await fs.pathExists(deleteFilePath))) {
      this.error(`This file does not exist`);
    }

    if (!(await fs.lstat(deleteFilePath)).isFile()) {
      this.error(`This is not a valid file`);
    }

    if (
      await cli.confirm(
        `Are you sure you wish to delete the local database dump: ${deleteFile}? [y/n]`
      )
    ) {
      await fs.remove(deleteFilePath);
      this.log(`Successfully deleted ${deleteFile}`);
    }
  }
}
