/*
 * @Author: junjie.lean
 * @Date: 2019-08-09 16:06:49
 * @Last Modified by: xm
 * @Last Modified time: 2021-01-25 17:00:11
 */
/**
 * @description 听评课教师 课表下的播放页
 */
import React, { Component } from "react";
import { Select, Tabs, message, Pagination, Input, Modal, Spin, Tooltip } from "antd";
import { withRouter } from "react-router-dom";
import { SVG, IMG } from "./../../../components/tpk/base.jsx";
// import { connect } from "react-redux";
import "./../../../../style/tpk/JC_jxjc_playerPage.scss";
import "./../../../../style/tpk/JC_player.scss";
import { request } from "./../../../../util/request_2.12";
// import _x from "./../../../../js/_x/index";
// const Ajax = _x.util.request.request;
import { G } from "./../../../../config/g";

import MyInput from "../../../components/tpk/gwj_input.jsx";
import MyComments from "../../../components/tpk/gwj_comments.jsx";
import MyDiscipline from "../../../components/tpk/gwj_discipline.jsx";
import MyTable from "../../../components/tpk/gwj_table.jsx";
import PIC_noData from "./../../../../media/picture/nodata1.png";
import Multiscreen from "./../../../publicComponent1/multiScreen.jsx";
import OneScreen from "../../../publicComponent1/oneScreen.jsx";
import TwoScreen from "../../../publicComponent1/twoScreen.jsx";
import "./../tpkMsPlayer.css";
// import cab from './../../../publicComponent/axvlc.cab'
import robot from './../../../../media/picture/robot.png'

const Option = Select.Option;
const TabPane = Tabs.TabPane;
const { TextArea } = Input;

let count = 0;

@withRouter
export default class TpkMsPlayerComponent extends Component {
  constructor(props) {
    super(props);
    let testurl =
      "rtmp://10.4.3.47:1936/live|rtspstd_hik/10.4.2.141/554/1/main/admin/jfkj12345";
    this.state = {
      classInfo: {},
      addrList: [],
      isLive: false,
      selectValue: "",
      videoUrl: [],
      currentId: "",
      currentPage: 1,
      type: "4", //类型 1教学检查评论 4课堂秩序评论
      comment: {}, //评论信息
      tableInfo: [], //课堂评分表格信息
      isComment: false, //是否已经评分
      isRest: false,
      tipScrip: "加载中...",
      msClassInfo: {
        cName: "-", //学院名
        seTime: "-", //节次
        tName: "-", // 教师名
        clName: "-", //课堂名
        sCount: "-", //学生人数
        atRate: "-" // 出勤率
      },
      isReadytoRenderPlayer: false,
      videoConfig: {
        baseWidth: 1865,
        isLive: 1,
        url: [testurl, testurl, testurl, testurl]
      },
      ss: {
        visible: false,
        time: "",
        base64: "",
        id: ""
      },
      isHideRobot: true,
      showScreen: '',//判断有多屏视频显示屏数
      showRobootInfo: true, //机器人显示隐藏
      rtspUrl: '',//rtsp视频流地址
      isIE: null, //是否是ie
      isNvr: null,//是否是rtsp视频流
      isVlcInstalled: null,//是否安装vlc
      rtspRtmp: null,//判断是否调用vlc false-调用rtmp ， true-条用vlc,
      robotFlag: false
    };
    this.robotClick = this.robotClick.bind(this);
    this.isIE = this.isIE.bind(this);
    this.isInstalledVlc = this.isInstalledVlc.bind(this);
  }
  /* 窗口变化是 动态设置ck播放器的宽高 */
  windowResize = () => {
    let contentDOM = document.querySelector(".lean-video-titleinfo");
    let baseWidth = 1300;
    if (contentDOM) {
      baseWidth = contentDOM.clientWidth - 10;
    }
    let { Childid } = this.state;
    console.log('Childid', Childid);

    this.setState({
      videoConfig: {
        ...this.state.videoConfig,
        baseWidth
      }
    })
  }
  componentDidMount() {
    window.addEventListener('resize', this.windowResize)
    let param = this.props.match.params;
    let id = JSON.parse(param.id);
    let type = param.type;
    console.log("param:", id);
    console.log(type);
    this.robotClick(id);
    this.isIE();
    if (this.isIE()) {
      this.isInstalledVlc()
    }
    this.setState(
      {
        currentId: id.curriculumallId,
        researchTeachId: id.researchTeachId || null,
        type
      },
      () => {
        const { currentId, researchTeachId } = this.state;
        // 获取播放数据 和教室信息
        this.getInfo(currentId);
        // 查询是否在课间 在此不需要，因为这个播放页不放直播
        // this.reqIsRest(id);
        // 1  我的教研课  3  教研评课
        if (type === "3") {
          // 判断这个老师 是否具有评分权限
          this.getTeacherType(currentId);
          // 请求课堂点评的评论列表
          this.getDpList(currentId, researchTeachId, type);
        } else if (type === "1") {
          // 1  我的教研课  没有评分  获取列表
          this.getDpList(currentId, researchTeachId, type);
        } else if (type === "4") {
          // 4 随堂听课
          this.getSttComent(currentId, researchTeachId, type);
        } else {
          this.reqCommentPage({
            pageNumber: this.state.currentPage,
            // 这个需要判断
            type: 1,
            curriculumallId: currentId
          });
        }
      }
    );
  }

  componentWillMount() {
    count = 0;
  }

