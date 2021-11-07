/*
 * @Author: junjie.lean
 * @Date: 2019-07-30 11:20:30
 * @Last Modified by: zoe ღ
 * @Last Modified time: 2020-03-23 16:31:45
 */

/**
 * @description 听评课的多屏播放组件
 */
import React from "react";
import { withRouter } from "react-router-dom";
import Multiscreen from "./../../../publicComponent/multiScreen";
import MyComments from "./../../../component/admin/jxjc/gwj_comments";
import MyInput from "./../../../component/admin/jxjc/gwj_input";
import ScreenShotModal from "./../../../publicComponent/screenshotModal";
import { message, Spin, Pagination } from "antd";
import { SVG, IMG } from "./../../../../base";
import _x from "./../../../../js/_x/index.js";
import _ from "lodash";
import PIC_noData from "./../../../../icon/nodata1.png";
import "./../../../../css/admin/JC_jxjc_playerPage.scss";
import "./../../../../css/teacher/JC_player.scss";
import "./msVideoPlayer.css";
const Ajax = _x.util.request.request;

class MSvideoplayer extends React.Component {
  constructor(props) {
    super(props);
    let testurl =
      "rtmp://10.4.3.47:1936/live|rtspstd_hik/10.4.2.141/554/1/main/admin/jfkj12345";
    this.state = {
      videoConfig: {
        baseWidth: 1865,
        isLive: 1,
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
      classInfo: {},
      isLive: false,
      addrList: [],
      videoUrl: [],
      refresh: false,
      selectValue: "",
      currentId: "",
      type: "",
      // "1-教学检查的评论，2-教研课评论，3-随堂听评论，4-课堂秩序评论 5-我的反思"
      tab: "1",
      pageSize: 10,
      pageNumber: 1,
      // 评论的列表信息
      comment: [],
      tipScrip: "加载中...",
      isReadytoRenderPlayer: false
    };

    // this.callback.bind(this);
    // this.rerenderCallback.bind(this);
  }

  componentDidMount() {
    let params = this.props.match.params || { id: "", type: "" };
    let { id, type } = params;
    let _this = this;

    //获取流地址
    Ajax(
      "api/web/patroller_realtime/get_patrol_video",
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
          if (data.flag) {
            let cName = "",
              seTime = "",
              tName = "",
              clName = "",
              sCount = "",
              atRate = "";
            let { addrList } = data;
            let typeList = [[], [], []];
            let url = [];
            //取流地址的操作
            if (data.hasOwnProperty("addrList") && data.addrList.length > 0) {
              //第一遍，序列化后端的数据结构
              for (let i = 1; i <= 3; i++) {
                let tmp = _.find(addrList, { type: i });
                typeList[i - 1].push(tmp);
              }
              //第二遍，筛出对象中的url流地址
              for (let j = 0; j < typeList.length; j++) {
                // console.log(typeList[j]);
                //typelist是一个length为3的数组，数组中的每一项是一个播放器的数据，按需求说应该是个数组，但是现在后台拿不到多个流地址
                typeList[j].map((item, ix) => {
                  let { urlList } = item;
                  if (urlList.list[0] == null) {
                    //异常容错
                    return;
                  }
                  let tmp = _.find(urlList, { playtype: "HD" });
                  let { list } = tmp;
                  let rtmpUrl = _.find(list, { videotype: "rtmp" });
                  let url = rtmpUrl.url; //最终遍历出来的url地址
                  typeList[j][ix]._url_ = url;
                });
              }
              //第三遍，将筛出来的url地址拿出来
              for (let z = 0; z < typeList.length; z++) {
                url[z + 1] = typeList[z][0];
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
              seTime = `${cfp.lessonLableType}(${sTime.getHours()}:${
                sTime.getMinutes() < 10
                  ? "0" + sTime.getMinutes()
                  : sTime.getMinutes()
              }-${eTime.getHours()}:${
                eTime.getMinutes() < 10
                  ? "0" + eTime.getMinutes()
                  : eTime.getMinutes()
              })`;
              tName = cfp.curriculum[0].teacherName;
              clName = cfp.curriculum[0].subjectName;
              sCount = cfp.curriculum[0].stuNum || 0;
              atRate = sCount ? (cfp.attendance / sCount).toFixed(3) + "%" : '-';
            }
            _this.setState({
              ..._this.state,
              videoConfig: {
                ...this.state.videoConfig,
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
              }
            });
          } else {
            message.error("无视频数据");
          }
        }
      }
    );
  }

  callback(key) {
    console.log(key);
    this.setState(
      {
        tab: key,
        pageNumber: 1
      },
      () => {
        this.getTabData();
      }
    );
  }

  rerenderCallback() {
    console.log("rerender callback");
    this.setState(
      {
        pageNumber: 1
      },
      () => {
        this.getTabData();
      }
    );
  }

  getTabData() {
    let { state } = this;
    console.log(state);
    Ajax(
      "api/web/teacommon/commentPage",
      {
        curriculumallId: state.currentId,
        pageNumber: state.pageNumber,
        pageSize: state.pageSize,
        type: state.tab
      },
      res => {
        if (res.result && res.code === "200") {
          this.setState({ comment: res.data });
        } else {
          this.setState({ comment: {} });
        }
      },
      err => {
        message.error("服务未连接成功，请联系管理员");
        this.setState({ comment: {} });
      }
    );
  }

