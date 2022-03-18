import { Command, Flags, CliUx } from '@oclif/core'
import fetch from 'node-fetch';
import * as chalk from 'chalk'

import Login from './login'

export default class Signup extends Command {
  static description = 'Command for creating a Zesty.io account'

  static examples = [
    `$ zesty auth:signup jane+doe@example.com strong-password-for-security Jane Doe`,
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
    },
    {
      name: 'firstName',
      required: true,
      description: "Your first name"
    },
    {
      name: 'lastName',
      required: true,
      description: "Your last name"
    }
  ]

  async run() {
    const { args } = await this.parse(Signup)

    try {
      CliUx.ux.action.start('Creating your account')

      const res = await fetch(`https://accounts.api.zesty.io/v1/users`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: args.email,
          password: args.pass,
          firstName: args.firstName,
          lastName: args.lastName,
        })
      })
        .then(res => res.json())
        .then(json => {
          if (json.error) {
            this.log(chalk.red(json.error))
            return json
          } else {
            return Login.run([args.email, args.pass])
          }
        })
        .catch(err => this.error(err))

      CliUx.ux.action.stop()

      return res

    } catch (err) {
      console.error(err);
    }
  }
}
