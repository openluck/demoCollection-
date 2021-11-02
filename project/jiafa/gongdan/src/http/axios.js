import axios from 'axios';
import config from './config';
import {
  Notification
} from "ant-design-vue";
import router from '@/router'

// 使用vuex做全局loading时使用
// import store from '@/store'
export default function $axios(options) {
  return new Promise((resolve, reject) => {
    const instance = axios.create({
      baseURL: config.baseUrl,
      headers: config.headers,
      timeout: config.timeout,
      withCredentials: config.withCredentials
    })
    // request 拦截器
    instance.interceptors.request.use(
      config => {
        const token = sessionStorage.getItem('sjgdxgxt_token');
        config.headers.token = token

        // config.data.examId=examId
        return config
      },

      error => {
        // 请求错误时
        // 1. 判断请求超时
        if (error.message.indexOf('timeout') !== -1) {
          console.log('timeout请求超时')
        }
        // 2. 需要重定向到错误页面
        const errorInfo = error.response
        if (errorInfo) {
          error = errorInfo.data // 页面那边catch的时候就能拿到详细的错误信息,看最下边的Promise.reject
          // const errorStatus = errorInfo.status; // 404 403 500 ...
          router.push({
            name: "404"
          })
        }
        return Promise.reject(error) // 在调用的那边可以拿到(catch)你想返回的错误信息
      }
    )
    // response 拦截器
    instance.interceptors.response.use(
      response => {
        let data;
        // IE9时response.data是undefined，因此需要使用response.request.responseText(Stringify后的字符串)
        if (response.data === undefined) {
          data = JSON.parse(response.request.responseText)
        } else {
          if (options.responseType === 'blob') {
            data = {
              blob: response.data,
              headers: response.headers
            }
          } else {
            data = response.data
          }
          // data = response.data
        }

        // 根据返回的code值来做不同的处理
        switch (data.message) {
          case 'token无效':
            Notification['error']({
              message: 'token过期',
              description: '数据获取失败，请退出系统重新登录!',
              duration: 0,
            });
            break;
          case 0:
            break;
          default:
        }
        // 若不是正确的返回code，且已经登录，就抛出错误
        // const err = new Error(data.desc)
        // err.data = data
        // err.response = response
        // throw err
        return data
      },
      err => {
        if (err && err.response) {
          switch (err.response.status) {
            case 400:
              err.message = '请求错误'
              break
            case 401:
              err.message = '未授权，请登录'
              break
            case 403:
              err.message = '拒绝访问'
              break
            case 404:
              err.message = `请求地址出错: ${err.response.config.url}`
              break
            case 408:
              err.message = '请求超时'
              break
            case 500:
              err.message = '服务器内部错误'
              break
            case 501:
              err.message = '服务未实现'
              break
            case 502:
              err.message = '网关错误'
              break
            case 503:
              err.message = '服务不可用'
              break
            case 504:
              err.message = '网关超时'
              break
            case 505:
              err.message = 'HTTP版本不受支持'
              break
            default:
          }
        }
        console.error(err)
        return Promise.reject(err) // 返回接口返回的错误信息
      }
    )

    // 请求处理
    // instance(options).then(res => {
    instance({
      ...options,
      data: {
        ...config.data,
        data: {
          exId: sessionStorage.getItem("exId"),
          orgId: sessionStorage.getItem("orgId"),
          ...options.data
        }
        //data: options.data
      }
    }).then(res => {
      resolve(res)
      return false
    }).catch(error => {
      reject(error)
    })
  })
}