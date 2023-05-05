import { Flags, CliUx } from '@oclif/core'
import Command from '../../../authenticated-command'
import * as inquirer from 'inquirer'
import * as chalk from 'chalk'
import { mkdir, writeFile } from 'fs/promises'
import { existsSync } from 'fs'
import { resolve } from 'path'

export default class GenerateMediaBins extends Command {
    static description = 'Command for generating the bins data of an instance as JSON in .zesty directory'
  
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
      const { args } = await this.parse(GenerateMediaBins)
      let { instance_zuid } = args
  
      if (!instance_zuid) {
        instance_zuid = await CliUx.ux.prompt(`What is the instance_zuid of the media bins you want to generate? ${chalk.italic("e.g. 8-abcd-1234")}`)
      }
  
      try {
        this.log('Fetching media bins of instance selected')
        await this.sdk.setInstance(instance_zuid);
        const bins = await this.sdk.media.getBins()

        const zestyConfigDir = resolve(process.cwd(), '.zesty')
        const zestyConfigFile = resolve(zestyConfigDir, "bin.json")

        const zestyDirExists = await existsSync(zestyConfigDir)

        if (!zestyDirExists) {
            this.log(chalk(`Creating .zesty config directory`))
            await mkdir(zestyConfigDir, { recursive: true } as any)
        }

        // Write config file
        const configData = { [instance_zuid]: bins.data }
        await writeFile(zestyConfigFile, JSON.stringify(configData), "utf8");

        this.log(chalk(`Generating .zesty/bin.json`))
        this.log(chalk(`Done!`))
      } catch (err) {
        console.error(err);
      }
    }
  }