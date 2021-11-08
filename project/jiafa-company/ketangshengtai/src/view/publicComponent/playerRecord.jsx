/*
 * @Author: JC.Liu
 * @Date: 2019-02-28 10:43:47
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-11-19 11:10:11
 * 录播组件
 */
import React, { Component } from "react";
import { Tooltip, message } from "antd";
// import { SVG } from "./../../base";
import ScreenShotModal from "./screenshotModal.jsx";
import { request } from './../../util/request_2.12';
// import _x from "./../../js/_x/index";
// const Request = _x.util.request.request;
// const format = _x.util.date.format
let index = 0;

export default class PlayerRecord extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showShot: true,
      // 截图的base64 图片
      base64: "",
      time: "",
      teaStatus: 0,
      stuNum: 0,
      descStatus: "",
      showRobootInfo: false,
      visible: false,
      shouldComeNum: 0,
      statisticsTime:''
    };
  }

  componentDidMount() {
    var that = this;
    window.captureImageToJs = function (imageData) {
      // 截图功能只有实时巡课 和 教学检查中有此功能，
      if (
        window.location.href.indexOf("jxjc") > -1 ||
        window.location.href.indexOf("ssxk") > -1
      ) {
        if (that.props.cid) {
          that.setState({
            base64: "data:image/jpeg;base64," + imageData,
            visible: true
          });
        } else {
          message.warning("教学秩序监管仅针对课堂记录哦，课间无法使用！");
        }
      }
    };

    window.playHandle = function () {
      if (index <= 10) {
        CKobject.getObjectById("ckplayer_a2").videoPlay();
        index++;
      }
    }

    window.bufferChange = function (a) {
      // if (index <= 10) {
      //   CKobject.getObjectById("ckplayer_a2").videoPlay();
      //   index++;
      // }
    };

    window.timeChange = function (a) { };

    window.loadChange = function (a) {
      console.log("bounceTime:", a);
      index = 0;
      // if (index <= 10) {
      //   CKobject.getObjectById("ckplayer_a2").videoPlay();
      //   index++;
      // }
    };

    window.errorHandler = function (a) {
      // 播放失败时  需要重新刷新播放器
      console.log("errorHandler:", a);
      message.warning("视频源出现异常，重新进行获取")
      that.props.endedCallback("error")
    };

    window.endHandle = function () {
      console.log("播放结束");
      that.props.endedCallback("end")
    };

    window.loadedHandler = function () {
      CKobject.getObjectById("ckplayer_a2").addListener("ended", "endHandle");
      CKobject.getObjectById("ckplayer_a2").addListener("play", "playHandle");
      CKobject.getObjectById("ckplayer_a2").addListener(
        "error",
        "errorHandler"
      ); // 监听错误
      CKobject.getObjectById("ckplayer_a2").addListener("time", "timeChange"); // 监听时间
      CKobject.getObjectById("ckplayer_a2").addListener(
        "buffer",
        "bufferChange"
      ); // 监听 buffer
      CKobject.getObjectById("ckplayer_a2").addListener(
        "bounceTime",
        "loadChange"
      ); // 点击进度跳转
    };

    // 实例化播放器
    this.renderPlayer(this.props.url);
    // 请求机器人汇报信息
    this.getRobootInfo(this.props);
  }

  renderPlayer = urlArr => {
    console.log("录播地址:", urlArr);

    var flashvars = {
      f: urlArr[0][0], // 视频地址
      b: "0", // 是否允许和播放器进行交互  默认0   0 允许   1 允许
      // i: 'http://www.ckplayer.com/static/images/cqdw.jpg'   封面海报
      a: "", //调用时的参数，只有当s>0的时候有效
      s: "0", //调用方式，0=普通方法（f=视频地址），1=网址形式,2=xml形式，3=swf形式(s>0时f=网址，配合a来完成对地址的组装)
      c: "0", //是否读取文本配置,0不是，1是
      // x: '',//调用配置文件路径，只有在c=1时使用。默认为空调用的是ckplayer.xml
      // i: 'http://www.ckplayer.com/static/images/cqdw.jpg',//初始图片地址
      // // d:'http://www.ckplayer.com/down/pause6.1_1.swf|http://www.ckplayer.com/down/pause6.1_2.swf',//暂停时播放的广告，swf/图片,多个用竖线隔开，图片要加链接地址，没有的时候留空就行
      // u: '',//暂停时如果是图片的话，加个链接地址
      // // l:'http://www.ckplayer.com/down/adv6.1_1.swf|http://www.ckplayer.com/down/adv6.1_2.swf',//前置广告，swf/图片/视频，多个用竖线隔开，图片和视频要加链接地址
      // r: '',//前置广告的链接地址，多个用竖线隔开，没有的留空
      // t: '10|10',//视频开始前播放swf/图片时的时间，多个用竖线隔开
      // y: '',//这里是使用网址形式调用广告地址时使用，前提是要设置l的值为空
      // // z:'http://www.ckplayer.com/down/buffer.swf',//缓冲广告，只能放一个，swf格式
      e: "", //视频结束后的动作，0是调用js函数，1是循环播放，2是暂停播放并且不调用广告，3是调用视频推荐列表的插件，4是清除视频流并调用js功能和1差不多，5是暂停播放并且调用暂停广告
      v: "80", //默认音量，0-100之间
      p: "0", //视频默认0是暂停，1是播放，2是不加载视频
      h: "4", //播放http视频流时采用何种拖动方法，=0不使用任意拖动，=1是使用按关键帧，=2是按时间点，=3是自动判断按什么(如果视频格式是.mp4就按关键帧，.flv就按关键时间)，=4也是自动判断(只要包含字符mp4就按mp4来，只要包含字符flv就按flv来)
      // q: '',//视频流拖动时参考函数，默认是start
      // m: '',//让该参数为一个链接地址时，单击播放器将跳转到该地址
      // o: '',//当p=2时，可以设置视频的时间，单位，秒
      // w: '',//当p=2时，可以设置视频的总字节数
      // g: '',//视频直接g秒开始播放
      // j: '',//跳过片尾功能，j>0则从播放多少时间后跳到结束，<0则总总时间-该值的绝对值时跳到结束
      // k: '32|63',//提示点时间，如 30|60鼠标经过进度栏30秒，60秒会提示n指定的相应的文字
      // n: '这是提示点的功能，如果不需要删除k和n的值|提示点测试60秒',//提示点文字，跟k配合使用，如 提示点1|提示点2
      // wh: '',//宽高比，可以自己定义视频的宽高或宽高比如：wh:'4:3',或wh:'1080:720'
      lv: "0", //是否是直播流，=1则锁定进度栏
      loaded: "loadedHandler" //当播放器加载完成后发送该js函数loaded
    };
    var params = {
      bgcolor: "#FFF",
      allowFullScreen: true,
      allowScriptAccess: "always",
      wmode: "transparent"
    };
    CKobject.embedSWF(
      "ckplayer/ckplayer.swf",
      "JC_player",
      "ckplayer_a2",
      "1200",
      "675",
      flashvars,
      params
    );
  };

  getRobootInfo = ({ cid }) => {
    request(
      "api/web/teacommon/get_class_brief",
      {
        curriculumallId: cid
      },
      res => {
        if (res.result && res.code === "200") {
          this.setState(
            {
              teaStatus: res.data.teacherStatus,
              stuNum: res.data.stuNum,
              descStatus: res.data.stuStatus,
              showRobootInfo: true,
              shouldComeNum: res.data.shouldComeNum,
              statisticsTime:format(new Date(res.data.statisticsTime || new Date()),"HH:mm:ss")
            });
        } else {
          this.setState({
            teaStatus: 0,
            stuNum: 0,
            descStatus: "",
            showRobootInfo: true,
            shouldComeNum: 0,
            statisticsTime:format(new Date(),"HH:mm:ss")
          });
        }
      }
    );
  };

  // 用于定位的截图按钮  （无用）
  screenshot = () => {
    this.setState({
      visible: true,
      time: new Date().getTime()
    });
    window.player.screenshot("video", false, "视频截图");
  };

  editorBtNShow = e => {
    this.setState({
      showShot: e
    });
  };

  download(base64) {
    this.setState({
      base64
    });
  }

  cancel = () => {
    this.setState({
      visible: false,
      base64: ""
    });
  };

  // 隐藏
  robootHide = () => {
    setTimeout(() => {
      this.setState({
        showRobootInfo: false
      });
    }, 5000);
  };

  robootClick = () => {
    // 请求机器人汇报信息
    this.getRobootInfo(this.props);
    this.setState({
      showRobootInfo: !this.state.showRobootInfo
    });
  };

  screenShotHandle() {
    // let shotImg = CKobject.getObjectById('ckplayer_a2').callMovieCapture();
    // console.log("shotImg:", shotImg);
    // window.callMovieCapture();
  }

  render() {
    const style = {
      wrap: {
        position: "relative",
        height: "100%",
        background: "#fff"
      },
      shot: {
        position: "absolute",
        bottom: "1%",
        right: "28%",
        fontSize: "24px",
        display: this.state.showShot ? "block" : "none"
      },
      roboot: {
        position: "absolute",
        bottom: "70px",
        right: "70px"
      }
    };
    const {
      visible,
      base64,
      time,
      teaStatus,
      stuNum,
      descStatus,
      showRobootInfo,
      shouldComeNum,
      statisticsTime
    } = this.state;
    return (
      <div
        style={{
          ...this.props.style,
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div id="JC_player" style={{ width: "1200px", height: "675px" }} />
        {/* <div onClick={() => { this.screenshot() }} style={style.shot} >
          <SVG type="2" width={24} height={24} />
        </div> */}

        {/* 定位可点击的机器人头 */}
        {
          <div className="JC-roboot-click" onClick={this.robootClick}>
            <img src={require("./../../media/picture/robot.png")} alt="" />
          </div>
        }

        {showRobootInfo ? (
          <div className="JC-roboot yh-roboot" id="JC-roboot-container">
            {this.robootHide()}
            <Tooltip
              getPopupContainer={() =>
                document.getElementById("JC-roboot-container")
              }
              placement="top"
              visible={true}
              title={
                <div className="JC-roboot-tip">
                 <div className="lean-robot-contentBox" style={{ background: 'rgba(0,0,0,0.75)' }}>
                  <p>
                    {teaStatus == 0
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
                                  ? "教师考勤正在努力分析中"
                                  : ""}
                  </p>
                  <p>当前教室人数&nbsp;{stuNum || 0}{shouldComeNum == -1 ? null : ` (应到 ${shouldComeNum || 0} )`}</p>
                  {/* <p>{descStatus}</p> */}
                  <p>{`上次统计时间：${statisticsTime}`}</p>
                  </div>
                </div>
              }
            >
              <div>
                <img src={require("./../../media/picture/robot.png")} alt="" />
              </div>
            </Tooltip>
          </div>
        ) : null}

        <ScreenShotModal
          visible={visible}
          id={this.props.cid}
          cancel={this.cancel}
          base64={base64}
          time={time}
          callback={this.props.callback}
        />
      </div>
    );
  }
}