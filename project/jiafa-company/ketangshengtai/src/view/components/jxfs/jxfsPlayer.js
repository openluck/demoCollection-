/*
 * @Author: JC.Liu
 * @Date: 2019-04-13 11:01:31
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2019-08-08 11:10:46
 */


import React, { Component } from "react";
import { Row, Col, Select, Tabs, message, Pagination } from "antd";
import { SVG } from "./../../../../base";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PlayerRecord from "./../../../publicComponent/playerRecord";
import PlayerLive from "./../../../publicComponent/player";
import "./../../../../css/admin/JC_jxjc_playerPage.scss";
import _x from "./../../../../js/_x/index";

import MyInput from "../../../component/admin/jxjc/gwj_input";
import MyComments from "../../../component/admin/jxjc/gwj_comments";
import MyDiscipline from "../../../component/admin/jxjc/gwj_discipline";
import MyTable from "../../../component/admin/jxjc/gwj_table";

const Request = _x.util.request.request;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
let count = 0;
@withRouter
@connect(
  state => state.JxjcPlayerReducer,
  {}
)
export default class JxfsPlayer extends Component {
 

  componentDidMount() {
    let param = this.props.match.params;
    let id = param.id;
    let type = param.type;
    this.getInfo(id);
    this.setState(
      {
        currentId: id,
        type
      },
      () => {
        this.reqCommentPage({
          pageNumber: this.state.currentPage,
          type: this.state.type,
          curriculumallId: id
        });
        this.reqIsRest(id);
      }
    );
  }

  componentWillMount() {
    count = 0;
  }

  getInfo = id => {
    Request(
      "api/web/patroller_realtime/get_patrol_video",
      {
        curriculumallId: id
      },
      res => {
        if (res.result && res.code === "200") {
          let classInfo = {},
            isLive = false,
            addrList = [];
          // 课堂信息
          if (res.data && res.data.cfp && Object.keys(res.data.cfp)) {
            classInfo = res.data.cfp;
          }

          this.setState({
            classInfo
          });

          if (!res.data.flag) {
            return message.error(res.data.msg || "未获取到视频信息");
          }

          if (res.data && res.data.addrList && res.data.addrList.length) {
            res.data.addrList.map(item => {
              addrList.push({
                equipName: item.equipName,
                equipTypeNum: item.equipTypeNum,
                urlList: this.mapUrllist(item.urlList)
              });
            });
          }

          // 直播还是录播 标识
          if (res.data.isLive) {
            isLive = res.data.isLive;
          }
          let videoUrl = [];
          if (addrList.length) {
            if (addrList[0] && Object.keys(addrList[0].urlList).length) {
              if (addrList[0].urlList && addrList[0].urlList.length) {
                addrList[0].urlList.map(item => {
                  if (item && Object.keys(item).length) {
                    videoUrl.push([
                      addrList[0].urlList[0].url,
                      "",
                      addrList[0].urlList[0].playtype === "hd"
                        ? "高清"
                        : "标清",
                      addrList[0].urlList[0].playtype === "hd" ? 10 : 0
                    ]);
                  }
                });
              }
            }
          }

          this.setState({
            classInfo,
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
  //     Request('api/web/teacommon/get_score_status', param, (res) => {
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
      Request(
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
    Request(
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
    let { curriculum } = data;
    switch (type) {
      case 5:
        if (curriculum && curriculum.length) {
          curriculum.map((item, index) => {
            if (index === 0) {
              name += item.teacherName;
            } else {
              name += `,${item.teacherName}`;
            }
          });
        }
        return name;
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
        return name;
      case 2:
        name = data.lessonLableType;
        return name;
      case 3:
        if (curriculum && curriculum.length) {
          curriculum.map((item, index) => {
            if (index === 0) {
              name += item.grdListName;
            } else {
              name += `,${item.grdListName}`;
            }
          });
        }
        return name;
      case 4:
        if (curriculum && curriculum.length) {
          name = curriculum[0].subjectName;
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
    Request(
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

  render() {
    console.log("state:", this.state);
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
      currentPage,
      tableInfo,
      isComment,
      isLive,
      videoUrl,
      refresh,
      currentId,
      isRest
    } = this.state;

    return (
      <>
        <div className="JC-jxjc-header">
          <div className="JC-header-info">
            <Row gutter={24}>
              <Col span={4}>
                <span
                  onClick={() => {
                    this.props.history.go(-1);
                  }}
                >
                  <SVG type="fanhui" style={{ fontSize: "25px" }} />
                </span>
                &nbsp;&nbsp;
                <span>{this.findData(classInfo, 1)}</span>
              </Col>
              <Col span={4}>
                <SVG type="shijian-2" title="节次" />
                &nbsp;<span>{this.findData(classInfo, 2)}</span>
              </Col>
              <Col span={4}>
                <SVG type="xueyuan" title="学院" />
                &nbsp;<span>{this.findData(classInfo, 3)}</span>
              </Col>
              <Col span={4}>
                <SVG type="icon25" title="科目" />
                &nbsp;<span>{this.findData(classInfo, 4)}</span>
              </Col>
              <Col span={4}>
                <SVG type="laoshi" title="老师" />
                &nbsp;<span>{this.findData(classInfo, 5)}</span>
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
        <div className="JC-jxjc-footer gwj-tabs-box" ref={ref => (this.node = ref)}>
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
                ) : null}
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
                ) : null}
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
              {/* <TabPane tab="课堂评分" key="4">
                <MyTable dataSource={tableInfo} isComment={isComment} />
              </TabPane> */}
            </Tabs>
          }
        </div>
      </>
    );
  }
}