  // 获取播放数据 和教室信息
  getInfo = id => {
    let _this = this;
    request(
      // "api/web/patroller_realtime/get_patrol_video",/**老地址 */
      "api/web/patroller_realtime/get_play_page_video",
      { curriculumallId: id },
      res => {
        let contentDOM = document.querySelector(".lean-video-titleinfo");
        let baseWidth = 1300;
        if (contentDOM) {
          baseWidth = contentDOM.clientWidth - 10;
        }

        if (res.code == "200") {
          //...处理数据
          // this.setState({
          //   videoConfig: {
          //     url: ""
          //   }
          // });

          let { data } = res;
          
          if (data.hasOwnProperty("Error")) {
            message.error(data.Error);
            _this.setState({
              videoConfig: {
                getUrlError: true,
                baseWidth
              },
              isReadytoRenderPlayer: true
            });
            return;
          }
         
          if (!data.flag) {
            message.error('无视频数据')
            _this.setState({
              videoConfig: {
                getUrlError: true,
                baseWidth
              },
              isReadytoRenderPlayer: true
            });
            // return;
          }
          let cName = "",
            seTime = "",
            tName = "",
            clName = "",
            sCount = "",
            atRate = "";
          let { addrList } = data;
          let typeList = [[], [], []];
          let url = [];
          let showScreen = []; //显示视频个数数组
          let rtspUrl = ""; //rtsp视频流地址
          //取流地址的操作
          if (data.hasOwnProperty("addrList") && data.addrList.length > 0) {
            //第一遍，序列化后端的数据结构
            for (let i = 1; i <= 3; i++) {
              let tmp = _.find(addrList, { type: i });
              if (tmp) {
                typeList[i - 1].push(tmp);
              }
            }
            //第二遍，筛出对象中的url流地址
            for (let j = 0; j < typeList.length; j++) {

              if (typeList[j].length == 0) {
                typeList[j][0] = {
                  _url_: null,
                  type: j + 1
                };
                continue;
              }

              typeList[j].map((item, ix) => {
                let { urlList, type } = item;
                if (
                  urlList == null ||
                  Object.prototype.toString.call(urlList).slice(8, -1) !=
                  "Array"
                ) {
                  //异常容错
                  _this.setState({
                    videoConfig: {
                      getUrlError: true,
                      baseWidth
                    },
                    isReadytoRenderPlayer: true
                  });
                  return;
                }
                let hdString = data.isLive ? "hd" : "HD";
                let tmp = _.find(urlList, { playtype: hdString });
                let { list } = tmp;
                if (data.isLive) {
                  let rtmpUrl = _.find(list, { videotype: "rtmp" });
                  let url = rtmpUrl.url; //最终遍历出来的url地址
                  let urlObj = {
                    _url_: url,
                    type: type
                  }
                  typeList[j][ix] = urlObj
                } else {
                  if (data.isNvr) {
                    let rtsp = _.find(list, { videotype: 'rtsp' });
                    if (rtsp) {
                      rtspUrl = rtsp.url
                    }
                  } else {
                    let rtmpUrl = _.find(list, { videotype: "rtmp" });
                    let url = rtmpUrl.url; //最终遍历出来的url地址
                    let urlObj = {
                      _url_: url,
                      type: type
                    }
                    typeList[j][ix] = urlObj
                  }
                }
                // typeList[j][ix]._url_ = url;
                // console.log("url:::", url);
              });
            }
            if (data.isLive) {
              //第三遍，将筛出来的url地址拿出来
              for (let z = 0; z < typeList.length; z++) {
                url[z + 1] = typeList[z][0];
                // url[z + 1] = typeList[z][0]._url_;
              }
              for (let i = 1; i < url.length; i++) {
                if (url[i]._url_ == undefined) {
                  continue
                }
                showScreen.push(url[i])
              }
            } else {
              if (!(data.isNvr)) {
                //第三遍，将筛出来的url地址拿出来
                for (let z = 0; z < typeList.length; z++) {
                  url[z + 1] = typeList[z][0];
                  // url[z + 1] = typeList[z][0]._url_;
                }
                for (let i = 1; i < url.length; i++) {
                  if (url[i]._url_ == undefined) {
                    continue
                  }
                  showScreen.push(url[i])
                }
              }
            }
          }
         
          //取基础信息的操作
          if (data.hasOwnProperty("cfp")) {
            // console.log("进入了判断");
            let { cfp } = data;
            let sTime = new Date(cfp.actureStartTime),
              eTime = new Date(cfp.actureEndTime);

            cName =
              cfp.curriculum[0].grdListName +
              " - " +
              cfp.curriculum[0].curClassName;
            seTime = `${cfp.lessonLableType}(${sTime.getHours()}:${sTime.getMinutes() < 10
                ? "0" + sTime.getMinutes()
                : sTime.getMinutes()
              }-${eTime.getHours()}:${eTime.getMinutes() < 10
                ? "0" + eTime.getMinutes()
                : eTime.getMinutes()
              })`;
            tName = cfp.curriculum[0].teacherName;
            clName = cfp.curriculum[0].subjectName;
            sCount = cfp.curriculum[0].stuNum || 0;
            atRate = sCount ? (cfp.attendance / sCount).toFixed(3) * 100 + "%" : '-';
          }
          _this.setState({
            ..._this.state,
            videoConfig: {
              ...this.state.videoConfig,
              getUrlError: false,
              baseWidth,
              url,
              isLive: data.isLive ? 1 : 0 //0录播，1直播
            },
            isReadytoRenderPlayer: true,
            currentId: id,
            msClassInfo: {
              cName,
              seTime,
              tName,
              clName,
              sCount,
              atRate
            },
            showScreen: showScreen.length,
            rtspUrl: rtspUrl,
            isNvr: data.isNvr,
            rtspRtmp: data.isLive ? false : data.isNvr ? true : false, //true-调用vlc，false-调用原有逻辑播放rtmp
          });
        }
      }
    );
  };
  /* 判断是否是ie浏览器 */
  isIE() {
    let activeXObject = (!!window.ActiveXObject || "ActiveXObject" in window);
    this.setState({
      isIE: activeXObject ? true : false
    });
    return activeXObject;
  }
  /* 判断vlc安装状态 */
  isInstalledVlc() {
    let vlcObj = null;
    try {
      vlcObj = new ActiveXObject("VideoLAN.Vlcplugin.2");
      if (vlcObj != null) {
        // alert('已安装vlc');
        this.setState({
          isVlcInstalled: true
        })
      }
    } catch (e) {
      this.setState({
        isVlcInstalled: false
      })
    }
  }
  // 判断这个老师 是否具有评分权限
  getTeacherType = id => {
    const baseinfo = JSON.parse(sessionStorage.getItem('baseinfo'))
    request(
      "api/web/common/can_score",
      {
        teacherId: baseinfo.userId,
        curId: id
      },
      res => {
        if (res.result && res.code === "200") {
          if (res.data) {
            // console.log("这个老师能够评分");
            this.setState({
              teacherHasScore: res.data
            });
          } else {
            // console.log("这个老师不能评分");
            this.setState({
              teacherHasScore: false
            });
          }
        } else {
          this.setState({
            teacherHasScore: false
          });
          message.warning(res.message || "查询该老师是否具有评分权限失败！");
        }
      },
      err => {
        this.setState({
          teacherHasScore: false
        });
        message.warning(res.message || "查询该老师是否具有评分权限失败！");
      }
    );
  };

