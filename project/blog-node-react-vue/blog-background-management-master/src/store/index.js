import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import articleClassify from './modules/articleClassify'
import tag from './modules/tag'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    articleClassify,
    tag
  },
  getters
})

export default store
