import { Command, flags } from '@oclif/command'
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
    { name: 'zuid' },
    { name: 'email' },
    { name: 'pass' }
  ]

  async run() {
    const { args } = this.parse(Auth)

    if (!args.zuid) {
      console.log(`Missing required zuid argument. Which is the ZUID for the instance you want to connect to.`);
      return
    }
    if (!args.email) {
      console.log(`Missing required email argument. Which is the email for the account you want to connect with.`);
      return
    }
    if (!args.pass) {
      console.log(`Missing required pass argument. Which is the password for the account you want to connect with.`);
      return
    }

    try {
      // Get authenticated session
      const auth = new SDK.Auth();
      const session = await auth.login(args.email, args.pass);

      // Instantiate sdk instance with instance ZUID and authenticated session token
      const sdk = new SDK(args.zuid, session.token);

      // Request instance data
      const res = await sdk.instance.getModels();

      // View our response data in the console
      console.log(res);

    } catch (error) {
      console.log(error);
    }
  }
}
