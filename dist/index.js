"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const hw_transport_node_hid_1 = __importDefault(require("@ledgerhq/hw-transport-node-hid"));
const hw_app_avalanche_1 = __importDefault(require("@avalabs/hw-app-avalanche"));
const utils_1 = require("./utils");
const util = __importStar(require("ethereumjs-util"));
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
    });
}
function sign(unsignedTx) {
    return __awaiter(this, void 0, void 0, function* () {
        const unsignedTxBuffer = Buffer.from(unsignedTx, 'hex');
        const transport = yield hw_transport_node_hid_1.default.open(undefined);
        const avalanche = new hw_app_avalanche_1.default(transport);
        const accountPath = "m/44'/60'/0'";
        const signPaths = ["0/0"];
        const resp = yield avalanche.sign(accountPath, signPaths, unsignedTxBuffer);
        const signature = resp.signatures.get("0/0").toString('hex');
        console.log(signature);
        const pubk = (0, utils_1.recoverPublicKey)(util.sha256(unsignedTxBuffer), (0, utils_1.prefix0x)(signature));
        console.log("signature:", signature);
        console.log("public key:", pubk.toString('hex'));
    });
}
function getPublicKey(accountPath, hrp) {
    return __awaiter(this, void 0, void 0, function* () {
        const transport = yield hw_transport_node_hid_1.default.open(undefined);
        const avalanche = new hw_app_avalanche_1.default(transport);
        const pubkaddr = yield avalanche.getAddressAndPubKey(accountPath, false, hrp);
        const pubkHex = pubkaddr.publicKey.toString('hex');
        console.log("public key:", pubkHex);
        console.log("flare address", pubkaddr.address);
        console.log("ethereum address", (0, utils_1.publicKeyToEthereumAddressString)(pubkHex));
    });
}
//getPublicKey("m/44'/60'/0'/0/0", "flare")
sign('0000000000110000007200000000000000000000000000000000000000000000000000000000000000000000000158734f94af871c3d131b56131b6fb7a0291eacadd261e69dfb42a9cdf6f7fddd0000000700000002540be40000000000000000000000000100000001db89a2339639a5f3fa183258cfea265e4d1cce6c0000000000000056506c6174666f726d564d207574696c697479206d6574686f64206275696c64496d706f7274547820746f20696d706f7274204156415820746f2074686520502d436861696e2066726f6d2074686520432d436861696e78db5c30bed04c05ce209179812850bbb3fe6d46d7eef3744d814c0da5552479000000015a0060607a586b1f6197671965d7c4fa45a6892f88385563510f6cc4af1853fe0000000058734f94af871c3d131b56131b6fb7a0291eacadd261e69dfb42a9cdf6f7fddd0000000500000002541b26400000000100000000');
