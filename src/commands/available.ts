import cli from "cli-ux";
import chalk from "chalk";
import execa from "execa";

import FlanCommand from "../FlanCommand";

const tableFlags = cli.table.flags();

type GitTag = { tag: string; sha: string; status?: string };

export default class Available extends FlanCommand {
  static description = "lists available dumps";

  static examples = [`$ flan available`];

  static flags = {
    ...FlanCommand.flags,
    ...tableFlags,
    sort: { ...tableFlags.sort, default: "tag" },
  };

  async run() {
    const { flags } = this.parse(Available);

    const localTags = await this.getTags(".");
    let remoteTags: GitTag[] = [];

    if (this.localConfig.repository) {
      remoteTags = await this.getTags(this.localConfig.repository);
    }

    let results: GitTag[] = [];
    let remaining: GitTag[] = [...remoteTags];

    localTags.forEach((ltag) => {
      // see if the local tag is also in the remote list
      const rtag = remoteTags.find((rtag) => rtag.tag === ltag.tag);

      if (!rtag) {
        results.push({
          ...ltag,
          status: `${chalk.bold("*")} (local)`,
        });
      } else {
        // compare the SHA of the local and remote tag,
        // if it's the same the commit is the same and the tag is up to date
        // if it's not then the file on the remote repo is different
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

        // remove the tag from the remote list
        remaining = remaining.filter((rtag) => rtag.tag !== ltag.tag);
      }
    });

    // any tags left in remaining are only in the remote repo, label them
    remaining = remaining.map((rtag) => ({
      ...rtag,
      status: chalk.blue(`${chalk.bold("*")} (remote)`),
    }));

    results = [...results, ...remaining];

    // print out the results in a nice table
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
    const tags = [];
    while ((match = tagRegex.exec(stdout))) {
      if (match.groups)
        tags.push({ tag: match.groups.tag, sha: match.groups.sha });
    }

    return tags;
  }
}
