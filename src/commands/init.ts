import { Input } from "@oclif/parser";
import * as fs from "fs-extra";
import * as path from "path";
import cli from "cli-ux";
import * as execa from "execa";

import TartCommand from "../TartCommand";

export default class Init extends TartCommand {
  static description = "Initializes tart for this project";

  static flags = {
    ...TartCommand.flags,
  };

  static examples = [
    `$ tart init
Config file found at home/tart.config.js
`,
    `$ tart init
A config file will be created, continue? [y/n]
`,
    `$ tart init -c /some-folder/tart.config.json
Config file found at home/tart/some-folder/tart.config.json
`,
  ];

  async init() {
    // Skip
  }

  async run() {
    const { flags } = this.parse(Init);

    const configPath = flags.config as unknown as string;

    const configPathExists = await fs.pathExists(configPath);

    if (!configPathExists) {
      if (await cli.confirm("A config file will be created, continue? [y/n]")) {
        const host = await cli.prompt("Please enter your database host");

        const db = await cli.prompt("Please enter your database name");

        const password = await cli.prompt(
          "(Optional) Please enter your database password",
          { required: false, type: "hide" }
        );

        const user = await cli.prompt(
          "(Optional) Please enter your database username",
          { required: false }
        );

        const repository = await cli.prompt(
          "(Optional) Please enter your repository name",
          { required: false }
        );

        const saveDir = await cli.prompt(
          "Please enter the name of your save directory",
          {
            required: false,
            default: ".tart",
          }
        );

        this.log(
          `The configuration file has been created successfully at ${path.resolve(
            configPath
          )}`
        );

        await fs.outputJson(configPath, {
          database: {
            host,
            password,
            db,
            user,
          },
          saveDir,
          repository,
        });
      }
    } else {
      this.log(`Config file found at ${path.resolve(configPath)}`);
    }

    await this.loadConfigFile(configPath);

    const saveDir = this.localConfig.saveDir;
    const saveDirExists = await fs.pathExists(saveDir);
    if (!saveDirExists) {
      if (
        await cli.confirm(
          `A save directory will be created at ${path.resolve(
            saveDir
          )}, continue? [y/n]`
        )
      ) {
        await fs.ensureDir(saveDir);
        this.log(
          `The save directory has been created successfully at ${path.resolve(
            saveDir
          )}`
        );
      }
    } else {
      this.log(`Save directory found at ${path.resolve(saveDir)}`);
    }

    const repoDir = path.resolve(saveDir, "./repo");
    const repoDirExists = await fs.pathExists(repoDir);
    if (!repoDirExists) {
      if (
        await cli.confirm(
          `A git repository will be initialized at ${repoDir}, continue? [y/n]`
        )
      ) {
        await fs.ensureDir(repoDir);
        await execa("git", ["init"], {
          cwd: repoDir,
        });
        this.log(`Git repository initialized at ${repoDir}`);
        if (this.localConfig.repository) {
          await execa(
            "git",
            ["remote", "add", "origin", this.localConfig.repository],
            {
              cwd: repoDir,
            }
          );
          this.log(`Set repository to track ${this.localConfig.repository}`);
        }
      }
    }
  }
}
