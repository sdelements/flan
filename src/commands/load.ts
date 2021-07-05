import TartCommand from "../TartCommand";
import * as execa from "execa";
import * as path from "path";

export default class Load extends TartCommand {
  static description = "describe the command here";

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
    this.runHook("beforeLoad");

    const { args } = this.parse(Load);

    const input = args.input;
    console.log(`input file name: ${input}`);

    const pgArgs = [
      "--jobs=8",
      "--clean",
      "-d",
      this.localConfig?.database.db as string,
    ];
    this.localConfig?.database.user &&
      pgArgs.push("-U", this.localConfig?.database.user);

    await execa("pg_restore", [
      ...pgArgs,
      path.resolve(this.localConfig?.saveDir || ".tart", input) as string,
    ]);

    this.runHook("afterLoad");
  }
}
