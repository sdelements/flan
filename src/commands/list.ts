import TartCommand from "../TartCommand";
import * as fs from "fs";

export default class List extends TartCommand {
  static description = "describe the command here";

  static examples = [`$ tart list`];

  static flags = {
    ...TartCommand.flags,
  };

  async run() {
    const saveDir = this.localConfig?.saveDir || ".tart";

    this.listDirectory(saveDir, "");
  }

  async listDirectory(dir: string, displayPath: string) {
    const fileList = fs.readdirSync(dir);

    for (let file of fileList) {
      if (file === "tart.config.json" || file === ".git") continue;

      const path = dir + "/" + file;
      const fileDisplayPath =
        displayPath === "" ? file : displayPath + "/" + file;

      if (fs.statSync(path).isDirectory()) {
        this.listDirectory(path, fileDisplayPath);
      } else {
        this.log(fileDisplayPath);
      }
    }
  }
}
