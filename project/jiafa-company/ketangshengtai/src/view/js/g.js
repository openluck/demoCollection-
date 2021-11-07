import _x from './_x/index';
const Request = _x.util.request.request
const getWeekStart = _x.util.date.getWeekStart;
const toChinese = _x.util.number.toChinese;

export let G = {
  token: "",
  orgCode: "",
  modelConfig: [],
  userInfo: {
    // 角色类型
    roleType: "",
  },
  //  用户信息
  baseinfo: {
    // // 用户名
    // uname: uinfos.nm,
    // // 用户ID 
    // userid: uinfos.userId,
    // // 登录的账号
    // loginName: uinfos.loginName,

    // utype: uinfos.rm,
    // // 关键字
    // ukey: uinfos.key,
    // // 老师账号
    // teacherid: uinfos.teacherId,
    // // 系统名
    // systemname: '课堂生态',
    // // 账号级别  1系统管理员 2管理员 3 教师 （听评课中）4 巡课员 还有在线巡课  
    // role: uinfos.roleLevel,
  },
  // 学期信息
  semesters: {},
  //  当前学期
  semester: {
    weeks: []
  },
  // 学段学年年级信息
  sections: [],
  funcs: [],
  rootpath: '',
  currentWeek: ""
}

const getGlobalData = () => {
  console.log("请求全局数据");
  Promise.all([
    // 获取所有巡课机构
    // Request('api/web/big_data/get_patrol_orgs', {}, res => { }),
    Request('api/web/public/getAllOrgs', {}, res => { }),
    // 获取所有教学机构
    Request('api/web/public/getTeachingData', {}, res => { }),
    // 获取所有的课程类型
    Request('api/web/big_data/get_course_type', {}, res => { }),

    // 获取学期数 第一学期和第二学期 ，每个学期对象中包含周次，还有学期的开始和结束时间
    Request('api/web/research_lesson/setting/semester', {}, res => { }),
    // 获取所有评课机构
    // Request('api/web/big_data/get_evaluation_org', {}, res => { }),
    // 获取所有违纪类型
    Request('api/web/patrol_common/all_disciplinary_event', {}, res => { }),
    // 获取平台名称
    Request('api/web/project/get_name', {}, res => { }),
    // 获取二级管理员的全部巡课机构
    Request('api/web/big_data/get_patrol_orgs_college', {}, res => { }),
    // 获取所有的机构，根节点是全部机构，每个学员中挂人
    // Request('api/web/research_lesson/setting/get_class_info', {}, res => { }),
  ])
    .then(values => {
      if (values && values.length) {
        values.map((item, index) => {
          switch (index) {
            case 0:
              if (item.data.result && item.data.data && item.data.data.length) {
                // 巡课机构
                G.xkTrgList = item.data.data
              } else {
                G.xkTrgList = []
              }
              break
            case 1:
              let orgList = [];
              G.baseinfo.roleLevel === 1
                ? orgList = [{
                  teachOrgId: "all",
                  teachOrgName: "全部教学机构"
                }] : []
              if (item.data.result && item.data.data && item.data.data.length) {
                // console.log(item.data)
                // 教学机构
                G.trgList = item.data.data;
              } else {
                G.trgList = orgList;
              }
              break
            case 2:
              if (item.data.result && item.data.data && item.data.data.length) {
                G.typeList = item.data.data
              } else {
                G.typeList = []
              }
              break
            case 3:
              // 获取学期数 第一学期和第二学期 ，每个学期对象中包含周次，还有学期的开始和结束时间
              if (item.data.result && item.data.data && item.data.data.length) {
                var weekms = 86400000 * 7; // 一周的毫秒数
                var currentWeek = '';
                var dnow = new Date().getTime();

                G.semesters = item.data.data.map((item2, index) => {
                  var semester = {
                    id: item2.id,
                    name: item2.name,
                    start: item2.semesterStartDate,
                    end: item2.semesterEndDate
                  }
                  var firsttime = 0;

                  if (semester.start) {
                    // firsttime = semester.start.getWeekStart().getTime()
                    firsttime = getWeekStart(new Date(semester.start)).getTime();
                  } else {
                    firsttime = 0
                  }

                  semester.weeks = item2.weeks.map(week => {
                    // var start = new Date(firsttime + weekms * (week.id - 1))
                    var start = (firsttime + weekms * (week.id - 1))

                    if (start <= dnow) {
                      currentWeek = String(week.id)

                    }
                    return {
                      id: String(week.id),
                      name: '第' + toChinese(Number(week.name)) + '周',
                      start: start,
                      // end: new Date(start.getTime() + 86400000 * 6)
                      end: (start + 86400000 * 6)
                    }
                  });

                  // 判断当前时间在哪一学期中
                  if (semester.start <= dnow && dnow <= semester.end) {
                    G.semester = semester
                    G.currentWeek = currentWeek
                  }
                  return semester
                })
                G.semester = G.semesters[0]
                if (!currentWeek) {
                  // 暑假寒假期间，取最后一周次
                  let len = G.semester.weeks.length
                  G.currentWeek = len ? G.semester.weeks[len - 1].id : ''
                }else{
                  G.currentWeek = currentWeek;
                }
                sessionStorage.setItem("semId", G.semester.id || "");
              } else {
                G.semester = [];
                G.currentWeek = '';
              }

              break;
            // case 4:
            //   // 全部评课机构
            //   if (item.data.result && item.data.data && item.data.data.length) {
            //     G.pkTrgList = item.data.data;
            //   } else {
            //     G.pkTrgList = [];
            //   }
            //   break;
            case 4:
              // 全部违纪类型
              if (item.data.result && item.data.data && item.data.data.length) {
                let data = item.data.data
                data.map(item => {
                  if (!item.id) {
                    item.id = ""
                  }
                })
                G.wjList = data
              } else {
                G.wjList = []
              }
              break;
            case 5:
              let sysName = '课堂生态';
                  if (item.data.result && item.data.data) {
                    if (item.data.data) {
                      sysName = item.data.data
                    }
                  }
                  G.systemname = sysName
                  document.title = sysName
                  sessionStorage.setItem("systemname", sysName);
              break;
            case 6:
              if (item.data.result && item.data.data && item.data.data.length) {
                // 二级管理员的全部巡课列表
                G.secondLevelTrgList = item.data.data
              } else {
                G.secondLevelTrgList = []
              }
              break;
            // case 8:
            //   // 获取所有的机构，根节点是全部机构，每个学员中挂人
            //   if (item.data.result && item.data.data && item.data.data.length) {
            //     G.sections = item.data.data
            //   } else {
            //     G.sections = []
            //   }
            //   break
            default:
              break
          }
        });
        // 将全局数据存入session
        sessionStorage.setItem('G', JSON.stringify(G));
      }
    })
}


