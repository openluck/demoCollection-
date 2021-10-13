/*
 * @Descripttion:
 * @version:
 * @Author: OpenLcuk
 * @Date: 2021-10-13 16:28:17
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-10-13 17:12:46
 */
/* eslint-disable */
// 导入 axios
import axios from "axios";
// 导入请求配置
import config from "./config";

// 导出$axios 函数
export default function $axios(options) {
  // 返回一个promise
  return new Promise((resolve, reject) => {
    const instance = axios.create({
      baseURL: config.baseUrl,
      headers: config.headers,
      timeout: config.timeout,
      withCredentials: config.withCredentials,
    });
    // request 请求拦截器
    instance.interceptors.request.use(() => {});

    // response 响应拦截器
    instance.interceptors.request.use(() => {});
  });
}
