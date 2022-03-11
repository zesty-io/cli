import cli from 'cli-ux'
import { Command, Flags, CliUx } from '@oclif/core'
import * as chalk from 'chalk'
import * as SDK from "@zesty-io/sdk"
import { mkdir, writeFile } from 'fs'
import { resolve } from 'path'

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
      required: true,
      description: "Your user account email"
    },
    {
      name: 'pass',
      required: true,
      description: "Your user account password"
    }
  ]

  async run(): Promise<void> {
    const { args } = await this.parse(Login)

    this.log(args.email, args.pass)

    if (!args.email) {
      this.warn(`Missing required email argument. Which is the email for the account you want to connect with.`);
      return
    }
    if (!args.pass) {
      this.warn(`Missing required pass argument. Which is the password for the account you want to connect with.`);
      return
    }

    try {
      CliUx.ux.action.start('Authenticating with Zesty')

      // Get authenticated session
      const auth = new SDK.Auth();
      const session = await auth.login(args.email, args.pass);

      if (session.token) {

        // Make config dir
        mkdir(resolve(this.config.configDir), { recursive: true } as any, (err) => {
          if (err) {
            this.log(err?.message)
          }

          // Generate config file
          writeFile(resolve(this.config.configDir, "config.json"), `{"USER_TOKEN: "${session.token}"}`, (err) => {
            this.log(err?.message)
            this.log(`Authenticated: ${chalk.green(session.token)}`)
          });
        })

      } else {
        this.log(chalk.red(`Failed to authenticate. ${session.message}`))
      }

      CliUx.ux.action.stop()
    } catch (err) {
      console.error(err);
    }
  }
}