  /**
   * 管理员已经评分后查询评分
   */
  reqGetScore = args => {
    // request('api/web/teacommon/get_finished_research_job', {
    request(
      "api/web/teacommon/evaluateModelList",
      {
        // "curriculumallId": args.curriculumallId
      },
      res => {
        if (res.result && res.code === "200") {
          let data = [],
            i = 1,
            len = 0;
          res.data.length
            ? res.data.map((item, index) => {
              len = item.childList.length;
              len
                ? item.childList.map((item2, index2) => {
                  data.push({
                    key: String(i++),
                    evaluateModelName1: item.title,
                    len: index2 % len === 0 ? len : 0,
                    evaluateModelName2: item2.title,
                    evaluateModelDescription: item2.content,
                    score: item2.totalScore,
                    value: item2.score
                  });
                })
                : null;
            })
            : null;
          // console.log(data)
          this.setState({ tableInfo: data });
        } else {
          message.error("查询失败");
          this.setState({ tableInfo: [] });
        }
      },
      () => {
        message.error("接口报错，请联系管理员");
        this.setState({ tableInfo: [] });
      }
    );
  };

  // 获取 教研评课 评论信息
  getDpList = (cid, uid, type) => {
    request(
      "api/web/research_job/get_comment",
      {
        // 我的教研课 获取列表 不需要uid 传null
        uid: type === "1" ? null : uid,
        cid: cid,
        //  "1我的教研课  2教研评课",
        type: type === "1" ? 1 : 2,
        pageSize: 10,
        pageIndex: this.state.currentPage
      },
      res => {
        if (res.result && res.code === "200") {
          if (res.data) {
            if (type === "3") {
              this.setState({
                jyComment: res.data
                // isComment: res.data[0].commontFlag,
                // isScore: res.data[0].scoreFlag
              });
            } else if (type === "2") {
              this.setState({
                wdjyComent: res.data
              });
            } else if (type === "1") {
              this.setState({
                jyComment: res.data
              });
            }
          } else {
            if (type === "3") {
              this.setState({ jyComment: {} });
            }

            if (type === "2") {
              this.setState({
                wdjyComent: []
              });
            }
          }
          this.setState({ totalElements: res.total });
        } else {
          message.error(res.message || "请求服务中断，请联系管理员！");
          this.setState({ jyComment: {}, totalElements: 0 });
        }
      },
      () => {
        message.error("请求服务中断，请联系管理员！");
        this.setState({ jyComment: {}, totalElements: 0 });
      }
    );
  };

  // 获取 我的随堂听/随堂听课 的评论信息
  getSttComent = (cid, uid, type) => {
    request(
      "api/web/research_job/get_listen_note",
      {
        // 我的随堂听 获取列表 不需要uid 传null
        uid: type === "4" ? uid : null,
        cid: cid,
        // "1我的随堂听,2随堂听课",   type 4 随堂听课
        type: type === "4" ? 2 : 1
      },
      res => {
        if (res.result && res.code === "200") {
          if (type === "4") {
            //随堂听课
            this.setState({
              sttComment: res.data
            });
          }
          if (type === "2") {
            // 我的随堂听
            this.setState({
              wdsttComment: res.data
            });
          }
        } else {
          message.error(res.message || "服务中断，请联系管理员！");
          if (type === "4") {
            //随堂听课
            this.setState({
              sttComment: []
            });
          }
          if (type === "2") {
            // 我的随堂听
            this.setState({
              wdsttComment: []
            });
          }
        }
      }
    );
  };

