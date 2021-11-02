/*
 * @Author: ylc
 * @Date: 2021-09-09 13:58:30
 * @LastEditTime: 2021-09-09 14:40:33
 * @LastEditors: ylc
 * @Description: 课表查询状态管理模块
 * @FilePath: \Web\src\store\modules\timetableQuery.js
 */

const timetableQuery = {
  namespaced: true,
  state: {
    // 我的课表
    myTimeTable: {
      schoolYearId: "",
      semesterId: "",
      personId: ""
    },
    // 年级课表
    gradeTimeTable: {
      schoolYearId: "",
      semesterId: "",
      secId: ""
    },
    // 班级课表
    classTimeTable: {
      schoolYearId: "",
      semesterId: "",
      secId: "",
      gradeId: ""
    },
    // 学生课表
    stuTimeTable: {
      schoolYearId: "",
      semesterId: "",
      secId: "",
      gradeId: "",
      classId: ""
    },
    // 教室课表
    classRoomTimeTable: {
      schoolYearId: "",
      semesterId: ""
    },
    // 教师课表
    teacherTimeTable: {
      schoolYearId: "",
      semesterId: "",
      secId: "",
      subjectId: ""
    }
  },
  mutations: {
    // 设置我的课表
    setMyTimeTable(state, data) {
      state.myTimeTable = data
    },
    // 设置年级课表
    setGradeTimeTable(state, data) {
      state.gradeTimeTable = data
    },
    // 设置班级课表
    setClassTimeTable(state, data) {
      state.classTimeTable = data
    },
    // 设置学生课表
    setStuTimeTable(state, data) {
      state.stuTimeTable = data
    },
    // 设置教室课表
    setClassRoomTimeTable(state, data) {
      state.classRoomTimeTable = data
    },
    // 设置教师课表
    setTeacherTimeTable(state, data) {
      state.teacherTimeTable = data
    }
  },
  actions: {

  }
};

export default timetableQuery;