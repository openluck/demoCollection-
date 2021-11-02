import Vue from "vue";
import { getDutyCheckConf, updateDutyCheckConf, getEscortCheckConf, updateEscortCheckConf } from '@/http/modules/workRequireMent.js'
import { message } from "ant-design-vue";
export default {
    namespaced: true,
    state: {
        // examId:'20201001',
        inspectionTime: [],  //检查要求设置时间数组
        checkItems: [],      //检查要求设置文本数组
        escortTime: '30',      //检查时间间隔
        limitTime: '10',       //上报间隔时间
        checkItemsbotm: [],  //检查时间间隔要求文本数组
        maxNumber: 30,   //最大间隔（分钟，不超过设置时间间隔的一半）
        appAddTask: false, // app能否添加任务
        reportType: '1' // 上报方式 0间隔  1整点
    },
    getters: {

    },
    mutations: {
        getDutyCheckConfAwait(state, dataAsync) {
            state.inspectionTime = dataAsync.inspectionTime;
            state.checkItems = dataAsync.checkItems;
        },
        addTimeItems(state, obj) {
            state.inspectionTime.push(obj)
        },
        delateTimeItem(state, e) {
            state.inspectionTime = state.inspectionTime.filter((item, index) => index != e)
        },
        addCheckItems(state, obj) {
            state.checkItems.push(obj)
        },
        delateCheckItems(state, e) {
            state.checkItems = state.checkItems.filter((item, index) => index != e)
        },
        getEscortCheckConfAwait(state, dataAsync) {
            // console.log(dataAsync);
            if (dataAsync.limitTime) {
                state.limitTime = dataAsync.limitTime;
            } else {
                state.limitTime = '10'
            }
            if (dataAsync.reportType) {
                state.reportType = dataAsync.reportType;
            } else {
                state.reportType = '1';
            }
            if (state.reportType == '1') {
                state.maxNumber = 30;
            } else {
                state.maxNumber = dataAsync.escortTime / 2;
            }
            state.escortTime = dataAsync.escortTime;
            state.checkItemsbotm = dataAsync.checkItems;
            state.appAddTask = dataAsync.appAddTask;
        },
        getMaxNumber(state, value) {
            state.escortTime = value
            state.maxNumber = value / 2
        },
        // app创建任务：
        appAddTaskChange(state, value) {
            state.appAddTask = value;
        },
        // app创建任务：
        reportTypeChange(state, value) {
            state.reportType = value;
        },
        changeLimitTime(state, value) {
            state.limitTime = value
        },
        addCheckItemsBtom(state, obj) {
            state.checkItemsbotm.push(obj)
        },
        delateCheckItemsBtom(state, e) {
            state.checkItemsbotm = state.checkItemsbotm.filter((item, index) => index != e)
        },
        // //清空查询条件
        // empty(state){

        //     if(!sessionStorage.getItem('userInfo')){
        //          state.orgCode= JSON.parse(sessionStorage.getItem('userInfo')).orgcode;
        //     }else{
        //         state.orgCode=''
        //     }

        // },
    },
    actions: {
        getDutyCheckConfAsync(context) {
            let data = {
                'examId': context.state.examId
            }
            getDutyCheckConf(data).then(res => {
                // console.log(res);
                context.commit('getDutyCheckConfAwait', res.data)
            })
        },
        updateDutyCheckConfAsync(context) {
            let data = {
                "timeInterval": context.state.inspectionTime,
                "checkItems": context.state.checkItems,
                'examId': context.state.examId
            }
            if (context.state.checkItems.length == 0) {
                message.error('检查要求项不能为空！');
                return
            }
            updateDutyCheckConf(data).then(res => {
                if (res.result) {
                    // console.log(message)
                    message.success('保存成功~！');
                } else {
                    message.error(res.message);
                }
                // console.log(res)
            })
        },
        getEscortCheckConfAsync(context) {
            let data = {
                'examId': context.state.examId
            }
            getEscortCheckConf(data).then(res => {
                // console.log(res.data)
                context.commit('getEscortCheckConfAwait', res.data)
            })
        },
        updateEscortCheckConfAsync(context) {
            let data = {
                "escorttime": context.state.escortTime,
                "limitTime": context.state.limitTime,
                'checkItems': context.state.checkItemsbotm,
                'examId': context.state.examId,
                'appAddTask': context.state.appAddTask,
                'reportType': context.state.reportType
            }
            if (context.state.checkItemsbotm.length == 0) {
                message.error('检查要求项不能为空！');
                return
            }
            if (context.state.limitTime == null) {
                message.error('上报延时不能为空！');
                return
            }
            if (!context.state.escortTime) {
                message.error('请先填写检查时间间隔~！');
            } else {
                // console.log(data)
                updateEscortCheckConf(data).then(res => {
                    console.log(res)
                    if (res.result) {
                        message.success('保存成功~！');
                    } else {
                        message.error(res.message);
                    }
                })
            }

        }

    }
}