  // tab切换
  callback = key => {
    let { researchTeachId, currentId, type } = this.state;
    // console.log(key);
    new Promise((resolve, reject) => {
      this.setState({ tab: key, currentPage: 1 });
      resolve(true);
    }).then(result => {
      // 课堂点评
      if (key === "1" || key === "7") {
        this.getDpList(currentId, researchTeachId, type);
      }

      if (key == "8") {
        //  也就是教学检查
        this.reqCommentPage({
          pageNumber: this.state.currentPage,
          type: 1, // 教学检查评论的 1  课堂秩序 2
          curriculumallId: currentId
        });
      }

      if (key === "3") {
        // 随堂听课
        this.getSttComent(currentId, researchTeachId, type);
      }
      if (key == "9") {
        // 随堂听课
        // this.getSttComent(currentId, researchTeachId, type);
        this.reqCommentPage({
          pageNumber: this.state.currentPage,
          type: 3,
          curriculumallId: currentId
        });
      }

      if (key == "2") {
        // 量表评分
        this.reqModel().then(result => {
          // this.reqGetScoreStatus({ curriculumallId: currentId }).then(
          // result => {
          this.setState({ isComment: result });
          // if (result) {
          // if (this.state.isScore) {
          // if (this.state.teacherHasScore) {
          // this.reqGetScore({ curriculumallId: currentId })
          this.get_teach_score({ uid: researchTeachId }).then(() => {
            if (!this.state.isScore) {
              this.reqGetScore({ curriculumallId: currentId });
            }
          });
          //         } else {
          //           this.reqGetScore({ curriculumallId: currentId })
          //         }
          //       } else {
          //         //增加评分
          //       }
          //     }
          //   )
        });
      }

      if (key == "5" || key == "10") {
        // 课堂秩序
        this.reqCommentPage({
          pageNumber: this.state.currentPage,
          type: 4,
          curriculumallId: currentId
        });
      }

      if (key == "6" || key == "11") {
        // 教学反思
        this.reqCommentPage({
          pageNumber: this.state.currentPage,
          type: 5,
          curriculumallId: currentId
        });
      }

      if (key == "4") {
        // 随堂听笔记
        // 请求列表
        this.reqCommentPage({
          pageNumber: this.state.currentPage,
          type: 3,
          curriculumallId: currentId
        });
      }
    });
  };

  get_teach_score = params => {
    return new Promise(resolve => {
      request(
        "api/web/research_job/get_teach_score",
        params,
        res => {
          if (res.result && res.code === "200") {
            if (res.data && res.data.length) {
              let data = [],
                i = 1,
                len = 0;
              res.data.length
                ? res.data.map((item, index) => {
                  len = item.childList.length;
                  len
                    ? item.childList.map((item2, index2) => {
                      data.push({
                        key: String(i++),
                        evaluateModelName1: item.title,
                        len: index2 % len === 0 ? len : 0,
                        evaluateModelName2: item2.title,
                        evaluateModelDescription: item2.content,
                        score: item2.totalScore,
                        value: item2.score
                      });
                    })
                    : null;
                })
                : null;
              // console.log(data)
              this.setState({ tableInfo: data, isScore: true }, () => {
                resolve();
              });
            } else {
              this.setState({ isScore: false }, () => {
                resolve();
              });
            }
          } else {
            message.error("查询失败");
            this.setState({ isScore: false }, () => {
              resolve();
            });
          }
        },
        () => {
          message.error("接口报错，请联系管理员");
          this.setState({ isScore: false }, () => {
            resolve();
          });
        }
      );
    });
  };

  /**
   * 查看课堂评分部分是否已经评分
   */
  reqGetScoreStatus = param => {
    return new Promise((resolve, reject) => {
      request("api/web/teacommon/get_score_status", param, res => {
        if (res.result && res.code === "200") {
          resolve(res.data.result);
        } else {
          reject(false);
        }
      });
    });
  };

  // 获取评分模板
  reqModel = () => {
    return new Promise((resolve, reject) => {
      request(
        "api/web/teacommon/evaluateModelList",
        {},
        res => {
          if (res.result && res.code === "200") {
            // console.log(res);
            let data = [],
              i = 1,
              len = 0;
            res.data.length
              ? res.data.map((item, index) => {
                len = item.childModelList.length;
                len
                  ? item.childModelList.map((item2, index2) => {
                    data.push({
                      key: String(i++),
                      evaluateModelName1: item.evaluateModelName,
                      len: index2 % len === 0 ? len : 0,
                      evaluateModelName2: item2.evaluateModelName,
                      evaluateModelName2Id: item2.evaluateModelId,
                      evaluateModelDescription:
                        item2.evaluateModelDescription,
                      score: item2.score
                    });
                  })
                  : null;
              })
              : null;
            this.setState({ tableInfo: data });
            resolve(true);
          } else {
            this.setState({ tableInfo: [] });
          }
        },
        () => {
          message.error("接口报错，请联系管理员");
          this.setState({ tableInfo: [] });
        }
      );
    });
  };

  // 视屏播放页面中，教学检查部分的评论信息
  reqCommentPage = args => {
    // console.log(args);
    request(
      "api/web/teacommon/commentPage",
      {
        curriculumallId: args.curriculumallId,
        pageNumber: args.pageNumber,
        pageSize: 10,
        type: args.type.toString()
      },
      res => {
        if (res.result && res.code === "200") {
          this.setState({ comment: res.data });
        } else {
          this.setState({ comment: {} });
        }
      },
      () => {
        message.error("接口报错，请联系管理员");
        this.setState({ comment: {} });
      }
    );
  };

  mapUrllist = data => {
    return data.map(item => {
      if (item && item.list && item.list.length) {
        return { playtype: item.playtype, url: this.mapUrl(item.list) };
      }
    });
  };

  mapUrl = data => {
    let a = "";
    data.map(item => {
      if (item.videotype === "rtmp") {
        a = item.url;
      }
    });
    return a;
  };

