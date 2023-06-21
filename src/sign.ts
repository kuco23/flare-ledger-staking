import TransportNodeHid from '@ledgerhq/hw-transport-node-hid'
import AvalancheApp from '@avalabs/hw-app-avalanche'
import { recoverPublicKey, recoverTransactionSigner, prefix0x, decodePublicKey, compressPublicKey, publicKeyToEthereumAddressString } from './utils'
import * as util from 'ethereumjs-util'
import fs from 'fs'

function translatePublicKey(pubk: string) {
	const [x, y] = decodePublicKey(pubk)
	return compressPublicKey(x, y).toString('hex')
}

class SignatureRequest {
    message: string
}

class Transaction {
    signatureRequests: SignatureRequest[]
}

async function blindSign(message: string) {
	const messageBuf = Buffer.from(message, 'hex')
	const transport = await TransportNodeHid.open(undefined)
	const avalanche = new AvalancheApp(transport)
	const accountPath = "m/44'/60'/0'"
	const signPaths = ["0/0"]
	const resp = await avalanche.signHash(accountPath, signPaths, messageBuf)
	const signature = resp.signatures.get("0/0").toString('hex')
	console.log("signature:", signature)

	const derivationPath = "m/44'/60'/0'/0/0"
	const addressAndPubk = await avalanche.getAddressAndPubKey(derivationPath, false, 'costwo')
	const pubk = recoverPublicKey(messageBuf, prefix0x(signature))
	const addr = recoverTransactionSigner(messageBuf, prefix0x(signature))
	console.log("public key:", addressAndPubk.publicKey.toString('hex'))
	console.log("public key:", translatePublicKey(pubk.toString('hex')))
	console.log("address:", addr)
}

export async function signHash(file: string) {
    const json = fs.readFileSync(file, 'utf8')
    const tx: Transaction = JSON.parse(json)
    if (tx && tx.signatureRequests && tx.signatureRequests.length > 0) {
        await blindSign(tx.signatureRequests[0].message)
    } else {
        console.log("Invalid transaction file")
    }
}