// 同步内存与session全局数据
export const findGlobalData = function () {
  return new Promise((resolve, reject) => {
    if (!G.token || !G.orgCode || !Object.keys(G.baseinfo).length) {
      // 重新请求全局数据
      getGlobalData()
      // 全局中没有token 并且 没有用户信息
      let global = JSON.parse(sessionStorage.getItem("G"));
      console.log("globalLength:", Object.keys(global).length, sessionStorage.getItem("token"), sessionStorage.getItem("orgCode"));
      if (!Object.keys(global).length || sessionStorage.getItem("token") == null || sessionStorage.getItem("orgCode") == null) {
        console.log("缓存中没有token或者没有orgCode或者没有用户信息");
        reject();
      } else {
        // session找用户信息，
        G = JSON.parse(sessionStorage.getItem("G"));
        G.baseinfo = JSON.parse(sessionStorage.getItem("baseInfo"));
        G.modelConfig = JSON.parse(sessionStorage.getItem("modelConfig"));
        G.token = sessionStorage.getItem("token");
        G.orgCode = sessionStorage.getItem("orgCode");
        // 重新赋值给全局 g
        window.g = G;

        resolve();
      }
    }
  });
}


// 开发环境
if (process.env.NODE_ENV === 'development') {
  // G.serverUrl = 'http://10.10.1.14:8088/cloud';
  // G.serverUrl = 'http://10.10.1.14:8087/cloud';
  // G.serverUrl = 'http://101.207.142.35:12202/cloud';
  // G.serverUrl = 'http://10.10.1.156:12202/cloud';
  G.serverUrl = 'http://10.4.3.18:12202/cloud';
  // G.serverUrl = 'http://10.10.0.136:8000/cloud';
  // G.serverUrl = 'http://211.65.107.180:12209/cloud';
  // G.serverUrl = 'http://10.20.5.124:12202/cloud';
  // G.serverUrl = 'http://10.10.1.14:8087/cloud'; 
  // G.serverUrl = 'http://192.168.64.111:12202/cloud';


} else {
  if (window.location.origin.indexOf('localhost') != -1) {
    // G.serverUrl = 'http://10.10.1.6:8087/cloud';
    G.serverUrl = 'http://10.10.1.169:8080/cloud';
  } else {
     G.serverUrl = window.location.origin + "/cloud"
    // G.serverUrl = 'http://10.10.0.121:8099/cloud';
   // G.serverUrl = 'http://10.10.1.14:8081/cloud';
    // G.serverUrl = 'http: 10.10.1.6:8087/cloud';
    // G.serverUrl = 'http://192.168.64.111:12202/cloud';
  }
}


window.g = G;