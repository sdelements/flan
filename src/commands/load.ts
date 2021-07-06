import TartCommand from "../TartCommand";
import * as execa from "execa";
import * as path from "path";

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

    this.log(`input file name: ${args.input}`);

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
      path.resolve(this.localConfig.saveDir, args.input) as string,
    ]);

    await this.runHook("afterLoad");
  }
}
