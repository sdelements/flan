import TartCommand from "../TartCommand";
import * as fs from "fs";

export default class List extends TartCommand {
  static description = "describe the command here";

  static examples = [`$ tart list`];

  static flags = {
    ...TartCommand.flags,
  };

  async run() {
    this.localConfig?.saveDir;
  }
}
