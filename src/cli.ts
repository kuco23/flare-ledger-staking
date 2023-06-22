import { Command, OptionValues } from 'commander'
import createLogger from 'logging'
import { initContext } from './key'
import { signHash } from './sign'


const DERIVATION_PATH = "m/44'/60'/0'/0/0"
const logger = createLogger('info')

export async function cli(program: Command) {
  program
    .command("init-ctx").description("Initialize context file")
    .option("-n, --network <Network>", "Network (HRP)", "flare")
    .action(async (options: OptionValues) => {
      await initContext(DERIVATION_PATH, options.network)
      logger.info("Context file created")
    })
  program
    .command("sign-hash").description("Sign a transaction hash (blind signature)")
    .argument("<file>", "File to sign")
    .option("-b, --blind <blind>", "Blind signature", true)
    .action(async (file: string, options: OptionValues) => {
      await signHash(file, DERIVATION_PATH, options.blind)
      logger.info("Transaction signed")
    })
}