  selectHandle = v => {
    const { addrList } = this.state;
    let t = _.find(addrList, { equipTypeNum: v });
    // url
    let videoUrl = [];
    if (t) {
      t.urlList.map(item => {
        videoUrl.push([
          item.url,
          "",
          item.playtype === "hd" ? "高清" : "标清",
          item.playtype === "hd" ? 10 : 0
        ]);
      });
    }

    this.setState({
      videoUrl,
      selectValue: v,
      refresh: true
    });

    setTimeout(() => {
      this.setState({
        refresh: false
      });
    }, 200);
  };

  renderList = data => {
    return data.map((item, index) => {
      return (
        <Option key={index} value={item.equipTypeNum}>
          {item.equipName}
        </Option>
      );
    });
  };

  // 课程信息
  findData = (data, type) => {
    let name = "";
    let { curriculum } = data;
    console.log(curriculum);
    switch (type) {
      case 1:
        if (curriculum && curriculum.length) {
          curriculum.map((item, index) => {
            if (index === 0) {
              name += item.curClassName;
            } else {
              name += `,${item.curClassName}`;
            }
          });
        }
        return name || "-";
      case 2:
        name = data.lessonLableType;
        return name || "-";
      case 3:
        if (curriculum && curriculum.length) {
          curriculum.map((item, index) => {
            if (index === 0) {
              if (item.grdListName) {
                name += item.grdListName;
              }
            } else {
              if (item.grdListName) {
                name += `,${item.grdListName}`;
              }
            }
          });
        }
        return name || "-";
      case 4:
        if (curriculum && curriculum.length) {
          name = curriculum[0].subjectName;
        }
        return name || "-";
      default:
        return name || "-";
    }
  };

  /**
   * 查询是否在课间
   */
  reqIsRest = id => {
    request(
      "api/web/teacommon/isRest",
      {
        curriculumallId: id
      },
      res => {
        if (res.result && res.code == "200") {
          this.setState({ isRest: res.data.isRest });
        } else {
          this.setState({ isRest: true });
        }
      },
      () => {
        message.error("接口报错，请联系管理员！");
        this.setState({ isRest: true });
      }
    );
  };

  // 翻页
  changePage = page => {
    let { currentId } = this.state;
    let { tab } = this.state;
    let key = tab;
    this.setState({ currentPage: page });
    if (key == "1" || key == "3" || key == "8") {
      // 课堂点评 也就是教学检查
      this.reqCommentPage({
        pageNumber: page,
        type: 1,
        curriculumallId: currentId
      });
    }

    if (key == "5" || key == "10") {
      // 课堂秩序
      this.reqCommentPage({
        pageNumber: page,
        type: 4,
        curriculumallId: currentId
      });
    }

    if (key == "6" || key == "11") {
      // 教学反思
      this.reqCommentPage({
        pageNumber: page,
        type: 5,
        curriculumallId: currentId
      });
    }
    if (key == "4") {
      // 随堂听笔记
      // 请求列表
      this.reqCommentPage({
        pageNumber: page,
        type: 3,
        curriculumallId: currentId
      });
    }
    if (key == "9") {
      // 请求 教研评课 列表
      this.reqCommentPage({
        pageNumber: page,
        type: 3,
        curriculumallId: currentId
      });
    }

    this.node.scrollIntoView();
  };

  // 教研评课中 提交的图片 大图展示
  commentPicClick = picId => {
    this.setState({
      jydpVisible: true,
      showPic: picId
    });
  };

  videoCallback = () => {
    return false;
  };

  endedCallback = type => {
    if (type === "end") {
      // 播放结束后 需要将播放器刷新
      this.setState({
        refresh: true
      });

      setTimeout(() => {
        this.setState({
          refresh: false
        });
      }, 50);
    } else if (type === "error") {
      // 这里需要做一个计数器，当计数器达到5次时 提示失败，
      count++;
      if (count > 4) {
        this.setState({
          refresh: true,
          tipScrip: "播放失败，请刷新重试或联系管理员~"
        });
      } else {
        this.setState({
          refresh: true
        });

        setTimeout(() => {
          this.setState({
            refresh: false
          });
        }, 50);
      }
    }
  };

  itemRender(current, type, originalElement) {
    if (type === "prev") {
      return <a>上一页</a>;
    }
    if (type === "next") {
      return <a>下一页</a>;
    }
    return originalElement;
  }
  componentWillUnmount() {
    count = 0;
    window.removeEventListener('resize', this.windowResize)
  }
  screenShotCallback() {
    console.log("");
  }
  // 隐藏
  robootHide = () => {
    setTimeout(() => {
      this.setState({
        showRobootInfo: false
      });
    }, 5000);
  };
  robotClick(cid) {
    if (this.state.isHideRobot) {
      request(
        "api/web/teacommon/get_class_brief",
        {
          curriculumallId: cid
        },
        _res => {
          console.log('888888')
          if (_res.code == "200" && _res.result) {
            let { data } = _res;
            let teaStatus = data.teacherStatus;
            let tState =
              teaStatus == 0
                ? "教师正常授课哦"
                : teaStatus == 1
                  ? "教师授课异常"
                  : teaStatus == 2
                    ? "教室授课迟到"
                    : teaStatus == 3
                      ? "教师私自调课"
                      : teaStatus == 4
                        ? "无人授课"
                        : teaStatus == -1
                          ? "当前不在授课状态"
                          : teaStatus == -2
                            ? "教师考勤正在努力分析中..."
                            : "";
            let tPeople = `当前教室人数: ${data.stuNum || 0}${data.shouldComeNum == -1
                ? null
                : ",(应到" + data.shouldComeNum + ")"
              }`;
            let date = new Date(data.statisticsTime || new Date());
            let lastTime = `上次统计时间：${date.toLocaleString()}`;

            let robotsay = {
              tState,
              tPeople,
              lastTime
            };
            this.setState(
              {
                robotsay,
                isHideRobot: false,
                showRobootInfo: true,
              },
              () => {
                //5s后关闭机器人
                setTimeout(() => {
                  this.setState({
                    isHideRobot: true,
                    showRobootInfo: false
                  });
                }, 5000);
              }
            );
          }
        }
      );
      // this.setState({
      //   isHideRobot: !this.state.isHideRobot
      // });
    } else {
      return false;
    }
  }

