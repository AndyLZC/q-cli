const chalk = require('chalk')
const fs = require('fs-extra')
const ora = require('ora')
const download = require('download-git-repo')

import { resolve } from 'path'
import { exec } from 'shelljs'
import { cwd } from 'process'
import * as inquirer from 'inquirer'
import { exit } from 'process'
import { REPO_URL } from './config'
import { Choice, RepoInfo } from './types'
import { log } from './helper'

// 用户交互选择处理
async function handleChoice(targetDir: string) {
  const { checkExist } = await inquirer.prompt({
    type: 'list',
    name: 'checkExist',
    message: `\文件夹 ${targetDir} 已存在`,
    choices: [Choice.rename, Choice.cover, Choice.cancel],
  })
  if (checkExist === Choice.rename) {
    const { inputNewName } = await inquirer.prompt({
      type: 'input',
      name: 'inputNewName',
      message: '请输入新的项目名称: ',
    })
    if (inputNewName && inputNewName !== targetDir) return inputNewName
    const res: any = await handleChoice(targetDir)
    if (res) return res
  } else if (checkExist == Choice.cover) {
    fs.removeSync(targetDir)
  } else {
    exit(1)
  }
}

// 检查文件夹存在情况
export async function checkTargetExist(targetDir: string) {
  const isExist = await fs.existsSync(resolve(cwd(), targetDir))
  if (isExist) {
    const res = await handleChoice(targetDir)
    return res
  }
}

// 克隆模板到本地
export async function cloneRepo(targetDir: string) {
  const spinner = ora()
  spinner.start('正在拉取模板...')
  return new Promise((resolve, reject) => {
    download(REPO_URL, cwd() + `/${targetDir}`, (err: any) => {
      if (err) {
        spinner.fail(chalk.red('模板拉取失败'))
        spinner.stop()
        reject()
      }
      spinner.succeed(chalk.green('模板下载成功'))
      resolve(true)
    })
  })
}

// 获取模板基础信息
export const getRepoInfo = (): Promise<RepoInfo> => {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'description',
      message: 'description',
    },
    {
      type: 'input',
      name: 'author',
      message: 'author',
    },
  ])
}

// 更新 package.json 信息
export function updatePackageInfo(target: string, repoInfo: RepoInfo) {
  const pkgJson = fs.readJsonSync(cwd() + `/${target}/package.json`)
  Object.assign(pkgJson, repoInfo)
}

async function runExec(command: string) {
  return new Promise((resolve, reject) => {
    exec(command, (err: any) => {
      if (!err) return resolve(true)
      reject(err)
    })
  })
}

// 安装依赖包
export async function installPkg(targetDir: string) {
  const spinner = ora()
  spinner.start('安装依赖中...')
  try {
    await runExec(`cd ${targetDir} && npm i`)
    spinner.succeed(chalk.green('依赖安装完成🎉'))
    log.success(`  cd ${targetDir} \n  npm run dev`)
  } catch (err) {
    spinner.fail(chalk.red('依赖安装失败'))
    spinner.stop()
  }
}
