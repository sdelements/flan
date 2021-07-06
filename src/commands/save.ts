import TartCommand from "../TartCommand";
import * as execa from "execa";
import * as path from "path";

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

    this.log(`output file name: ${args.output}`);

    const pgArgs = [
      "-Fc",
      "-Z",
      "9",
      "--file",
      path.resolve(this.localConfig.saveDir, args.output),
    ];

    if (this.localConfig.database.user) {
      pgArgs.push("-U", this.localConfig.database.user);
    }

    await execa("pg_dump", [...pgArgs, this.localConfig.database.db as string]);

    await this.runHook("afterSave");
  }
}
