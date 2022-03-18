import * as path from 'path'
import * as os from 'os'
import { expect, test } from '@oclif/test'
import { InitSDK } from '../../src/commands/authenticated-command'

describe('authenticated-command', () => {
    const configDir = path.join(os.homedir(), '/.config/zesty/');

    console.log(configDir);

    const sdk = InitSDK(configDir)

    console.log(sdk);

    // expect(sdk).to.contain

    //   test
    //   .stdout()
    //   .command(['hello', 'friend', '--from=oclif'])
    //   .it('runs hello cmd', ctx => {
    //     expect(ctx.stdout).to.contain('hello friend from oclif!')
    //   })
})
