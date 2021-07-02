import {Command} from '@oclif/command'
import * as execa from 'execa'
import constants from '../constants'

export default class Save extends Command {
  static description = 'describe the command here'

  static examples = [
    `$ tart save`,
  ]

  static args = [{
      name: 'output', 
      required: false,
      description: 'name of output file',
      default: 'dbdump'
    }]

  async run() {
    const {args} = this.parse(Save)

    const output = args.output
    this.log(`output file name: ${output}`)

    const dump = await execa.command(
      `pg_dump -Fc -Z 9 -U sdlc --file=${constants.REPO_DIR}/${output} sdlc`
    );

  }
}
