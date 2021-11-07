# 使命召唤手游微社区

## Build Setup

__依赖:__

  推荐: node: 12.16.3, 不要低于 12

__分支说明:__

-- master: 生产分支

-- pre-release: 测试分支(预发布分支)

-- internal: 开发测试分支(开发内部测试环境)

-- dev: 本地开发分支(本地测试分支)

__开发说明:__

> feature

- 从 `pre-release` 分支切出一个分支: `feature-[feature-name]-[your-name]`

> hotfix: 从 `master` 分支切出一个分支: `hotfix-[bug-name]-[your-name]`

```bash
# install dependencies

$ yarn install 安装依赖

> 注意: 安装依赖如果遇到 @tencent 的包无法安装的报错, 那么将根目录下的  `@tencent.zip` 包解压到 `node_modules/@tencent/` 下, 如果遇到还遇到 @tencent 的包装不上, 可以删除 `package.json` 中的 `@tencent` 开头的包名, 然后再执行 `yarn install`, 安装完成之后, 将 `package.json` 中 `@tencent` 开头的包补全, 再 `@tencent.zip` 包解压到 `node_modules/@tencent/`

# 开发环境初始化
$ yarn dev
```

## commit 规范

- 不管是哪一个部分，任何一行都不得超过 72 个字符（或 100 个字符）

```txt
<type>(<scope>): <subject>
// 空一行
<body>
// 空一行
<footer>
```

### Header

- 1. type:
  - feat：新功能（feature）
  - fix：修补 bug
  - docs：文档（documentation）
  - style： 格式（不影响代码运行的变动）
  - refactor：重构（即不是新增功能，也不是修改 bug 的代码变动）
  - test：增加测试
  - chore：构建过程或辅助工具的变动
  - wip: 开发正在进行中，临时提交
  - static: 重构同学的静态页面

> 注意： type 为 feat 和 fix，则该 commit 将肯定出现在 Change log 之中， 其他的情况不会放在 Change log 中。

- 2. scope

  - scope 用于说明 commit 影响的范围，比如数据层、控制层、视图层等等，视项目不同而不同
  - 如： hotfix: 热修复

- 3. subject
  - subject 是 commit 目的的简短描述，不超过 50 个字符。

### Body

- Body 部分是对本次 commit 的详细描述，可以分成多行

### Revert 是固定写法

- 当前 commit 用于撤销以前的 commit，则必须以 revert:开头，后面跟着被撤销 Commit 的 Header

## 项目目录说明 src 下

```txt
  -- main.ts 项目主入口
  -- config.ts 项目配置常量

- ├── assets // 静态资源
      -- lib
      -- css
      -- font
- ├── components // 公共的组件
- ├── helpers // 基础模块
- ├── layouts // 页面整体布局
- ├── views  // 页面
- ├── services // api 定义
- ├── store // vuex store
      -- index store 的入口文件
      |-- modules
        - -- app.ts 全局
          -- home.ts 首页
          -- walkthrough.ts 攻略
          -- found.ts 发现
          -- central.ts 我的(个人中心)
  |-- routes
      -- home.ts 首页相关,一级,二级...路由配置
      -- walkthrough.ts 攻略,一级,二级...路由配置
      -- found.ts 发现, 一级,二级...路由配置
      -- central.ts 我的(个人中心), 一级,二级...路由配置
  |-- mixins
  |-- styles
- ├── typings  // 项目中自定义类型定义
- └── vueUtils // vue 指令, 过滤器等
```

## 项目中功能模块说明: CODM 项目, 同时定义命名

> 注意: `|--` 表示导航页面 `--` 表示页面内部的 tab

```text
|-- 首页(home)

|-- 攻略(文章，视频)(walkthrough)

  |-- 视频攻略(video)
      -- 全部
      -- 枪械打法
      -- 地图攻略
      -- 排位进阶
      -- 其他攻略
      |-- 图文攻略详情页(detail)

  |-- 图文攻略(article)
      -- 全部
      -- 枪械打法
      -- 地图攻略
      -- 排位进阶
      -- 其他攻略
      |-- 图文攻略详情页(detail)

  |-- 枪械库(weapon)
      -- 武器
      -- 配件
      -- 物资
      -- 载具
      |-- 武器详情页(detail)

|-- 发现(found)
  |-- 动态广场(dynamic)
  |-- 福利站(welfare)
  |-- 活动日历(activity)

|-- 我的(个人中心)(central)
  |-- 我的数据(data)
  |-- 我的动态(dynamic)
  |-- 消息互动(message)
```

## 重构同学开发规范

> less 开发规范

  1. 将按页面内按页面路由或者是页面导航分割模块。每个模块使用单独的文件，避免文件过大
  2. 使用 less import 进行模块导入
  3. 多使用 less 变量
  4. 添加命名空间，每一个模块要注意命名空间，避免样式冲突
  5. style 中 background url 资源可以使用 “~@” 开头的绝对路径

> html 开发规范

  1. 检查标签闭合情况。
  2. 尽量减少 dom 的层级
  3. 非链接的按钮禁止使用 a 标签，可以使用 button，span， 或其他的标签代替等标签
  4. 表格类的显示尽量不要使用 table 布局，推荐使用 ul 和 li 进行布局
  5. 尽量不要使用 &nbsp 等特殊字符
  6. 注意标签对齐和换行，单行字符 80 内
  7. 禁止使用表格做列表
  8. vue template 中 img src 资源可以使用 “@” 开头的绝对路径
