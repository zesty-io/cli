import { Command, Flags } from '@oclif/core'
import * as inquirer from 'inquirer'
import * as chalk from 'chalk'
import { mkdir, stat, writeFile } from 'fs/promises'
import { resolve } from 'path'

import Signup from './auth/signup'
import Login from './auth/login'
import CreateInstance from './instance/create'
import { GetUserToken, InitSDK } from '../authenticated-command'

export default class Init extends Command {

  static description = "describe the command here";

  static flags = {
    help: Flags.help({ char: "h" })
  };

  // TODO support running command without prompts
  // static args = [
  //   { name: "zuid" },
  //   {
  //     name: 'email',
  //     description: "Your user account email"
  //   },
  //   {
  //     name: 'pass',
  //     description: "Your user account password"
  //   },
  // ]

  async run() {
    const { args } = await this.parse(Init);

    const zestyConfigDir = resolve(process.cwd(), '.zesty')
    const zestyConfigFile = resolve(zestyConfigDir, "config.json")

    try {
      await stat(zestyConfigFile)
      console.log(`${chalk.yellow('Notice:')} .zesty/config.json already exists`)
      console.log(chalk('If you want to reinitialize an instance you must delete the .zesty/config.json file'))
      this.exit()
    } catch (error: any) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }

    const { confirm } = await inquirer.prompt({
      type: "confirm",
      name: "confirm",
      message: `Set up a Zesty.io instance in this project: ${process.cwd()}`
    })
    if (!confirm) {
      this.exit()
    }

    // 1) Get session
    // Check CLI config for session
    let token = await GetUserToken(this.config.configDir)
    let authenticated = false

    if (token) {
      // verify
      const sdk = InitSDK(token)
      const res = await sdk.auth.verifyToken(token)
      if (res.statusCode === 200) {
        authenticated = true
      }
    }

    if (!authenticated) {
      // login
      const { email } = await inquirer.prompt({
        type: 'input',
        name: 'email',
        message: `Email (${chalk.italic("If you do not have an account we will create one now")}):`,
        validate: (value: { length: number; }) => value.length > 0,
      })
      const { pass } = await inquirer.prompt({
        type: 'password',
        name: 'pass',
        message: "Password:",
        validate: (value: { length: number; }) => value.length > 0,
      })
      token = await Login.run([email, pass])

      if (!token) {
        const { signup } = await inquirer.prompt({
          type: "confirm",
          name: "signup",
          message: `Unable to login with provided email. Create account?`
        })

        if (signup) {
          const signup = await Signup.run([email, pass])
          if (signup.error) {
            this.error(signup.error)
          } else {
            token = await Login.run([email, pass])
          }
        } else {
          // One more login attempt 
          this.log(chalk('One more login attempt'))
          token = await Login.run([])
        }
      }
    }

    if (!token) {
      this.error('Failed authentication')
    }

    this.log(chalk('Fetching instances'))
    // Can not use ListInstances command as it 
    // outputs to the console breaking this experience
    // so we use the sdk directly to fetch all instances
    const sdk = InitSDK(token)
    const instances = await sdk.account.getInstances()
    let instance: any

    if (instances?.data?.length) {
      if (instances?.data?.length > 1) {
        await inquirer.prompt([{
          type: 'list',
          name: 'zuid',
          message: 'Which instance would you like to use?',
          choices: instances.data.map((instance: any) => {
            return {
              name: instance.name,
              value: instance.ZUID
            }
          }),
        },]).then(({ zuid }) => {
          instance = instances.data.find((instance: any) => instance.ZUID === zuid)
        });
      } else {
        instance = instances.data[0]
      }
    } else {
      const dir: any = process.cwd().split('/').pop()

      this.log(chalk(`No instances found`))

      const { confirm } = await inquirer.prompt({
        type: "confirm",
        name: "confirm",
        message: `Create new instance: ${dir}`
      })

      if (!confirm) {
        this.exit()
      }

      const created = await CreateInstance.run([dir])

      if (created.statusCode === 201) {
        instance = created.data
        this.log(chalk.green(`Instance created: https://${instance.ZUID}.manager.zesty.io`))
      } else {
        throw new Error('Failed creating instance')
      }
    }

    // write repo config
    try {
      this.log(chalk(`Creating .zesty config directory`))

      // Make config dir
      await mkdir(zestyConfigDir, { recursive: true } as any)

      // Write config file
      const configData = { [instance.ZUID]: instance }
      await writeFile(zestyConfigFile, JSON.stringify(configData), "utf8");
    } catch (error: any) {
      this.error(error)
    }


    // TODO Fetch instance data
    // this.log(chalk(`Pulling instance data`))

    this.log(chalk.green(`Done!`))

    this.exit()
    ///
  }
}