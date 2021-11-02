/*
 * @Descripttion: 行政班级持久化状态管理
 * @version: v1.0
 * @Author: xutao
 * @Date: 2021-04-27 17:03:53
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-09-10 10:49:24
 */

import {
  getStuInAdminClass,
  getStuListInCombinationInClass,
  // getStuInTeachClass,
  getKHBTeachClassList,
  getGroupGoClassStuList,
  getSaveData,
} from "@/http/modules/divideClass/adminClass";
import { getStudyClassDetails } from "@/http/modules/divideClass/chooseExam";
export default {
  namespaced: true,
  state: {
    count: 0, // 未分班的人员
    time: "", // 最后一次保存时间
    isStuList: true, // 有无学生名单:true有 false无
    isFinish: false, // 是否已经完成分班
    divideclassType: "1", // 分班类型： 选考分班还是学考分班 1 - 选考分班  2 - 学考分班
    pageContentLoading: false, // content loading 效果
    DCbtnLoadingStatus: false, // 智能分班首页学考/选考按钮loading和disable状态
    adminClassStatus: false, //行政班级人员查看弹窗状态 true false
    adminClassData: {}, //行政班级数据
    personRes: {},
    isMergepersonRes: {},
    loading: false,
    // 组合操作
    delModalStatus: false, //删除组合操作弹窗状态
    delErrorInfo: "", // 删除时错误信息
    editModalStatus: false, //编辑组合弹窗状态
    editComModalData: [], // 编辑组合弹窗数据
    // 教学班操作-查看
    teachPersonModalStatus: false, // 教学班级查看人员状态
    teachPersonModalData: [], //教学班弹窗人员list
    teachClassData: {}, //当前教学班基础数据
    studyTeachClassData: {},
    // 教学班操作-合并班级
    mergeClassModalStatus: false, //合并班级弹窗状态
    mergeClassInfo: {}, // 合并弹窗传递基础信息
    mergeClassList: [], //合并班级弹窗List
    stuListInMergeStatus: false, //合并班级-选择插入人员弹窗
    stuListInMergeInfo: {},
    currentComSelected: [], //当前组合已经被选中的人员
    stuListInMergeList: [],
    stuSelectInMergeList: [], //合并班级中-合并 已选择人员前端缓存数据
    planId: "", // 方案id
    teachClassName: "", // 学生所在班级名称
    studyPersonListStatus: false,
    isMergeLoading: false,
    createOrEdit: "create", // 是新建还是编辑
    settingColorModalVisble: false, // 是否显示颜色设置modal
    saveColor: "#FFB4A2", // 保存的颜色
    setColorPayload: {},
    divideclassOrgType: false,

    planGroupPage: 1, // 保存分班选课活动列表第几页
    divideClassPage: 1, // 保存分班方案列表第几页
  },
  getters: {
    // adminClassStatus(state) {
    //   return state.adminClassStatus
    // },
    adminClassData(state) {
      return state.adminClassData;
    },
  },
  mutations: {
    setDivideClassOrgType(state, payload) {
      state.divideclassOrgType = payload;
    },
    // 设置方案id
    setPlanId(state, payload) {
      state.planId = payload;
    },
    // 设置有无学生名单状态
    setIsStuListStatus(state, payload) {
      state.isStuList = payload;
    },
    // 设置分班类型  1 - 选考分班  2 - 学考分班
    setDivideclassType(state, payload) {
      state.divideclassType = payload;
    },
    // 设置 点击学考/选考分班按钮后，全局加载的loading
    setPageContentLoading(state, payload) {
      state.pageContentLoading = payload;
    },
    // 设置 是否已经完成分班
    setIsFinishStatus(state, payload) {
      state.isFinish = payload;
    },
    // 设置 智能分班首页学考/选考按钮loading和disable状态
    setDCbtnLoadingStatus(state, payload) {
      state.DCbtnLoadingStatus = payload;
    },
    // 设置新建还是编辑状态
    setCreateOrEdit(state, payload) {
      state.createOrEdit = payload;
    },
    onAdminClassStatus(state, payload) {
      state.adminClassStatus = payload;
    },
    changeAdminClassData(state, payload = {}) {
      state.adminClassData = JSON.parse(JSON.stringify(payload));
    },
    setPersonList(state, payload = {}) {
      state.personRes = payload;
    },
    setisMergePersonList(state, payload = {}) {
      state.isMergepersonRes = payload;
    },
    setLoading(state, payload = {}) {
      state.loading = payload;
    },
    // 组合操作
    setDelModalStatus(state, payload) {
      state.delModalStatus = payload;
    },
    setDelErrorInfo(state, payload) {
      state.delErrorInfo = payload;
    },
    setEditModalStatus(state, payload) {
      state.editModalStatus = payload;
    },
    setEditComModalData(state, payload) {
      state.editComModalData = payload;
    },
    // 教学班级操作 - 查看
    setTeachPersonModalStatus(state, payload) {
      state.teachPersonModalStatus = payload;
    },
    setTeachClassData(state, payload = {}) {
      state.teachClassData = JSON.parse(JSON.stringify(payload));
    },
    setStudyTeachClassData(state, payload = {}) {
      state.studyTeachClassData = JSON.parse(JSON.stringify(payload));
    },
    setTeachPersonModalData(state, payload) {
      state.teachPersonModalData = payload;
    },
    // 教学班操作 - 合并班级
    setMergeClassModalStatus(state, payload) {
      state.mergeClassModalStatus = payload;
    },
    // 确定合并
    setMergeClassInfo(state, payload) {
      state.mergeClassInfo = payload;
    },
    // 合并 选择 人员列表数据
    setMergeClassList(state, payload) {
      state.mergeClassList = payload;
    },
    // 合并 已选择人员前端缓存数据
    setStuSelectInMergeList(state, payload) {
      // state.stuSelectInMergeList = payload
      if (
        state.stuSelectInMergeList.length &&
        state.stuSelectInMergeList.find((item) => item.combinationId)
      ) {
      } else {
        state.stuSelectInMergeList.push(payload);
      }
    },
    // 教学班操作 - 合并班级 - 插入人员
    setStuListInMergeStatus(state, payload) {
      state.stuListInMergeStatus = payload;
    },
    setStuListInMergeInfo(state, payload) {
      state.stuListInMergeInfo = payload;
    },
    setStuListInMergeList(state, payload) {
      state.stuListInMergeList = payload;
    },
    // 学生所在班级名称
    setTeachClassName(state, payload) {
      state.teachClassName = payload;
    },
    // 学生所在班级名称
    setStudyPersonListStatus(state, payload) {
      state.studyPersonListStatus = payload;
    },
    setisMergeLoading(state, payload) {
      state.isMergeLoading = payload;
    },
    setSettingColorModalVisble(state, parameter) {
      state.settingColorModalVisble = parameter.visible;
      Object.assign(state.setColorPayload, parameter);
    },
    setSaveColor(state, payload) {
      state.saveColor = payload;
    },
    // 保存班选课活动列表页数
    setPlanGroupPage(state, payload) {
      state.planGroupPage = payload;
    },
    // 保存班选课活动列表页数
    setdivideClassPage(state, payload) {
      state.divideClassPage = payload;
    },
  },
  actions: {
    //获取查看人员列表中 弹窗表格数据 type 1 行政班级查看人员List  2 教学班级查看人员list
    async getPersonList(state, data) {
      const { type } = data;
      state.commit("setLoading", true);
      let res = await getStuInAdminClass(data);
      if (res.code === "200") {
        if (type === "1") {
          state.commit("setPersonList", res.data);
        } else if (type === "2") {
          state.commit("setTeachPersonModalData", res.data);
        }
        state.commit("setLoading", false);
      }
    },

    // 获取 已经 合并 的班级人员列表
    async getisMergePersonList(state, data) {
      try {
        state.commit("setisMergeLoading", true);
        const res = await getStudyClassDetails(data);
        if (res.code === "200") {
          state.commit("setisMergePersonList", res.data);
          state.commit("setisMergeLoading", false);
        }
      } catch (error) {
        throw new Error(error);
      }
    },

    //获取编辑组合中 弹窗表格数据
    async getStuListInCombinationInClass(state, data) {
      state.commit("setLoading", true);

      let res = await getStuListInCombinationInClass(data);

      if (res.code === "200") {
        state.commit("setEditComModalData", res.data);
        state.commit("setLoading", false);
      }
    },
    // // 获取教学班级中 人员列表数据
    // async getStuInTeachClass(state, data) {
    //   // state.commit('setLoading', true)
    //   let res = await getStuInTeachClass(data)
    //   if (res.code === '200') {
    //     state.commit('setTeachPersonModalData', res.data)
    //     state.commit('setLoading', false)
    //   }
    // },

    // 获取教学班级中 人员列表数据
    async getKHBTeachClassList(state, data) {
      // state.commit('setLoading', true)
      let res = await getKHBTeachClassList(data);
      // console.log(res, 'res.data......')
      if (res.code === "200") {
        // let list = JSON.parse(JSON.stringify(res.data.list))
        const list = res.data;
        list.map((item) => {
          item.combinationList.map((i) => {
            i.insertNum = 0;
            i.personNum = Number(i.personNum);
          });
        });
        state.commit("setMergeClassList", list);
        // state.commit('setLoading', false)
      }
    },

    // 教学班操作-合并教学班-组合下未走班人员
    async getGroupGoClassStuList(state, data) {
      // state.commit('setLoading', true)
      let res = await getGroupGoClassStuList(data);
      if (res.code === "200") {
        let list = JSON.parse(JSON.stringify(res.data));

        state.commit("setStuListInMergeList", list);
        // state.commit('setLoading', false)
      }
    },
    // 获取剩余人数，和最后保存时间
    async getSaveData({ state }) {
      try {
        const { planId } = state;
        const parmas = { planId };
        const res = await getSaveData(parmas);
        if (res.code === "200") {
          const { count, time } = res.data;
          // 不建议action直接修改state，而是提交mutations ...
          Object.assign(state, {
            count,
            time,
          });
        } else {
          Object.assign(state, {
            count: 0,
            time: "2020年5月20日13:14:00",
          });
        }
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};
