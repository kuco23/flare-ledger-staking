import { Command, OptionValues } from 'commander'
import createLogger from 'logging'
import { getPublicKey as initContext } from './key'
import { signHash } from './sign'

const logger = createLogger('info')

export async function cli(program: Command) {
  program
    .command("init-ctx").description("Initialize context file")
    .option("-n, --network <Network>", "Network (HRP)", "flare")
    .action(async (options: OptionValues) => {
      await initContext("m/44'/60'/0'/0/0", options.network)
    })
  program
    .command("sign-hash").description("Sign a transaction hash (blind signature)")
    .argument("<file>", "File to sign")
    .action(async (file: string) => {
      await signHash(file)
    })
}

