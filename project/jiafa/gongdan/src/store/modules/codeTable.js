import { queryCodeTable } from '../../http/modules/init'
const codeTable = {
    namespaced: true,
    state: {
        options: [],
        returnCode: [],
        auditType: []
    },
    mutations: {
        setReturnCodeList(state, returnCode) {
            state.returnCode = returnCode
        },
        setAuditTypeList(state, auditType) {
            state.auditType = auditType
        }
    },
    actions: {
        queryCodeTable(context, type) {
            return new Promise((resolve, reject) => {
                queryCodeTable(type).then(res => {
                    if (res.code === "200") {
                        if (res.data.length || Object.keys(res.data).length) {

                            if (type.type === "gdtulx") {
                                context.commit('setReturnCodeList', res.data.list)
                            } else {
                                context.commit('setAuditTypeList', res.data.list)
                            }

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