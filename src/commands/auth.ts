import { Command, flags } from '@oclif/command'
import cli from 'cli-ux'
import chalk from 'chalk'

// import SDK from "@zesty-io/sdk"
const SDK = require("@zesty-io/sdk")

export default class Auth extends Command {

  static flags = {
    help: flags.help({ char: 'h' }),
  }

  async run() {
    this.log('You need to authenticate with zesty auth:login INSTANCE-ZUID EMAIL PASSWORD')
  }
}
