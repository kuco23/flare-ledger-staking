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
exports.signHash = void 0;
const hw_transport_node_hid_1 = __importDefault(require("@ledgerhq/hw-transport-node-hid"));
const hw_app_avalanche_1 = __importDefault(require("@avalabs/hw-app-avalanche"));
const utils_1 = require("./utils");
const fs_1 = __importDefault(require("fs"));
function translatePublicKey(pubk) {
    const [x, y] = (0, utils_1.decodePublicKey)(pubk);
    return (0, utils_1.compressPublicKey)(x, y).toString('hex');
}
function blindSign(message) {
    return __awaiter(this, void 0, void 0, function* () {
        const messageBuf = Buffer.from(message, 'hex');
        const transport = yield hw_transport_node_hid_1.default.open(undefined);
        const avalanche = new hw_app_avalanche_1.default(transport);
        const accountPath = "m/44'/60'/0'";
        const signPaths = ["0/0"];
        const resp = yield avalanche.signHash(accountPath, signPaths, messageBuf);
        const signature = resp.signatures.get("0/0").toString('hex');
        console.log("signature:", signature);
        const derivationPath = "m/44'/60'/0'/0/0";
        const addressAndPubk = yield avalanche.getAddressAndPubKey(derivationPath, false, 'costwo');
        const pubk = (0, utils_1.recoverPublicKey)(messageBuf, (0, utils_1.prefix0x)(signature));
        const addr = (0, utils_1.recoverTransactionSigner)(messageBuf, (0, utils_1.prefix0x)(signature));
        console.log("public key:", addressAndPubk.publicKey.toString('hex'));
        console.log("public key:", translatePublicKey(pubk.toString('hex')));
        console.log("address:", addr);
        return signature;
    });
}
function signHash(file) {
    return __awaiter(this, void 0, void 0, function* () {
        const json = fs_1.default.readFileSync(file, 'utf8');
        const tx = JSON.parse(json);
        if (tx && tx.signatureRequests && tx.signatureRequests.length > 0) {
            const signature = yield blindSign(tx.signatureRequests[0].message);
            tx.signature = signature;
            let outFile = file.replace('unsignedTx.json', 'signedTx.json');
            if (outFile === file) {
                outFile = file + '.signed';
            }
            fs_1.default.writeFileSync(outFile, JSON.stringify(tx, null, 2));
        }
        else {
            console.log("Invalid transaction file");
        }
    });
}
exports.signHash = signHash;
