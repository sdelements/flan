import { flags } from "@oclif/command";
import TartCommand from "../TartCommand";

export default class Hello extends TartCommand {
  static description = "describe the command here";

  static examples = [
    `$ tart hello
hello world from ./src/hello.ts!
`,
  ];

  static flags = {
    ...TartCommand.flags,
    help: flags.help({ char: "h" }),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({ char: "n", description: "name to print" }),
    // flag with no value (-f, --force)
    force: flags.boolean({ char: "f" }),
  };

  static args = [{ name: "file" }];

  async run() {
    const { args, flags } = this.parse(Hello);
    console.log(this.localConfig);

    const name = flags.name ?? "world";
    this.log(`hello ${name} from ./src/commands/hello.ts`);
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`);
    }
  }
}
