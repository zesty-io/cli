import { Command, Flags } from '@oclif/core'
import * as inquirer from 'inquirer'
import * as input from 'listr-input'
import * as Listr from 'listr'
import * as chalk from 'chalk'
import * as notifier from 'node-notifier'
import { mkdir, writeFile } from 'fs/promises'
import { resolve } from 'path'

import Signup from './auth/signup'
import Login from './auth/login'
import CreateInstance from './instance/create'
import { GetUserToken, InitSDK } from '../authenticated-command'

export default class Init extends Command {
  // token = ''
  // sdk: any

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

    const { confirm } = await inquirer.prompt({
      type: "confirm",
      name: "confirm",
      message: `Set up Zesty.io instance in this project: ${process.cwd()}`
    })


    if (confirm) {
      this.log(chalk('Authenticating'))
      /// 1) Get session
      // Check CLI config for session
      let token = await GetUserToken(this.config.configDir)
      if (token) {
        const sdk = InitSDK(token)
        const res = await sdk.auth.verifyToken(token)
        if (res.statusCode === 200) {
          // a valid session exists so lets move along
          token = token
        }
      } else {
        // Start login flow
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


        // Provided email/pass did not have an account
        // start signup flow
        if (!token) {
          const { firstName } = await inquirer.prompt({
            type: 'input',
            name: 'firstName',
            message: "First Name:",
            validate: (value: { length: number; }) => value.length > 0,
          })
          const { lastName } = await inquirer.prompt({
            type: 'input',
            name: 'lastName',
            message: "Last Name:",
            validate: (value: { length: number; }) => value.length > 0,
          })

          this.log(chalk('Creating account'))
          const signup = await Signup.run([email, pass, firstName, lastName])
          if (signup.error) {
            this.error(signup.error)
          } else {
            token = await Login.run([email, pass])
          }
        }
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
          message: `Create new instance named: ${dir}`
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
        const zestyConfigDir = resolve(process.cwd(), '.zesty')
        await mkdir(zestyConfigDir, { recursive: true } as any)

        // Generate config file
        const zestyConfigFile = resolve(zestyConfigDir, "config.json")
        const configData = { [instance.ZUID]: instance }
        await writeFile(zestyConfigFile, JSON.stringify(configData), "utf8");
      } catch (error: any) {
        this.error(error)
      }


      // TODO Fetch instance data
      // this.log(chalk(`Pulling instance data`))

      this.log(chalk.green(`Done!`))
    }

    this.exit()
    ///


    // const tasks = new Listr([
    //   {
    //     title: `Authenticate with Zesty`,
    //     task: async () => {

    //       const token = await GetUserToken(this.config.configDir)
    //       if (token) {
    //         const sdk = InitSDK(token)
    //         const res = await sdk.auth.verifyToken(token)
    //         if (res.statusCode === 200) {
    //           // a valid session exists so lets move along
    //           this.token = token
    //           return
    //         }
    //       }

    //       return new Listr([
    //         {
    //           title: "Email",
    //           task: async (ctx: any) => input('email', {
    //             skip: () => args.email,
    //             validate: (value: { length: number; }) => value.length > 0,
    //             done: (email: string) => ctx.email = email
    //           })
    //         },
    //         {
    //           title: "Password",
    //           task: async (ctx: any) => input('password', {
    //             secret: true,
    //             skip: () => args.pass,
    //             validate: (value: { length: number; }) => value.length > 0,
    //             done: (pass: string) => ctx.pass = pass
    //           })
    //         },
    //         {
    //           title: "First name",
    //           task: async (ctx: any) => input('firstname', {
    //             skip: () => args.email, // login info provided so do not collect name for signup
    //             validate: (value: { length: number; }) => value.length > 0,
    //             done: (firstname: string) => ctx.firstname = firstname
    //           })
    //         },
    //         {
    //           title: "Last name",
    //           task: async (ctx: any) => input('lastname', {
    //             skip: () => args.email, // login info provided so do not collect name for signup
    //             validate: (value: { length: number; }) => value.length > 0,
    //             done: (lastname: string) => ctx.lastname = lastname
    //           })
    //         },
    //         {
    //           title: "Connect",
    //           task: async (ctx) => {
    //             let token = ''

    //             // attempt signup
    //             const signupRes = await Signup.run([ctx.email, ctx.pass, ctx.firstname, ctx.lastname])

    //             if (signupRes.error) {
    //               if (signupRes.error.includes('Duplicate entry')) {
    //                 token = await Login.run([ctx.email, ctx.pass])
    //               } else {
    //                 this.error(signupRes.error)
    //               }
    //             } else {
    //               ctx.newUser = true
    //               token = await Login.run([ctx.email, ctx.pass])
    //             }

    //             if (!token) {
    //               throw new Error('Failed login')
    //             }

    //             // need to place the token on the class
    //             // as the ctx is in a sub-listr and not
    //             // carried forward to the parent listr
    //             this.token = token
    //           }
    //         }
    //       ])
    //     }
    //   },
    //   {
    //     title: 'Select instance',
    //     skip: () => args.zuid,
    //     task: async (ctx) => {

    //       // Can not use ListInstances command as it 
    //       // outputs to the console breaking this experience
    //       // so we use the sdk directly to fetch all instances
    //       this.sdk = InitSDK(this.token)
    //       const instances = await this.sdk.account.getInstances()

    //       console.log(instances)

    //       if (instances?.data?.length) {

    //         return inquirer.prompt([{
    //           type: 'list',
    //           name: 'zuid',
    //           message: 'Which instance would you like to use?',
    //           choices: instances.data.map((instance: any) => {
    //             return {
    //               name: instance.name,
    //               value: instance.ZUID
    //             }
    //           }),
    //         },]).then(({ zuid }) => {
    //           const instance = instances.data.find((instance: any) => instance.ZUID === zuid)
    //           ctx.instance = instance
    //         });

    //       } else {

    //         const dir: any = process.cwd().split('/').pop()
    //         const instance = await CreateInstance.run([dir])

    //         if (instance.statusCode === 201) {
    //           ctx.instance = instance.data
    //         } else {
    //           throw new Error('Failed creating instance')
    //         }
    //       }
    //     }
    //   },
    //   {
    //     title: 'Fetch instance data',
    //     task: (ctx) => {
    //       console.log(ctx)
    //       // TODO Pull instances files
    //       // this.sdk.instance.getFiles()
    //     }
    //   },
    //   {
    //     title: 'Done!',
    //     task: (ctx) => {

    //       console.log(ctx)

    //       notifier.notify({
    //         title: 'Zesty.io CLI',
    //         message: `Initialized instance: `
    //       })
    //     }
    //   }
    // ]);

    // tasks.run().catch((err: any) => {
    //   this.warn(err)
    // });
  }
}