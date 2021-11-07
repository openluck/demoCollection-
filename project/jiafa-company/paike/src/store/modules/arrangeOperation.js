/*
 * @Author: MinJ
 * @Date: 2021-06-10 09:21:47
 * @LastEditTime: 2021-09-30 11:24:43
 * @LastEditors: OpenLcuk
 * @Description: In User Settings Edit
 * @FilePath: \2021-06-10 pk_V1.0_code\src\store\modules\arrangeOperation.js
 */
export default {
  namespaced: true,
  state: {
    roomDrawerVisible: false, // 教室安排抽屉状态
    teacherDrawerVisible: false, // 教师任教安排抽屉状态
    isAddTeacherModal: false,// 添加教师弹窗
    courseDrawerVisible: false, // 课程安排抽屉状态
    ruleDrawerVisible: false, // 排课规则抽屉
    settingHourVisible: false,//添加课程弹窗
    classId: '',  //左侧-选中的班级id
    dragItem: {}, //右侧拖拽数据项
    isDroped: false,//表格操作后：用于右侧数据更新
    isRefresh: false,//右侧内部拖动：用于刷新表格数据
    contactIsNoTeacher: false // 点击检测/自动排课，课目无教师，显示红框
  },
  getters: {},
  mutations: {
    setRoomDrawerVisible(state, data) {
      state.roomDrawerVisible = data
    },
    setTeacherDrawerVisible(state, data) {
      state.teacherDrawerVisible = data
    },
    setAddTeacherModal(state) {
      state.isAddTeacherModal = !state.isAddTeacherModal
    },
    setCourseDrawerVisible(state, data) {
      state.courseDrawerVisible = data
    },
    setRuleDrawerVisible(state, data) {
      state.ruleDrawerVisible = data
    },
    setSettingHourVisible(state, data) {
      state.settingHourVisible = data
    },
    setContactIsNoTeacher(state, data) {
      state.contactIsNoTeacher = data
    },
    /**
     * 修改左侧班级选中 
     * @param {String} params 选中id
     */
    chanClass(state, params) { state.classId = params; },
    /**
     * 修改右侧拖拽数据
     * @param {Object} params 拖拽数据
     */
    setDragItem(state, params) { state.dragItem = params; },
    /**
     * 表格操作成功调用
     * @param {*} val 
     */
    setDroped(state, val) { state.isDroped = val; },
    /**
     * @desc 用于右侧内部拖拽时 仅刷新表格数据
     */
    refreshTableData(state, val) { state.isRefresh = val },
  },
  actions: {
  },
}
