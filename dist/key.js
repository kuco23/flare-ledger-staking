"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicKey = exports.Context = void 0;
const hw_app_avalanche_1 = __importDefault(require("@avalabs/hw-app-avalanche"));
const hw_transport_node_hid_1 = __importDefault(require("@ledgerhq/hw-transport-node-hid"));
const utils_1 = require("./utils");
const fs_1 = __importDefault(require("fs"));
class Context {
    constructor(publicKey, flareAddress, ethAddress, network) {
        this.publicKey = publicKey;
        this.flareAddress = flareAddress;
        this.ethAddress = ethAddress;
        this.network = network;
    }
}
exports.Context = Context;
function getPublicKey(accountPath, hrp) {
    return __awaiter(this, void 0, void 0, function* () {
        const transport = yield hw_transport_node_hid_1.default.open(undefined);
        const avalanche = new hw_app_avalanche_1.default(transport);
        const pubkaddr = yield avalanche.getAddressAndPubKey(accountPath, false, hrp);
        const pubkHex = pubkaddr.publicKey.toString('hex');
        const data = new Context(pubkHex, pubkaddr.address, (0, utils_1.publicKeyToEthereumAddressString)(pubkHex), hrp);
        // save to file
        fs_1.default.writeFileSync('ctx.json', JSON.stringify(data, null, 2));
    });
}
exports.getPublicKey = getPublicKey;
