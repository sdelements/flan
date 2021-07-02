import {Command} from '@oclif/command'
import * as execa from 'execa'

export default class Load extends Command {
  static description = 'describe the command here'

  static examples = [
    `$ tart save`,
  ]

  static args = [{
      name: 'input', 
      required: true,
      description: 'name of input file',
    }]

  async run() {
    const {args} = this.parse(Load)

    const input = args.input
    this.log(`output file name: ${input}`)

    const dump = await execa.command(
      `pg_restore --jobs=8 -U sdlc -d sdlc --clean ${input}`
    );

  }
}
