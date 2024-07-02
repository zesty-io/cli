import { Command } from '@oclif/core'
import { existsSync } from "fs"
import { readFile } from "fs/promises"
import { resolve } from "path"
import * as SDK from '@zesty-io/sdk'
import "dotenv/config";

export function getAPIURLs(): {
  accountsAPIURL: string;
  authURL: string;
} {
  const env = process.env.ENV || 'prod'
  let accountsAPIURL: string;
  let authURL: string;

  switch (env) {
    case "local":
      accountsAPIURL = "https://accounts.api.dev.zesty.io/v1";
      authURL = "https://auth.api.dev.zesty.io";
      break;
    case "dev":
      accountsAPIURL = "https://accounts.api.dev.zesty.io/v1";
      authURL = "https://auth.api.dev.zesty.io";
      break;
    case "stage":
      accountsAPIURL = "https://accounts.api.stage.zesty.io/v1";
      authURL = "https://auth.api.stage.zesty.io";
      break;
    case "prod":
    default:
      accountsAPIURL = "https://accounts.api.zesty.io/v1";
      authURL = "https://auth.api.zesty.io";
      break;
  }

  return { accountsAPIURL, authURL };
}

export async function GetUserToken(path: string) {
    try {
        const file = resolve(path, 'config.json')
        const exists = existsSync(file)

        if (exists) {
            const str = await readFile(file, {
                encoding: 'utf-8'
            })
            const json = JSON.parse(str)
            return json.user_token
        }

    } catch (error) {
        throw error
    }
}

export function InitSDK(token: string) {
    const { accountsAPIURL, authURL } = getAPIURLs();

    return new SDK('', token, {
        accountsAPIURL,
        authURL
        // instancesAPIURL: "https://INSTANCE_ZUID.api.zesty.io/v1",
        // mediaAPIURL: "https://svc.zesty.io",
    })
}

export default abstract class extends Command {
    sdk: any

    // expose on the class
    GetUserToken = GetUserToken
    InitSDK = InitSDK

    async init() {
        try {
            const token = await GetUserToken(this.config.configDir)
            const { authURL } = getAPIURLs();
            const auth = new SDK.Auth({
                authURL
            })
            const valid = await auth.verifyToken(token)

            if (!token || !valid.verified) {
                // TODO can we trigger login flow from here?
                throw new Error('You must login with the command: zesty auth:login')
            }

            this.sdk = InitSDK(token)
        } catch (error) {
            throw error
        }
    }

    // async catch(err) {
    //     // add any custom logic to handle errors from the command
    //     // or simply return the parent class error handling
    //     return super.catch(err);
    // }
    // async finally(err) {
    //     // called after run and catch regardless of whether or not the command errored
    //     return super.finally(_);
    // }
}
