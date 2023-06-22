"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const cli_1 = require("./cli");
const program = new commander_1.Command();
(0, cli_1.cli)(program).then(() => {
    program.parse();
});
