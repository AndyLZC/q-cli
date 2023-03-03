"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const create_1 = require("./create");
const pkg = require('../package');
commander_1.program.version(`{${pkg}.version}`, '-v --version').usage('<command> [options]');
commander_1.program
    .command('create <project-name>')
    .description('创建一个项目')
    .action(async (name) => {
    await (0, create_1.default)(name);
});
commander_1.program.parse(process.argv);
