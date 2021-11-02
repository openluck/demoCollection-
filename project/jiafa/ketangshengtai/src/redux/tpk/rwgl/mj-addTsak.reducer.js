/*
 * @Author: MinJ
 * @Date: 2019-07-23 09:27:24
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-09-15 09:52:50
 * 听评课2.2-创建评课任务
 */
import _ from 'lodash';
import { message } from 'antd';
import moment from 'moment';
import { requestForListen, formRequest } from './../../../util/request';
import { G } from './../../../config/g';

const requestListen = requestForListen;
// const formRequest = request.formRequest;
const PAGEDATA = 'PAGEDATA_ADDTASK';
const PAGESELE = 'PAGESELE_ADDTASK';
const PAGEINIT = 'PAGEINIT_ADDTASK';

let taskList = JSON.parse(sessionStorage.getItem('taskTypeList')) || [];
// console.log(taskList);

const init = {
  pageSize: 20,       //每页条数
  pageStep: 1,        //页面步骤 1，2
  taskId: '',         // 任务Id

  // 步骤一
  taskType: '',             //任务类型
  taskName: '',             //任务名称
  taskDate: moment(),           //截止日期
  courseInfoList: [],           //课程名单回显所有数据
  courseInfoTotal: 0,           //课程名单总数
  courseInfoTable: [],          // 课程名单用于表格展示
  courseInfoIndex: 1,           //课程名单页码

  // 导入
  leadInModal: false,       //导入弹框
  leadInError: false,       //导入出错弹框
  fileName: '',                 //导入文件名字
  fileData: undefined,          //导入的文件
  errorUrl: '',                 //导入出错文件Url

  // 课程选择
  seleCourseModal: false,       // 选择课程弹框
  ifSele: true,                // true选择页 fase选择查看页
  ifMount: true,               // 是否是初始化：true 是 false不是
  collegeList: [],    //院系数据
  collegeSele: '',    //选择院系
  schoolList: [],     //校区数据
  schoolSele: '',     //选择校区
  typeList: [],       //课程类别数据
  typeSele: '',       //选择类别
  courseKeyWord: '',  //课程搜索值
  teacherKeyWord: '', //教师搜索值
  courseListData: [],       // 课程选择列表
  courseListTotal: 0,       // 课程选择列表总数
  courseListIndex: 1,       // 课程选择页码
  ifAll: false,             // 全部选择
  seleList: [],       // 已选择的全部课程
  seleListTable: [],  // 已选择的展示课程
  seleListIndex: 1,   // 已选择页码

  // 指定评课人员
  personModal: false,       // 人员选择弹框
  personListData: [],       // 人员列表回显
  personListTotal: 0,       // 人员列表数据总数
  personListIndex: 1,       // 人员列表页码
  personTable: [],          // 人员列表用于展示数据

  ifNew: true,              //是否是新增：true新增false编辑
  ifEdit: false,            //是否可编辑 false不能 true能
  ifSubmit: false,          //是否提交成功
  submitDisabled: false,    //提交按钮是否能点击，避免重复点击
}

export function addTask(state = init, action) {
  switch (action.type) {
    case PAGEDATA:
      return { ...state, ...action };
    case PAGESELE:
      return { ...state, ...action };
    case PAGEINIT:
      return state = init;
    default:
      return state;
  }
}

/**
 * 页面各操作
 */
