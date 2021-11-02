/*
 * @Desc:
 * @Version: v1.00
 * @Author: went
 * @Date: 2021-08-02 15:28:59
 * @LastEditors: went
 * @LastEditTime: 2021-08-25 10:58:53
 */
// 代课调整
const timetableAdjust = {
  namespaced: true,
  state: {
    curTeachWeek: {
      teachWeekId: "",
      teachWeekName: "",
    },
    //代课
    reLesSecList: [],
    reLesSubjectList: [],
    reLesTeacherList: [],
    reLesInitSecId: "",
    reLesInitSubjectId: "",
    reLesInitTeacherId: "",
  },
  mutations: {
    setCurTeachWeek(state, curTeachWeek) {
      state.curTeachWeek = JSON.parse(JSON.stringify(curTeachWeek));
    },
    //代课学段列表
    setReLesSecList(state, reLesSecList) {
      state.reLesSecList = JSON.parse(JSON.stringify(reLesSecList));
    },
    //代课科目列表
    setReLesSubjectList(state, reLesSubjectList) {
      state.reLesSubjectList = JSON.parse(JSON.stringify(reLesSubjectList));
    },
    //代课教师列表
    setReLesTeacherList(state, reLesTeacherList) {
      state.reLesTeacherList = JSON.parse(JSON.stringify(reLesTeacherList));
    },
    //代课学段初始项
    setReLesInitSecId(state, reLesInitSecId) {
      state.reLesInitSecId = reLesInitSecId;
    },
    //代课科目初始项
    setReLesInitSubjectId(state, reLesInitSubjectId) {
      state.reLesInitSubjectId = reLesInitSubjectId;
    },
    //代课教师初始项
    setReLesInitTeacherId(state, reLesInitTeacherId) {
      state.reLesInitTeacherId = reLesInitTeacherId;
    },
  },
  actions: {},
};
export default timetableAdjust;
