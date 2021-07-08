import { Command, flags } from "@oclif/command";
import { IConfig } from "@oclif/config";
import { OutputFlags } from "@oclif/parser";
import * as path from "path";
import * as fs from "fs-extra";

export default abstract class TartCommand extends Command {
  localConfig: {
    database: { host: string; db: string; user?: string; password?: string };
    saveDir: string;
    repoDir: string;
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
      repoDir: ".tart/repo",
      database: {
        host: "localhost",
        db: "",
      },
    };
  }

  async init() {
    // see: https://github.com/oclif/oclif/issues/225#issuecomment-806318444
    const { flags } = this.parse(this.ctor);

    await this.loadConfigFile(flags.config as unknown as string);
  }

  async loadConfigFile(configPath: string) {
    let configJSON;

    try {
      configJSON = await fs.readJson(configPath);
    } catch (err) {
      this.error("Unable to load configuration");
    }

    if (!configJSON.database.db) {
      this.error("Database is required");
    }
    if (!configJSON.database.host) {
      this.error("Database host is required");
    }

    if (!configJSON.saveDir) {
      this.error("Save directory is required");
    }

    this.localConfig = {
      ...this.localConfig,
      // set full repo path
      repoDir: path.resolve(
        configJSON.saveDir || this.localConfig.saveDir,
        "./repo"
      ),
      ...configJSON,
    };
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
