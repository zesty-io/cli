import { Command, flags } from '@oclif/command'
import { cli } from 'cli-ux'
import chalk from 'chalk'

const SDK = require("@zesty-io/sdk")

export default class InstanceCreate extends Command {
  static description = 'Creates a new instance on Zesty.io'

  static flags = {
    help: flags.help({ char: 'h' })
  }

  static args = [
    {
      name: 'name',
      description: "name to use for instance"
    }
  ]

  async run() {
    const { args } = this.parse(InstanceCreate)
    let { name } = args

    if (!name) {
      name = await cli.prompt(`What should we call your new instance? ${chalk.italic("e.g. example.com")}`)
    }

    try {
      cli.action.start(`Creating instance ${name}`)

      // // Get authenticated session

      // // Create instance
      // SDK.accounts


      cli.action.stop()
    } catch (err) {
      console.error(err);
    }






    // const name = flags.name || 'world'
    // this.log(`hello ${name} from /home/shrunyan/repos/zesty-io/cli/src/commands/instance/create.ts`)
    // if (args.file && flags.force) {
    //   this.log(`you input --force and --file: ${args.file}`)
    // }
  }
}
