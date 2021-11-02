/*
 * @Author: junjie.lean
 * @Date: 2019-08-07 17:26:58
 * @Last Modified by: xm
 * @Last Modified time: 2021-01-25 16:50:43
 */

/**
 * @description 教学反思多屏播放页
 */

import React, { Component } from "react";
import { Row, Col, Select, Tabs, message, Pagination, Spin, Tooltip } from "antd";
import { SVG } from "./../../components/tpk/base.jsx";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import "./../../../style/jxfs/JC_jxjc_playerPage.scss";
import { request } from "./../../../util/request_2.12";

import MyInput from "./../../components/tpk/gwj_input.jsx";
import MyComments from "./../../components/tpk/gwj_comments.jsx";
import MyDiscipline from "./../../components/tpk/gwj_discipline.jsx";
import "./../tpk/tpkMsPlayer.css";
// import cab from './../../../publicComponent/axvlc.cab';
import PIC_noData from "./../../../media/picture/nodata1.png";
import robot from "./../../../media/picture/robot.png";

import Multiscreen from "./../../publicComponent1/multiScreen.jsx";
import OneScreen from "./../../publicComponent1/oneScreen.jsx";
import TwoScreen from "./../../publicComponent1/twoScreen.jsx";

const Ajax = request;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
let count = 0;

@withRouter
@connect(
  state => state.JxjcPlayerReducer,
  {}
)
export default class JxfsMSPlayer extends Component {
  constructor(props) {
    super(props);
    let testurl =
      "rtmp://10.4.3.47:1936/live|rtspstd_hik/10.4.2.141/554/1/main/admin/jfkj12345";
    this.state = {
      videoConfig: {
        baseWidth: 1865,
        isLive: 1,
        getUrlError: false,
        url: [testurl, testurl, testurl, testurl]
        // screenShot
      },
      ss: {
        visible: false,
        time: "",
        base64: "",
        id: ""
      },
      msClassInfo: {
        cName: "-", //学院名
        seTime: "-", //节次
        tName: "-", // 教师名
        clName: "-", //课堂名
        sCount: "-", //学生人数
        atRate: "-"
      },
      isHideRobot: true,
      classInfo: {},
      isLive: false,
      addrList: [],
      videoUrl: [],
      refresh: false,
      selectValue: "",
      currentId: "",
      type: "1",
      // "1-教学检查的评论，2-教研课评论，3-随堂听评论，4-课堂秩序评论 5-我的反思"
      tab: "1",
      pageSize: 10,
      currentPage: 1,
      // 评论的列表信息
      comment: [],
      tipScrip: "加载中...",
      isReadytoRenderPlayer: false,
      showScreen: '', //判断有多屏视频显示屏数
      showRobootInfo: true, //机器人显示隐藏
      rtspUrl: '',//rtsp视频流地址
      isIE: null, //是否是ie
      isNvr: null,//是否是rtsp视频流
      isVlcInstalled: null,//是否安装vlc
      rtspRtmp: null,//判断是否调用vlc false-调用rtmp ， true-条用vlc
    };

    // this.callback.bind(this);
    // this.rerenderCallback.bind(this);
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
    let params = this.props.match.params || { id: "", type: "" };
    let { id, type } = params;
    this.setState({
      currentId: id
    })
    let _this = this;
    this.robotClick(id);
    this.isIE();
    if (this.isIE()) {
      this.isInstalledVlc()
    }
    //获取流地址
    Ajax(
      // "api/web/patroller_realtime/get_patrol_video",/*老地址*/
      "api/web/patroller_realtime/get_play_page_video",
      {
        curriculumallId: id
      },
      res => {
        let contentDOM = document.querySelector(".lean-video-titleinfo");
        let baseWidth = 1300;
        if (contentDOM) {
          baseWidth = contentDOM.clientWidth - 10;
        }

        if (res.code == "200") {
          //...处理数据
          // console.log("接口返回成功");
          // this.setState({
          //   videoConfig: {
          //     url: ""
          //   }
          // });
          let { data } = res;

          //接口返回错误 不继续播放
          if (data.hasOwnProperty("Error")) {
            message.error(data.Error);
            _this.setState({
              videoConfig: {
                getUrlError: true
              },
              isReadytoRenderPlayer: true
            });
            return;
          }

          //接口返回无视频信息 不继续播放
          if (!data.flag) {
            message.error("无视频数据");
            _this.setState({
              videoConfig: {
                getUrlError: true
              },
              isReadytoRenderPlayer: true
            });
            return;
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
              // console.log(typeList[j]);
              //typelist是一个length为3的数组，数组中的每一项是一个播放器的数据，按需求说应该是个数组，但是现在后台拿不到多个流地址
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
                      getUrlError: true
                    }
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
              });
            }
            // console.log(typeList);
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
          console.log('chengggg')
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
            atRate = sCount ? ((cfp.attendance / sCount) * 100).toFixed(3) + "%" : '--';
          }
          console.log('tName', tName)
          console.log('clName', clName)
          console.log('sCount', sCount)

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

