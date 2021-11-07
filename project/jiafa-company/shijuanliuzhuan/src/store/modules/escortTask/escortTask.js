import Vue from "vue";
import { queryEscort, setEscort,  deleteEscort, getPerson, queryEscortManagementList } from '@/http/modules/escortPlan.js'
import { getEscortTaskDetail} from '@/http/modules/escortTask.js'
import { message } from "ant-design-vue";
import { getStore } from '@/utils/util.js';
export default {
    namespaced: true,
    state: {
        //查询
        filterInfo: {
            // orgCode: JSON.parse(getStore('userInfo')).orgcode,
            orgCode: '',
            escortUserName: '', //押运负责人
            session: '', //场次
            taskTypeId: '',//任务类型id
            forceStatus: '', //强制状态
            taskInfo: '', //模糊搜索（任务名称，机构名称）
            taskStatusId: "", //任务状态id
            onlyToday: false, //仅显示当天任务
            onlyOvertime: false, //仅显示超时任务
            pageIndex: 1,
            pageSize: 10,
            // examId:'20201001',
        },
        lists: [],
        total: 0,
        countList: [],
        //编辑新增
        changeInfo: {
            escortTypeId: '',
            taskId: '',
            taskName: '',
            escortPersonId: '',
            startOrgCode: '',
            endOrgCode: '',
            startTime: null,
            endTime: null,
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
            escortPersonId: '',
            startOrgCode: '',
            endOrgCode: '',
            startTime: null,
            endTime: null,
            createOrgCode: "",
            paperCnt: '',
            mapCircuit: {
                circuitType: '',
                circuitArea: '',
            },
            examId: '',
            cars: [],
        },
        //查询押运人员列表
        curPerson: [],
        startPerson: [],
        endPerson: [],
        addPersonList: [],
        tableLoading: false,
        showTaskList: false,
        taskStatus: "0",
    },
    getters: {

    },
    mutations: {
        //查询
        queryEscort(state, dataAsync) {
            state.lists = dataAsync.list;
            state.total = dataAsync.total;
            state.countList = dataAsync.countList;
            sessionStorage.setItem("countList",JSON.stringify(dataAsync.countList))
        },
        //分页
        queryEscortPageindex(state, code) {
            state.filterInfo.pageIndex = code
        },
        //查询--机构
        queryEscortOrgCode(state, code) {
            state.filterInfo.orgCode = code
        },
        //查询--押运负责人
        queryEscortUserName(state, code) {
            state.filterInfo.escortUserName = code
        },
        //查询--场次
        queryEscortSession(state, code) {
            state.filterInfo.session = code
        },
        //查询--任务类型
        queryEscortTaskTypeId(state, code) {
            state.filterInfo.taskTypeId = code
        },
        //查询--强制状态
        queryEscortForceStatus(state, code) {
            state.filterInfo.forceStatus = code
        },
        //模糊查询
        queryEscortTaskInfo(state, code) {
            state.filterInfo.taskInfo = code
        },
        //查询--任务状态
        queryEscortTaskStatusId(state, code) {
            state.filterInfo.taskStatus = code
        },
        //查询--仅显示当天任务
        queryEscortOnlyToday(state, code) {
            state.filterInfo.onlyToday = code
        },
        //查询--仅显示超时任务
        queryEscortOnlyOvertime(state, code) {
            state.filterInfo.onlyOvertime = code
        },

        //一键新增
        addPlian(state, obj) {
            state.changeInfo = {}
            state.changeInfo.escortTypeId = obj.taskType
            state.changeInfo.startTime = obj.startTime
            state.changeInfo.endTime = obj.endTime
            // console.log(state.changeInfo)
        },
        queryEscortinfo(state, data) {
            console.log("state, data",state, data);
            state.changeInfoX = {}
            state.changeInfoX = data
            state.taskStatus = data.taskStatus
        },
        addPlanFabu(state, data) {
            state.changeInfo = {}
            state.changeInfo = data
        },
        //清空查询条件
        empty(state) {
            state.filterInfo.orgCode = '',
            state.filterInfo.escortUserName = '',
            state.filterInfo.session = "",
            state.filterInfo.taskTypeId = '',//任务类型id
            state.filterInfo.forceStatus = '',//任务类型id
            state.filterInfo.taskInfo = '' //模糊搜索（任务名称，机构名称）
            state.filterInfo.taskStatusId = "", //任务状态id
            state.filterInfo.onlyToday = false, //任务状态id
            state.filterInfo.onlyOvertime = false, //任务状态id
            state.filterInfo.pageIndex = 1
            if (!sessionStorage.getItem('userInfo')) {
                state.filterInfo.orgCode = JSON.parse(sessionStorage.getItem('userInfo')).orgcode;
            } else {
                state.filterInfo.orgCode = JSON.parse(getStore('userInfo')).orgcode
            }

        },
        //查询押运人开始机构
        startPersonAwait(state, data) {
            state.startPerson = data
            // console.log(state.startPerson)
        },
        //查询押运人结束机构
        endPersonAwait(state, data) {
            state.endPerson = data
            // console.log(state.endPerson)
        },
        //合并押运人
        assionPerson(state) {
            state.addPersonList = []
            state.startPerson = []
            state.endPerson = []
            // state.addPersonList=state.startPerson.concat(state.endPerson)
            // console.log(state.addPersonList)
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
            if (payload == '2') { //搜索
                context.state.filterInfo.orgCode= JSON.parse(getStore('userInfo')).orgcode,
                context.state.filterInfo.escortUserName = "" //押运负责人
                context.state.filterInfo.session = "" //场次
                context.state.filterInfo.taskTypeId = '',//任务类型id
                context.state.filterInfo.taskStatusId = "" //任务状态id
                context.state.filterInfo.pageIndex = 1 //任务状态id
                context.state.filterInfo.orgCode = JSON.parse(sessionStorage.getItem('userInfo')).orgcode;
            }
            if (payload == '3') { //查询
                context.state.filterInfo.taskInfo = ''
                context.state.filterInfo.pageIndex = 1 //任务状态id 
            }
            queryEscortManagementList(context.state.filterInfo).then(res => {
                context.state.showTaskList = true
                if (res.result) {
                    if (payload == '1' || payload == '2' || payload == '3') {
                        // message.success('操作成功~！'),
                        context.commit('queryEscort', res.data)
                        context.state.tableLoading = false
                    } else {
                        context.commit('queryEscort', res.data)
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
            setEscort(context.state.changeInfo).then(res => {
                if (res.result) {
                    message.success(res.message);
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
            }
            deleteEscort(data).then(res => {
                // console.log(res)
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
                if (res.result) {
                    context.commit('queryEscortinfo', res.data)
                } else {
                    context.commit('queryEscortinfo', '')
                    message.error(res.message);
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
                    // console.log(res)
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
                    // console.log(res)
                    context.commit('endPersonAwait', res.data.escorts)
                } else {
                    context.commit('endPersonAwait', '')
                    message.error(res.message);
                }
            })
        },
    }
} 