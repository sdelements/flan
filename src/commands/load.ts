import TartCommand from "../TartCommand";
import * as execa from "execa";
import * as path from "path";

export default class Load extends TartCommand {
  static description = "describe the command here";

  static examples = [`$ tart save`];

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
    const { args } = this.parse(Load);

    const input = args.input;
    console.log(`input file name: ${input}`);

    var dirPath = this.localConfig?.saveDir || ".tart";

    if (input.includes("@")) {
      dirPath += "/repo";
      const resRepoDir = path.resolve(dirPath);

      //git checkout db@v2
      await execa("git", ["checkout", input], {
        cwd: resRepoDir,
      });
    }

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
      path.resolve(dirPath, input) as string,
    ]);
  }
}
