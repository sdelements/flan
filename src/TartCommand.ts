import { Command, flags } from "@oclif/command";
import { Input, OutputFlags } from "@oclif/parser";
import * as path from "path";
import * as fs from "fs-extra";

export default abstract class TartCommand extends Command {
  localConfig?: {
    database: { host: string; db: string; user: string; password: string };
    repository: string;
    saveDir: string;
  };

  static flags = {
    config: flags.string({
      char: "c",
      description: "Path to configuration file",
      env: "TART_CONFIG",
    }),
  };

  // https://github.com/oclif/oclif/issues/225
  protected parsedFlags?: OutputFlags<typeof TartCommand.flags>;

  async init() {
    const { flags } = this.parse(
      this.constructor as Input<typeof TartCommand.flags>
    );

    const configPath = flags.config || "./tart.config.json";

    try {
      const config = await fs.readJson(configPath as string);
      this.localConfig = config;
    } catch (err) {
      this.error("Unable to load configuration", err);
    }

    if (!this.localConfig?.database?.db) {
      this.error("db is required in the database is required");
    }
  }

  async runHook(name: string) {
    const hooksFileName = path.resolve(process.cwd(), "./tart.hooks.js");
    const hooksExists = await fs.pathExists(hooksFileName);

    if (hooksExists) {
      const hooks = require(hooksFileName);
      if (typeof hooks[name] === "function") return hooks[name]();
    }
  }
}
