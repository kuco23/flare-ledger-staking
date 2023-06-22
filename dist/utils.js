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
Object.defineProperty(exports, "__esModule", { value: true });
exports.integerToDecimal = exports.decimalToInteger = exports.prefix0x = exports.unPrefix0x = exports.sleepms = exports.recoverPublicKey = exports.recoverTransactionSigner = exports.recoverMessageSigner = exports.publicKeyToEthereumAddressString = exports.publicKeyToBech32AddressString = exports.compressPublicKey = exports.decodePublicKey = exports.privateKeyToPublicKey = exports.privateKeyToPublicKeyEncoding = void 0;
const ethutil = __importStar(require("ethereumjs-util"));
const elliptic = __importStar(require("elliptic"));
const bech32_1 = require("bech32");
//////////////////////////////////////////////////////////////////////////////////////////
// public keys and bech32 addresses
const EC = elliptic.ec;
const ec = new EC("secp256k1");
function privateKeyToPublicKeyEncoding(privateKey, compress = true) {
    const keyPair = ec.keyFromPrivate(privateKey);
    return keyPair.getPublic().encode("hex", compress);
}
exports.privateKeyToPublicKeyEncoding = privateKeyToPublicKeyEncoding;
function privateKeyToPublicKey(privateKey) {
    const keyPair = ec.keyFromPrivate(privateKey).getPublic();
    const x = keyPair.getX().toBuffer(undefined, 32);
    const y = keyPair.getY().toBuffer(undefined, 32);
    return [x, y];
}
exports.privateKeyToPublicKey = privateKeyToPublicKey;
function decodePublicKey(publicKey) {
    let x;
    let y;
    publicKey = unPrefix0x(publicKey);
    if (publicKey.length == 128) {
        // ethereum specific public key encoding
        x = Buffer.from(publicKey.slice(0, 64), "hex");
        y = Buffer.from(publicKey.slice(64), "hex");
    }
    else {
        const keyPair = ec.keyFromPublic(publicKey, 'hex').getPublic();
        x = keyPair.getX().toBuffer(undefined, 32);
        y = keyPair.getY().toBuffer(undefined, 32);
    }
    return [x, y];
}
exports.decodePublicKey = decodePublicKey;
function compressPublicKey(x, y) {
    return Buffer.from(ec.keyFromPublic({
        x: x.toString('hex'),
        y: y.toString('hex')
    }).getPublic().encode("hex", true), "hex");
}
exports.compressPublicKey = compressPublicKey;
function publicKeyToBech32AddressBuffer(x, y) {
    const compressed = compressPublicKey(x, y);
    return ethutil.ripemd160(ethutil.sha256(compressed), false);
}
function publicKeyToBech32AddressString(publicKey, hrp) {
    const [pubX, pubY] = decodePublicKey(publicKey);
    const addressBuffer = publicKeyToBech32AddressBuffer(pubX, pubY);
    return `${bech32_1.bech32.encode(hrp, bech32_1.bech32.toWords(addressBuffer))}`;
}
exports.publicKeyToBech32AddressString = publicKeyToBech32AddressString;
function publicKeyToEthereumAddressString(publicKey) {
    const [pubX, pubY] = decodePublicKey(publicKey);
    const decompressedPubk = Buffer.concat([pubX, pubY]);
    const ethAddress = ethutil.publicToAddress(decompressedPubk);
    return prefix0x(ethAddress.toString('hex'));
}
exports.publicKeyToEthereumAddressString = publicKeyToEthereumAddressString;
/////////////////////////////////////////////////////////////////////////////////////////
// signatures
function recoverMessageSigner(message, signature) {
    const messageHash = ethutil.hashPersonalMessage(message);
    return recoverTransactionSigner(messageHash, signature);
}
exports.recoverMessageSigner = recoverMessageSigner;
function recoverTransactionSigner(message, signature) {
    let split = ethutil.fromRpcSig(signature);
    let publicKey = ethutil.ecrecover(message, split.v, split.r, split.s);
    let signer = ethutil.pubToAddress(publicKey).toString("hex");
    return signer;
}
exports.recoverTransactionSigner = recoverTransactionSigner;
function recoverPublicKey(message, signature) {
    const split = ethutil.fromRpcSig(signature);
    return ethutil.ecrecover(message, split.v, split.r, split.s);
}
exports.recoverPublicKey = recoverPublicKey;
//////////////////////////////////////////////////////////////////////////////////////////
// general helper functions
function sleepms(milliseconds) {
    return __awaiter(this, void 0, void 0, function* () {
        yield new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, milliseconds);
        });
    });
}
exports.sleepms = sleepms;
function unPrefix0x(tx) {
    if (!tx) {
        return '0x0';
    }
    return tx.startsWith('0x') ? tx.slice(2) : tx;
}
exports.unPrefix0x = unPrefix0x;
function prefix0x(hexString) {
    return hexString.startsWith("0x") ? hexString : "0x" + unPrefix0x(hexString);
}
exports.prefix0x = prefix0x;
function decimalToInteger(dec, n) {
    let ret = dec;
    if (ret.includes('.')) {
        const split = ret.split('.');
        ret = split[0] + split[1].slice(0, n).padEnd(n, '0');
    }
    else {
        ret = ret + '0'.repeat(n);
    }
    return ret;
}
exports.decimalToInteger = decimalToInteger;
function integerToDecimal(int, n) {
    int = int.padStart(n, '0');
    const part1 = int.slice(0, -n);
    const part2 = int.slice(-n);
    return part1 + '.' + part2;
}
exports.integerToDecimal = integerToDecimal;
