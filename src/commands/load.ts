import * as path from "path";
import * as execa from "execa";

import TartCommand from "../TartCommand";

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

    let dirPath = this.localConfig.saveDir;

    if (input.includes("@")) {
      dirPath = this.localConfig.repoDir;

      //git checkout db@v2
      await execa("git", ["checkout", input], {
        cwd: dirPath,
      });
    }

    const pgArgs = [
      "--jobs=8",
      "--clean",
      "-d",
      this.localConfig.database.db as string,
    ];

    if (this.localConfig.database.user) {
      pgArgs.push("-U", this.localConfig.database.user);
    }

    await execa("pg_restore", [
      ...pgArgs,

      path.resolve(dirPath, input) as string,
    ]);

    await this.runHook("afterLoad");
  }
}
