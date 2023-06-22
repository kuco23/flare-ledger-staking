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
exports.cli = void 0;
const logging_1 = __importDefault(require("logging"));
const key_1 = require("./key");
const sign_1 = require("./sign");
const logger = (0, logging_1.default)('info');
function cli(program) {
    return __awaiter(this, void 0, void 0, function* () {
        program
            .command("init-ctx").description("Initialize context file")
            .option("-n, --network <Network>", "Network (HRP)", "flare")
            .action((options) => __awaiter(this, void 0, void 0, function* () {
            yield (0, key_1.getPublicKey)("m/44'/60'/0'/0/0", options.network);
        }));
        program
            .command("sign-hash").description("Sign a transaction hash (blind signature)")
            .argument("<file>", "File to sign")
            .action((file) => __awaiter(this, void 0, void 0, function* () {
            yield (0, sign_1.signHash)(file);
        }));
    });
}
exports.cli = cli;
