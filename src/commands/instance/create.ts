import Command from '../authenticated-command'
import { Flags, CliUx } from '@oclif/core'
import * as chalk from 'chalk'

export default class CreateInstance extends Command {
  static description = 'Create a new instance'

  static flags = {
    help: Flags.help({ char: 'h' })
  }

  static args = [
    {
      name: 'name',
      description: "name for your instance"
    }
  ]

  async run() {
    const { args } = await this.parse(CreateInstance)
    let { name } = args

    if (!name) {
      name = await CliUx.ux.prompt(`What should we call your new instance? ${chalk.italic("e.g. example.com")}`)
    }

    try {
      CliUx.ux.action.start(`Creating instance`)

      const instance = await this.sdk.account.createInstance({ name })

      if (instance.statusCode === 201) {
        this.sdk.setInstance(instance.data.ZUID)
        this.log(`Created instance: ${name}`)
      } else {
        this.warn(`Failed to create instance.`)
      }

      CliUx.ux.action.stop()

      return instance
    } catch (err: any) {
      this.error(err.message);
    }
  }
}
