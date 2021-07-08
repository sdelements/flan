import { Command, flags } from "@oclif/command";
import { IConfig } from "@oclif/config";
import { OutputFlags } from "@oclif/parser";
import * as path from "path";
import * as fs from "fs-extra";

export default abstract class TartCommand extends Command {
  localConfig: {
    database: { host: string; db: string; user?: string; password?: string };
    baseDir: string;
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
      baseDir: ".tart",
      saveDir: ".tart/local",
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
      this.error("Unable to load configuration file");
    }

    this.localConfig = {
      ...this.localConfig,
      ...configJSON,
      baseDir: path.resolve(configJSON.baseDir || this.localConfig.baseDir),
      // set full paths
      repoDir: path.resolve(
        configJSON.baseDir || this.localConfig.baseDir,
        "./repo"
      ),
      saveDir: path.resolve(
        configJSON.baseDir || this.localConfig.baseDir,
        "./local"
      ),
    };

    if (configJSON.repoDir) {
      this.localConfig.repoDir = path.resolve(configJSON.repoDir);
    }

    if (configJSON.saveDir) {
      this.localConfig.saveDir = path.resolve(configJSON.saveDir);
    }

    if (!this.localConfig.database.db) {
      this.error("Database is required");
    }
  
    if (!this.localConfig.database.host) {
      this.error("Database host is required");
    }

    if (!this.localConfig.baseDir) {
      this.error("Base directory is required");
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
