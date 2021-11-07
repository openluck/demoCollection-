import axios from 'axios';

axios.defaults.timeout = 5000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

// 默认请求地址
// axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.baseURL = 'http://test.xiandanmall.com';
// http request 拦截器
axios.interceptors.response.use((response) => response, (err) => {
    console.log(err);
});

axios.defaults.withCredentials = true;

export default axios;