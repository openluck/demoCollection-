# smart-city-template

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Run your unit tests
```
npm run test:unit
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


### 路由配置 
  ```
config/global.config.js文件中修改asyncRouter（true:异步路由，false:静态路由）
异步路由：BasicLayout.vue中请求回来的路由传入this.$store.dispatch("add_Routes", JSON.parse(res.data.data.menuList)
静态路由：/router/static.router中配置静态路由

  ```