export function seleChan(info, data) {
  return (dispatch, getState) => {
    let { taskName, taskDate, taskType, courseInfoList, courseInfoIndex, ifNew, fileData, seleList,
    } = getState().addTask;
    switch (info) {
      case 'init':
        dispatch({
          type: PAGEINIT,
        })
        break;

      case 'taskTypeList':
        dispatch({
          type: PAGESELE,
          taskType: data && data.length ?
            (data[0].taskTypeId === 'all' ? data[1].taskTypeId : data[0].taskTypeId)
            : ''
        })
        break;

      case 'ifNewPage':
        dispatch({
          type: PAGESELE,
          ifNew: data.ifId,
          ifEdit: data.type
        })
        break;

      // 步骤一
      case 'stepNext':
        if (data === 2) {
          if (taskName.match(/^[ ]*$/)) {
            message.info('请填写任务名称');
          } else if (!taskDate) {
            message.info('请选择截止日期');
          } else if (!taskType && taskType !== 0) {
            message.info('请选择任务类型');
          } else {
            dispatch(checkTaskName());
          }
        } else {
          dispatch({
            type: PAGESELE,
            pageStep: 1,
            personListIndex: 1
          })
        }
        break;

      case 'taskTypeSele':
        dispatch({
          type: PAGESELE,
          taskType: data
        })
        break;

      case 'taskNameSele':
        dispatch({
          type: PAGESELE,
          taskName: data
        })
        break;

      case 'taskDateSele':
        dispatch({
          type: PAGESELE,
          taskDate: data
        })
        break;

      case 'seleCourse':
        dispatch({
          type: PAGESELE,
          seleCourseModal: true
        })
        break;

      // 导入操作
      case 'leadInClick':
        dispatch({
          type: PAGESELE,
          leadInModal: true
        })
        break;

      case 'leadInCancel':
        dispatch({
          type: PAGESELE,
          leadInModal: false,
          fileData: undefined,
          fileName: '',
          errorUrl: ''
        })
        break;

      case 'errorLeadCancel':
        dispatch({
          type: PAGESELE,
          leadInError: false
        })
        break;

      case 'filesChan':
        if (data.length) {
          if (data[0].name) {
            let name = getFileSuffix(data[0].name)
            if (name === 'xls' || name === 'xlsx') {
              console.log(data);

              dispatch({
                type: PAGESELE,
                fileName: data[0].name,
                fileData: data[0]
              })
            } else {
              dispatch({
                type: PAGESELE,
                fileName: '',
                fileData: undefined
              })
              message.warn('请上传excel格式的文件');
            }
          }
        }
        break;

      case 'filesOk':
        if (fileData) {
          dispatch(leadInExcel());
        } else {
          message.warn('请上传excel格式的文件');
        }
        break;

      // 表格
      case 'courseInfoDele':
        // 从选中列表删除
        let seleListInfo = JSON.parse(JSON.stringify(seleList));
        let seleListInfoIndex = _.findIndex(seleListInfo, ['dataId', data]);
        if (seleListInfoIndex !== -1) {
          _.remove(seleListInfo, function (n) {
            return n.dataId === data;
          });
        }

        // 从展示列表删除
        let allData = JSON.parse(JSON.stringify(courseInfoList));
        let deleIndex = _.findIndex(allData, ['dataId', data]);
        if (deleIndex !== -1) {
          _.remove(allData, function (n) {
            return n.dataId === data;
          });
        }
        let deleLen = allData.length,
          delePage = Math.ceil(deleLen / 20),
          delePageIndex = delePage < courseInfoIndex ? delePage : courseInfoIndex;
        let deleList = pageDeal(allData, delePageIndex);
        dispatch({
          type: PAGESELE,
          courseInfoList: allData,
          courseInfoTotal: deleLen,
          courseInfoTable: deleList,
          courseInfoIndex: delePageIndex,

          seleList: seleListInfo
        })
        break;

      case 'courseInfoChan':
        let courseInfoPage = pageDeal(courseInfoList, data);
        dispatch({
          type: PAGESELE,
          courseInfoIndex: data,
          courseInfoTable: courseInfoPage
        })
        break;

      default:
        break;
    }
  }
}

/**
 * 课程选择列表操作
 */
