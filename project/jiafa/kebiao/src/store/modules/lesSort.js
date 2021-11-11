/*
 * @Descripttion: 
 * @version: 
 * @Author: YanQY
 * @Date: 2021-08-09 14:07:59
 * @LastEditors: YanQY
 * @LastEditTime: 2021-09-27 15:42:44
 */

const codeTable = {
  namespaced: true,

  state: {
    curSec: {},
    lesSortPlanId: undefined,
    timePlanType: undefined,
    timePlanId: null,
    dis: null,
    tempLesSortPlanName: "",
    tempDiffNoonRangeList: [],
    timePlanTypeList: [
      { value: "1", name: "学段", imgName: "按学段" },
      { value: "2", name: "年级", imgName: "按年级" },
      { value: "3", name: "场所", imgName: "按场所" }
    ],
    tempLesSortList: [],
    timePlanList: [],
    lesSortPlanList: [],
    placeTree: [],
    placeTreeList: [],
    originalLesSortList: []

  },
  mutations: {
    changeCurSec(state, payload) {
      // console.log("changeCurSec",payload);
      state.curSec = payload
    },
    changeTempLesSortList(state, payload) {
      // console.log("changeTempLesSortList",payload);
      state.tempLesSortList = payload
    },
    changeLesSortPlanId(state, payload) {
      // console.log("changeTempLesSortList",payload);
      state.lesSortPlanId = payload
    },
    changeTimePlanType(state, payload) {
      // console.log("changeTempLesSortList",payload);
      state.timePlanType = payload
    },
    changeTempLesSortPlanName(state, payload) {
      // console.log("changeTempLesSortList",payload);
      state.tempLesSortPlanName = payload
    },
    changeTempDiffNoonRangeList(state, payload) {
      // console.log("changeTempLesSortList",payload);
      state.tempDiffNoonRangeList = payload
    },
    changeTimePlanId(state, payload) {
      state.timePlanId = payload
    },
    changeDis(state, payload) {
      state.dis = payload
    },
    changeLesSortPlanList(state, payload) {
      state.lesSortPlanList = payload
    },
    changeTimePlanList(state, payload) {
      state.timePlanList = payload
    },
    changePlaceTree(state, payload) {
      state.placeTree = payload
    },
    changePlaceTreeList(state, payload) {
      state.placeTreeList = payload
    },
    changeOriginalLesSortList(state, payload) {
      state.originalLesSortList = payload
    },


    delLesSort(state, index) {
      // debugger
      let n = state.tempDiffNoonRangeList.length;
      for (let i = 0, j = n; i < j; i++) {
        const item = state.tempDiffNoonRangeList[i];
        // console.log(item);
        if (item.startIndex <= index && item.endIndex >= index) {
          item.endIndex -= 1;
          n = i
        }
        if (i > n) {
          item.startIndex -= 1;
          item.endIndex -= 1;
        }
      }
      // console.log(state.tempDiffNoonRangeList);
      // debugger
      state.tempDiffNoonRangeList = state.tempDiffNoonRangeList.filter(i => i.startIndex <= i.endIndex)
    }
  },
  actions: {

  }
}
export default codeTable