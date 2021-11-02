/*
 * @Descripttion:
 * @version:
 * @Author: YanQY
 * @Date: 2021-08-02 15:27:47
 * @LastEditors: ylc
 * @LastEditTime: 2021-09-09 14:14:06
 */
import Vue from "vue";
import vuex from "vuex";

import app from "./modules/app.js";
import addRoutes from "./modules/addRoutes";
import codeTable from "./modules/codeTable";
import timetableAdjust from "./modules/timetableAdjust";
import stuTimeTable from "./modules/stuTimeTable";
import replaceLes from "./modules/replaceLes";
import lesSort from "./modules/lesSort";
import stuCgLes from "./modules/stuCgLes";
// import spelledAdjustment from "./modules/spelledAdjustment";
import placeAdjust from "./modules/placeAdjust";
import deleteCouese from "./modules/deleteCouese";
import timetableQuery from "./modules/timetableQuery"
import createPersistedState from "vuex-persistedstate";
Vue.use(vuex);
const store = new vuex.Store({
  modules: {
    app: app,
    addRoutes: addRoutes,
    codeTable: codeTable,
    timetableAdjust: timetableAdjust,
    stuTimeTable: stuTimeTable,
    replaceLes: replaceLes,
    lesSort: lesSort,
    stuCgLes: stuCgLes,
    placeAdjust: placeAdjust,
    deleteCouese: deleteCouese,
    timetableQuery: timetableQuery
    // spelledAdjustment: spelledAdjustment,
  },
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
      //加入要持久化的vuex模块
      reducer(val) {
        return {
          app: val.app,
          timetableAdjust: val.timetableAdjust,
          replaceLes: val.replaceLes,
          treeData: val.treeData,
          lesSort: val.lesSort,
          stuCgLes: val.stuCgLes,
          placeAdjust: val.placeAdjust,
          deleteCouese: val.deleteCouese,
          timetableQuery: val.timetableQuery
        };
      }
    })
  ]
});
export default store;
