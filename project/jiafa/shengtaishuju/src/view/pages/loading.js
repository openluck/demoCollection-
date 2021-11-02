/*
 * @Author: junjie.lean
 * @Date: 2019-04-15 16:28:09
 * @Last Modified by: lxx
 * @Last Modified time: 2021-03-25 10:30:48
 */

/**
 * @description loading页，解参跳转
 */

import React from "react";
import ReactLoding from "react-loading";
import { withRouter, Prompt } from "react-router-dom";
import G from "./../../config/g";
import U from "./../../util/_util";
import _x from "./../../util/file";
import { GetMenu, MenuConfig } from './../../config/menuConfig';
import { ws_saveGlobalData } from "../../redux/ws-global.reducer";
import { connect } from "react-redux";
import { request } from './../../util/request';
import { message } from "antd";
import _, { assign } from "lodash";

const toChinese = U.toChinese;
const getQueryString = U.getQueryString;
const getSection = _x.getSection;

@withRouter
@connect(state => state,
  {
    ws_saveGlobalData,
  })
export default class Loading extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.getPublicData = this.getPublicData.bind(this);
  }

  componentDidMount () {

    //跳转逻辑
    if (window.location.href.indexOf("rt") > -1) {
      //http://localhost:4000/loading?otherParams=1&orgcode=1&token=2&rt=%27{%22p%22:{%22a%22:1,%22b%22:2},%22t%22:%22/des/two/%22}%27
      let rt = U.getQueryString("rt");
      if (rt) {
        let rtObject = JSON.parse(rt.slice(1, -1)); //需要把字符串中一前一后的单引号去掉后才能json.parse出来
        setTimeout(() => {
          // this.props.history.push("/home");
        }, 100);
      }
    } else {
      //如果没有需要带参跳转
      //初始化跳转
      let token = getQueryString('token') || null;
      let orgcode = getQueryString('orgcode') || null;

      if (token && orgcode) {
        // 同步存入redux和G
        this.props.ws_saveGlobalData(orgcode, "ISCED_orgcode");
        this.props.ws_saveGlobalData(token, "ISCED_token");

        // 用户鉴权
        request('/api/public/getRoleData', { token: G.ISCED_token || '', orgcode: G.ISCED_orgcode || '' }, (res) => {
          if (res.result && res.data) {
            // res.data.systemTime = 1616639296483
            let ISCED_curRoleInfo = {};
            // res.data.roleData = [{
            //   // belongOrgId: "8651010000002",
            //   // belongOrgName: "四川大学",
            //   // roleId: "1",
            //   // roleName: "生态大数据校级",
            //   ...res.data.roleData[0],
            //   menuData: [
            //     { "name": "可视化中心", "id": "ISCED00" },
            //     { "name": "教学秩序", "id": "ISCED000" },
            //     { "name": "教学质量", "id": "ISCED001" },
            //     { "name": "资源情况", "id": "ISCED002" },
            //     { "name": "画像中心", "id": "ISCED01" },
            //     { "name": "学校画像", "id": "ISCED010" },
            //     { "name": "学院画像", "id": "ISCED011" },
            //     { "name": "课程画像", "id": "ISCED012" },
            //     { "name": "教师画像", "id": "ISCED013" },
            //     { "name": "报告中心", "id": "ISCED04" },
            //     { "name": "系统报告", "id": "ISCED040" },
            //     { "name": "自定义报告", "id": "ISCED041" },
            //     { "name": "教学改进", "id": "ISCED05" },
            //     { "name": "首页", "id": "ISCED050" },
            //     { "name": "异常情况下发", "id": "ISCED051" },
            //     { "name": "异常情况回复", "id": "ISCED052" },
            //     { "name": "异常情况跟踪", "id": "ISCED053" },
            //     { "name": "设置", "id": "ISCED06" },
            //     { "name": "角色权限", "id": "ISCED060" },
            //     { "name": "角色分配", "id": "ISCED061" },
            //     { "name": "功能设置", "id": "ISCED062" },
            //     { "name": "消息设置", "id": "ISCED063" },
            //     {"name":"报表统计","id":"ISCED02"},
            //     {"name":"教学秩序","id":"ISCED020"},
            //     {"name":"课程统计","id":"ISCED0200"},
            //     {"name":"教师统计","id":"ISCED0201"},
            //     {"name":"教学质量","id":"ISCED021"},
            //     {"name":"课程统计","id":"ISCED0210"},
            //     {"name":"教师统计","id":"ISCED0211"},
            //     {"name":"资源情况","id":"ISCED022"},
            //     {"name":"教室统计","id":"ISCED0220"},
            //     {"name":"教师统计","id":"ISCED0221"},
            //     {"name":"明细结果","id":"ISCED03"},
            //     {"name":"教学秩序","id":"ISCED030"},
            //     {"name":"教师考勤","id":"ISCED0300"},
            //     {"name":"到课率","id":"ISCED0301"},
            //     {"name":"前排就座率","id":"ISCED0302"},
            //     {"name":"低头率","id":"ISCED0303"},
            //     {"name":"课堂违纪","id":"ISCED0304"},
            //     {"name":"教学质量","id":"ISCED031"},
            //     {"name":"教学分析","id":"ISCED0310"},
            //     {"name":"学生听讲反馈","id":"ISCED0311"},
            //     {"name":"课堂互动","id":"ISCED0312"},
            //     {"name":"资源情况","id":"ISCED032"},
            //     {"name":"多媒体使用","id":"ISCED0320"},
            //   ]

            // }]
            let systemTime
            if (res.data.roleData.length) {
              let arr = _.filter(res.data.roleData || [], o => o.menuData.length) // 剔除无菜单权限的角色
              console.log('arr', arr)
              if (arr.length) {
                // 有权限进入项目
                arr.map(item => {
                  item.menuData = GetMenu(item.menuData)
                });
                ISCED_curRoleInfo = arr[0];
                res.data.roleData = arr
                systemTime = res.data.systemTime // 获取服务器时间
                this.props.ws_saveGlobalData(res.data, "ISCED_roleData");
                this.props.ws_saveGlobalData(ISCED_curRoleInfo, "ISCED_curRoleInfo");
              } else {
                // 无权限进入项目跳转无权限页面
                this.props.history.push('/error')
                return
              }

            } else {
              message.warning('菜单数据获取失败，请稍后重试或联系管理员')
              return;
            }
            // 获取学期数据
            request('/api/public/getSemesterList', {}, (res) => {
              if (res.result && res.data) {
                if (res.data.length) {
                  let ISCED_cutSemesterData = {};
                  res.data.map((item, index) => {
                    let weekTemp = [];
                    for (let i = 1; i <= parseInt(item.weekMax); i++) {
                      weekTemp.push({
                        weekId: i.toString(),
                        weekName: `第${i}周`
                      });
                      item.weekList = weekTemp;
                    }
                    request('/api/public/getWeekDate', { semesterId: item.semesterId }, (res1) => {
                      if (res1.result && res1.data) {
                        item.weekList.map(dt => {
                          let t = _.find(res1.data, (o) => { return o.weekId == dt.weekId })
                          Object.assign(dt, { startTime: t ? t.startTime : '', endTime: t ? t.endTime : '', disable: (systemTime > t.endTime || systemTime === t.endTime || (systemTime > t.startTime && systemTime < t.endTime)) ? false : true })
                        })
                      }
                    })
                    // 获取学期对应周次具体时间
                    let subTemp = item.semesterName.substr(-1, 1);//截取最后1位
                    item.semesterName = subTemp === "2" ?
                      item.semesterName.replace(/(.*)_2/, '$1学年（春）') :
                      item.semesterName.replace(/(.*)_1/, '$1学年（秋）');
                    let sectionTemp = [];
                    for (let i = 1; i <= parseInt(item.sectionMax); i++) {
                      sectionTemp.push(
                        {
                          sectionId: i.toString(),
                          sectionName: `第${getSection(i)}节`
                        }
                      );
                      item.sectionList = sectionTemp;
                    }
                    if (item.isCutSemester === "1") {
                      ISCED_cutSemesterData = item;
                    }
                  });
                  if (!Object.getOwnPropertyNames(ISCED_cutSemesterData).length) {
                    ISCED_cutSemesterData = res.data[0];
                  }
                  this.props.ws_saveGlobalData(res.data, "ISCED_semesterList");
                  this.props.ws_saveGlobalData(ISCED_cutSemesterData, "ISCED_cutSemesterData");
                  this.getPublicData();
                } else {
                  message.warning('学期暂无数据');
                }

              } else {
                message.warning('数据获取失败，请重新登录或联系管理员');
              }
            })

          } else {
            message.warning('数据获取失败，请重新登录或联系管理员');
          }
        }).catch(() => {
          message.warning('数据获取失败，请重新登录或联系管理员');
        })
      } else if (G.ISCED_token && G.ISCED_orgcode) {
        let params = this.props.match.params
        if (params.id) {
          this.props.ws_saveGlobalData(G.ISCED_curRoleInfo, "ISCED_curRoleInfo");
          this.getPublicData('1')
        }
      }
    }
  }

  /**
   * 公共数据请求
   * @param {String} type 0: 只初次请求 1: 切换角色及初次均请求
   */
  getPublicData (type) {
    let postData = [
      {
        name: 'ISCED_courseTypeList', // 获取课程类型列表
        url: '/api/public/getCourseTypeList',
        params: {},
        type: '0'
      }, {
        name: 'ISCED_courseList', // 获取课程列表
        url: '/api/public/getCourseList',
        params: {
          searchValue: "",
          couTypeId: "",
          collegeId: "",
          semesterId: G.ISCED_cutSemesterData.semesterId,
          teacherId: G.ISCED_curRoleInfo.roleType === '5' ? G.ISCED_roleData.accountId : '' //1.21
        },
        type: '1'
      }, {
        name: 'ISCED_teacherList', // 获取教师列表
        url: '/api/public/getTeacherList',
        params: {
          searchValue: "",
          semesterId: "",
          collegeId: "",
          semesterId: G.ISCED_cutSemesterData.semesterId,
          teacherId: G.ISCED_curRoleInfo.roleType === '5' ? G.ISCED_roleData.accountId : '' //1.21
        },
        type: '1'
      }, {
        name: 'ISCED_collegeList', // 获取学院列表
        url: '/api/public/getDepartmentList',
        params: {
          searchValue: "",
          courseId: "",
          teacherId: G.ISCED_curRoleInfo.roleType === '5' ? G.ISCED_roleData.accountId : '', //1.21
          couTypeId: "",
          semesterId: G.ISCED_cutSemesterData.semesterId
        },
        type: '1'
      }, {
        name: 'ISCED_codeList', // 获取码表数据
        url: '/api/public/getCodeList',
        params: {},
        type: '0'
      }, {
        name: 'ISCED_setInfo', // 获取设置信息
        url: '/api/system/getSetInfo',
        params: {},
        type: '1'
      }, {
        name: 'ISCED_sysName', // 系统名称
        url: '/api/public/getSystemName',
        params: {},
        type: '0'
      }];
    let begData = [];
    postData.map(item => {
      begData.push(new Promise((resolve, reject) => {
        if (type === '1' && item.type === '0') {
          // 角色切换不做请求
          return resolve(true)
        }
        request(item.url, item.params, (res) => {
          if (res.result && res.data) {
            if (item.name === 'ISCED_setInfo') {
              let info = JSON.parse(JSON.stringify(G.ISCED_curRoleInfo));
              // 根据课堂数据分析配置关闭菜单明细及报表的教学质量
              if (res.data.dataAnalyze === '0') {
                let t1 = _.findIndex(info.menuData, { key: "ISCED02" })
                let t2 = _.findIndex(info.menuData, { key: "ISCED03" })
                if (t1 > -1) {
                  // 删除报表中的教学质量
                  let ind1 = _.findIndex(info.menuData[t1].children, { key: "ISCED021" });
                  if (ind1 > -1) {
                    info.menuData[t1].children.splice(ind1, 1)
                  }

                }
                if (t2 > -1) {
                  // 删除明细中的教学质量
                  let ind2 = _.findIndex(info.menuData[t2].children, { key: "ISCED031" });
                  if (ind2 > -1) {
                    info.menuData[t2].children.splice(ind2, 1)
                  }
                }
              }
              // 更新全局
              this.props.ws_saveGlobalData(info, "ISCED_curRoleInfo");
            }
            if (item.name === 'ISCED_sysName') {
              // 设置标题
              let len = res.data.length
              document.querySelector("head>title").innerHTML = res.data;
              if (len && len > 6) {
                let config = {
                  fontSize: len ? 27 - (len - 5) : 27
                }
                this.props.ws_saveGlobalData(config, 'ISCED_sysNameConfig');
              }
            }
            this.props.ws_saveGlobalData(res.data, item.name);
            resolve(res.result)
          } else {
            message.warning('获取数据失败，请稍后重试或联系管理员');
          }
        }, () => {
          message.warning('请求失败，请联系管理员');
        })
      })
      )
    })
    Promise.all(begData).then((result) => {
      setTimeout(() => {
        this.props.history.push("/home");
      }, 500);
    }).catch((error) => {
      setTimeout(() => {
        message.warning('数据获取失败，请重新登录或联系管理员');
      }, 2000);
    })
  }
  render () {
    let types = [
      "blank",
      "balls",
      "bars",
      "bubbles",
      "cubes",
      "cylon",
      "spin",
      "spinningBubbles",
      "spokes"
    ];
    return (
      <>
        <div
          style={{
            position: "fixed",
            // background: "#282c34",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}
        >
          <div style={{ margin: "100px 100px" }}>
            <span
              style={{ color: "#1479CC", margin: "0 0 30px", fontSize: 20, fontWeight: 'bold' }}
            >
              {G.systeamTitle}
            </span>
            <ReactLoding type={"bars"} color="#1479CC" />
          </div>
          <div
            style={{
              position: "fixed",
              bottom: 20,
              right: 62
            }}
          >
            <ReactLoding
              type={"spinningBubbles"}
              color="#1479CC"
              width="35px"
              height="35px"
            />
          </div>
        </div>
      </>
    );
  }
}
