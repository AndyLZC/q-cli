import { program } from 'commander'
import create from './create'
const pkg = require('../package')

program.version(`{${pkg}.version}`, '-v --version').usage('<command> [options]')
program
  .command('create <project-name>')
  .description('创建一个项目')
  .action(async (name: string) => {
    await create(name)
  })

program.parse(process.argv)
