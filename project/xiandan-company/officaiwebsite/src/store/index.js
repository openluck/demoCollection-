import Vue from 'vue';
import Vuex from 'vuex';
import VueCookie from 'vue-cookie';

Vue.use(Vuex);
Vue.use(VueCookie);

export default new Vuex.Store({
  state: {
    token: ''
  },
  mutations: {
    set_token(state, token){
      state.token = token;
      localStorageStorage.token = token;
    },
    del_token(state) {
      state.token = '';
      localStorageStorage.removeItem('token');
    }
  }

})
