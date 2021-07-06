import TartCommand from "../TartCommand";
import * as fs from "fs-extra";

export default class List extends TartCommand {
  static description = "lists available dumps";

  static examples = [`$ tart list`];

  static flags = {
    ...TartCommand.flags,
  };

  async run() {
    const fileList = await fs.readdir(this.localConfig.saveDir, {
      withFileTypes: true,
    });

    const files = fileList
      .filter((dirent) => dirent.isFile())
      .map((dirent) => dirent.name);

    files.forEach((file) => {
      this.log(file);
    });
  }
}
