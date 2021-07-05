import TartCommand from "../TartCommand";
import * as execa from "execa";
import * as path from "path";

export default class Save extends TartCommand {
  static description = "describe the command here";

  static examples = ["$ tart save", "$ tart save myDB"];

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
    this.runHook("beforeSave");

    const { args } = this.parse(Save);

    const output = args.output;
    this.log(`output file name: ${output}`);

    const pgArgs = [
      "-Fc",
      "-Z",
      "9",
      "--file",
      path.resolve(this.localConfig?.saveDir || ".tart", output),
    ];
    this.localConfig?.database.user &&
      pgArgs.push("-U", this.localConfig?.database.user);

    await execa("pg_dump", [
      ...pgArgs,
      this.localConfig?.database.db as string,
    ]);

    this.runHook("afterSave");
  }
}
