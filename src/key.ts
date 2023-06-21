import AvalancheApp from '@avalabs/hw-app-avalanche'
import TransportNodeHid from '@ledgerhq/hw-transport-node-hid'
import { publicKeyToEthereumAddressString } from './utils'
import fs from 'fs'


export class PublicKeyData {
    publicKey: string
    flareAddress: string
    ethAddress: string
    network: string

    constructor(publicKey: string, flareAddress: string, ethAddress: string, network: string) {
        this.publicKey = publicKey
        this.flareAddress = flareAddress
        this.ethAddress = ethAddress
        this.network = network
    }

}

export async function getPublicKey(accountPath: string, hrp: string) {
	const transport = await TransportNodeHid.open(undefined)
	const avalanche = new AvalancheApp(transport)
	const pubkaddr = await avalanche.getAddressAndPubKey(accountPath, false, hrp)
	const pubkHex = pubkaddr.publicKey.toString('hex')
    const data = new PublicKeyData(pubkHex, pubkaddr.address, publicKeyToEthereumAddressString(pubkHex), hrp)
    // save to file
    fs.writeFileSync('publicKey.json', JSON.stringify(data, null, 2))
}
