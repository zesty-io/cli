import { Flags, CliUx } from '@oclif/core'
import Command from '../../../authenticated-command'
import * as chalk from 'chalk'

export default class ListMediaBins extends Command {
    static description = 'Command for listing media bins of an instance'
  
    static flags = {
      help: Flags.help({ char: 'h' }),
    }
  
    static args = [
      {
        name: 'instance_zuid',
        description: "instance_ZUID of your instance"
      }
    ]
  
    async run(): Promise<void> {
      const { args } = await this.parse(ListMediaBins)
      let { instance_zuid } = args
  
      if (!instance_zuid) {
        instance_zuid = await CliUx.ux.prompt(`What is the instance_zuid of the media bins you want to list? ${chalk.italic("e.g. 8-abcd-1234")}`)
      }
  
      try {
        CliUx.ux.action.start('Fetching media bins of instance selected')
        await this.sdk.setInstance(instance_zuid);
        const bins = await this.sdk.media.getBins()
        CliUx.ux.action.stop()

        CliUx.ux.table(bins.data, {
            id: {
                minWidth: 7,
            },
            name: {
                minWidth: 7,
            },
            storage_base_url: {
                minWidth: 7,
            },
            cdn_base_url: {
                minWidth: 7,
            }
        }, {
            printLine: this.log.bind(this),
        })
  
        return bins
      } catch (err) {
        console.error(err);
      }
    }
  }