import TartCommand from "../TartCommand";
import * as fs from "fs";

export default class Available extends TartCommand {
  static description = "describe the command here";

  static examples = [`$ tart list`];

  static flags = {
    ...TartCommand.flags,
  };

  async run() {
    const saveDir = this.localConfig?.saveDir || ".tart";
    // const repo = await nodegit.Repository.open(saveDir); // FIX ME PLS await nodegit.Repository.open(saveDir);

    // await this.diff(repo);
    //await this.logDirectory("./test", "test", repo);
  }

  // async diff(repo: nodegit.Repository) {
  //   const head = await repo.getHeadCommit();
  //   const tree = await head.getTree();
  //   const diff = await nodegit.Diff.treeToWorkdir(repo, tree);
  //   this.log(diff.numDeltas().toString());

  //   for (var i = 0; i < diff.numDeltas(); i++) {
  //     const delta = diff.getDelta(i);
  //     this.log(
  //       delta.status() +
  //         " " +
  //         delta.newFile().path() +
  //         " " +
  //         delta.oldFile().path()
  //     );
  //   }
  // }

  async walkLocalRepo(dir: string, parent: TreeNode, repo: nodegit.Repository) {
    const fileList = fs.readdirSync(dir);

    for (let file of fileList) {
      if (file == ".git") continue;

      var fileNode = new TreeNode(file, parent);
      parent.children.push(fileNode);

      const path = dir + "/" + file;
      if (fs.statSync(path).isDirectory()) {
        this.walkLocalRepo(path, fileNode, repo);
      }
    }
  }

  async logDirectory(dir: string, repoPath: string, repo: nodegit.Repository) {
    const fileList = fs.readdirSync(dir);

    for (let file of fileList) {
      if (file == ".git") continue;

      const path = dir + "/" + file;
      const fileRepoPath = repoPath == "" ? file : repoPath + "/" + file;

      if (fs.statSync(path).isDirectory()) {
        this.logDirectory(path, fileRepoPath, repo);
      } else {
        const status = await nodegit.Status.file(repo, fileRepoPath);
        var msg = fileRepoPath;
        msg += status == nodegit.Status.STATUS.WT_NEW ? " (Local)" : "";
        this.log(msg);
      }
    }
  }
}

class TreeNode {
  path: string;
  parent: TreeNode;
  children: TreeNode[];

  constructor(path: string, parent: TreeNode) {
    this.path = path;
    this.parent = parent;
    this.children = [];
  }
}