  render() {
    const {
      selectValue,
      addrList,
      classInfo,
      type,
      comment,
      totalElements,
      currentPage,
      tableInfo,
      isComment,
      isLive,
      videoUrl,
      refresh,
      currentId,
      isRest,
      teacherHasScore,
      jyComment,
      researchTeachId,
      sttComment,
      wdsttComment,
      showScreen,
      showRobootInfo,
      rtspUrl,
      isIE,
      isNvr,
      isVlcInstalled,
      rtspRtmp
    } = this.state;

    let {
      cName, //学院名
      seTime, //节次
      tName, // 教师名
      clName, //课堂名
      sCount, //学生人数
      atRate // 出勤率
    } = this.state.msClassInfo;

    let mediaStyle = {
      position: "absolute",
      top: (this.state.videoConfig.baseWidth / 100) * 21 + 20,
      left: (this.state.videoConfig.baseWidth / 3) * 2,
      zIndex: 9999
    };

    return (
      <>
        <div className="lean-video-titleinfo">
          {/* 播放信息头部 */}
          <ul>
            <li className='fanhui'
              onClick={() => { this.props.history.go(-1); }}
            >
              <SVG type="fanhui" />
            </li>
            <li>
              <SVG type="xueyuan" />
              <b>{cName}</b>
            </li>
            <li>
              <SVG type="weibiaoti1" />
              {seTime}
            </li>
            <li>
              <SVG type="teacher" />
              {tName}
            </li>
            <li>
              <SVG type="pass" />
              {clName}
            </li>
            <li>
              <SVG type="users" /> 学生人数：{sCount}
            </li>
            <li>
              <SVG type="users" />
              出勤率：{atRate}
            </li>
          </ul>
        </div>
        {this.state.isReadytoRenderPlayer ? (
          <div className="lean-msvideo-warp">
            {this.state.videoConfig.getUrlError ? null : (
              !rtspRtmp ? showScreen && showScreen === 3 ? <div className="lean-msvideo-header">
                {/* 播放切换 */}
                <div>
                  <SVG type="teacher" />
                  {"  "}教师
                </div>
                <div
                  style={{
                    marginLeft: (this.state.videoConfig.baseWidth / 3) * 2 - 100
                  }}
                >
                  <SVG type="users" />
                  {"  "}学生
                </div>
                <div style={{ ...mediaStyle }}>
                  <SVG type="mp3" style={{ width: '20px', height: '20px', fill: '#bcbcbc' }} />
                  {"  "}多媒体
                </div>
              </div> : null : null
            )}
            {
              rtspRtmp ?
                (isIE ?
                  (
                    isVlcInstalled ? <div className="yh-vlc-wrap">
                      {/* <object classid="clsid:9BE31822-FDAD-461B-AD51-BE1D1C159921" codebase="./axvlc.cab" width="1240" height="680" id="vlc" hspace="500px" */}
                      <object classid="clsid:9BE31822-FDAD-461B-AD51-BE1D1C159921"
                        // codebase={cab} 
                        codebase='https://downloads.videolan.org/pub/videolan/contrib/win32/axvlc.cab'
                        width="1240" height="680" id="vlc" hspace="500px"
                        events="True">
                        <param name="Src" value={rtspUrl} />
                        {/* <param name="Src" value="rtmp://10.4.3.88:1936/vod/file/local://D:/fms_TRMS/data/file/20191021/multi/10/add419cd179c46c6a52d10f1dc271938.mp4" /> */}
                        {/* <param name="Src" value="rtsp://admin:12345@10.4.3.90:554/streaming/tracks/101?starttime=20191023T140000Z&endtime=20191023T142000Z" />  */}
                        <param name="ShowDisplay" value="True" />
                        <param name="AutoLoop" value="True" />
                        <param name="AutoPlay" value="True" />
                      </object>
                    </div> :
                      <div className="yh-not-install">
                        <div>
                          {/* <p>您没有安装vlc插件，无法播放视频，请<a href="https://get.videolan.org/vlc/2.0.5/win32/vlc-2.0.5-win32.exe">点击此处下载安装最新的vlc插件</a></p> */}
                          <p>您没有安装vlc插件，无法播放视频，请<a href="https://mirrors.tuna.tsinghua.edu.cn/videolan-ftp/vlc/3.0.2/win32/vlc-3.0.2-win32.exe" download="vlc-3.0.2-win32.exe">点击此处下载安装最新的vlc插件</a></p>
                          <p>安装成功后，请刷新浏览器</p>
                        </div>
                      </div>
                  )
                  :
                  <div className="yh-not-support">本浏览器不支持播放，请用IE浏览器播放</div>
                )
                :
                (showScreen && showScreen == 3 ?
                  <Multiscreen
                    {...this.state.videoConfig}
                    screenShot={this.screenShotCallback.bind(this)}
                  /> : showScreen && showScreen == 2 ?
                    <TwoScreen
                      {...this.state.videoConfig}
                      screenShot={this.screenShotCallback.bind(this)}
                    /> :
                    <OneScreen
                      {...this.state.videoConfig}
                      screenShot={this.screenShotCallback.bind(this)}
                    />
                )
            }
            {/* {
              showScreen && showScreen == 3 ?
                <Multiscreen
                  {...this.state.videoConfig}
                  screenShot={this.screenShotCallback.bind(this)}
                /> : showScreen && showScreen == 2 ?
                  <TwoScreen
                    {...this.state.videoConfig}
                    screenShot={this.screenShotCallback.bind(this)}
                  /> :
                  <OneScreen
                    {...this.state.videoConfig}
                    screenShot={this.screenShotCallback.bind(this)}
                  />

            } */}
            {/* 20191024->产品为了与以前的机器人统一，现将以下机器人部分代码注释 */}
            {/* <div
              className={
                this.state.isHideRobot
                  ? "lean-robot-zone lean-robot-zone-hide "
                  : "lean-robot-zone lean-robot-zone-show"
              }
              onClick={this.robotClick.bind(this, currentId)}
            >
              {!this.state.isHideRobot ? (
                <div className="lean-robot-contentBox">
                  <p>{this.state.robotsay.tState}</p>
                  <p>{this.state.robotsay.tPeople}</p>
                  <p>{this.state.robotsay.lastTime}</p>
                </div>
              ) : null}
              <img src={require("./../../../../icon/robot.png")} />
            </div> */}
            {/* 20191024->以上注释代码替换为以下代码 */}
            {
              !showRobootInfo ? 
              <div className="JC-roboot-click" onClick={this.robotClick.bind(this, currentId)}>
                <img src={robot} alt="" />
              </div> : ''
            }
            {showRobootInfo ? (
              <div className="JC-roboot yh-roboot" id="JC-roboot-container">
                {this.robootHide()}
                <Tooltip
                  getPopupContainer={() =>
                    document.getElementById("JC-roboot-container")
                  }
                  placement="topLeft"
                  visible={true}
                  title={
                    <div className="JC-roboot-tip">
                      <div className="lean-robot-contentBox" style={{ background: 'rgba(0,0,0,0.75)' }}>
                        <p>{this.state.robotsay && this.state.robotsay.tState}</p>
                        <p>{this.state.robotsay && this.state.robotsay.tPeople}</p>
                        <p>{this.state.robotsay && this.state.robotsay.lastTime}</p>
                      </div>
                    </div>
                  }
                >
                  <div>
                    <img src={robot} alt="" />
                  </div>
                </Tooltip>

              </div>
            ) : null}
          </div>
        ) : (
            <div className="lean-videoloading">
              <Spin size="large" />
            </div>
          )}

        <div
          className="JC-jxjc-footer gwj-tabs-box"
          style={{ padding: '20px' }}
          ref={ref => (this.node = ref)}
        >
          {// 我的教研课  只是看别人对我的评价
            type === "1" ? (
              <Tabs
                defaultActiveKey={"1"}
                onChange={this.callback}
                tabBarStyle={{ height: "80px", backgroundColor: "#eff3f5" }}
              >
                <TabPane tab="课堂点评" key="1">
                  {jyComment && jyComment.length ? (
                    <div>
                      {jyComment.map((item, index) => {
                        return <MyComments key={index} info={item} type={type} />;
                      })}
                      <div className="gwj-tabs-pagination">
                        <Pagination
                          current={currentPage}
                          total={totalElements}
                          pageSize={10}
                          itemRender={this.itemRender}
                          showTotal={total => `每页10条，共 ${total} 条数据`}
                          onChange={this.changePage}
                        />
                      </div>
                    </div>
                  ) : (
                      <div className="JC-nodata-tip">
                        <img src={PIC_noData} />
                        <p>暂无数据</p>
                      </div>
                    )}
                </TabPane>
              </Tabs>
            ) : // 随堂听课  是我去听别的老师上课  进行评论 只能评论一次
              type === "4" ? (
                <Tabs
                  defaultActiveKey={"3"}
                  onChange={this.callback}
                  tabBarStyle={{ height: "80px", backgroundColor: "#eff3f5" }}
                >
                  <TabPane tab="课堂点评" key="4">
                    {sttComment &&
                      sttComment.length &&
                      sttComment[0].commontFlag ? (
                        <div className="JC-jyComment">
                          <TextArea value={sttComment[0].note} />
                        </div>
                      ) : (
                        <MyInput
                          // type={type}
                          curriculumallId={currentId}
                          researchTeachId={researchTeachId}
                          callback={() => this.callback("3")}
                          type="tea_stt"
                        />
                      )}
                  </TabPane>
                </Tabs>
              ) : // 教研评课  去听别的老师的课程
                type === "3" ? (
                  <Tabs
                    defaultActiveKey={"7"}
                    onChange={this.callback}
                    tabBarStyle={{ height: "80px", backgroundColor: "#eff3f5" }}
                  >
                    <TabPane tab="课堂点评" key="7">
                      {// commentFlag 1 已评价过了  不能再评价
                        jyComment && jyComment.length && jyComment[0].commontFlag ? (
                          <div className="JC-jyComment">
                            <TextArea value={jyComment[0].comment} />
                            {jyComment[0].picId.map((item, index) => (
                              <div
                                key={"key" + index}
                                style={{
                                  cursor: "pointer",
                                  display: "inline-block",
                                  margin: "20px 10px"
                                }}
                                onClick={this.commentPicClick.bind(this, item)}
                              >
                                <IMG
                                  src={`${G.serverUrl}/pic/findById/${item}`}
                                  width={120}
                                  height={80}
                                />
                              </div>
                            ))}
                            <Modal
                              visible={this.state.jydpVisible}
                              footer={null}
                              title={null}
                              onCancel={() => this.setState({ jydpVisible: false })}
                              className="JC-jyComment-modal"
                            >
                              <div>
                                <IMG
                                  src={`${G.serverUrl}/pic/findById/${this.state.showPic
                                    }`}
                                  width={700}
                                  height={400}
                                />
                              </div>
                            </Modal>
                          </div>
                        ) : (
                            <MyInput
                              // type={type}
                              curriculumallId={currentId}
                              researchTeachId={researchTeachId}
                              callback={() => this.callback("7")}
                              type="tea_jydp"
                              typeStatus={0}
                            />
                          )}
                    </TabPane>
                    {// jyComment.length && jyComment[0].scoreFlag ?
                      teacherHasScore ? (
                        <TabPane tab="量表评分" key="2">
                          <MyTable
                            dataSource={tableInfo}
                            isComment={this.state.isScore}
                            // isComment={teacherHasScore}
                            researchTeachId={researchTeachId}
                            curriculumallId={this.state.currentId}
                          />
                        </TabPane>
                      ) : null}
                  </Tabs>
                ) : // 我的随堂听课   看别的老师对我的评价 一个列表
                  type === "2" ? (
                    <Tabs
                      defaultActiveKey={"8"}
                      onChange={this.callback}
                      tabBarStyle={{ height: "80px", backgroundColor: "#eff3f5" }}
                    >
                      <TabPane tab="教学检查" key="8">
                        {/* <MyInput type={type} curriculumallId={currentId} callback={() => this.callback("7")} /> */}
                        {Object.keys(comment).length == 0 ? (
                          <div className="JC-nodata-tip">
                            <img src={PIC_noData} />
                            <p>暂无数据</p>
                          </div>
                        ) : comment.page.length ? (
                          <div>
                            {comment.page.map((item, index) => (
                              <MyComments key={index} info={item} type={type} />
                            ))}
                            <div className="gwj-tabs-pagination">
                              <Pagination
                                current={currentPage}
                                total={comment.totalElements}
                                pageSize={10}
                                itemRender={this.itemRender}
                                showTotal={total => `每页10条，共 ${total} 条数据`}
                                onChange={this.changePage}
                              />
                            </div>
                          </div>
                        ) : (
                              <div className="JC-nodata-tip">
                                <img src={PIC_noData} />
                                <p>暂无数据</p>
                              </div>
                            )}
                      </TabPane>
                      <TabPane tab="教研评课" key="9">
                        {Object.keys(comment).length == 0 ? (
                          <div className="JC-nodata-tip">
                            <img src={PIC_noData} />
                            <p>暂无数据</p>
                          </div>
                        ) : comment.page.length ? (
                          <div>
                            {comment.page.map((item, index) => (
                              <MyComments
                                key={index}
                                info={item}
                                type={type}
                                curriculumallId={currentId}
                                commentStatus="教研评课"
                              />
                            ))}
                            <div className="gwj-tabs-pagination">
                              <Pagination
                                current={currentPage}
                                total={comment.totalElements}
                                pageSize={10}
                                itemRender={this.itemRender}
                                showTotal={total => `每页10条，共 ${total} 条数据`}
                                onChange={this.changePage}
                              />
                            </div>
                          </div>
                        ) : (
                              <div className="JC-nodata-tip">
                                <img src={PIC_noData} />
                                <p>暂无数据</p>
                              </div>
                            )}
                      </TabPane>
                      <TabPane tab="课堂秩序" key="10">
                        {Object.keys(comment).length == 0 ? (
                          <div className="JC-nodata-tip">
                            <img src={PIC_noData} />
                            <p>暂无数据</p>
                          </div>
                        ) : comment.page.length ? (
                          <div>
                            {comment.page.map((item, index) => (
                              <MyDiscipline
                                key={index}
                                info={item}
                                curriculumallId={currentId}
                              />
                            ))}
                            <div className="gwj-tabs-pagination">
                              <Pagination
                                current={currentPage}
                                total={comment.totalElements}
                                pageSize={10}
                                itemRender={this.itemRender}
                                showTotal={total => `每页10条，共 ${total} 条数据`}
                                onChange={this.changePage}
                              />
                            </div>
                          </div>
                        ) : (
                              <div className="JC-nodata-tip">
                                <img src={PIC_noData} />
                                <p>暂无数据</p>
                              </div>
                            )}
                      </TabPane>
                      <TabPane tab="教学反思" key="11">
                        {/* 有评论 和 图片上传功能 */}
                        <MyInput
                          // type={type}
                          curriculumallId={currentId}
                          researchTeachId={researchTeachId}
                          callback={() => this.callback("11")}
                          type="tea_submit"
                          typeStatus={1}
                        />
                        {Object.keys(comment).length == 0 ? null : comment.page
                          .length ? (
                            <div>
                              {comment.page.map((item, index) => (
                                <MyComments
                                  key={index}
                                  info={item}
                                  type={type}
                                  curriculumallId={currentId}
                                />
                              ))}
                              <div className="gwj-tabs-pagination">
                                <Pagination
                                  current={currentPage}
                                  total={comment.totalElements}
                                  pageSize={10}
                                  itemRender={this.itemRender}
                                  showTotal={total => `每页10条，共 ${total} 条数据`}
                                  onChange={this.changePage}
                                />
                              </div>
                            </div>
                          ) : null}
                      </TabPane>
                    </Tabs>
                  ) : null}
        </div>
      </>
    );
  }
}
