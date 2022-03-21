import Command from '../../authenticated-command'
import { Flags, CliUx } from '@oclif/core'
import fetch from 'node-fetch'
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

        // TODO: this needs to get moved into the SDK
        // set blueprint to skeleton
        this.log(`Setting instance blueprint`)
        await fetch(`https://accounts.api.zesty.io/v1/instances/${instance.data.ZUID}/blueprints`, {
          method: "PUT",
          headers: {
            'Authorization': `Bearer ${this.sdk.token}`,
            'Content-Type': "application/json"
          },
          body: JSON.stringify({ "zuid": "14-64329e0-555666" })
        })

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
