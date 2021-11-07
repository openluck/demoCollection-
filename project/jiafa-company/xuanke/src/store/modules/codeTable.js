import { queryCodeTable } from '../../http/modules/init'
const codeTable = {
    state: {
        options: []
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