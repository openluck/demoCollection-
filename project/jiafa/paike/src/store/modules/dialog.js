/*
 * @Descripttion:
 * @version:
 * @Author: OpenLcuk
 * @Date: 2021-06-08 11:20:07
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-08-11 14:57:07
 */
export default {
  namespaced: true,
  state: {
    teacherListVisible: false, // 添加教师弹窗
    addClassDialogvisible: false, // 添加班级弹窗
    settingHourVisible: false, // 批量配置课程课时弹窗
    arrLessonId: "", // 排课方案id
  },
  getters: {
    getTeacherListVisible(state) {
      return state.teachGroupVisible;
    },
    getArrLessonId(state) {
      console.log(state.arrLessonId);
      return state.arrLessonId;
    },
  },
  mutations: {
    setTeacherListVisible(state, payload) {
      // state.teacherListVisible = !state.teacherListVisible;
      state.teacherListVisible = payload;
    },
    setAddClassDialog(state,payload) {
      // state.addClassDialogvisible = !state.addClassDialogvisible;
      state.addClassDialogvisible = payload;
    },
    setSettingHourVisible(state,payload) {
      // state.settingHourVisible = !state.settingHourVisible;
      state.settingHourVisible = payload;
    },
    setArrLessonId(state, payload) {
      state.arrLessonId = payload;
      console.log(state.arrLessonId);
    },
  },
};
