import Command from '../../authenticated-command'

export default class GetUserToken extends Command {
    static description = "Show current user session token CLI is configured to use";

    async run() {
        const token = await this.GetUserToken(this.config.configDir)
        this.log(token)
    }
}