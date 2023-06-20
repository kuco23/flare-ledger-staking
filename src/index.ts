import TransportNodeHid from '@ledgerhq/hw-transport-node-hid'
import AvalancheApp from '@avalabs/hw-app-avalanche'
import { recoverPublicKey, recoverTransactionSigner, prefix0x } from './utils'

const message = "6bd0ff1f787dcd4bc345e22bf12f03fb1ff1996c2d8383befa66877f94b13ca5"
const messageBuf = Buffer.from(message, 'hex')

async function main() {
	const transport = await TransportNodeHid.open(undefined)
	console.log(transport)
	const avalanche = new AvalancheApp(transport)
	const accountPath = "m/44'/9000'/0'"
	const signPaths = ["0/0"]
	const resp = await avalanche.signHash(accountPath, signPaths, messageBuf)
	const signature = resp.signatures.get("0/0").toString('hex')
	console.log("signature:", signature)
	const pubk = recoverPublicKey(messageBuf, prefix0x(signature))
	const addr = recoverTransactionSigner(messageBuf, prefix0x(signature))
	console.log("public key:", pubk.toString('hex'))
	console.log("address:", addr)
}

main()