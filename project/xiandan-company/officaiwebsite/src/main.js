// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import VueI18n from 'vue-i18n'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import vueTable from 'vue-pagination-table'
import './assets/sass/mall.scss'
import animated from 'animate.css'
import axios from './axios'
import App from './App'

Vue.use(animated);
Vue.use(VueI18n);
Vue.use(ElementUI);
Vue.use(vueTable);

Vue.config.productionTip = false;
Vue.prototype.$http = axios;

const isMobile = () => {
  return navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
}

router.beforeEach((to, from, next) => {
  // document.body.scrollTop = 0;
  // console.log(to.path);
  if (isMobile()) {
    if (!to.path.startsWith('/m')) {
      return  next('/m');
    }
  } else if(to.path.startsWith('/m')) {
    return next('/');
  }

  const { token } = to.query;
  if(global.quiting){
    global.quiting = false;
  }else if (token) {
    global.token = token;
    axios.defaults.headers['X-WX-Skey'] = global.token;
  } else if (global.token) {
    next({name: to.name, query: {token: global.token, ...to.query}, params: {...to.params}});
    return;
  }
  next();
});


const i18n = new VueI18n({
  locale: localStorage.lang ? localStorage.lang : 'zh',
  // locale: 'zh',
  messages: {
    'zh': require('./assets/lang/zh'),
    'en': require('./assets/lang/en')
  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  components: {App},
  template: '<App/>'
})