export function courseSeleChan(info, data) {
  return (dispatch, getState) => {
    let { collegeSele, ifAll, courseListData, courseListIndex, seleList, seleListIndex, courseInfoList,
      personListTotal, personListData } = getState().addTask;
    switch (info) {
      case 'ifSeleChan':
        if (data) {     //选择页
          let courseListRe = JSON.parse(JSON.stringify(courseListData));
          courseListRe.map(item => {
            item.checked = false;
          })
          dispatch({
            type: PAGESELE,
            ifSele: data,
            ifAll: false,
            courseListData: courseListRe,
          })
        } else {      //查看页
          let seleTableList = JSON.parse(JSON.stringify(seleList));
          let seleTable = pageDeal(seleTableList, 1);
          dispatch({
            type: PAGESELE,
            ifSele: data,
            seleList: seleTableList,
            seleListTable: seleTable,
            seleListIndex: 1,
          })
        }
        break;

      case 'courseCance':
        dispatch({
          type: PAGESELE,
          seleCourseModal: data,
          ifAll: false,
          ifMount: true,
          courseKeyWord: '',  //课程搜索值
          teacherKeyWord: '', //教师搜索值
          ifSele: true,
        })
        break;

      case 'collegeChan':
        dispatch({
          type: PAGESELE,
          collegeSele: data
        })
        dispatch(reqSchoolList(data));
        break;

      case 'schoolChan':
        dispatch({
          type: PAGESELE,
          schoolSele: data
        })
        dispatch(reqTypeList(collegeSele, data));
        break;

      case 'typeChan':
        dispatch({
          type: PAGESELE,
          typeSele: data
        })
        break;

      case 'teahcerChan':
        dispatch({
          type: PAGESELE,
          teacherKeyWord: data
        })
        break;

      case 'courseChan':
        dispatch({
          type: PAGESELE,
          courseKeyWord: data
        })
        break;

      case 'checkAll':
        let seleAll = JSON.parse(JSON.stringify(seleList));//seleList  courseListData
        if (data) {//选中
          !courseListData.length ? null :
            courseListData.map(item => {
              item.checked = true;
              let i = _.findIndex(seleAll, ['dataId', item.dataId]);
              if (i === -1) {
                seleAll.push(item);
              }
            })
        } else {
          !courseListData.length ? null :
            courseListData.map(item => {
              let i = _.findIndex(seleAll, ['dataId', item.dataId]);
              if (i !== -1) {
                item.checked = false;
                let evens = _.remove(seleAll, function (n) {
                  return n.dataId === item.dataId;
                });
              }
            })
        }
        dispatch({
          type: PAGESELE,
          ifAll: data,
          seleList: seleAll
        })
        break;

      case 'check':
        let seleCon = JSON.parse(JSON.stringify(seleList));
        let index = _.findIndex(seleCon, ['dataId', data.item.dataId]);
        let allSele = ifAll;
        let checkNum = 0;
        courseListData.map(item => {
          if (item.dataId === data.item.dataId) {
            item.checked = data.event;
          }
          if (item.checked) {
            checkNum++;
          }
        })
        if (data.event) {
          if (index === -1) {  //选中且没在选中列表（避免已选中但没回显的点击）
            seleCon.push(data.item);
          }
          if (checkNum === courseListData.length) {
            allSele = true;
          }
        } else {
          let evens = _.remove(seleCon, function (n) {
            return n.dataId === data.item.dataId;
          });
          allSele = false;
        }
        dispatch({
          type: PAGESELE,
          seleList: seleCon,
          ifAll: allSele
        })
        break;

      // 已选中操作
      case 'deleSele':
        let seleCheck = JSON.parse(JSON.stringify(seleList));
        _.remove(seleCheck, function (n) {
          return n.dataId === data;
        });
        let seleLen = seleCheck.length,
          selePageAll = Math.ceil(seleLen / 20),
          selePageIndex = selePageAll < seleListIndex ? selePageAll : seleListIndex;
        let checkedSele = pageDeal(seleCheck, selePageIndex);
        dispatch({
          type: PAGESELE,
          seleList: seleCheck,
          seleListTable: checkedSele,
          seleListIndex: selePageIndex
        })
        break;

      case 'seleListPage':
        let seleListNext = pageDeal(seleList, data);
        dispatch({
          type: PAGESELE,
          seleListIndex: data,
          seleListTable: seleListNext
        })
        break;

      case 'checkSure':
        let seleListCheck = JSON.parse(JSON.stringify(seleList));
        let courseInfoCheck = JSON.parse(JSON.stringify(courseInfoList));
        seleListCheck.map(item => {
          let checkSureIndex = _.findIndex(courseInfoCheck, ['dataId', item.dataId]);
          if (checkSureIndex === -1) {
            courseInfoCheck.push(item);
          }
        })
        // let courseInfoAll = _.concat(seleList, courseInfoList);
        let courseInfoShow = pageDeal(courseInfoCheck, 1);

        dispatch({
          type: PAGESELE,
          courseInfoList: courseInfoCheck,
          courseInfoTotal: courseInfoCheck.length,
          courseInfoTable: courseInfoShow,
          courseInfoIndex: 1,
          seleCourseModal: false,
          courseKeyWord: '',  //课程搜索值
          teacherKeyWord: '', //教师搜索值
          ifSele: true,

          ifAll: false,
          ifMount: true,
        })
        break;

      default:
        break;
    }
  }
}

