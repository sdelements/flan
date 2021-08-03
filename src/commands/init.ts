import fs from "fs-extra";
import path from "path";
import execa from "execa";
import cli from "cli-ux";

import FlanCommand from "../FlanCommand";

export default class Init extends FlanCommand {
  static description = "Initializes flan for this project";

  static flags = {
    ...FlanCommand.flags,
  };

  static examples = [
    `$ flan init
Config file found at home/flan.config.js
`,
    `$ flan init
A config file will be created, continue? [y/n]
`,
    `$ flan init -c /some-folder/flan.config.json
Config file found at home/flan/some-folder/flan.config.json
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
        const db = await cli.prompt("Please enter your database name");

        const host = await cli.prompt(
          "(Optional) Please enter your database host",
          {
            required: false,
            default: "localhost",
          }
        );

        const user = await cli.prompt(
          "(Optional) Please enter your database username",
          { required: false }
        );

        const repository = await cli.prompt(
          "(Optional) Please enter your repository url",
          { required: false }
        );

        this.log(
          `The configuration file has been created successfully at ${path.resolve(
            configPath
          )}`
        );

        await fs.outputJson(
          configPath,
          {
            baseDir: this.localConfig.baseDir,
            database: {
              host,
              db,
              user,
            },
            repository,
          },
          {
            spaces: 2,
          }
        );
      }
    } else {
      this.log(`Config file found at ${path.resolve(configPath)}`);
    }

    await this.loadConfigFile(configPath);

    const { baseDir } = this.localConfig;

    if (!(await fs.pathExists(baseDir))) {
      if (
        await cli.confirm(
          `A base directory will be created at ${baseDir}, continue? [y/n]`
        )
      ) {
        await fs.ensureDir(baseDir);

        this.log(
          `The base directory has been created successfully at ${baseDir}`
        );
      }
    } else {
      this.log(`Base directory found at ${baseDir}`);
    }

    const { saveDir } = this.localConfig;

    if (!(await fs.pathExists(saveDir))) {
      if (
        await cli.confirm(
          `A save directory will be created at ${saveDir}, continue? [y/n]`
        )
      ) {
        await fs.ensureDir(saveDir);

        this.log(
          `The save directory has been created successfully at ${saveDir}`
        );
      }
    } else {
      this.log(`Save directory found at ${saveDir}`);
    }

    const { repoDir } = this.localConfig;

    if (!(await fs.pathExists(repoDir))) {
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
      }
    } else {
      this.log(`Git repo found at ${repoDir}`);
    }
  }
}
