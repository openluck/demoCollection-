
import Vue from 'vue';
import axios from 'axios';
import { Toast } from 'vant';
import { getMetaStr } from '../common/js/tools';

const errMessage = new Map([
  [400, '请求错误(400)'],
  [401, '未授权，请重新登录(401)'],
  [403, '拒绝访问(403)'],
  [404, '请求出错(404)'],
  [408, '请求超时(408)'],
  [500, '服务器错误(500)'],
  [501, '服务未实现(501)'],
  [502, '网络错误(502)'],
  [503, '服务不可用(503)'],
  [504, '网络超时(504)'],
  [505, 'HTTP版本不受支持(505)'],
]);

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
axios.defaults.baseURL = 'http://test.xiandanmall.com';
axios.interceptors.response.use((response) => response, (err) => {
  const e = err;
  if (err && err.response) {
    if (errMessage.has(err.response.status)) {
      e.message = errMessage.get(err.response.status);
    } else {
      e.message = `连接出错(${err.response.status})!`;
    }
  } else {
    e.message = '连接服务器失败!';
  }
  Toast.clear();
  return Promise.reject(e);
});

const clientMode = getMetaStr('client-mode');
if (clientMode === 'standalone') { // 独立模式，前后端开发
  axios.defaults.withCredentials = true;
} else {
  axios.defaults.headers.common['X-CSRF-TOKEN'] = getMetaStr('csrf-token');
}

Vue.prototype.$http = axios;

export default axios;
