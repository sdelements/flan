import fs from "fs-extra";
import path from "path";
import TartCommand from "../TartCommand";

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
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    files.forEach((file) => {
      if (
        // must be sync due to forEach
        fs.pathExistsSync(
          path.resolve(this.localConfig.saveDir, file, "./toc.dat")
        )
      ) {
        this.log(file);
      }
    });
  }
}
