/*
 * @Descripttion:
 * @version: v3.10
 * @Author: wentan
 * @Date: 2021-04-01 14:43:56
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-07-05 10:40:47
 */
import Vue from "vue";
import vuex from "vuex";
import VuexPersistence from 'vuex-persist'

import app from "./modules/app.js";
import addRoutes from "./modules/addRoutes";
import codeTable from "./modules/codeTable";
import arrangeOperation from "./modules/arrangeOperation";
import common from "./modules/common";
import smartArrange from "./modules/smartArrange";
import dialog from "./modules/dialog";
import stateList from "./modules/stateList";

Vue.use(vuex);
const store = new vuex.Store({
  modules: {
    app,
    common: common,
    addRoutes: addRoutes,
    codeTable: codeTable,
    arrangeOperation: arrangeOperation,
    smartArrange: smartArrange,
    dialog: dialog,
    stateList: stateList,
  },
  plugins: [
    new VuexPersistence({
      storage: window.sessionStorage,
      reducer: val => ({
        app: val.app,
        stateList: val.stateList,
      })
    }).plugin
  ],
});
export default store;
