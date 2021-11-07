import Vue from 'vue';
import { Lazyload, Dialog, Toast } from 'vant';
import router from './router';
import App from './App';
import store from './store';
import axios from './axios';

// import 'babel-polyfill' //IE兼容暂不要，太大了
import '@/common/js/filters';
import '@/sass/iconfont.css';
import '@/sass/mall.scss';
import { login } from '@/common/js/tools';

require('promise.prototype.finally').shim();
// 全局注册
Vue.use(Lazyload).use(Toast);

// wx.login = function (loginOption) {
//     wx.loginOption = loginOption;
//     location.href
// }

Vue.config.productionTip = false;
Vue.config.devtools = true;

axios.get('/api/userinfo', { params: { t: new Date().getTime() } })
  .then((response) => {
    store.commit('initUser', response.data.data);
  }).catch((error) => {
    console.log(error.message);
  }).finally(() => {
    const vm = new Vue({
      el: '#app',
      router,
      store,
      components: { App },
      template: '<App/>',
    });
    Vue.use({ vm });
  });
router.beforeEach((to, from, next) => {
  // document.body.scrollTop = 0;
  const { inviter } = to.query;
  if (inviter) {
    global.inviter = inviter;
  } else if (global.inviter) {
    next({ name: to.name, query: { inviter: global.inviter, ...to.query }, params: { ...to.params } });
    return;
  }
  Toast.clear();
  Dialog.close();
  if (!store.getters.isLogin) {
    const arr = ['index', 'countries', 'cart', 'usercenter', 'topic', 'search', 'commodity', 'login', 'plate', 'anniversary', 'invited', 'rule'];
    if (arr.indexOf(to.name) === -1
            || to.path.match(/^\/user\//)) {
      login(router);
      return;
    }
  }
  next();
});
