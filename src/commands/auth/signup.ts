import { Command, Flags, CliUx } from '@oclif/core'
import fetch from 'node-fetch';
import * as chalk from 'chalk'
import * as inquirer from 'inquirer'

import Login from './login'

export default class Signup extends Command {
  static description = 'Command for creating a Zesty.io account'

  static examples = [
    `$ zesty auth signup jane+doe@example.com strong-password-for-security Jane Doe`,
  ]

  static flags = {
    help: Flags.help({ char: 'h' }),
  }

  static args = [
    {
      name: 'email',
      description: "Your user account email"
    },
    {
      name: 'pass',
      description: "Your user account password"
    },
    {
      name: 'firstName',
      description: "Your first name"
    },
    {
      name: 'lastName',
      description: "Your last name"
    }
  ]

  async run() {
    const { args } = await this.parse(Signup)
    let { email, pass, firstName, lastName } = args

    if (!email) {
      const answer = await inquirer.prompt({
        type: 'input',
        name: 'email',
        message: `Email (${chalk.italic("If you do not have an account we can create one")}):`,
        validate: (value: { length: number; }) => value.length > 0,
      })
      email = answer.email
    }
    if (!pass) {
      const answer = await inquirer.prompt({
        type: 'password',
        name: 'pass',
        message: "Password:",
        validate: (value: { length: number; }) => value.length > 0,
      })
      pass = answer.pass
    }
    if (!firstName) {
      const answer = await inquirer.prompt({
        type: 'input',
        name: 'firstName',
        message: "First Name:",
        validate: (value: { length: number; }) => value.length > 0,
      })
      firstName = answer.firstName
    }
    if (!lastName) {
      const answer = await inquirer.prompt({
        type: 'input',
        name: 'lastName',
        message: "Last Name:",
        validate: (value: { length: number; }) => value.length > 0,
      })
      lastName = answer.lastName
    }

    try {
      CliUx.ux.action.start('Creating your account')

      const res = await fetch(`https://accounts.api.dev.zesty.io/v1/users`, {
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
          CliUx.ux.action.stop()
          if (json.error) {
            this.log(chalk.red(json.error))
            return json
          } else {
            return Login.run(["zesty"])
          }
        })
        .catch(err => this.error(err))

      

      return res

    } catch (err) {
      console.error(err);
    }
  }
}
