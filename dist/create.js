"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flow_1 = require("./flow");
// 检查文件夹名称是否重复 => 拉取模板 => 更新 package.json 信息 =>  安装依赖
async function create(targetDir) {
    let newTargetDir = targetDir;
    const res = await (0, flow_1.checkTargetExist)(targetDir);
    res && (newTargetDir = res);
    await (0, flow_1.cloneRepo)(newTargetDir);
    const repoInfo = await (0, flow_1.getRepoInfo)();
    (0, flow_1.updatePackageInfo)(targetDir, repoInfo);
    (0, flow_1.installPkg)(targetDir);
}
exports.default = create;