/**
 * 人员列表操作
 */
export function perChan(info, data) {
  return (dispatch, getState) => {
    let { personListData, personTable, courseInfoTotal } = getState().addTask;
    switch (info) {
      // 人员列表
      case 'perModal':
        dispatch({
          type: PAGESELE,
          personModal: data
        })
        break;

      //人员确定选中
      case 'perChecked':
        console.log(data);
        let perList = [];
        data.map(item => {
          // let perI = _.findIndex(personListData, ['perId', item.personId]);
          // if (perI === -1) {
          perList.push({
            perName: item.personName,
            work: item.postName || '',
            orgId: item.orgId,
            // courseLow: 1,
            courseLow: courseInfoTotal ? 1 : 0,
            evaluLow: 1,
            perId: item.personId
          })
          // }
        })
        // perList = _.concat(perList, personListData);
        let checkList = pageDeal(perList, 1);
        dispatch({
          type: PAGESELE,
          personListData: perList,
          personListTotal: perList.length,
          personModal: false,
          personTable: checkList,
          personListIndex: 1
        })
        break;

      case 'courseNum1':
        // console.log(data, !data.value, courseInfoTotal);
        let courseNumChan = JSON.parse(JSON.stringify(personListData));
        let courseNum = _.findIndex(courseNumChan, ['perId', data.item.perId]);
        courseNumChan[courseNum].courseLow = courseInfoTotal > 0 ? (data.value ? data.value : 1) : 0;
        // console.log(courseNumChan[courseNum].courseLow);

        let courseTableChan = JSON.parse(JSON.stringify(personTable));
        let courseTableNum = _.findIndex(courseTableChan, ['perId', data.item.perId]);
        courseTableChan[courseTableNum].courseLow = courseInfoTotal > 0 ? data.value ? data.value : 1 : 0;
        dispatch({
          type: PAGESELE,
          personListData: courseNumChan,
          personTable: courseTableChan
        })
        break;

      case 'evaluNum1':
        let evaluNumChan = JSON.parse(JSON.stringify(personListData)),
          evaluNum = _.findIndex(evaluNumChan, ['perId', data.item.perId]);
        evaluNumChan[evaluNum].evaluLow = data.value ? data.value : 1;
        evaluNumChan[evaluNum].courseLow = courseInfoTotal === 0 || data.value === '' ? 0 :
          evaluNumChan[evaluNum].courseLow > evaluNumChan[evaluNum].evaluLow
            ? evaluNumChan[evaluNum].evaluLow : evaluNumChan[evaluNum].courseLow;
        // courseInfoTotal === 0 || data.value === '' ? 0 : 1;

        let evaluTableChan = JSON.parse(JSON.stringify(personTable)),
          evaluTableNum = _.findIndex(evaluTableChan, ['perId', data.item.perId]);
        evaluTableChan[evaluTableNum].evaluLow = data.value ? data.value : 1;
        evaluTableChan[evaluTableNum].courseLow = courseInfoTotal === 0 || data.value === '' ? 0 :
          evaluNumChan[evaluNum].courseLow > evaluNumChan[evaluNum].evaluLow
            ? evaluNumChan[evaluNum].evaluLow : evaluNumChan[evaluNum].courseLow;
        // courseInfoTotal === 0 || data.value === '' ? 0 : 1;

        dispatch({
          type: PAGESELE,
          personListData: evaluNumChan,
          personTable: evaluTableChan
        })
        break;

      case 'pseronListChan':
        let list = pageDeal(personListData, data);
        dispatch({
          type: PAGESELE,
          personTable: list,
          personListIndex: data
        })
        break;

      case 'submitData':
        let courNum = 0,
          long = personListData.length;
        let evaluTableSub = JSON.parse(JSON.stringify(personTable));
        // console.log(personListData, evaluTableSub);
        personListData.map(item => {
          if (!item.courseLow) {
            let evaluTableSubNum = _.findIndex(evaluTableSub, ['perId', item.perId]);
            if (evaluTableSubNum !== -1) {
              item.courseLow = courseInfoTotal > 0 ? 1 : 0;
              // console.log(item.courseLow + '- ' + evaluTableSubNum);
              evaluTableSub[evaluTableSubNum].courseLow = courseInfoTotal > 0 ? 1 : 0;
            }
          }
          if (item.evaluLow) {
            courNum++;
          }
        })
        dispatch({
          type: PAGESELE,
          personTable: evaluTableSub
        })
        if (long && long === courNum) {
          dispatch(submitData());
        } else {
          message.info('次数填写不合理')
        }
        break;

      default:
        break;
    }
  }
}

