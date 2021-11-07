import axios from "axios";
import config from "./config";
// import Cookies from "js-cookie";
import router from "@/router";

// // 正在进行中的请求列表
// let reqList = []

// /**
//  * 阻止重复请求
//  * @param {array} reqList - 请求缓存列表
//  * @param {string} url - 当前请求地址
//  * @param {function} cancel - 请求中断函数
//  * @param {string} errorMessage - 请求中断时需要显示的错误信息
//  */
// const stopRepeatRequest = function (reqList, url, cancel, errorMessage) {
//   const errorMsg = errorMessage || ''
//   for (let i = 0; i < reqList.length; i++) {
//     if (reqList[i] === url) {
//       cancel(errorMsg)
//       return
//     }
//   }
//   reqList.push(url)
// }

// /**
//  * 允许某个请求可以继续进行
//  * @param {array} reqList 全部请求列表
//  * @param {string} url 请求地址
//  */
// const allowRequest = function (reqList, url) {
//   for (let i = 0; i < reqList.length; i++) {
//     if (reqList[i] === url) {
//       reqList.splice(i, 1)
//       break
//     }
//   }
// }

// 使用vuex做全局loading时使用
// import store from '@/store'
export default function $axios(options) {
  return new Promise((resolve, reject) => {
    const instance = axios.create({
      // baseURL:
      //   options.url === "/public/getMenuList" &&
      //   process.env.NODE_ENV === "development"
      //     ? "http://110.185.174.59:3000/mock/487"
      //     : config.baseUrl,
      baseURL: config.baseUrl,
      headers: config.headers,
      timeout: config.timeout,
      withCredentials: config.withCredentials
    });
    // request 拦截器
    instance.interceptors.request.use(
      (config) => {
        // let cancel
        // // 设置cancelToken对象
        // config.cancelToken = new axios.CancelToken(function(c) {
        //   cancel = c
        // })
        // // 阻止重复请求。当上个请求未完成时，相同的请求不会进行
        // stopRepeatRequest(reqList, config.url, cancel, `${config.url} 请求被中断`)

        const token = sessionStorage.getItem("token");
        config.headers.token = token;
        const orgCode = sessionStorage.getItem("orgCode");
        config.headers.orgCode = orgCode;
        return config;
      },

      (error) => {
        // 请求错误时
        console.log("request:", error);
        // 1. 判断请求超时
        if (error.message.indexOf("timeout") !== -1) {
          console.log("timeout请求超时");
        }
        // 2. 需要重定向到错误页面
        const errorInfo = error.response;
        console.log(errorInfo);
        if (errorInfo) {
          error = errorInfo.data; // 页面那边catch的时候就能拿到详细的错误信息,看最下边的Promise.reject
          // const errorStatus = errorInfo.status; // 404 403 500 ...
          router.push({
            name: "404"
          });
        }
        return Promise.reject(error); // 在调用的那边可以拿到(catch)你想返回的错误信息
      }
    );
    // response 拦截器
    instance.interceptors.response.use(
      (response) => {
        // setTimeout(() => {
        //   allowRequest(reqList, response.config.url)
        // }, 1000)
        let data;
        // IE9时response.data是undefined，因此需要使用response.request.responseText(Stringify后的字符串)
        if (response.data === undefined) {
          data = JSON.parse(response.request.responseText);
        } else {
          if (options.responseType === "blob") {
            data = {
              blob: response.data,
              headers: response.headers
            };
          } else {
            data = response.data;
          }
        }

        // 根据返回的code值来做不同的处理
        switch (data.rc) {
          case 1:
            console.log(data.desc);
            break;
          case 0:
            // store.commit('changeState')
            // console.log('登录成功')
            break;
          default:
        }
        // 若不是正确的返回code，且已经登录，就抛出错误
        // const err = new Error(data.desc)
        // err.data = data
        // err.response = response
        // throw err

        return data;
      },
      (err) => {
        // if (axios.isCancel(err)) {
        //   // console.log(err.message);
        // } else {
        //   // 增加延迟，相同请求不得在短时间内重复发送
        //   setTimeout(() => {
        //     allowRequest(reqList, err.config.url)
        //   }, 1000)
        // }

        if (err && err.response) {
          switch (err.response.status) {
            case 400:
              err.message = "请求错误";
              break;
            case 401:
              err.message = "未授权，请登录";
              break;
            case 403:
              err.message = "拒绝访问";
              break;
            case 404:
              err.message = `请求地址出错: ${err.response.config.url}`;
              break;
            case 408:
              err.message = "请求超时";
              break;
            case 500:
              err.message = "服务器内部错误";
              break;
            case 501:
              err.message = "服务未实现";
              break;
            case 502:
              err.message = "网关错误";
              break;
            case 503:
              err.message = "服务不可用";
              break;
            case 504:
              err.message = "网关超时";
              break;
            case 505:
              err.message = "HTTP版本不受支持";
              break;
            default:
          }
        }
        console.error(err);
        return Promise.reject(err); // 返回接口返回的错误信息
      }
    );

    // 请求处理
    // instance(options).then(res => {
    instance({
      ...options,
      data: {
        ...config.data,
        data: options.data
      }
    })
      .then((res) => {
        resolve(res);
        return false;
      })
      .catch((error) => {
        reject(error);
      });
  });
}
