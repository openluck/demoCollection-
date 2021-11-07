const stuTimeTable = {
  namespaced: true,
  state: {
    adjustRecord: [],
    selectedNum: 0,
    selectedCourseId: '',
    timetableList: []
  },
  mutations: {
    setAdjustRecord(state, adjustRecord) {
      state.adjustRecord.unshift(adjustRecord)
    },
    setSelectedNum(state, selectedNum) {
      state.selectedNum = selectedNum
    },
    setSelectedCourseId(state, selectedCourseId) {
      state.selectedCourseId = selectedCourseId
    },
    setTimetableList(state, timetableList) {
      state.timetableList = timetableList
    }
  },
  actions: {

  }
}
export default stuTimeTable