  // 翻页
  changePage = page => {
    this.setState({ pageNumber: page }, () => {
      this.getTabData();
    });
    this.node.scrollIntoView();
  };

  // selectHandle = v => {
  //   const { addrList } = this.state;
  //   let t = _.find(addrList, { equipName: v });
  //   // url
  //   let videoUrl = [];
  //   if (t) {
  //     t.urlList.map(item => {
  //       videoUrl.push([
  //         item.url,
  //         "",
  //         item.playtype === "hd" ? "高清" : "标清",
  //         item.playtype === "hd" ? 10 : 0
  //       ]);
  //     });
  //   }

  //   this.setState({
  //     videoUrl,
  //     selectValue: v,
  //     refresh: true
  //   });

  //   setTimeout(() => {
  //     this.setState({
  //       refresh: false
  //     });
  //   }, 200);
  // };

  itemRender(current, type, originalElement) {
    if (type === "prev") {
      return <a>上一页</a>;
    }
    if (type === "next") {
      return <a>下一页</a>;
    }
    return originalElement;
  }

  // videoCallback = () => {
  //   if (this.state.tab == 4) {
  //     // 请求课堂秩序
  //     this.getTabData();
  //   }
  // };

  // endedCallback = type => {
  //   if (type === "end") {
  //     // 播放结束后 需要将播放器刷新
  //     this.setState({
  //       refresh: true
  //     });

  //     setTimeout(() => {
  //       this.setState({
  //         refresh: false
  //       });
  //     }, 50);
  //   } else if (type === "error") {
  //     // 这里需要做一个计数器，当计数器达到5次时 提示失败，
  //     count++;
  //     if (count > 4) {
  //       this.setState({
  //         refresh: true,
  //         tipScrip: "播放失败，请刷新重试或联系管理员~"
  //       });
  //     } else {
  //       this.setState({
  //         refresh: true
  //       });

  //       setTimeout(() => {
  //         this.setState({
  //           refresh: false
  //         });
  //       }, 50);
  //     }
  //   }
  // };

  showPlayer() {
    this.setState({
      isReadytoRenderPlayer: !this.state.isReadytoRenderPlayer
    });
  }

  screenShotCallback(imgBase64) {
    console.log("父组件捕获到截图事件，并接收到图片");
    this.setState({
      ss: {
        visible: true,
        time: new Date().getTime(),
        base64: imgBase64,
        id: ""
      }
    });
  }

  screenShotCancle() {
    this.setState({
      ss: {
        visible: false,
        base64: ""
      }
    });
  }

  screenShotComplteCallback() {
    this.setState({
      ss: {
        visible: false,
        base64: ""
      }
    });
  }

  render() {
    let tabbar = [
      { tab: "听课评分", key: "2" },
      { tab: "听课评议", key: "1" },
      { tab: "课堂秩序", key: "4" },
      { tab: "教学反思", key: "5" }
    ];

    let {
      selectValue,
      addrList,
      classInfo,
      isLive,
      videoUrl,
      refresh,
      currentId,
      comment,
      pageNumber,
      tab
    } = this.state;

    let {
      cName, //学院名
      seTime, //节次
      tName, // 教师名
      clName, //课堂名
      sCount, //学生人数
      atRate // 出勤率
    } = this.state.msClassInfo;
    
    return (
      <div>
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
              <SVG type="xuesheng" />
              出勤率：{atRate}
            </li>
          </ul>
        </div>
        {this.state.isReadytoRenderPlayer ? (
          <div className="lean-msvideo-warp">
            <div className="lean-msvideo-header">
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
            </div>
            <Multiscreen
              {...this.state.videoConfig}
              screenShot={this.screenShotCallback.bind(this)}
            />
          </div>
        ) : (
            <div className="lean-videoloading">
              <Spin size="large" />
            </div>
          )}
        <div
          className="JC-jxjc-footer gwj-tabs-box"
          ref={ref => (this.node = ref)}
        >
          <div className="JC-tabbar">
            {tabbar.map(item => {
              return (
                <div
                  key={item.key}
                  onClick={() => this.callback(item.key)}
                  className={tab === item.key ? "JC-tab tab-active" : "JC-tab"}
                >
                  {item.tab}
                </div>
              );
            })}
          </div>
          {tab === "1" ? (
            <MyInput
              curriculumallId={currentId}
              callback={() => this.rerenderCallback()}
            />
          ) : null}
          {Object.keys(comment).length == 0 ? null : comment.page.length ? (
            <div>
              {comment.page.map((item, index) => (
                <MyComments
                  key={index}
                  info={item}
                // type={type}
                />
              ))}
              <div className="gwj-tabs-pagination">
                <Pagination
                  className="ll-PageStyle ll-Pg"
                  current={pageNumber}
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
        </div>
        <ScreenShotModal
          visible={this.state.ss.visible}
          id={this.state.currentId}
          base64={this.state.ss.base64}
          time={this.state.ss.time}
          cancel={this.screenShotCancle.bind(this)}
          callback={this.screenShotComplteCallback.bind(this)}
        />
      </div>
    );
  }
}

export default withRouter(MSvideoplayer);
