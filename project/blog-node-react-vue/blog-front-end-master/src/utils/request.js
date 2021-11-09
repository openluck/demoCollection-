import axios from 'axios'
import { getToken, removeToken } from '../utils/auth'
import { message } from 'antd';
axios.defaults.baseURL = 'http://localhost:3001';//接口请求地址
axios.defaults.timeout = 10000;
axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'; //post请求头
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'; //默认异步请求
//请求拦截器
axios.interceptors.request.use(
    request => {
        //if (sessionStorage.sign) {
        request.headers.Authorization = getToken(); //sign判断，没有的可以不加。
        return request;
    },
    error => {
        return Promise.reject(error);
    }
)
//响应拦截器
axios.interceptors.response.use(
    response => {
        if (response.status == 200) {
            const code = response.data.code;
            const msg = response.data.msg;
            if (code == 200) { //条件判断，自行和后端商量定义
                console.log(code)
                return Promise.resolve(response.data);
            } else if (code == 401 || code == 402 || code== 403) {
                //自定义处理
                removeToken()
                if (code == 402) {
                    message.info('请重新登录')
                } else {
                    message.info('请登录')
                }
                return Promise.reject(response.data);
            } else {
                //错误处理
                message.error(msg)
                return Promise.reject(response.data);
            }
        } else {
            return Promise.reject(response.data);
        }
    },
    error => {
        if (!error.response) {
            //Message.error({
            // message: '后端接口响应失败，请刷新浏览器重试。'
            // });
            return Promise.reject(error)
        } else {
            //跳转错误页面
        }
    }
)
export default axios