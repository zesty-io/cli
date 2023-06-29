import { Command, Flags } from '@oclif/core'

export default class Auth extends Command {

  static flags = {
    help: Flags.help({ char: 'h' }),
  }

  async run(): Promise<void> {
    this.log('Use the command; zesty auth:login')
  }
}
