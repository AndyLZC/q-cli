## TypeScript 脚手架工具 sug-cli

拉取 vite + vue3 + pinia + vue-router 模板的脚手架工具

## 使用

### npx

```shell
$ npx @andylzc/sug-cli create <new app>
```

### 全局安装

```shell
$ npm i @andylzc/sug-cli -g
```

```shell
$ sug-cli create <new app>
```

## 本地开发调试

```shell
$ cd sug-cli && npm link
$ cd ..
$ sug-cli create <new app>
```

## 从零开始开发一个脚手架

### 1、为什么需要脚手架

日常开发中，我们根据经验沉淀出一些项目模板，在不同项目中可以进行复用。但如果每次都是通过拷贝代码到新项目，操作效率低下而且容易出错。如果能把模板集成到脚手架，直接通过命令行创建项目，这样便能极大加快项目初始化。

### 2、开发脚手架需要准备的第三方库

- commander 命令行工具，帮助解析用户输入的命令

* inquirer 交互式命令行工具，根据用户动作进行下一步操作
* ora 显示 loading 动画
* chalk 美化控制台输出内容样式
* download-git-repo 用来下载远程仓库模板
* fs-extra fs 升级版，提供更便利的 API 和编码方式

#### 2.1 commander

```js
program
  .command('print <something>')
  .description('输入一些什么')
  .option('-t', --tip <tip>, '输入提示', '默认值')
  .action((something, cmd)=> {
    console.log(something, cmd)
  })
```

代码定义了一条交互命令，用户执行 `print` 命令, 并输入内容，命令面板就会打印用户的消息

```shell
    print hello   // 输出：  hello { tip: '默认值' }
    print hello -t world // 输出: hello { tip: 'world' }
```

`command` 和 `option` 分别代表执行的命令和命令后面可选参数

#### 2.2 inquirer

等待用户选择操作或者输入内容来决定后续逻辑

```js
const choseQuestion = async () => {
  const { question } = await prompt([
    {
      name: 'question',
      type: 'list',
      message: '你要选哪个框架？',
      choices: ['vue', 'react', 'svelte', 'solid'],
    },
  ])
  console.log(`您的选择是：${question}`)
}
```

## 3、实现步骤

3.3 根目录下新建一个 `bin` 文件夹，然后再创建两个脚本文件，区分开发环境和生产环境要执行

```shell
// sug-cli-dev.js

#!/usr/bin/env node
console.log('hello world')
```

其中文件头部的 `#!/usr/bin/env node`不可缺少，它代表的含义是执行这个脚本的时候，调用 `/usr/bin/env` 路径下的 `node` 解释器

执行 `ndoe ./bin/sug-cli-dev` , 控制台就会打印出 hello world, 但每次都要输入这个命令有些麻烦，可以在 package.json 进行配置

```json
 // package.json
 "bin": {
    "sug-cli-dev": "./bin/sug-cli-dev.js",
    "sug-cli": "./bin/sug-cli.js",
 }
```

然后执行 `npm link ` 软链接到全局环境里， 之后就可以直接使用命令 `sug-cli create <pkg-name>`
