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
      email = await CliUx.ux.prompt(`What is your Zesty account email? ${chalk.italic("e.g. hello@example.com")}`)
    }
    if (!pass) {
      pass = await CliUx.ux.prompt(`What is your Zesty account pasword?`)
    }

    try {
      CliUx.ux.action.start('Authenticating with Zesty')

      // Get authenticated session
      const auth = new SDK.Auth({
        authURL: "https://auth.api.zesty.io",
      });
      const session = await auth.login(email, pass);

      if (session.token) {
        // Make config dir
        mkdir(resolve(this.config.configDir), { recursive: true } as any, (err) => {
          if (err) {
            this.log(err?.message)
          }

          // Generate config file
          writeFile(resolve(this.config.configDir, "config.json"), JSON.stringify({ user_token: session.token }), "utf8", (err) => {
            if (err) {
              this.error(err?.message)
            }
            // this.log(`Authenticated: ${chalk.green(session.token)}`)
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
