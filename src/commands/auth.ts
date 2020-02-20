import { Command, flags } from '@oclif/command'
import cli from 'cli-ux'
import chalk from 'chalk'

// import SDK from "@zesty-io/sdk"
const SDK = require("@zesty-io/sdk")

export default class Auth extends Command {
  static description = 'Command for authenticating with a Zesty.io instance'

  static examples = [
    `$ zesty auth 8-000-0000 user@example.com strong-password-for-security`,
  ]

  static flags = {
    help: flags.help({ char: 'h' }),
  }

  static args = [
    {
      name: 'zuid',
      required: true,
      description: "ZUID of the instance you want to connect with"
    },
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
    const { args } = this.parse(Auth)

    if (!args.zuid) {
      this.warn(`Missing required zuid argument. Which is the ZUID for the instance you want to connect to.`);
      return
    }
    if (!args.email) {
      this.warn(`Missing required email argument. Which is the email for the account you want to connect with.`);
      return
    }
    if (!args.pass) {
      this.warn(`Missing required pass argument. Which is the password for the account you want to connect with.`);
      return
    }

    try {
      cli.action.start('Authenticating with instance')

      // Get authenticated session
      const auth = new SDK.Auth();
      const session = await auth.login(args.email, args.pass);
      if (session.token) {

        // Instantiate sdk instance with instance ZUID and authenticated session token
        const sdk = new SDK(args.zuid, session.token);

        // Verify token
        const res = await sdk.auth.verifyToken(session.token);

        if (res.code === 200) {
          this.log('Authenticated!')
          this.log(`TOKEN: ${chalk.green(session.token)}`)

        } else {
          this.log(chalk.red(`Failed to authenticate. ${res.message}`))
        }

      } else {
        this.warn(chalk.yellow(session.message))
      }


      cli.action.stop()
    } catch (err) {
      console.error(err);
    }
  }
}
