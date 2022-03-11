import { Command, Flags } from '@oclif/core'

import Auth from './auth/login'

import { mkdir, writeFile } from 'fs'
import { resolve } from 'path'
import { input } from 'listr-input'
import * as Listr from 'listr'
import * as chalk from 'chalk'
import * as notifier from 'node-notifier'

export default class Init extends Command {
  static description = "describe the command here";

  static flags = {
    help: Flags.help({ char: "h" })
  };

  static args = [{ name: "zuid" }];

  async run() {
    const { args } = await this.parse(Init);

    const tasks = new Listr([
      {
        title: "Create CLI settings directory",
        task: async () => {
          try {
            // Make config dir
            await mkdir(this.config.configDir, {
              recursive: true
            } as any)

            // // If zuid was provided create dir for that instance and setup config file
            // if (args.zuid) {
            //   const instancedir = resolve(this.config.configDir, args.zuid);

            //   // mkdir(instancedir, (err: { code: string; }) => {
            //   //   if (err && err.code !== "EEXIST") {
            //   //     throw err
            //   //   }

            //   //   // Generate config file
            //   //   writeFile(
            //   //     resolve(instancedir, "config.json"),
            //   //     `{"INSTANCE_ZUID: "${args.zuid}"}`,
            //   //     (err: { code: string; }) => {
            //   //       if (err && err.code !== "EEXIST") {
            //   //         throw err
            //   //       }
            //   //       // console.log("Generated config file");
            //   //     }
            //   //   );
            //   // });
            // }

          } catch (error) {
            console.error(error)
          }

          // try {
          //   // Make config dir

          //   mkdir(this.config.configDir, {
          //     recursive: true
          //   }, (err: { code: string; }) => {
          //     if (err && err.code !== "EEXIST") {
          //       throw err
          //     }

          //     // If zuid was provided create dir for that instance and setup config file
          //     if (args.zuid) {
          //       const instancedir = resolve(this.config.configDir, args.zuid);
          //       mkdir(instancedir, (err: { code: string; }) => {
          //         if (err && err.code !== "EEXIST") {
          //           throw err
          //         }

          //         // Generate config file
          //         writeFile(
          //           resolve(instancedir, "config.json"),
          //           `{"INSTANCE_ZUID: "${args.zuid}"}`,
          //           (err: { code: string; }) => {
          //             if (err && err.code !== "EEXIST") {
          //               throw err
          //             }
          //             // console.log("Generated config file");
          //           }
          //         );
          //       });
          //     } else {
          //       if (err && err.code === "EEXIST") {
          //         console.log(chalk.yellow(`The CLI has already been initialized. Would you like to initalize a specific instance? Try using zesty init ZUID`))
          //       }
          //     }
          //   });
          // } catch (err) {
          //   console.error(err);
          // }
        }
      },
      {
        title: `Authenticate with ${args.zuid} instance`,
        enabled: () => args.zuid,
        task: () => {
          return new Listr([
            {
              title: "Enter your account email",
              task: async (ctx: { email: string; }) => input('email', {
                validate: (value: { length: number; }) => value.length > 0,
                done: (email: any) => ctx.email = email
              })
            },
            {
              title: "Enter your account password",
              task: async (ctx: { pass: any; }) => input('password', {
                secret: true,
                validate: (value: { length: number; }) => value.length > 0,
                done: (pass: any) => ctx.pass = pass
              })
            },
            {
              title: "Connecting to instance",
              task: async (ctx: { email: string; pass: string; }) => {
                return Auth.run([args.zuid, ctx.email, ctx.pass])
              }
            }
          ])
        }
      },
      {
        title: 'Pulling Instance Files',
        enabled: () => args.zuid,
        task: () => {
          // TODO Pull instances files
        }
      },
      {
        title: 'Done!',
        task: () => {
          notifier.notify({
            title: 'Zesty.io CLI',
            message: args.zuid ? `Initialized instance ${args.zuid}` : `Initialized`
          })
        }
      }
    ]);

    tasks.run().catch((err: any) => {
      console.error(err);
    });
  }
}
