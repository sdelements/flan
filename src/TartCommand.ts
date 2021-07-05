import { Command, flags } from "@oclif/command";
import { IConfig } from "@oclif/config";
import { Input, OutputFlags } from "@oclif/parser";
import * as fs from "fs-extra";

export default abstract class TartCommand extends Command {
  localConfig: {
    database: { host: string; db?: string; user?: string; password?: string };
    saveDir: string;
    repository?: string;
  };

  static flags = {
    config: flags.string({
      char: "c",
      description: "Path to configuration file",
      env: "TART_CONFIG",
      default: "./tart.config.json",
    }),
  };

  // https://github.com/oclif/oclif/issues/225
  protected parsedFlags?: OutputFlags<typeof TartCommand.flags>;

  constructor(argv: string[], config: IConfig) {
    super(argv, config);

    this.localConfig = {
      saveDir: ".tart",
      database: {
        host: "localhost",
      },
    };
  }

  async init() {
    const { flags, ...rest } = this.parse(
      this.constructor as Input<typeof TartCommand.flags>
    );

    await this.loadConfigFile(flags.config as unknown as string);
  }

  async loadConfigFile(configPath: string) {
    try {
      const configJSON = await fs.readJson(configPath);

      this.localConfig = {
        ...this.localConfig,
        ...configJSON,
      };
    } catch (err) {
      this.error("Unable to load configuration", err);
    }
  }
}
