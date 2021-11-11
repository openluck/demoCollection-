/*
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-11-02 10:59:09
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-11-11 13:57:57
 */
/*
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-11-02 10:59:09
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-11-03 15:41:07
 */
import axios from 'axios'
import { Toast } from 'zarm'

const MODE = import.meta.env.MODE // 环境变量

// axios.defaults.baseURL = MODE == 'development' ? 'http://47.99.134.126:7009' : 'http://47.99.134.126:7009'
axios.defaults.baseURL = MODE == 'development' ? 'http://127.0.0.1:7009' : 'http://10.0.12.14:7009'
axios.defaults.withCredentials = true
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers['Authorization'] = `${localStorage.getItem('token') || null}`
axios.defaults.headers.post['Content-Type'] = 'application/json'

axios.interceptors.response.use(res => {
  if (typeof res.data !== 'object') {
    Toast.show('服务端异常！')
    return Promise.reject(res)
  }
  if (res.data.code != 200) {
    if (res.data.msg) Toast.show(res.data.msg)
    if (res.data.code == 401) {  // 所有接口返回为401的 都是 没有登录，或者token过期
      window.location.href = '/login'
    }
    if (res.data.code == 413) {
      Toast.show('图片不得超过 50kb')
    }
    return Promise.reject(res.data)
  }

  return res.data
})

export default axios
