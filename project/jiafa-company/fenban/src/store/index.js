/*
 * @Descripttion:
 * @version: v3.10
 * @Author: wentan
 * @Date: 2021-04-01 14:43:56
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-09-10 10:14:50
 */
import Vue from 'vue'
import vuex from 'vuex'

import app from './modules/app.js'
import addRoutes from './modules/addRoutes'
import codeTable from './modules/codeTable'
import adminClass from './modules/adminClass'
import adminClassCy from './modules/adminClassCy'
import createPersistedState from 'vuex-persistedstate'
Vue.use(vuex)
const store = new vuex.Store({
  modules: {
    app: app,
    addRoutes: addRoutes,
    codeTable: codeTable,
    adminClass: adminClass,
    adminClassCy: adminClassCy,
  },
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
      //加入要持久化的vuex模块
      reducer(val) {
        return {
          app: val.app,
          codeTable: val.codeTable,
          adminClass: val.adminClass,
        }
      },
    }),
  ],
})
export default store
