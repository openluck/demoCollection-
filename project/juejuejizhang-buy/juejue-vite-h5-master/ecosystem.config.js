/*
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-11-02 10:59:09
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-11-11 13:53:39
 */
module.exports = {
  apps: [
    {
      name: 'juejue-vite-h5',
      script: 'juejue-vite-h5-server.js'
    },
  ],
  deploy: {
    production: {
      user: 'root',
      host: '10.0.12.14',
      ref: 'origin/master',
      repo: 'git@git.zhlh6.cn:Nick930826/juejue-vite-h5.git',
      path: '/workspace/juejue-vite-h5',
      'post-deploy': 'git reset --hard && git checkout master && git pull && npm i --production=false && pm2 startOrReload ecosystem.config.js', // -production=false 下载全量包
      env: {
        NODE_ENV: 'production'
      }
    }
  }
}