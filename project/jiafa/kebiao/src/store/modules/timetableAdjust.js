/*
 * @Desc:
 * @Version: v1.00
 * @Author: went
 * @Date: 2021-08-02 15:28:59
 * @LastEditors: went
 * @LastEditTime: 2021-09-22 11:10:35
 */
// 调换课调整
const timetableAdjust = {
  namespaced: true,
  state: {
    isEditType: false,
    curSelectLes: {
    },
    hasSelectedLes: null,
    teachWeek: "",
    //周内
    iwSecList: [],
    iwGradeList: [],
    iwClassList: [],
    iwInitSecId: "",
    iwInitGradeId: "",
    iwInitClassId: "",
    iwCurTeachWeek: {
      teachWeekId: "",
      teachWeekName: ""
    },
    //跨周
    awSecList: [],
    awGradeList: [],
    awClassList: [],
    awInitSecId: "",
    awInitGradeId: "",
    awInitClassId: "",
    awCurTeachWeek: {
      teachWeekId: "",
      teachWeekName: ""
    },
    selectLesWeekId: {
      teachWeekId: "",
      teachWeekName: ""
    }
  },
  mutations: {
    setIsEditType(state, type) {
      state.isEditType = type;
    },
    setCurSelectLes(state, obj) {
      state.curSelectLes = JSON.parse(JSON.stringify(obj));
    },
    setHasSelectedLes(state, obj) {
      state.hasSelectedLes = JSON.parse(JSON.stringify(obj));
    },
    //周内
    seIwtCurTeachWeek(state, iwCurTeachWeek) {
      state.iwCurTeachWeek = JSON.parse(JSON.stringify(iwCurTeachWeek));
    },
    setIwSecList(state, iwSecList) {
      state.iwSecList = JSON.parse(JSON.stringify(iwSecList));
    },
    setIwGradeList(state, iwGradeList) {
      state.iwGradeList = JSON.parse(JSON.stringify(iwGradeList));
    },
    setIwClassList(state, iwClassList) {
      state.iwClassList = JSON.parse(JSON.stringify(iwClassList));
    },
    setIwInitSecId(state, iwInitSecId) {
      state.iwInitSecId = iwInitSecId;
    },
    setIwInitGradeId(state, iwInitGradeId) {
      state.iwInitGradeId = iwInitGradeId;
    },
    setIwInitClassId(state, iwInitClassId) {
      state.iwInitClassId = iwInitClassId;
    },
    //跨周
    seAwtCurTeachWeek(state, awCurTeachWeek) {
      state.awCurTeachWeek = JSON.parse(JSON.stringify(awCurTeachWeek));
    },
    //选中课程所在周
    setSelectLesWeekId(state, selectLesWeekId) {
      state.selectLesWeekId = JSON.parse(JSON.stringify(selectLesWeekId));
    },
    setAwSecList(state, awSecList) {
      state.awSecList = JSON.parse(JSON.stringify(awSecList));
    },
    setAwGradeList(state, awGradeList) {
      state.awGradeList = JSON.parse(JSON.stringify(awGradeList));
    },
    setAwClassList(state, awClassList) {
      state.awClassList = JSON.parse(JSON.stringify(awClassList));
    },
    setAwInitSecId(state, awInitSecId) {
      state.awInitSecId = awInitSecId;
    },
    setAwInitGradeId(state, awInitGradeId) {
      state.awInitGradeId = awInitGradeId;
    },
    setAwInitClassId(state, awInitClassId) {
      state.awInitClassId = awInitClassId;
    }
  },
  actions: {}
};
export default timetableAdjust;
