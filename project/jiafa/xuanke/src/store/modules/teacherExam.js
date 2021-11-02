export default {
  state: {
    curGradeId: false, // 当前年级id
    pageInfo: {
      pageIndex: 1,
      pageSize: 10
    }, 
  },
  mutations: {
      changeCurGradeId(state, payload) {
        // console.log("payload", payload);
          state.curGradeId = payload
      },
      changePageInfo(state, payload) {
        state.pageInfo = Object.assign(state.pageInfo, payload)
      }
  },
  actions: {
  }
}