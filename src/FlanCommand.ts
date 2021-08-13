import { Command, flags } from "@oclif/command";
import { IConfig } from "@oclif/config";
import { OutputFlags } from "@oclif/parser";
import * as path from "path";
import * as fs from "fs-extra";

export default abstract class FlanCommand extends Command {
  localConfig: {
    database: { host: string; db: string; user?: string };
    baseDir: string;
    saveDir: string;
    repoDir: string;
    repository?: string;
  };

  static flags = {
    config: flags.string({
      char: "c",
      description: "Path to configuration file",
      env: "FLAN_CONFIG",
      default: "./flan.config.json",
    }),
  };

  // https://github.com/oclif/oclif/issues/225
  protected parsedFlags?: OutputFlags<typeof FlanCommand.flags>;

  constructor(argv: string[], config: IConfig) {
    super(argv, config);

    this.localConfig = {
      baseDir: ".flan",
      saveDir: ".flan/local",
      repoDir: ".flan/repo",
      database: {
        host: "localhost",
        db: "",
        user: "",
      },
    };
  }

  async init() {
    // see: https://github.com/oclif/oclif/issues/225#issuecomment-806318444
    const { flags } = this.parse(this.ctor);

    await this.loadConfigFile(flags.config as unknown as string);
  }

  getPgConnectionArgs(): string[] {
    return [
      `--host=${this.localConfig.database.host}`,
      `--dbname=${this.localConfig.database.db}`,
      "-U",
      this.localConfig.database.user as string,
    ];
  }

  async loadConfigFile(configPath: string) {
    // load config file if it exsits
    let configJSON: {
      database?: { host?: string; db?: string; user?: string };
      baseDir?: string;
      saveDir?: string;
      repoDir?: string;
      repository?: string;
    } = {};

    try {
      configJSON = await fs.readJson(configPath);
    } catch (error) {
      if (!error.code || error.code !== "ENOENT") {
        this.error("A config file exists but it could not be loaded");
      }
    }

    this.localConfig = {
      baseDir: path.resolve(
        process.env.FLAN_BASE_DIR ||
          configJSON.baseDir ||
          this.localConfig.baseDir
      ),
      // set full paths
      repoDir: path.resolve(
        process.env.FLAN_BASE_DIR ||
          configJSON.baseDir ||
          this.localConfig.baseDir,
        "./repo"
      ),
      saveDir: path.resolve(
        process.env.FLAN_BASE_DIR ||
          configJSON.baseDir ||
          this.localConfig.baseDir,
        "./local"
      ),
      database: {
        host:
          process.env.FLAN_DB_HOST ||
          configJSON.database?.host ||
          this.localConfig.database.host,
        db:
          process.env.FLAN_DB_NAME ||
          configJSON.database?.host ||
          this.localConfig.database.db,
        user:
          process.env.FLAN_DB_USER ||
          configJSON.database?.user ||
          this.localConfig.database.user,
      },
    };

    if (process.env.FLAN_REPOSITORY || configJSON.repository) {
      this.localConfig.repository =
        process.env.FLAN_REPOSITORY || configJSON.repository;
    }

    if (process.env.FLAN_REPO_DIR || configJSON.repoDir) {
      // the "" is needed to suppress a TypeScript error, it will not be used
      this.localConfig.repoDir = path.resolve(
        process.env.FLAN_REPO_DIR || configJSON.repoDir || ""
      );
    }

    if (process.env.FLAN_SAVE_DIR || configJSON.saveDir) {
      // the "" is needed to suppress a TypeScript error, it will not be used
      this.localConfig.saveDir = path.resolve(
        process.env.FLAN_SAVE_DIR || configJSON.saveDir || ""
      );
    }

    if (!this.localConfig.database.db) {
      this.error("Database is required");
    }

    if (!this.localConfig.database.user) {
      this.error("Database username is required");
    }
  }

  async runHook(name: string) {
    const hooksFileName = path.resolve(process.cwd(), "./flan.hooks.js");
    const hooksExists = await fs.pathExists(hooksFileName);

    if (hooksExists) {
      const hooks = require(hooksFileName);
      if (typeof hooks[name] === "function") return hooks[name]();
    }
  }
}
