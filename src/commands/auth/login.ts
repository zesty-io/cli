import { Command, Flags, CliUx } from '@oclif/core'
import * as chalk from 'chalk'
import * as SDK from "@zesty-io/sdk"
import { mkdir, writeFile } from 'fs'
import { resolve } from 'path'
import * as inquirer from 'inquirer'

export default class Login extends Command {
  static description = 'Command for authenticating with a Zesty.io account'

  static examples = [
    `$ zesty auth:login user@example.com strong-password-for-security`,
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
    }
  ]

  async run(): Promise<void> {
    const { args } = await this.parse(Login)
    let { email, pass } = args

    if (!email) {
      const answer = await inquirer.prompt({
        type: 'input',
        name: 'email',
        message: `Email: (${chalk.italic("e.g. hello@example.com")})`,
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

    try {
      CliUx.ux.action.start('Authenticating with Zesty')

      // Get authenticated session
      const auth = new SDK.Auth({
        authURL: "https://auth.api.zesty.io",
      });
      const session = await auth.login(email, pass);      

      if (session.token) {

        // TODO fetch user to get email & zuid

        // Make config dir
        mkdir(resolve(this.config.configDir), { recursive: true } as any, (err) => {
          if (err) {
            this.log(err?.message)
          }

          // Generate config file
          writeFile(resolve(this.config.configDir, "config.json"), JSON.stringify({
            // email: 
            // user_zuid: 
            user_token: session.token
          }), "utf8", (err) => {
            if (err) {
              this.error(err?.message)
            }
            // this.log(`Authenticated: ${chalk.green(email)}`)
          });
        })

      } else {
        this.warn(chalk.red(`Failed to authenticate. ${session.message}`))
      }

      CliUx.ux.action.stop()

      return session.token
    } catch (err) {
      console.error(err);
    }
  }
}
