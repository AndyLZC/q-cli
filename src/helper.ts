const chalk = require('chalk')
// 打印信息
export const log = {
  info: (msg: string) => console.log(msg),
  warn: (msg: string) => console.log(chalk.yellow(`${msg}`)),
  error: (msg: string) => console.log(chalk.red(`${msg}`)),
  success: (msg: string) => console.log(chalk.green(`${msg}`)),
}
