"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.installPkg = exports.updatePackageInfo = exports.getRepoInfo = exports.cloneRepo = exports.checkTargetExist = void 0;
const chalk = require('chalk');
const fs = require('fs-extra');
const ora = require('ora');
const download = require('download-git-repo');
const path_1 = require("path");
const shelljs_1 = require("shelljs");
const process_1 = require("process");
const inquirer = require("inquirer");
const process_2 = require("process");
const config_1 = require("./config");
const types_1 = require("./types");
const helper_1 = require("./helper");
// 用户交互选择处理
async function handleChoice(targetDir) {
    const { checkExist } = await inquirer.prompt({
        type: 'list',
        name: 'checkExist',
        message: `\文件夹 ${targetDir} 已存在`,
        choices: [types_1.Choice.rename, types_1.Choice.cover, types_1.Choice.cancel],
    });
    if (checkExist === types_1.Choice.rename) {
        const { inputNewName } = await inquirer.prompt({
            type: 'input',
            name: 'inputNewName',
            message: '请输入新的项目名称: ',
        });
        if (inputNewName && inputNewName !== targetDir)
            return inputNewName;
        const res = await handleChoice(targetDir);
        if (res)
            return res;
    }
    else if (checkExist == types_1.Choice.cover) {
        fs.removeSync(targetDir);
    }
    else {
        (0, process_2.exit)(1);
    }
}
// 检查文件夹存在情况
async function checkTargetExist(targetDir) {
    const isExist = await fs.existsSync((0, path_1.resolve)((0, process_1.cwd)(), targetDir));
    if (isExist) {
        const res = await handleChoice(targetDir);
        return res;
    }
}
exports.checkTargetExist = checkTargetExist;
// 克隆模板到本地
async function cloneRepo(targetDir) {
    const spinner = ora();
    spinner.start('正在拉取模板...');
    return new Promise((resolve, reject) => {
        download(config_1.REPO_URL, (0, process_1.cwd)() + `/${targetDir}`, (err) => {
            if (err) {
                spinner.fail(chalk.red('模板拉取失败'));
                spinner.stop();
                reject();
            }
            spinner.succeed(chalk.green('模板下载成功'));
            resolve(true);
        });
    });
}
exports.cloneRepo = cloneRepo;
// 获取模板基础信息
const getRepoInfo = () => {
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
    ]);
};
exports.getRepoInfo = getRepoInfo;
// 更新 package.json 信息
function updatePackageInfo(target, repoInfo) {
    const pkgJson = fs.readJsonSync((0, process_1.cwd)() + `/${target}/package.json`);
    Object.assign(pkgJson, repoInfo);
}
exports.updatePackageInfo = updatePackageInfo;
async function runExec(command) {
    return new Promise((resolve, reject) => {
        (0, shelljs_1.exec)(command, (err) => {
            if (!err)
                return resolve(true);
            reject(err);
        });
    });
}
// 安装依赖包
async function installPkg(targetDir) {
    const spinner = ora();
    spinner.start('安装依赖中...');
    try {
        await runExec(`cd ${targetDir} && npm i`);
        spinner.succeed(chalk.green('依赖安装完成🎉'));
        helper_1.log.success(`  cd ${targetDir} \n  npm run dev`);
    }
    catch (err) {
        spinner.fail(chalk.red('依赖安装失败'));
        spinner.stop();
    }
}
exports.installPkg = installPkg;