/**
 * @desc 任务信息回显
 * @param {*} taskId 任务id
 */
export function reqTaskInfo(taskId) {
  return dispatch => {
    requestListen('addTask/taskInfo', { taskId }, res => {
      const res1 = {
        result: true,
        data: {
          taskType: 1,
          taskName: '我们都是好孩子',
          taskDate: '2020-02-22'
        }
      }
      if (res.result) {
        const data = res.data;
        dispatch({
          type: PAGEDATA,
          taskType: data.taskType ? data.taskType : '',
          taskName: data.taskName ? data.taskName : '',
          taskDate: new Date(data.taskDate) ? new Date(data.taskDate) : null,
          taskId
        })
      } else {
        dispatch({
          type: PAGEDATA,
          taskType: 0,
          taskName: '',
          taskDate: null,
          taskId
        })
      }
    })
  }
}

/**
 * @desc 课程名单回显信息
 * @param {*} taskId 任务id
 * @param {*} pageIndex 页码
 */
export function reqCourseInfo(taskId) {
  return (dispatch, getState) => {
    const { courseInfoList, seleList } = getState().addTask;
    const req = { taskId, };
    requestListen('addTask/courseInfo', req, res => {
      const res1 = {
        result: true,
        total: 90,
        data: []
      }
      let data = res.data;
      // for(let i = 0; i < 90; i ++){
      //   data.push({
      //       dataId: i+1,
      //       collegeName: i+1,
      //       courseName: i+1,
      //       courseType: i+1,
      //       teacherName: i+1,
      //       week: i+1,
      //       weekDay: i+1,
      //       schoolNum: i+1,
      //       school: i+1
      //   })
      // }
      let list = [];
      if (res.result) {
        let dataAll = _.concat(seleList, data);
        list = pageDeal(dataAll, 1);
        dispatch({
          type: PAGEDATA,
          courseInfoTotal: dataAll.length,
          courseInfoList: dataAll,
          courseInfoTable: list,
          courseInfoIndex: 1
        })
      } else {
        list = pageDeal(seleList, 1);
        dispatch({
          type: PAGEDATA,
          courseInfoList: seleList,
          courseInfoTotal: seleList.length,
          courseInfoTable: list,
          courseInfoIndex: 1
        })
      }
    })
  }
}

/**
 * @desc 下载课程模板
 */
export function downLoadList() {
  return dispatch => {
    requestListen('addTask/downloadList', {}, res => {
      let res1 = {
        result: true,
        data: '',
        message: ' OK'
      }
      if (res.result) {
        let url = res.data.excel_file;
        let downUrl = G.serverUrl + '/' + url;
        let elink = document.createElement('a');
        elink.download = "巡课安排模板.xls";
        elink.href = downUrl;
        elink.click();
        // console.log(downUrl);
      } else {
        message.info(res.message);
      }
    })
  }
}

