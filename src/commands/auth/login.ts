import { Command, Flags, CliUx } from '@oclif/core'
import * as chalk from 'chalk'
import * as SDK from "@zesty-io/sdk"
import { mkdir, writeFile } from 'fs'
import { resolve } from 'path'
import * as inquirer from 'inquirer'
import * as express from 'express'
import * as cookieParser from 'cookie-parser'

const open = require('open')

export default class Login extends Command {
  static description = 'Command for authenticating with a Zesty.io account using basic and SSO authentication'
  
  static flags = {
    help: Flags.help({ char: 'h' }),
  }

  sessionToken: string | undefined
  server: any | null = null;

  async run(): Promise<void> {
    const authURL = "https://auth.api.dev.zesty.io"

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
      if (service === "Zesty") { 
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
        
        const auth = new SDK.Auth({ authURL: authURL });
        const session = await auth.login(email, pass);

        if (session.token) {
          this.sessionToken = session.token
          this.WriteTokenToConfigFile()
        } else {
          this.warn(chalk.red(`Failed to authenticate. ${session.message}`))
        }

        CliUx.ux.action.stop()
      } else {
          const idp = service === "Microsoft" ? "azure" : service.toLowerCase();
          const loginURL = `${authURL}/${idp}/login?redirect_uri=http://localhost:8085`;

          await new Promise<void>((resolve, reject) =>{
            this.StartLocalServer(service)
            CliUx.ux.action.start(`Authenticating with ${service}`)
            open(loginURL)

            const intervalId = setInterval(() => {
              if (this.sessionToken !== undefined) {
                clearInterval(intervalId);
                
                // this.server.close();
                resolve();
              }
            }, 1000);
          });
          
          CliUx.ux.action.stop()
      }
    } catch (err) {
      console.error(err);
    }
  }

  WriteTokenToConfigFile() {
    // Make config dir
    mkdir(resolve(this.config.configDir), { recursive: true } as any, (err) => {
      if (err) {
        this.log(err?.message)
      }

      // Generate config file
      writeFile(resolve(this.config.configDir, "config.json"), JSON.stringify({
        user_token: this.sessionToken
      }), "utf8", (err) => {
        if (err) {
          this.error(err?.message)
        }
      });
    })
  }

  StartLocalServer(service: string) {
    const app = express();

    app.use(cookieParser());

    app.get('/finished', (req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.log(req.cookies["APP_SID"]);
      console.log(req.headers);
      
      if (req.query.status === "200") {
        // this.sessionToken = "sessionToken"
        // TO DO
      } else {
        this.log(chalk.red(`Failed to authenticate. ${req.query.error_message}`))
      }

      // res.redirect("https://zesty.io")
      res.send(req.cookies);
    });

    this.server = app.listen(8085, () => {
      this.log(`Your browser has been opened to login to Zesty using ${service}. Please complete the login to continue.`);
    });
  }
}
