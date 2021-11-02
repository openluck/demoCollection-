import { queryEscortAlarm, confirmEscortAlarm } from '@/http/modules/escortAlarm.js'
import { message } from "ant-design-vue";
import { getStore } from '@/utils/util.js'
export default {
  namespaced: true,
  state: {
    filterInfo: {
      taskId: "",
      orgCode: "",
      // orgCode: JSON.parse(getStore('userInfo')).orgcode,
      alarmType: "",
      startTime: "",
      endTime: "",
      keyword: '',
      pageIndex: 1,
      pageSize: 10,
    },
    lists: [],
    total: 0,
    isLoading: false,
    savaInfo: {},
    render: {
      first: false,
      orgCode: []
    }
  },
  getters: {

  },
  mutations: {
    queryEscortAlarmMut(state, payload) {
      state.lists = payload.list;
      state.total = payload.total;
    },
    save(state, payload) {
      state.savaInfo = payload;
    },
    //重置state 
    resetFilterInfo(state, payload) {
      state.filterInfo = {
        taskId: "",
        // orgCode: "86.32",
        orgCode: getStore('userInfo') != null ? JSON.parse(getStore('userInfo')).orgcode : '',
        alarmType: "",
        startTime: "",
        endTime: "",
        keyword: '',
        pageIndex: 1,
        pageSize: 10,
      }
    }
  },
  actions: {
    queryEscortAlarmAsync(context, payload) {
      context.state.isLoading = true
      queryEscortAlarm(context.state.filterInfo).then(res => {
        context.state.isLoading = false
        if (res.result) {
          context.commit('queryEscortAlarmMut', res.data)

        } else {

        }
      }).catch(res => {
        context.state.isLoading = false
        message.error("请求错误！")
      })
    },
    confirmEscortAlarmAsync(context, payload) {
      confirmEscortAlarm(context.state.savaInfo).then(res => {
        if (res.result) {
        //  message.success('处置成功')
          context.dispatch('queryEscortAlarmAsync')
        }
        payload(res.result)
      })
    },
  }
}