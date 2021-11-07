
import Vue from 'vue';
import adapter from 'axios-miniprogram-adapter';
import { login } from '@/common/js/tools';
import { Toast, Dialog } from 'vant-kbone';
import router from './router/index.mp';
import App from './App';
import store from './store';
import axios from './axios';
// import 'babel-polyfill' //IE兼容暂不要，太大了
import '@/common/js/filters';
import '@/sass/iconfont.css';
import './sass/mall.scss';
// import 'mint-ui/lib/style.css';

require('promise.prototype.finally').shim();

// 全局注册
Vue.use(Toast).use(Dialog);

export default async function createApp() {
  axios.defaults.adapter = adapter;
  router.beforeEach((to, from, next) => {
    // document.body.scrollTop = 0;
    const { inviter } = to.query;
    if (inviter) {
      store.commit('updateInviter', inviter);
    }
    Toast.clear();
    Dialog.close();
    if (!store.getters.isLogin) {
      const arr = ['index', 'countries', 'cart', 'usercenter', 'topic', 'search', 'commodity', 'login'];
      if (to.name != null
                && arr.indexOf(to.name) === -1) {
        login(router);
        return;
      }
    }
    next();
  });

  const container = document.createElement('div');
  container.id = 'app';
  document.body.appendChild(container);

  // rem 和页面样式修改
  window.onload = function () {
    document.documentElement.style.fontSize = `${wx.getSystemInfoSync().screenWidth / 16}px`;
    document.documentElement.style.backgroundColor = '#fffbe7';
  };
  window.onerror = (message, source, lineno, colno, error) => {
    console.log('window.onerror => ', message, source, lineno, colno, error);
  };
  window.addEventListener('error', (evt) => console.log('window.addEventListener(\'error\') =>', evt));

  try {
    const response = await axios.get('/api/userinfo', { params: { t: new Date().getTime() } });
    store.commit('initUser', response.data);
  } catch (e) {
    console.log(e);
  }

  // window.$$extend('element', {
  //     getBoundingClientRect() {
  //         return this.getBoundingClientRectAsync();
  //     },
  //     async getBoundingClientRectAsync() {
  //         let rect = await this.$$getBoundingClientRect()
  //         console.log(rect);
  //         return { x: rect.left, y: rect.top, width: rect.width, height: rect.height }
  //     }
  // })

  return new Vue({
    el: '#app',
    router,
    store,
    render: (h) => h(App),
  });
}
