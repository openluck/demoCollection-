/*
 * @Author: JC.Liu
 * @Date: 2019-04-13 11:01:31
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-11-19 14:09:40
 * 教学检查播放页
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
export default class TpkPlayerComponent extends Component {
  state = {
    classInfo: {},
    addrList: [],
    isLive: false,
    selectValue: "",
    videoUrl: [],
    currentId: "",
    researchTeachId: "",
    currentPage: 1,
    type: "", // 路由来源类型  1 我的教研课  2 我的随堂听 3 教研评课 4 随堂听课
    tab: "1",
    comment: {}, //评论信息
    tableInfo: [], //课堂评分表格信息
    isComment: false, //是否已经评分
    isRest: false,
    // 判断老师是否具有评分权限
    teacherHasScore: false,
    // 教研点评评价信息
    jyComment: [],
    totalElements: 0,
    // 我的教研课 评论列表
    wdjyComent: [],
    // 随堂听 评论信息
    sttComment: [],
    // 我的随堂听 评论列表
    wdsttComment: [],
    // 教研评价 中的图片点击 modal 展示
    jydpVisible: false,
    //查看大图的图片id
    showPic: undefined,
    tipScrip: "加载中..."
  };

  componentDidMount() {
    let param = this.props.match.params;
    let id = JSON.parse(param.id);
    let type = param.type;
    // console.log("param:", id);

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
    request(
      "api/web/patroller_realtime/get_patrol_video",
      {
        curriculumallId: id
      },
      res => {
        if (res.result && res.code === "200") {
          // flag 播放流地址获取成功失败标识
          let classInfo = {},
            isLive = false,
            addrList = [];
          if (res.data && res.data.flag) {
            res.data.addrList.map(item => {
              addrList.push({
                equipName: item.equipName,
                equipTypeNum: item.equipTypeNum,
                urlList: this.mapUrllist(item.urlList)
              });
            });
          } else {
            message.error(res.data.msg || "获取视频失败！");
          }
          // 课堂信息
          if (res.data && res.data.cfp && Object.keys(res.data.cfp).length) {
            classInfo = res.data.cfp;
          }
          this.setState({
            classInfo
          });

          // 直播还是录播 标识
          if (res.data.isLive) {
            isLive = res.data.isLive;
          }

          let videoUrl = [
            [
              addrList[0].urlList[0].url,
              "",
              addrList[0].urlList[0].playtype === "hd" ? "高清" : "标清",
              addrList[0].urlList[0].playtype === "hd" ? 10 : 0
            ],
            [
              addrList[0].urlList[1].url,
              "",
              addrList[0].urlList[1].playtype === "hd" ? "高清" : "标清",
              addrList[0].urlList[0].playtype === "hd" ? 10 : 0
            ]
          ];
          this.setState({
            isLive,
            addrList,
            selectValue: addrList[0].equipName,
            videoUrl,
            refresh: true
          });

          setTimeout(() => {
            this.setState({
              refresh: false
            });
          }, 200);
        } else {
          // 请求失败
          this.setState({
            classInfo: {},
            isLive: false,
            addrList: [],
            videoUrl: []
          });
        }
      }
    );
  };

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

      if (key === "3" || key == "9") {
        // 随堂听课
        this.getSttComent(currentId, researchTeachId, type);
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
        pageIndex: args.pageNumber,
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
        curriculumallId: id
      });
    }
    if (key == "9") {
      // 请求 教研评课 列表
      this.reqCommentPage({
        pageNumber: page,
        type: 2,
        curriculumallId: id
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

  render() {
    const style = {
      playerCSS: {
        display: "inline-block"
      }
    };
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
      wdsttComment
    } = this.state;
    return (
      <>
        <div className="JC-jxjc-header">
          <div className="JC-header-info">
            <Row gutter={24}>
              <Col span={8}>
                <span
                  onClick={() => {
                    this.props.history.goBack();
                  }}
                >
                  <SVG type="fanhui" style={{ fontSize: "25px" }} />
                </span>
                &nbsp;&nbsp;
                <span>{this.findData(classInfo, 1) || "-"}</span>
              </Col>
              <Col span={4}>
                <SVG type="shijian-2" title="节次" />
                &nbsp;<span>{this.findData(classInfo, 2) || "-"}</span>
              </Col>
              <Col span={4}>
                <SVG type="xueyuan" title="年级" />
                &nbsp;<span>{this.findData(classInfo, 3) || "-"}</span>
              </Col>
              <Col span={4}>
                <SVG type="icon25" title="课程" />
                &nbsp;<span>{this.findData(classInfo, 4) || "-"}</span>
              </Col>
              <Col span={4}>
                <Select value={selectValue} onChange={this.selectHandle}>
                  {this.renderList(addrList)}
                </Select>
              </Col>
            </Row>
          </div>
        </div>
        <div className="JC-jxjc-content">
          {videoUrl && videoUrl.length ? (
            !refresh ? (
              isLive ? (
                <PlayerLive
                  cid={currentId}
                  url={videoUrl}
                  style={style.playerCSS}
                  robot={true}
                  callback={this.videoCallback}
                  endedCallback={this.endedCallback}
                />
              ) : (
                // <PlayerRecord id={currentId} url={videoUrl} style={style.playerCSS} robot={true} />
                <PlayerRecord
                  cid={currentId}
                  url={videoUrl}
                  style={style.playerCSS}
                  robot={true}
                  callback={this.videoCallback}
                  endedCallback={this.endedCallback}
                />
              )
            ) : (
              <div className="JC-ssxk-noVideo">
                <div className="JC-svg">
                  <SVG
                    type="shipin"
                    style={{ fontSize: "100px" }}
                    color="#333333"
                  />
                  <p>{this.state.tipScrip}</p>
                </div>
              </div>
            )
          ) : (
            <div className="JC-ssxk-noVideo">
              <div className="JC-svg">
                <SVG
                  type="shipin"
                  style={{ fontSize: "100px" }}
                  color="#333333"
                />
                <p>{this.state.tipScrip}</p>
              </div>
            </div>
          )}
        </div>
        <div
          className="JC-jxjc-footer gwj-tabs-box"
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
                {jyComment.length ? (
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
                    type={type}
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
                jyComment.length && jyComment[0].commontFlag ? (
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
                          src={`${G.serverUrl}/pic/findById/${
                            this.state.showPic
                          }`}
                          width={700}
                          height={400}
                        />
                      </div>
                    </Modal>
                  </div>
                ) : (
                  <MyInput
                    type={type}
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
                  type={type}
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
                ) : (
                  <div className="JC-nodata-tip">
                    <img src={PIC_noData} />
                    <p>暂无数据</p>
                  </div>
                )}
              </TabPane>
            </Tabs>
          ) : null}
        </div>
      </>
    );
  }
}
