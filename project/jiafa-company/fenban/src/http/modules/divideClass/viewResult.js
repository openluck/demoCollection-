import axios from '../../axios';

/**
 * @desc 获取详情列表
 * @param {*} params 请求参数
 */
export const getResultDetailList = (params) => {
  // console.log(params);
  return axios({
    url: '/DC_Class/getStuInAdminClass',
    method: 'post',
    data: params
  })
  // let adminDetData = [];
  // for (let i = 0; i < 50; i++) {
  //   adminDetData.push({
  //     id: i,
  //     stuId: "id-" + i,
  //     stuName: "学生姓名-" + i,
  //     studyCom: "学考组合-" + i,
  //     selectWalkCom: "选考走班科目-" + i,
  //     selectCom: "选考组合-" + i,
  //     studyWalkCom: "学考走班科目-" + i,
  //     OrignClass: "来源行政班-" + i,
  //     sex: "男" + i,
  //   });
  // }
  // let res = {
  //   code: '200',
  //   data: {
  //     list: adminDetData,
  //     pagination: {
  //       current: 2,
  //       pageSize: 20,
  //       total: 50
  //     }
  //   }
  // }
  // return res
}

/**
 * @desc 获取班级列表
 */
export const getClassListData = (params) => {
  return axios({
    // url: '/DC_Class/getClassResultClasslist',
    url: '/DC_Class/getClassResultSubjectList',
    method: 'post',
    data: params,
  })

  // const res = {
  //   code: '200',
  //   data: {
  //     list: [
  //       { className: '三年一班', classId: '1' },
  //       { className: '三年二班', classId: '2' },
  //       { className: '二年一班', classId: '3' },
  //       { className: '二年二班', classId: '4' },
  //     ]
  //   }
  // }
  // return res
}

/**
 * @desc 获取分班结果列表
 * @param {*} params 请求入参
 */
export const getTableListData = params => {
  // console.log(params);
  return axios({
    url: '/DC_Class/getClassResultList',
    method: 'post',
    data: params
  })

  // let list = [];
  // for (let i = 0; i < 52; i++) {
  //   list.push({
  //     adminClassId: "id-" + i,
  //     admClassName: "行政班名字-" + i,
  //     admClassType: "班级类别-" + i,
  //     studyGroup: "物理（学）+化学（学）（42）" ,
  //     chooseWalkSub: "选考走班科目-" + i,
  //     chooseExamGroup: "物理（选）+生物（选）（42），物理（选）+化学（选）（42），物理（选）+历史（选）（42），" ,
  //     boysNum: 90 + i,
  //     grilsNum: 20 + i,
  //     studyWalkSub: "学考走班科目-" + i,
  //     originalClass: "来源班级-" + i,
  //     totalNum: 110 + 2 * i,
  //     teachClassId: "11-" + i,
  //     stuName: "学生姓名-" + i,
  //     classType: i === 1 ? '1' : '2',
  //   });
  // }
  // const res = {
  //   code: '200',
  //   data: {
  //     list,
  //     pagination:{
  //       current: 1,
  //       pageSize: 20,
  //       total:52
  //     }
  //   }
  // }
  // return res
}