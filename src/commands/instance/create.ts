import { Command, Flags, CliUx } from '@oclif/core'
import * as chalk from 'chalk'
import * as SDK from '@zesty-io/sdk'

export default class InstanceCreate extends Command {
  static description = 'Creates a new instance on Zesty.io'

  static flags = {
    help: Flags.help({ char: 'h' })
  }

  static args = [
    {
      name: 'name',
      description: "name to use for instance"
    }
  ]

  async run() {
    const { args } = await this.parse(InstanceCreate)
    let { name } = args

    if (!name) {
      name = await CliUx.ux.prompt(`What should we call your new instance? ${chalk.italic("e.g. example.com")}`)
    }

    try {
      CliUx.ux.action.start(`Creating instance ${name}`)

      // // Get authenticated session

      // // Create instance
      // SDK.accounts


      CliUx.ux.action.stop()
    } catch (err) {
      console.error(err);
    }
  }
}
