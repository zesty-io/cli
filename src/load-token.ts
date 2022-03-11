import { existsSync } from "fs"
import { readFile } from "fs/promises"
import { resolve } from "path"

export async function LoadUserToken(path: string) {
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