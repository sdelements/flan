import { Input } from "@oclif/parser";
import * as fs from "fs-extra";
import * as path from "path";
import cli from "cli-ux";

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
  ];

  async init() {
    // Skip
  }

  async run() {
    const { flags } = this.parse(
      this.constructor as Input<typeof TartCommand.flags>
    );

    const configPath = flags.config as unknown as string;

    const configPathExists = await fs.pathExists(configPath);

    if (!configPathExists) {
      if (await cli.confirm("A config file will be created, continue?")) {
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

        let saveDir = this.localConfig.saveDir;
        const savePathExists = await fs.pathExists(saveDir);

        if (!savePathExists) {
          const saveDirName = await cli.prompt(
            "Please enter the name of your save directory",
            {
              required: false,
              default: ".tart",
            }
          );
          if (saveDirName) {
            await fs.ensureDir(saveDirName);
            saveDir = saveDirName;

            this.log(
              `The save directory has been created successfully at ${path.resolve(
                saveDirName
              )}`
            );
          }
        }

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
        });
      } else {
        this.log(`Config file found at ${path.resolve(configPath)}`);
      }
    }
    await this.loadConfigFile(configPath);
  }
}
