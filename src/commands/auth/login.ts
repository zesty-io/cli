import { Command, Flags, CliUx } from '@oclif/core'
import * as chalk from 'chalk'
import * as SDK from "@zesty-io/sdk"
import { mkdir, writeFile } from 'fs'
import { resolve } from 'path'
import * as inquirer from 'inquirer'
import * as express from 'express'
import * as cors from 'cors'

const open = require('open')

export default class Login extends Command {
  static description = 'Command for authenticating with a Zesty.io account using basic and SSO authentication'

  static examples = [
    `$ zesty auth login zesty`,
  ]
  
  static flags = {
    help: Flags.help({ char: 'h' }),
  }

  static args = [
    {
      name: 'service',
      description: 'The service to be used to login. Accepted values are zesty, microsoft, google, github and okta',
      options: ['zesty', 'microsoft', 'google', 'github', 'okta'],
    }
  ]
  
  sessionToken: any | undefined
  server: any | null = null
  failedSSOAuthentication: boolean | undefined

  async run(): Promise<void> {
    const authURL = "https://auth.api.dev.zesty.io"
    const { args } = await this.parse(Login)
    let { service } = args

    if (!service) {
      const answer = await inquirer.prompt([
        {
          type: 'list',
          name: 'service',
          message: 'Which service would you like to use?',
          choices: [
            { name: "Zesty", value: "zesty" },
            { name: "Microsoft", value: "azure" },
            { name: "Google", value: "google" },
            { name: "Github", value: "github" },
            { name: "Okta", value: "okta" },
          ],
        },
      ])
      service = answer.service.toLowerCase()
    }

    try {
      if (service === "zesty") { // Basic authentication
        const { email } = await inquirer.prompt({
          type: 'input',
          name: 'email',
          message: `Email: (${chalk.italic("e.g. hello@example.com")})`,
          validate: (value: { length: number; }) => value.length > 0,
        })

        const { pass } = await inquirer.prompt({
          type: 'password',
          name: 'pass',
          message: "Password:",
          validate: (value: { length: number; }) => value.length > 0,
        })

        CliUx.ux.action.start(`Authenticating with ${service}`)
        
        const auth = new SDK.Auth({ authURL: authURL })
        const session = await auth.login(email, pass)

        if (session.token) {
          this.sessionToken = session.token
          this.WriteTokenToConfigFile()
        } else {
          this.warn(chalk.red(`Failed to authenticate. ${session.message}`))
        }

        CliUx.ux.action.stop()

        return this.sessionToken
      } else { // SSO authentication
        let loginURL = `${authURL}/${service}/login?redirect_uri=http://localhost:8085`

        if (service === "okta") {
          const clientDomainPrompt = await inquirer.prompt({
            type: 'input',
            name: 'clientDomain',
            message: `Client Domain: (${chalk.italic("e.g. https://myorg.okta.com")})`,
            validate: (value: { length: number; }) => value.length > 0,
          })
          loginURL = `${loginURL}&iss=${clientDomainPrompt.clientDomain}`
        }

        await new Promise<void>((resolve, reject) =>{
          this.StartLocalServer(service)
          CliUx.ux.action.start(`Authenticating with ${service}`)
          open(loginURL)

          const intervalId = setInterval(async () => {
            if (this.sessionToken !== undefined || this.failedSSOAuthentication) {
              this.server.close()
              
              clearInterval(intervalId)
              resolve()
            }
          }, 1000)
        })

        CliUx.ux.action.stop()
        return this.sessionToken
      }
    } catch (err) {
      console.error(err)
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
      })
    })
  }

  StartLocalServer(service: string) {
    const app = express()

    app.use(
      cors({
        credentials: true,
        origin: [
          /localhost:?\d*$/,
          /zesty\.localdev:?\d*$/,
          /dev.zesty\.io:?\d*$/,
          /stage.zesty\.io:?\d*$/,
          /zesty\.io:?\d*$/,
        ],
      })
    )

    // Successful authentication
    app.post('/get-session', express.text(), (req: express.Request, res: express.Response) => {
      if (req.body) {
        this.sessionToken = req.body
        this.WriteTokenToConfigFile()
        this.log(chalk.green(`Successfully authenticated to Zesty CLI using ${service}`))

        res.end()
      } else {
        this.failedSSOAuthentication = true
        this.log(`Failed to authenticate. Session Token not returned`)

        res.redirect("/finished?status=403&error_message=Failed to authenticate. Session Token not returned")
      }
    })
    
    // Failed authentication
    app.get('/finished', (req: express.Request, res: express.Response) => {
      this.failedSSOAuthentication = true
      this.log(chalk.red(`Failed to authenticate. ${req.query.error_message}`))

      res.redirect("https://zesty.io")
    })

    this.server = app.listen(8085, () => {
      this.log(`Your browser has been opened to login to Zesty CLI using ${service}. Please complete the login to continue.\n`)
    })
  }
}
