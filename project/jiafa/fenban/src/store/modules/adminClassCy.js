/*
 * @Descripttion: 非持久化状态管理
 * @version: v1.0
 * @Author: xutao
 * @Date: 2021-04-25 14:20:23
 * @LastEditors: xutao
 * @LastEditTime: 2021-04-30 16:22:58
 */
export default {
  namespaced: true,
  state: {
    stuSelectInMergeList: [], //合并班级中-合并 已选择人员前端缓存数据
  },
  getters: {},
  mutations: {
    // 合并 已选择人员前端缓存数据
    setStuSelectInMergeList(state, payload) {
      if (
        state.stuSelectInMergeList.length &&
        state.stuSelectInMergeList.find(
          (item) => item.combinationId === payload.combinationId
        )
      ) {
        state.stuSelectInMergeList.map((item) => {
          if (item.combinationId === payload.combinationId) {
            item.list = [...payload.list]
          }
        })
      } else {
        state.stuSelectInMergeList.push(payload)
      }
    },
    clearStuSelectInMergeList(state, payload) {
      state.stuSelectInMergeList = payload
    },
  },
  actions: {},
}
