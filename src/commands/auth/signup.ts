import { Command, Flags, CliUx } from '@oclif/core'
import fetch from 'node-fetch';
import * as chalk from 'chalk'

import Login from './login'

export default class Signup extends Command {
  static description = 'Command for creating a Zesty.io account'

  static examples = [
    `$ zesty auth:signup user@example.com strong-password-for-security`,
  ]

  static flags = {
    help: Flags.help({ char: 'h' }),
  }

  static args = [
    {
      name: 'email',
      required: true,
      description: "Your user account email"
    },
    {
      name: 'pass',
      required: true,
      description: "Your user account password"
    }
  ]

  async run() {
    const { args } = await this.parse(Signup)

    if (!args.email) {
      this.warn(`Missing required email argument. Which is the email for the account you want to connect with.`);
      return
    }
    if (!args.pass) {
      this.warn(`Missing required pass argument. Which is the password for the account you want to connect with.`);
      return
    }

    try {
      CliUx.ux.action.start('Creating your account')

      const parts = args.email.split('@')

      await fetch(`https://accounts.api.zesty.io/v1/users`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: args.email,
          password: args.pass,
          firstName: parts[0],
          lastName: parts[1],
        })
      })
        .then(res => res.json())
        .then(json => {
          if (json.error) {
            this.log(chalk.red(json.error))
          } else {
            Login.run([args.email, args.pass])
          }
        })
        .catch(err => this.error(err))

      CliUx.ux.action.stop()
    } catch (err) {
      console.error(err);
    }
  }
}
