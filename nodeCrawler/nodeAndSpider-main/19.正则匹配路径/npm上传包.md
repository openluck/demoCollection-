# NPM上传包

**1.创建文件夹**

**2.npm包的初始化**

```go
npm init
```

**3.npm包信息的配置**

```go
{
  "name": "zw_use_node",
  "version": "1.0.0",
  "description": "自己封装的node框架，带正则路径匹配渲染功能",
  "main": "index.js",
  "scripts": {
    "test": "none"
  },
  "repository": {
    "type": "git",
    "url": "none"
  },
  "keywords": [
    "node"
  ],
  "author": "theverwang",
  "license": "ISC"
}

```

**4.注册NPM官网账号**

**5.NPM官网账号需要邮箱验证**

**6.本机登录NPM**

```go
npm login
```

**7.发布NPM包**

```go
npm publish
```