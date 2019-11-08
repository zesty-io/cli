import { Command, flags } from "@oclif/command";
import * as notifier from 'node-notifier'
import cli from 'cli-ux'

const input = require('listr-input');

const os = require("os");
const fs = require("fs");
const path = require("path");
const execa = require("execa");
const Listr = require("listr");
const chalk = require("chalk");

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
            }, err => {
              if (err && err.code !== "EEXIST") {
                throw err
              }

              // If zuid was provided create dir for that instance and setup config file
              if (args.zuid) {
                const instancedir = path.resolve(this.config.configDir, args.zuid);
                fs.mkdir(instancedir, err => {
                  if (err && err.code !== "EEXIST") {
                    throw err
                  }

                  // Generate config file
                  fs.writeFile(
                    path.resolve(instancedir, "config.json"),
                    `{"INSTANCE_ZUID: "${args.zuid}"}`,
                    err => {
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
              task: (ctx) => input('email', {
                validate: value => value.length > 0,
                done: email => ctx.email = email
              })
            },
            {
              title: "Enter your account password",
              task: (ctx) => input('password', {
                secret: true,
                validate: value => value.length > 0,
                done: pass => ctx.pass = pass
              })
            },
            {
              title: "Connecting to instance",
              task: (ctx) => {
                return execa(`zesty auth ${args.zuid} ${ctx.email} ${ctx.pass}`)
                  .catch((err) => {
                    // console.error(err)
                    throw err
                  })
              }
            }
          ])
        }
        // task: () => {

        //   return promptly.prompt('Name: ')
        //     .then(name => {
        //       console.log(name);
        //     });

        //   // const email = await cli.prompt('Enter your Zesty.io user account email')
        //   // const pass = await cli.prompt('Enter your Zesty.io user account password', {type: 'hide'})

        //   // execa(`zesty auth ${email} ${pass}`)
        //   //   .catch((err) => {
        //   //     console.error(err)
        //   //     throw err
        //   //   })
        // }
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
            message: args.zuid ? `Initialized with instance ${args.zuid}` : `Initialized`
          })
        }
      }
    ]);

    tasks.run().catch(err => {
      console.error(err);
    });
  }
}
