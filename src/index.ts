import TransportNodeHid from '@ledgerhq/hw-transport-node-hid'
import AvalancheApp from '@avalabs/hw-app-avalanche'
import { recoverPublicKey, recoverTransactionSigner, prefix0x, decodePublicKey, compressPublicKey, publicKeyToEthereumAddressString } from './utils'
import * as util from 'ethereumjs-util'

function translatePublicKey(pubk: string) {
	const [x, y] = decodePublicKey(pubk)
	return compressPublicKey(x, y).toString('hex')
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
	const pubkaddr = await avalanche.getAddressAndPubKey(accountPath, false, hrp)
	const pubkHex = pubkaddr.publicKey.toString('hex')
	console.log("public key:", pubkHex)
	console.log("flare address", pubkaddr.address)
	console.log("ethereum address", publicKeyToEthereumAddressString(pubkHex))
}

//getPublicKey("m/44'/60'/0'/0/0", "flare")
sign('0000000000110000007200000000000000000000000000000000000000000000000000000000000000000000000158734f94af871c3d131b56131b6fb7a0291eacadd261e69dfb42a9cdf6f7fddd0000000700000002540be40000000000000000000000000100000001db89a2339639a5f3fa183258cfea265e4d1cce6c0000000000000056506c6174666f726d564d207574696c697479206d6574686f64206275696c64496d706f7274547820746f20696d706f7274204156415820746f2074686520502d436861696e2066726f6d2074686520432d436861696e78db5c30bed04c05ce209179812850bbb3fe6d46d7eef3744d814c0da5552479000000015a0060607a586b1f6197671965d7c4fa45a6892f88385563510f6cc4af1853fe0000000058734f94af871c3d131b56131b6fb7a0291eacadd261e69dfb42a9cdf6f7fddd0000000500000002541b26400000000100000000')