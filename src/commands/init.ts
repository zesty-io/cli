import { Command, flags } from "@oclif/command";

import Auth from './auth'

const input = require('listr-input');
const fs = require("fs");
const path = require("path");
const Listr = require("listr");
const chalk = require("chalk");
const notifier = require("node-notifier")

export default class Init extends Command {
  static description = "describe the command here";

  static flags = {
    help: flags.help({ char: "h" })
  };

  static args = [{ name: "zuid" }];

  async run() {
    const { args } = this.parse(Init);

    const tasks = new Listr([
      {
        title: "Create CLI settings directory",
        task: () => {
          try {
            // Make config dir
            fs.mkdir(this.config.configDir, {
              recursive: true
            }, (err: { code: string; }) => {
              if (err && err.code !== "EEXIST") {
                throw err
              }

              // If zuid was provided create dir for that instance and setup config file
              if (args.zuid) {
                const instancedir = path.resolve(this.config.configDir, args.zuid);
                fs.mkdir(instancedir, (err: { code: string; }) => {
                  if (err && err.code !== "EEXIST") {
                    throw err
                  }

                  // Generate config file
                  fs.writeFile(
                    path.resolve(instancedir, "config.json"),
                    `{"INSTANCE_ZUID: "${args.zuid}"}`,
                    (                    err: { code: string; }) => {
                      if (err && err.code !== "EEXIST") {
                        throw err
                      }
                      // console.log("Generated config file");
                    }
                  );
                });
              } else {
                if (err && err.code === "EEXIST") {
                  console.log(chalk.yellow(`The CLI has already been initialized. Would you like to initalize a specific instance? Try using zesty init ZUID`))
                }
              }
            });
          } catch (err) {
            console.error(err);
          }
        }
      },
      {
        title: `Authenticate with ${args.zuid} instance`,
        enabled: () => args.zuid,
        task: () => {
          return new Listr([
            {
              title: "Enter your account email",
              task: (ctx: { email: any; }) => input('email', {
                validate: (value: { length: number; }) => value.length > 0,
                done: (email: any) => ctx.email = email
              })
            },
            {
              title: "Enter your account password",
              task: (ctx: { pass: any; }) => input('password', {
                secret: true,
                validate: (value: { length: number; }) => value.length > 0,
                done: (pass: any) => ctx.pass = pass
              })
            },
            {
              title: "Connecting to instance",
              task: (ctx: { email: string; pass: string; }) => {
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
