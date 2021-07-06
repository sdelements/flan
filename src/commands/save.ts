import TartCommand from "../TartCommand";
import * as execa from "execa";
import * as fs from "fs";
import * as nodegit from "nodegit";
import * as path from "path";

export default class Save extends TartCommand {
  static description = "describe the command here";

  static examples = [`$ tart save`];

  static flags = {
    ...TartCommand.flags,
  };

  static args = [
    {
      name: "output",
      required: false,
      description: "name of output file",
      default: "dbdump",
    },
  ];

  async run() {
    const { args } = this.parse(Save);

    const output = args.output;
    this.log(`output file name: ${output}`);

    const saveDir = this.localConfig?.saveDir || ".tart";

    if (output.includes("@")) {
      this.log("doing repo save");
      const repoDir = saveDir + "/repo";

      // git checkout --orphan file
      // TODO try git reset
      await execa("git", ["checkout", "--orphan", output], {
        cwd: path.resolve(repoDir),
      });

      this.log("orphan checked out");

      const repo = await nodegit.Repository.open(repoDir);

      // const head1 = await repo.getHeadCommit();
      // this.log(head1.toString());

      // git rm -f file
      // TODO change to git reset --hard
      const fileList = fs.readdirSync(repoDir);
      var oldFile = "";
      for (let file of fileList) {
        if (file === "." || file === "..") continue;
        oldFile = file;
        break;
      }

      const index = await repo.refreshIndex();
      await index.removeByPath(repoDir + "/" + oldFile);

      this.log("removed old file");

      // save file
      const pgArgs = [
        "-Fc",
        "-Z",
        "9",
        "--file",
        path.resolve(repoDir, output),
      ];
      this.localConfig?.database.user &&
        pgArgs.push("-U", this.localConfig?.database.user);

      await execa("pg_dump", [
        ...pgArgs,
        this.localConfig?.database.db as string,
      ]);

      this.log("saved new file");

      // git add file
      // await index.addByPath(output);
      // this.log("added new file");

      // git commit -m "file"
      const commit = await repo.createCommitOnHead(
        [output],
        repo.defaultSignature(),
        repo.defaultSignature(),
        output
      );

      this.log("git commit done");

      // git tag -a -m "file" file
      await repo.createTag(commit, output, output);
      this.log("git tag done");
    }

    // const pgArgs = [
    //   "-Fc",
    //   "-Z",
    //   "9",
    //   "--file",
    //   path.resolve(this.localConfig?.saveDir || ".tart", output),
    // ];
    // this.localConfig?.database.user &&
    //   pgArgs.push("-U", this.localConfig?.database.user);

    // await execa("pg_dump", [
    //   ...pgArgs,
    //   this.localConfig?.database.db as string,
    // ]);
  }
}
