import { Flags, CliUx } from '@oclif/core'
import Command from '../authenticated-command'

export default class ListInstances extends Command {
    static description = 'List your instances'

    static flags = {
        help: Flags.help({ char: 'h' })
    }

    async run() {
        try {
            CliUx.ux.action.start(`Fetching instances`)
            const instances = await this.sdk.account.getInstances()
            CliUx.ux.action.stop()

            CliUx.ux.table(instances.data, {
                name: {
                    minWidth: 7,
                },
                domain: {
                    minWidth: 7,
                },
                ZUID: {
                    minWidth: 7,
                }
            }, {
                printLine: this.log.bind(this),
            })

            return instances

        } catch (err: any) {
            this.error(err.message);
        }
    }
}
