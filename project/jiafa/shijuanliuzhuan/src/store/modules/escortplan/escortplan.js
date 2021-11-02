import Vue from "vue";
import { queryEscort,queryEscortPlanList, setEscort,releaseTask,setEscortDetail, getEscortDetail,getEscortPlanDetail, deleteEscort,deleteEscortPlan, getPerson,setBatchEscort } from '@/http/modules/escortPlan.js'
import { getEscortTaskDetail } from '@/http/modules/escortTask.js'
import { message } from "ant-design-vue";
import { getStore } from '@/utils/util.js';
export default {
  namespaced: true,
  state: {
    //查询
    filterInfo: {
      // orgCode: JSON.parse(getStore('userInfo')).orgcode,
      orgCode: '',
      taskType: '',//任务类型id
      taskStatus: "", //任务状态id
      keyword: '', //模糊搜索（任务名称，机构名称）
      pageIndex: 1,
      pageSize: 10,
      onlyShowToday: false,
      onlyShowTest: false,
      // examId:'20201001',
    },
    lists: [],
    total: 0,
    //编辑新增
    changeInfo: {
      escortTypeId: '',
      taskId: '',
      taskName: '',
      escortPersonId: '',
      startOrgCode: '',
      endOrgCode: '',
      planStartTime: null,
      planEndTime: null,
      createOrgCode: "",
      paperCnt: '',
      mapCircuit: {},
      examId: '',
      cars: [],
    },
    //获取详情
    changeInfoX: {
      escortTypeId: '',
      taskId: '',
      taskName: '',
      personId: '',
      personName: '',
      startOrgCode: '',
      endOrgCode: '',
      startTime: null,
      endTime: null,
      planStartTime:null,
      planEndTime:null,
      createOrgCode: "",
      paperCnt: '',
      mapCircuit: {
        circuitType: '',
        circuitArea: '',
      },
      carsPersons:{
        cars:[],
        escortWorker:[]
      },
      examId: '',
      cars: [],
      escortPersons:[],
      escortCount: []
    },
    //查询押运人员列表
    startPerson: [],
    endPerson: [],
    addPersonList: [],
    tableLoading: false,
    taskStatus:"0"
  },
  getters: {

  },
  mutations: {
    //查询
    queryEscortPlanList(state, dataAsync) {
      state.lists = dataAsync.list;
      state.total = dataAsync.total;
    },
    //处理所有分页参数
    quertFilterInfo(state,params){
      state.filterInfo=params
    },
    //分页
    queryEscortPageindex(state, code) {
      // console.log(code)
      state.filterInfo.pageIndex = code
    },
    //查询机构
    queryEscortOrgCode(state, code) {
      // console.log(code)
      state.filterInfo.orgCode = code
    },
    //查询任务类型
    queryEscortTaskTypeId(state, code) {
      // console.log(code)
      state.filterInfo.taskType = code
    },
    //查询任务状态
    queryEscortTaskStatusId(state, code) {
      // console.log(code)
      state.filterInfo.taskStatus = code
    },
    //模糊查询
    queryEscortTaskInfo(state, code) {
      // console.log(code)
      state.filterInfo.keyword = code
    },
    //仅显示当天
    queryEscortTaskShowToday(state, code) {
      // console.log(code)
      state.filterInfo.onlyShowToday = code
    },
    //仅显示测试
    queryEscortTaskShowTest(state, code) {
      console.log("仅显示测试",code)
      state.filterInfo.onlyShowTest = code
    },
    //一键新增
    addPlian(state, obj) {
      state.changeInfo = {}
      state.changeInfo.escortTypeId = obj.taskType
      state.changeInfo.planStartTime = obj.startTime
      state.changeInfo.planEndTime = obj.endTime
      state.changeInfo.orgCode=obj.orgCode
      // console.log(state.changeInfo)
    },
    queryEscortinfo(state, data) {
      // state.changeInfoX = {}
      state.changeInfoX = data
      state.taskStatus = data.taskStatus
      state.changeInfoX.escortCount = data.session ? data.session.split(",") : [];
      state.changeInfoX.cars = data.carsPersons.cars||[];
      // state.changeInfoX.canForce = true

      state.changeInfoX.carsPersons.escortWorker = data.carsPersons.escortWorker
      for(let item of data.carsPersons.cars){
        const arr=item.deviceList.filter(i=>i.deviceType==="602")
        if(arr.length>0){
          item.device = arr[0].deviceId
        }
      }
    },
    addPlanFabu(state, data) {
      state.changeInfo = {}
      state.changeInfo = data
    },
    //清空查询条件
    empty(state) {
      state.filterInfo.taskType = '',//任务类型id
        state.filterInfo.taskStatus = "", //任务状态id
        state.filterInfo.keyword = '' //模糊搜索（任务名称，机构名称）
      state.filterInfo.pageIndex=1
      if (!sessionStorage.getItem('userInfo')) {
        state.filterInfo.orgCode = JSON.parse(sessionStorage.getItem('userInfo')).orgcode;
      } else {
        state.filterInfo.orgCode = JSON.parse(getStore('userInfo')).orgcode
      }

    },
    //查询押运人开始机构
    startPersonAwait(state, data) {
      state.startPerson = data
    },
    //查询押运人结束机构
    endPersonAwait(state, data) {
      state.endPerson = data
    },
    //合并押运人
    assionPerson(state) {
      state.addPersonList = []
      state.startPerson = []
      state.endPerson = []
      // state.addPersonList=state.startPerson.concat(state.endPerson)

    },
    //清空编辑
    delateX(state) {
      state.changeInfoX = {}
    },

  },
  actions: {
    //查询押运计划表格
    queryEscortAsync(context, payload) {
      context.state.tableLoading = true
      if (payload == '2') {
        context.state.filterInfo.taskType = '',//任务类型id
          context.state.filterInfo.taskStatus = "" //任务状态id
        context.state.filterInfo.pageIndex = 1 //任务状态id
        context.state.filterInfo.orgCode = JSON.parse(sessionStorage.getItem('userInfo')).orgcode;
      }
      if (payload == '3') {
        context.state.filterInfo.keyword = ''
        context.state.filterInfo.pageIndex = 1 //任务状态id
      }
      queryEscortPlanList(context.state.filterInfo).then(res => {
        console.log("context.state.filterInfo",context.state.filterInfo)
        if (res.result) {
          if (payload == '1' || payload == '2' || payload == '3') {
            // message.success('操作成功~！'),
            context.commit('queryEscortPlanList', res.data)
            context.state.tableLoading = false
          } else {
            context.commit('queryEscortPlanList', res.data)
            context.state.tableLoading = false
          }
        } else {
          message.error(res.message);
          context.state.tableLoading = false
        }
      })
      // context.state.tableLoading=false


    },
    //编辑与新增通用方法
    setEscortAsync(context) {
      releaseTask(context.state.changeInfo).then(res => {
        if (res.result) {
          message.success(res.message);
          context.dispatch('queryEscortAsync')
        } else {
          message.error(res.message);
        }
      })
    },
    //618---编辑与新增通用方法
    setEscortDetailAsync(context) {
      setEscortDetail(context.state.changeInfo).then(res => {
        if (res.result) {
          message.success(res.message);
          context.dispatch('queryEscortAsync')
        } else {
          message.error(res.message);
        }
      })
    },
    //一键创建
    setBatchEscort(context,data) {
      setBatchEscort(data).then(res => {
        if (res.result) {
          message.success('创建成功');
          context.dispatch('queryEscortAsync')
        } else {
          message.error(res.message);
        }
      })
    },
    //删除
    deleteEscortAsync(context, taskId) {
      let data = {
        taskId: taskId,
        examId: context.state.filterInfo.examId
      } // deleteEscort
      deleteEscortPlan(data).then(res => {
        if (res.result) {
          message.success('删除成功');
        } else {
          message.error(res.message);
        }
      })
    },
    //查询押运计划详情
    getEscortDetailAsync(context, taskId) {
      let data = {
        taskId: taskId,
        examId: context.state.filterInfo.examId
      }
      getEscortTaskDetail(data).then(res => {
        if (res.data) {
          context.commit('queryEscortinfo', res.data)
        } else {
          context.commit('queryEscortinfo', '')
          message.error('未获取到任务详情~');
        }
      })
    },
    //获取押运员起始机构
    getPersonStartAsync(context, orgCode) {
      let data = {
        orgCode: orgCode,
        examId: context.state.filterInfo.examId
      }
      getPerson(data).then(res => {
        if (res.result) {
          context.commit('startPersonAwait', res.data.escorts)
        } else {
          context.commit('startPersonAwait', '')
          message.error(res.message);
        }
      })
    },
    //获取押运员目标机构
    getPersonendAsync(context, orgCode) {
      let data = {
        orgCode: orgCode,
        examId: context.state.filterInfo.examId
      }
      getPerson(data).then(res => {
        if (res.result) {
          context.commit('endPersonAwait', res.data.escorts)
        } else {
          context.commit('endPersonAwait', '')
          message.error(res.message);
        }
      })
    },
  }
}
