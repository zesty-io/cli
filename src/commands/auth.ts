import {Command, flags} from '@oclif/command'

export default class Auth extends Command {
  static description = 'Command for authenticating with a Zesty.io instance'

  static examples = [
    `$ zesty auth --email=user@example.com --pass=strong-password-for-security`,
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    
    // flag with a value (-e, --email=VALUE)
    email: flags.string({char: 'e', description: 'Email to login with'}),

    // flag with a value (-p, --pass=VALUE)
    pass: flags.string({char: 'p', description: 'Password to login with'})
    
  }

  static args = [{name: 'file'}]

  async run() {
    const {args, flags} = this.parse(Auth)

    // const name = flags.name || 'world'
    // this.log(`hello ${name} from ./src/commands/hello.ts`)

    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`)
    }
  }
}
