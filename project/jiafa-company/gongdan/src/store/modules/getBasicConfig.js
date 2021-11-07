/**
 * @description 获取基础配置
 * @returns {pdfBaseUrl,signBaseUrl} PDF基础路径,签名基础路径
 */

import {getBasicConfig} from '../../http/modules/init'

const basicConfig = {
  state: {
      options: []
  },
  mutations: {

  },
  actions: {
    fetchBasicConfig() {
          return new Promise((resolve, reject) => {
            getBasicConfig({}).then(res => {
                  if (res.code === "200") {
                    resolve(res.data)
              } else {
                      reject(res.message)
                  }
              })
          })
      }
  }
}
export default basicConfig