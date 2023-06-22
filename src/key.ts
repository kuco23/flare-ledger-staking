import fs from 'fs'
import AvalancheApp from '@avalabs/hw-app-avalanche'
import TransportNodeHid from '@ledgerhq/hw-transport-node-hid'
import { publicKeyToEthereumAddressString } from './utils'


export class Context {
    constructor(
        public publicKey: string, 
        public flareAddress: string, 
        public ethAddress: string, 
        public network: string
    ) {}
}

async function ledgerGetAccount(derivationPath: string, hrp: string): Promise<{
    publicKey: string, address: string
}> {
	const transport = await TransportNodeHid.open(undefined)
	const avalanche = new AvalancheApp(transport)
	const pubkaddr = await avalanche.getAddressAndPubKey(derivationPath, false, hrp)
	return {
        publicKey: pubkaddr.publicKey.toString('hex'),
        address: pubkaddr.address
    }
}

export async function initContext(derivationPath: string, hrp: string) {
    const { publicKey, address } = await ledgerGetAccount(derivationPath, hrp)
    const data = new Context(publicKey, address, publicKeyToEthereumAddressString(publicKey), hrp)
    fs.writeFileSync('ctx.json', JSON.stringify(data, null, 2))
}