/**
 * @desc 导入课程列表
 */
export function leadInExcel() {
  return (dispatch, getState) => {
    const { fileData, taskId, courseInfoList } = getState().addTask;
    // console.log(taskId, fileData);
    formRequest('addTask/uploadList', { taskId, files: fileData }, res => {
      let res1 = {
        // result: false,
        result: true,
        data: {
          tableList: [],
          errorUrl: ''
        }
      }
      if (!res.result) {
        if (res.data && res.data.excel_file) {
          let errorUrl = res.data && res.data.excel_file ? res.data.excel_file : '';
          dispatch({
            type: PAGESELE,
            leadInModal: false,
            leadInError: true,
            fileName: '',
            fileData: undefined,
            errorUrl
          })
        } else {
          message.info('导入失败，请重新导入')
          dispatch({
            type: PAGESELE,
            leadInModal: false,
            fileName: '',
            fileData: undefined,
            errorUrl: ''
          })
        }
      } else {
        message.info('导入成功');
        let tableList = [],
          infoList = [],
          infoDeal = [];
        if (res.data && res.data.length) {
          tableList = res.data;
        }
        infoList = _.concat(tableList, courseInfoList);
        // 数据去重
        infoList = _.unionBy(infoList, 'dataId');
        console.log(infoList);

        infoDeal = pageDeal(infoList, 1);
        dispatch({
          type: PAGESELE,
          leadInModal: false,
          fileName: '',
          fileData: undefined,
          courseInfoList: infoList,
          courseInfoTotal: infoList.length,
          courseInfoTable: infoDeal,
          courseInfoIndex: 1
        })
      }
    })
  }
}

/**
 * @desc 下载出错excel文件
 */
export function reqErrorLeadIn() {
  return (dispatch, getState) => {
    const { errorUrl } = getState().addTask;
    if (errorUrl) {
      // let url = "videoshot/excel/错误数据20200407144713.xls";
      let downUrl = G.serverUrl + '/' + errorUrl;
      let elink = document.createElement('a');
      let list = /[^/]+(?!.*xls)/.exec(errorUrl)[0];
      elink.download = list;
      elink.href = downUrl;
      elink.click();
    }
    dispatch({
      type: PAGESELE,
      leadInError: false
    })
    // request('/addTask/downloadError', { taskId}, res => {
    // let res = {
    //   result: true
    // }
    // if (res.result) {
    //   // window.open(res.data);
    //   dispatch({
    //     type: PAGESELE,
    //     leadInError: false
    //   })
    // }
    // })
  }
}

/**
 * @des 获取院系下拉列表数据
 */
export function reqCollegeList() {
  return dispatch => {
    requestListen('addTask/collegeList', {}, res => {
      const res1 = {
        result: true,
        data: [{
          collegeName: '1',
          collegeId: '1'
        },
        {
          collegeName: '2',
          collegeId: '2'
        },
        {
          collegeName: '3',
          collegeId: '3'
        },
        {
          collegeName: '4',
          collegeId: '4'
        },
        {
          collegeName: '5',
          collegeId: '5'
        },
        ]
      }
      const data = res.data;
      if (res.result && data && data.length) {
        const id = data[0].collegeId;
        dispatch({
          type: PAGEDATA,
          collegeList: data,
          collegeSele: id
        })
        dispatch(reqSchoolList(id));
      } else {
        dispatch({
          type: PAGEDATA,
          collegeList: [],
          collegeSele: ''
        })
      }
    })
  }
}

/**
 * @des 获取校区下拉列表数据
 * @param {*} collegeId 院系id
 */
export function reqSchoolList(collegeId) {
  return dispatch => {
    requestListen('addTask/schoolList', { collegeId }, res => {
      const res1 = {
        result: true,
        data: [{
          schoolName: '1',
          schoolId: '1'
        },
        {
          schoolName: '2',
          schoolId: '2'
        },
        {
          schoolName: '3',
          schoolId: '3'
        },
        {
          schoolName: '4',
          schoolId: '4'
        },
        {
          schoolName: '5',
          schoolId: '5'
        },
        ]
      }
      const data = res.data;
      if (res.result && data && data.length) {
        const id = data[0].schoolId;
        dispatch({
          type: PAGEDATA,
          schoolList: data,
          schoolSele: id
        })
        dispatch(reqTypeList(collegeId, id));
      } else {
        dispatch({
          type: PAGEDATA,
          schoolList: [],
          schoolSele: ''
        })
      }
    })
  }
}

