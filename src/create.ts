import { checkTargetExist, cloneRepo, updatePackageInfo, getRepoInfo, installPkg } from './flow'

// 检查文件夹名称是否重复 => 拉取模板 => 更新 package.json 信息 =>  安装依赖

export default async function create(targetDir: string) {
  let newTargetDir = targetDir
  const res = await checkTargetExist(targetDir)
  res && (newTargetDir = res)
  await cloneRepo(newTargetDir)
  const repoInfo = await getRepoInfo()
  updatePackageInfo(targetDir, repoInfo)
  installPkg(targetDir)
}
