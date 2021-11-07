import Vue from 'vue';
import App from '@layouts/App.vue';
import router from './routes';
import store from './store';
import SlugUi from '@tencent/slug-ui';
import MultiReport from '@tencent/multi-report/Platform/Vue';
import Waterfall from '@assets/libs/waterfall';
// import { Skeleton } from '@tencent/slug-skeleton';

import './styles/reset.less';
import './styles/webp.less';
import './styles/global.less';

Vue.use(Waterfall as any);

// Vue.directive('Skeleton', Skeleton);

const { install, registerRouter } = MultiReport as any;
// note: drm vue install 必须在 registerRouter router 之前
Vue.use(install, (window as any).reportConfig || {});

// note: drm 上报;
const { mosso, dmpt } = registerRouter(router) as any;

// Vue.prototype.$mta = mta;
Vue.prototype.$mosso = mosso;
Vue.prototype.$dmpt = dmpt;
Vue.config.productionTip = false;

Vue.use(SlugUi as any);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
