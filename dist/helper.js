"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = void 0;
const chalk = require('chalk');
// 打印信息
exports.log = {
    info: (msg) => console.log(msg),
    warn: (msg) => console.log(chalk.yellow(`${msg}`)),
    error: (msg) => console.log(chalk.red(`${msg}`)),
    success: (msg) => console.log(chalk.green(`${msg}`)),
};
