# 更新日志：

**此项目的所有更改都将记录在此文件中**
# 


**Version : V0.4.7**

**Last Modify : 2019-11-18**

### 变动：

* 依赖项升级
* 默认增加了prop-types的依赖项
* 移除部分无用代码
* 修复通用方法getQueryString()方法取不到url中第一个参数的bug
* 计划--增加判断当前是否是开发环境的判断
* 计划--增加针对sessionStrong的取值封装方法

#

**Version : V0.4.6**

**Last Modify : 2019-11-06**

### 变动：

* 修复SVG公共组件的title显示异常的bug
* 尝试修复请求方法request中错误回调异常的问题

#


**Version : V0.4.5**

**Last Modify : 2019-10-21**

### 变动：

* 依赖项升级
* 修改BrowserRouter为HashRouter，从而支持前端的二级路由
* 修改部分文字说明

### 近期计划：

* 尝试用其他方法解决webpack-dev-server代码热更不生效的问题
* 尝试用hooks写法替代底层框架逻辑


#




**Version : V0.4.4**

**Last Modify : 2019-10-09**

### 变动：

* 依赖项升级
* 尝试修复修改代码后，浏览器不能热更新的bug


#




**Version : V0.4.3**

**Last Modify : 2019-09-26**

### 变动：

* 在React的class语法中，增加对箭头函数的支持（不推荐在class里使用箭头函数）
* 依赖包：antd的版本升级 v3.23.3 => v3.23.4
* 新增依赖包express，用来支持打包后，使用`npm run builddev`命令来预览打包文件。


#


**Version : V0.4.2**

**Last Modify : 2019-09-18**

### 变动：

* 移除工具包中，`formatDate()` 函数,如项目中有日期格式化需求，可采用`moment`依赖


#

**Version : V0.4.1**

**Last Modify : 2019-09-17**

### 变动：
* 依赖包：node-cross-spawn v6.05 => v7.0.0 (不再支持node8以下的版本)
* 依赖包：antd的版本升级 v3.23.2 => v3.23.3
* 依赖包：sass-loader v7.3.1 => v8.0.0 

### bug修复：
* 修复redux-thunk的未提交的bug
* 修复生产模式下的打包路径修复
* 修复生产模式下的反调试bug

