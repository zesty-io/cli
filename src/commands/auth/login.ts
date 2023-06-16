import { Command, Flags, CliUx } from '@oclif/core'
import * as chalk from 'chalk'
import * as SDK from "@zesty-io/sdk"
import { mkdir, writeFile } from 'fs'
import { resolve } from 'path'
import * as inquirer from 'inquirer'
import * as express from 'express'
const open = require('open')

export default class Login extends Command {
  static description = 'Command for authenticating with a Zesty.io account using basic and SSO authentication'
  
  static flags = {
    help: Flags.help({ char: 'h' }),
  }

  async run(): Promise<void> {
    let sessionToken: any

    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'service',
        message: 'Which service would you like to use?',
        choices: ["Zesty", "Google", "Microsoft", "Github", "Okta"],
      },
    ])
    const service = answer.service

    try {
      switch(service) { 
        case "Zesty": { 
          const emailPrompt = await inquirer.prompt({
            type: 'input',
            name: 'email',
            message: `Email: (${chalk.italic("e.g. hello@example.com")})`,
            validate: (value: { length: number; }) => value.length > 0,
          })
          const email = emailPrompt.email
       
          const passPrompt = await inquirer.prompt({
            type: 'password',
            name: 'pass',
            message: "Password:",
            validate: (value: { length: number; }) => value.length > 0,
          })
          const pass = passPrompt.pass

          CliUx.ux.action.start(`Authenticating with ${service}`)
          
          const auth = new SDK.Auth({
            authURL: "https://auth.api.zesty.io",
          });
          const session = await auth.login(email, pass);

          if (session.token) {
            sessionToken = session.token
            this.WriteTokenToConfigFile(sessionToken)
          } else {
            this.warn(chalk.red(`Failed to authenticate. ${session.message}`))
          }

          CliUx.ux.action.stop()
          break; 
        } 
        case "Okta": { 
          break; 
        } 
        default: {
          const idp = service === "Microsoft" ? "azure" : service.toLowerCase();
          const loginURL = `https://auth.api.dev.zesty.io/${idp}/login?redirect_uri=http://localhost:8085`;

          this.StartLocalServer(loginURL)
          CliUx.ux.action.start(`Authenticating with ${service}`)
          open(loginURL)

          // CliUx.ux.action.stop()

          break; 
        } 
      }

      // return sessionToken
    } catch (err) {
      console.error(err);
    }
  }

  WriteTokenToConfigFile(sessionToken: string) {
    // Make config dir
    mkdir(resolve(this.config.configDir), { recursive: true } as any, (err) => {
      if (err) {
        this.log(err?.message)
      }

      // Generate config file
      writeFile(resolve(this.config.configDir, "config.json"), JSON.stringify({
        user_token: sessionToken
      }), "utf8", (err) => {
        if (err) {
          this.error(err?.message)
        }
      });
    })
  }

  StartLocalServer(loginURL: string) {
    const app = express();

    app.use((req: express.Request, res: express.Response, next: Function) => {
      req.setTimeout(0);
      next();
    });

    app.get('/', (req: express.Request, res: express.Response, next: Function) => {
      // this.log(JSON.stringify(req.headers.cookie));
      res.send(req.headers.cookie);
    });

    app.listen(8085, () => {
      console.log(`Your browser has been opened to visit: ${loginURL}. Please complete login.`);
    });
  }
}