/**
 * @des 获取课程类别下拉列表数据
 * @param {*} collegeId 院系id
 * @param {*} schoolId 校区id
 */
export function reqTypeList(collegeId, schoolId) {
  return (dispatch, getState) => {
    const { ifMount } = getState().addTask;
    requestListen('addTask/courseType', { collegeId, schoolId }, res => {
      const res1 = {
        result: true,
        data: [{
          typeName: '1',
          typeId: '1'
        },
        {
          typeName: '2',
          typeId: '2'
        },
        {
          typeName: '3',
          typeId: '3'
        },
        {
          typeName: '4',
          typeId: '4'
        },
        {
          typeName: '5',
          typeId: '5'
        },
        ]
      }
      const data = res.data;
      if (res.result && data && data.length) {
        const id = data[0].typeId;
        !ifMount ? null : dispatch(reqCourseList(1, collegeId, schoolId, id, '', ''));
        dispatch({
          type: PAGEDATA,
          typeList: data,
          typeSele: id
        })
      } else {
        dispatch({
          type: PAGEDATA,
          typeList: [],
          typeSele: ''
        })
      }
    })
  }
}

/**
 * @desc 获取课程列表
 * @param {*} pageIndex 页码
 * @param {*} collegeId 院系
 * @param {*} schoolId 校区
 * @param {*} courseType 课程类别
 * @param {*} courseKey 搜索值
 * @param {*} teacherKey 搜索值
 */
export function reqCourseList(pageIndex, collegeId, schoolId, courseType, courseKey, teacherKey) {
  return (dispatch, getState) => {
    const { pageSize } = getState().addTask;
    const req = {
      pageIndex,
      pageSize,
      collegeId,
      schoolId,
      courseType,
      searchKey: teacherKey,
      courseSearch: courseKey
    }
    requestListen('addTask/courseList', req, res => {
      const res1 = {
        result: true,
        total: 50,
        data: []
      }
      let data = res.data;
      // for(let i = 0; i < 5; i++){
      //   data.push({
      //     dataId: 'pageIndex' + pageIndex + '-' + i,
      //     collegeName: 'pageIndex' + pageIndex + '-' + i,
      //     courseName: 'pageIndex' + pageIndex + '-' + i,
      //     courseType: 'pageIndex' + pageIndex + '-' + i,
      //     teacherName: 'pageIndex' + pageIndex + '-' + i,
      //     week: 'pageIndex' + pageIndex + '-' + i,
      //     weekDay: 'pageIndex' + pageIndex + '-' + i,
      //     schoolNum: 'pageIndex' + pageIndex + '-' + i,
      //     school: 'pageIndex' + pageIndex + '-' + i
      //   })
      // }
      // console.log(data);

      if (res.result) {
        data.map(item => {
          item.checked = false;
        })
        dispatch({
          type: PAGEDATA,
          courseListTotal: res.total,
          // courseListData: pageIndex === 1 ? data : _.concat(courseListData, data),
          courseListData: data,
          courseListIndex: pageIndex,
          ifMount: false,
          ifAll: false
        })
      } else {
        dispatch({
          type: PAGEDATA,
          // courseListData: pageIndex === 1 ? [] : courseListData,
          courseListData: [],
          courseListIndex: pageIndex,
          ifMount: false,
          ifAll: false
        })
      }
    })
  }
}

/**
 * @desc 验证任务名称
 */