    this.reqCommentPage({
      pageNumber: this.state.currentPage,
      type: this.state.type,
      curriculumallId: id
    });
  }
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
  componentWillUnmount() {
    window.removeEventListener('resize', this.windowResize)
  }
  componentWillMount() {
    // count = 0
  }

  callback = key => {
    let id = this.state.currentId;
    // console.log(key);
    new Promise((resolve, reject) => {
      this.setState({ type: key, currentPage: 1 });
      resolve(true);
    }).then(result => {
      // 教学检查
      if (Number(key) == 1) {
        this.reqCommentPage({
          pageNumber: this.state.currentPage,
          type: key,
          curriculumallId: id
        });
      }
      // 课堂秩序
      if (Number(key) == 2) {
        this.reqCommentPage({
          pageNumber: this.state.currentPage,
          type: Number(key) + 2,
          curriculumallId: id
        });
      }
      // 教学反思
      if (Number(key) == 3) {
        this.reqCommentPage({
          pageNumber: this.state.currentPage,
          type: Number(key) + 2,
          curriculumallId: id
        });
      }
    });
  };

  // /**
  //   * 查看课堂评分部分是否已经评分
  //   */
  // reqGetScoreStatus = (param) => {
  //   return new Promise((resolve, reject) => {
  //     Ajax('api/web/teacommon/get_score_status', param, (res) => {
  //       if (res.result && res.code === '200') {
  //         resolve(res.data.result);
  //       } else {
  //         reject(false);
  //       }
  //     })
  //   })
  // }

  reqModel = () => {
    return new Promise((resolve, reject) => {
      Ajax(
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

  // 视屏播放页面中，教学检测部分的评论信息
  reqCommentPage = args => {
    // console.log(args);
    Ajax(
      "api/web/teacommon/commentPage",
      {
        curriculumallId: args.curriculumallId,
        pageNumber: args.pageNumber,
        pageSize: 10,
        type: Number(args.type)
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
      if (item.list && item.list.length) {
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

    console.log("d11: ", videoUrl);
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

  findData = (data, type) => {
    let name = "";
    let { curriculuams } = data;
    switch (type) {
      case 5:
        if (curriculuams && curriculuams.length) {
          curriculuams.map((item, index) => {
            if (index === 0) {
              name += item.teacherName;
            } else {
              name += `,${item.teacherName}`;
            }
          });
        }
        return name;
      case 1:
        if (curriculuams && curriculuams.length) {
          curriculuams.map((item, index) => {
            if (index === 0) {
              name += item.curClassName;
            } else {
              name += `,${item.curClassName}`;
            }
          });
        }
        return name;
      case 2:
        name = data.lessonLableType;
        return name;
      case 3:
        if (curriculuams && curriculuams.length) {
          curriculuams.map((item, index) => {
            if (index === 0) {
              name += item.grdListName;
            } else {
              name += `,${item.grdListName}`;
            }
          });
        }
        return name;
      case 4:
        if (curriculuams && curriculuams.length) {
          name = curriculuams[0].subjectName;
        }
        return name;
      default:
        return name;
    }
  };

  /**
   * 查询是否在课间
   */
  reqIsRest = id => {
    Ajax(
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

  changePage = page => {
    let { type, currentId } = this.state;
    this.setState(
      {
        currentPage: page
      },
      () => {
        this.reqCommentPage({
          pageNumber: page,
          type: type == 1 ? 1 : type == 2 ? 4 : 5,
          curriculumallId: currentId
        });

        this.node.scrollIntoView();
      }
    );
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

  screenShotCallback() {
    console.log("callback");
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
      Ajax(
        "api/web/teacommon/get_class_brief",
        {
          curriculumallId: cid
        },
        _res => {
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
    console.log("state:", this.state);

    const {
      type,
      currentPage,
      tableInfo,
      isComment,
      isRest,
      selectValue,
      addrList,
      classInfo,
      isLive,
      videoUrl,
      refresh,
      currentId,
      comment,
      // pageNumber,
      tab,
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
      <div className="lean-video-content-withrobot">
        {/* <div className="JC-jxjc-content"> */}
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
                        codebase='https://downloads.videolan.org/pub/videolan/contrib/win32/axvlc.cab'
                        // codebase={cab} 
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
              <div className="JC-roboot-click" onClick={this.robotClick.bind(this, currentId)}>
                <img src={robot} alt="" />
              </div>
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

        {/* </div> */}
        <div className="JC-jxjc-footer gwj-tabs-box" ref={ref => (this.node = ref)} style={{margin: '0 20px'}}>
          {
            <Tabs
              defaultActiveKey={type}
              onChange={this.callback}
              tabBarStyle={{ height: "80px", backgroundColor: "#eff3f5" }}
            >
              <TabPane tab="教学检查" key="1">
                {/* 教学检查只有管理员来写 */}
                {/* <MyInput type={type} curriculumallId={this.state.currentId} /> */}
                {Object.keys(comment).length == 0 ? null : comment.page
                  .length ? (
                    <div>
                      {comment.page.map((item, index) => (
                        <MyComments
                          key={index}
                          info={item}
                          type={type}
                          curriculumallId={this.state.currentId}
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
              <TabPane tab="课堂秩序" key="2">
                {Object.keys(comment).length == 0 ? null : comment.page
                  .length ? (
                    <div>
                      {comment.page.map((item, index) => (
                        <MyDiscipline
                          key={index}
                          info={item}
                          curriculumallId={this.state.currentId}
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
              <TabPane tab="教学反思" key="3">
                <MyInput
                  type={type}
                  curriculumallId={this.state.currentId}
                  callback={() => this.callback("3")}
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
                      <div className="gwj-tabs-pagination" style={{textAlign: 'right'}}>
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
              {/* <TabPane tab="课堂评分" key="4">
                <MyTable dataSource={tableInfo} isComment={isComment} />
              </TabPane> */}
            </Tabs>
          }
        </div>
      </div>
    );
  }
}
