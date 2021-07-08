import cli from "cli-ux";
import * as chalk from "chalk";
import * as execa from "execa";

import TartCommand from "../TartCommand";

const tableFlags = cli.table.flags();

export default class Available extends TartCommand {
  static description = "lists available dumps";

  static examples = [`$ tart list`];

  static flags = {
    ...TartCommand.flags,
    ...tableFlags,
    sort: { ...tableFlags.sort, default: "tag" },
  };

  async run() {
    const { flags } = this.parse(Available);

    const localTags = await this.getTags(".");
    const remoteTags = await this.getTags(this.localConfig.repository || "");

    // console.info("local tags: ", localTags);
    // console.info("remote tags: ", remoteTags);

    let results: { tag: string; sha: string; status?: string }[] = [];
    let remaining: { tag: string; sha: string; status?: string }[] = [
      ...remoteTags,
    ];

    localTags.forEach((ltag) => {
      const rtag = remoteTags.find((rtag) => rtag.tag === ltag.tag);

      if (!rtag) {
        results.push({
          ...ltag,
          status: `${chalk.bold("*")} (local)`,
        });
      } else {
        if (rtag.sha === ltag.sha) {
          results.push({
            ...ltag,
            status: chalk.green(`${chalk.bold("=")} (up to date)`),
          });
        } else {
          results.push({
            ...ltag,
            status: chalk.red(`${chalk.bold("!")} (conflicting)`),
          });
        }

        remaining = remaining.filter((rtag) => rtag.tag !== ltag.tag);
      }
    });

    remaining = remaining.map((rtag) => ({
      ...rtag,
      status: chalk.blue(`${chalk.bold("*")} (remote)`),
    }));

    results = [...results, ...remaining];

    //console.info(results);

    cli.table(
      results,
      {
        tag: {
          minWidth: 30,
        },
        sha: {
          minWidth: 10,
          get: (row) => row.sha.slice(0, 6),
        },
        status: {
          minWidth: 10,
        },
      },
      {
        printLine: this.log,
        sort: flags.sort,
      }
    );
  }

  async getTags(repository: string) {
    const { stdout } = await execa("git", ["ls-remote", "--tags", repository], {
      cwd: this.localConfig.repoDir,
    });
    const tagRegex = /(?<sha>[a-z0-9]+)\srefs\/tags\/(?<tag>[\w\.\-@]+)$/gim;

    let match;
    let tags = [];
    while ((match = tagRegex.exec(stdout))) {
      if (match.groups)
        tags.push({ tag: match.groups.tag, sha: match.groups.sha });
    }

    return tags;
  }
}