export function checkTaskName() {
  return (dispatch, getState) => {
    const { taskName, taskId, personListData, personListTotal, courseInfoTotal, taskType } = getState().addTask;
    requestListen('addTask/checkName', { taskName, taskId, taskType }, res => {
      const res1 = {
        result: true,
        message: '1'
      }
      if (!res.result) {
        message.info(res.message);
      } else {
        //人员列表有数据则更新不可操作项
        let personList = JSON.parse(JSON.stringify(personListData));
        let personListShow = [];
        if (personListTotal) {
          personList.map(item => {
            item.courseLow = !courseInfoTotal ? 0 : item.courseLow === 0 ? 1 : item.courseLow;
          })
          personListShow = pageDeal(personList, 1);
        }
        dispatch({
          type: PAGESELE,
          pageStep: 2,

          personListData: personList,
          personTable: personListShow,
        })
      }
    })
  }
}

/**
 * @desc 获取评课人员列表
 * @param {*} taskId 任务ID
 */
export function reqPerList(taskId) {
  return (dispatch, getState) => {
    const { personListData, personListTotal } = getState().addTask;
    requestListen('addTask/personList', { taskId }, res => {
      const res1 = {
        result: true,
        total: 98,
        data: [],
        message: '1'
      }
      let data = res.data;
      // for(let i = 0; i< 2 ; i++){
      //   data.push({
      //     perName: `${i}`,
      //     work: `${i}`,
      //     courseLow: i + 1,
      //     evaluLow: i + 1,
      //     perId: `${i}`
      //   })
      // }
      if (res.result && data.length) {
        if (personListTotal) {
          data.map(item => {
            // item.courseLow = item.courseLow === 0 ? 1 : item.courseLow;
            item.courseLow = !courseInfoTotal ? 0 : item.courseLow === 0 ? 1 : item.courseLow;
          })
        }
        let list = pageDeal(data, 1);
        dispatch({
          type: PAGEDATA,
          personListData: data,
          personListTotal: res.total,
          personTable: list
        })
      } else {
        dispatch({
          type: PAGEDATA,
          personListData: [],
          personListTotal: 0,
          personTable: []
        })
      }
    })
  }
}

/**
 * @desc 数据提交
 */
export function submitData() {
  return (dispatch, getState) => {
    dispatch({
      type: PAGESELE,
      submitDisabled: true
    })
    const { taskId, taskType, taskName, taskDate, personListData, courseListData, seleList, courseInfoList } = getState().addTask;
    let courList = [];
    // console.log(personListData);

    courseInfoList.map(item => {
      courList.push(item.dataId)
    })
    let person = [];
    personListData.map(item => {
      person.push({
        perId: item.perId,
        perName: item.perName,
        orgId: item.orgId,
        perWork: item.work,
        courseLow: item.courseLow,
        appraiseLow: item.evaluLow ? item.evaluLow : 1,
      })
    })
    const req = {
      jobId: taskId,
      taskType,
      taskName,
      taskDate: moment(new Date(taskDate)).format("YYYY-MM-DD"),
      courseList: courList,
      personList: person
    };
    requestListen('addTask/submitData', req, res => {
      const res1 = {
        result: true,
        message: '1'
      }
      if (res.result) {
        message.info('提交成功', 2);
        setTimeout(() => {
          dispatch({
            type: PAGESELE,
            ifSubmit: true,
            submitDisabled: false
          })
        }, 2000);
      } else {
        message.info(res.message);
        setTimeout(() => {
          dispatch({
            type: PAGESELE,
            submitDisabled: false
          })
        }, 2000);
      }
    })
  }
}

/**
 * @desc 分页处理
 * @param {*} data 数据源
 * @param {*} pageIndex 页码
 */
function pageDeal(data, pageIndex) {
  let list = [];
  let long = Math.ceil(data / 20),
    start = pageIndex === 1 ? 0 : (pageIndex - 1) * 20,
    end = pageIndex === long ? data.length + 1 : pageIndex * 20;
  list = data.slice(start, end);
  return list;
}

/**
   * 返回文件后缀
   * @param {*String} fileName 上传的文件名字
   */
function getFileSuffix(fileName) {
  if (typeof (fileName) === 'string' && fileName.indexOf('.') > -1) {
    let args = fileName.split('.');
    return args[args.length - 1];
  } else {
    alert('传入参数必须为文件名且不能为空且必须为字符串！');
  }
}