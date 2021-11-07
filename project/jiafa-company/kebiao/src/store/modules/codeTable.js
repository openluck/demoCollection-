/*
 * @Descripttion: 
 * @version: 
 * @Author: YanQY
 * @Date: 2021-08-02 15:27:47
 * @LastEditors: YanQY
 * @LastEditTime: 2021-08-09 18:08:12
 */
import { queryCodeTable } from '../../http/modules/init'
const codeTable = {
    state: {
        options: [],
        lesSortTypeList:[
            {label:"非授课",value:"0"},
            {label:"授课",value:"1"}
        ],
        lesTypeList:[
            {label:"非自习",value:"0"},
            {label:"自习",value:"1"}
        ],
        showTypeList:[
            {label:"通栏",value:"1"},
            {label:"七列",value:"2"}
        ]
    },
    mutations: {

    },
    actions: {
        queryCodeTable(context, type) {
            return new Promise((resolve, reject) => {
                queryCodeTable({ type }).then(res => {
                    if (res.code === "200" && res.result) {
                        if (res.data.length || Object.keys(res.data).length) {
                            resolve(res.data)
                        }
                } else {
                        reject(res.message)
                    }
                })
            })
        }
    }
}
export default codeTable