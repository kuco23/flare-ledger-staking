import TransportNodeHid from '@ledgerhq/hw-transport-node-hid'
import AvalancheApp from '@avalabs/hw-app-avalanche'
import { recoverPublicKey, recoverTransactionSigner, prefix0x } from './utils'
import * as util from 'ethereumjs-util'

async function blindSign(message: string) {
	const messageBuf = Buffer.from(message, 'hex')
	const transport = await TransportNodeHid.open(undefined)
	const avalanche = new AvalancheApp(transport)
	const accountPath = "m/44'/60'/0'"
	const signPaths = ["0/0"]
	const addressAndPubk = await avalanche.getAddressAndPubKey(accountPath, false, 'costwo')
	console.log("public key:", addressAndPubk.publicKey.toString('hex'))
	console.log("address:", addressAndPubk.address)
	const resp = await avalanche.signHash(accountPath, signPaths, messageBuf)
	const signature = resp.signatures.get("0/0").toString('hex')
	console.log("signature:", signature)
	const pubk = recoverPublicKey(messageBuf, prefix0x(signature))
	const addr = recoverTransactionSigner(messageBuf, prefix0x(signature))
	console.log("public key:", pubk.toString('hex'))
	console.log("address:", addr)
}

async function sign(unsignedTx: string) {
	const unsignedTxBuffer = Buffer.from(unsignedTx, 'hex')
	const transport = await TransportNodeHid.open(undefined)
	const avalanche = new AvalancheApp(transport)
	const accountPath = "m/44'/60'/0'"
	const signPaths = ["0/0"]
	const resp = await avalanche.sign(accountPath, signPaths, unsignedTxBuffer)
	const signature = resp.signatures.get("0/0").toString('hex')
	console.log(signature)
	const pubk = recoverPublicKey(util.sha256(unsignedTxBuffer), prefix0x(signature))
	console.log("signature:", signature)
	console.log("public key:", pubk.toString('hex'))
}

async function getPublicKey(accountPath: string, hrp: string) {
	const transport = await TransportNodeHid.open(undefined)
	const avalanche = new AvalancheApp(transport)
	const pubkaddr = await avalanche.getAddressAndPubKey(accountPath, true, hrp)
	console.log(pubkaddr.publicKey.toString('hex'))
	console.log(pubkaddr.address)
}

getPublicKey("m/44'/60'/0'", "flare")