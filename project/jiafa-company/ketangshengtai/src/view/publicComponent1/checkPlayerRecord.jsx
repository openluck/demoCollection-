import React, { Component } from 'react';
import { Tooltip, message } from "antd";
import { SVG } from "./../components/tpk/base.jsx";
import './../../css/admin/yh_video.css';
import _ from "lodash";
// import _x from "./../../js/_x/index";
import noData from "./../../media/picture/nodata1.png";

class CheckPlayerRecord extends Component {
  constructor(props) {
    super(props);
    let testurl =
    {
      url: "rtmp://10.4.3.47:1936/vod|/file/local://D:/fms_TRMS/data/file/20190814/multi/18/d1510629fed543c2b12d01738ce73c25.mp4",
      type: 1
    }
    let baseWidth = props.baseWidth;
    let perWidth = (baseWidth - 24) / 2;
    let playUrl = props.playUrl ? props.playUrl : [testurl, testurl];
    let isLive = props.isLive;
    let getUrlError = props.getUrlError;
    console.log('getUrlError', getUrlError);
    let urls = props.urls || [testurl, testurl]
    let bgColor = props.bgcolor || "#000";
    this.state = {
      playerIdArr: [],
      playerW: perWidth,
      playerH: (9 * perWidth) / 16,
      domId: [],
      Childid: [],
      tabId: 2,
      type: 2,
      playUrl,
      urls,
      videoConfig: {},
      isLive,
      getUrlError,
      playerMasterBG: bgColor,
    }
    Array.from({ length: playUrl.length }).map(() => {
      this.state.domId.push('rd' + Math.floor(Math.random() * 1e10))
      this.state.Childid.push('rd' + Math.floor(Math.random() * 1e10))
    })
    this.tabs = [
      {
        id: 2,
        name: '学生'
      }, {
        id: 3,
        name: '多媒体'
      }
    ];
    this.computeStyle.bind(this)
  }
  componentDidMount() {
    /* 监听浏览器窗口变化 */
    window.addEventListener('resize', this.windowResize)
    // 实例化播放器
    if (!this.props.playUrl) {
      return
    } else {
      for (let i = 1; i < 3; i++) {
        // if (playUrl[i]['url'] == undefined || playUrl[i]['url'] == null) {
        //   continue;
        // }
        if (this.props.playUrl.length >= i) {
          this.initRecordPlayer(this.props.playUrl[i - 1]['url'], i - 1)
        } else {
          return false;
        }
      }
    }
  }
  /* 窗口变化是 动态设置ck播放器的宽高 */
  windowResize = () => {
    let videoCon = document.getElementById('yh-ap-play');
    let baseWidth = videoCon.offsetWidth;
    let perWidth = (baseWidth - 24) / 2;
    let { Childid } = this.state;
    this.setState({
      playerW: perWidth,
      playerH: (9 * perWidth) / 16,
    }, () => {
      Childid && Childid.map((item, i) => {
        let video = CKobject.getObjectById(item); //判断ck播放器是否存在
        if (video) {
          CKobject.getObjectById(item).width = this.state.playerW - 4;
          CKobject.getObjectById(item).height = this.state.playerH - 4;
        }
      })
    })
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.windowResize)
  }
  static getDerivedStateFromProps(props, state) {
    if (props.playUrl !== state.playUrl) {
      let baseWidth = props.baseWidth;
      let perWidth = (baseWidth - 24) / 2;
      return {
        playUrl: props.playUrl,
        urls: props.urls,
        // playerW: perWidth,
        // playerH: (9 * perWidth) / 16,
      }
    }
    return { ...state }
  }
  initRecordPlayer = (url, index) => {
    let flashvars = {
      f: url, // 视频地址
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
      // o: '300',//当p=2时，可以设置视频的时间，单位，秒
      // w: '',//当p=2时，可以设置视频的总字节数
      // g: '',//视频直接g秒开始播放
      // j: '',//跳过片尾功能，j>0则从播放多少时间后跳到结束，<0则总总时间-该值的绝对值时跳到结束
      // k: '32|63',//提示点时间，如 30|60鼠标经过进度栏30秒，60秒会提示n指定的相应的文字
      // n: '这是提示点的功能，如果不需要删除k和n的值|提示点测试60秒',//提示点文字，跟k配合使用，如 提示点1|提示点2
      // wh: '16:9',//宽高比，可以自己定义视频的宽高或宽高比如：wh:'4:3',或wh:'1080:720'
      lv: this.state.isLive ? 1 : 0, //是否是直播流，=1则锁定进度栏
      loaded: `loadedHandler(${index})` //当播放器加载完成后发送该js函数loaded
    };
    var params = {
      bgcolor: "#FFF",
      allowFullScreen: true,
      allowScriptAccess: "always",
      wmode: "transparent"
    };
    let dom = document.getElementById(this.state.domId[index]);
    if (dom) {
      window.CKobject.embedSWF(
        "ckplayer/ckplayer.swf",
        this.state.domId[index],
        this.state.Childid[index],
        this.state.playerW - 4,
        this.state.playerH - 4,
        flashvars,
        params
      );
    }
    // window.CKobject.embedSWF(
    //   "ckplayer/ckplayer.swf",
    //   this.state.domId[index],
    //   this.state.Childid[index],
    //   this.state.playerW,
    //   this.state.playerH,
    //   flashvars,
    //   params
    // );
    (function (win, that) {
      let index = 0
      win.playHandle = function () {
        let { Childid } = that.state;
        if (index > 5) {
          // CKobject.getObjectById(Childid[0]).videoPlay();
          // CKobject.getObjectById(Childid[1]).videoPlay();
          // index++;
        }
      }

      win.bufferChange = function (a) {
        let { Childid } = that.state;
        let statusOne = CKobject.getObjectById(Childid[0]).getStatus();
        let statusTwo = CKobject.getObjectById(Childid[1]).getStatus();
        if (statusOne.play && statusOne.volume > 0) {
          CKobject.getObjectById(Childid[1]).changeFlashvars('{v->0}')
        }
        CKobject.getObjectById(Childid[0]).changeFlashvars('{v->80}')
      };

      win.timeChange = function (a) { };

      win.loadChange = function (a) {
        console.log("bounceTime:", a);
        index = 0;
        // if (index <= 10) {
        //   CKobject.getObjectById(this.props.playerId).videoPlay();
        //   index++;
        // }
      };

      win.errorHandle = function (a) {
        // 播放失败时  需要重新刷新播放器
        // console.log("errorHandle:", a);
        // message.warning("视频源出现异常，重新进行获取")
        // that.props.endedCallback("error")
      };

      win.endHandle = function () {
        // console.log("播放结束");
        // that.props.endedCallback("end")
      };
      win.onvolumechangeHandle = function (params) {
        let { Childid } = that.state;
        let statusOne = CKobject.getObjectById(Childid[0]).getStatus();
        let statusTwo = CKobject.getObjectById(Childid[1]).getStatus();
        if (statusOne.play && statusOne.volume > 0) {
          CKobject.getObjectById(Childid[1]).changeFlashvars('{v->0}')
        }
        if (statusTwo.play && statusTwo.volume > 0) {
          CKobject.getObjectById(Childid[0]).changeFlashvars('{v->0}')
        }
        // console.log('status', statusOne);
      }
      win.loadedHandler = function (index) {
        let { Childid } = that.state;
        let videoId = Childid[index]
        CKobject.getObjectById(videoId).addListener("volumechange", "onvolumechangeHandle");
        CKobject.getObjectById(videoId).addListener("ended", "endHandle");
        CKobject.getObjectById(videoId).addListener("play", "playHandle");
        CKobject.getObjectById(videoId).addListener("error", "errorHandle"); // 监听错误
        CKobject.getObjectById(videoId).addListener("time", "timeChange"); // 监听时间
        CKobject.getObjectById(videoId).addListener("buffer", "bufferChange"); // 监听 buffer
        CKobject.getObjectById(videoId).addListener("bounceTime", "loadChange"); // 点击进度跳转
      };
    })(window, this)
  }
  tabChange = (item) => {
    let { Childid, domId, urls } = this.state;
    if (urls) {
      let target = _.find(urls, { type: item.id });
      // console.log('target', target);
      let targetUrl = ''
      if (target) {
        targetUrl = target.url;
      }
      this.setState({
        playUrl: this.state.playUrl.splice(1, 1, target)
      })
      if (window.CKobject.getObjectById(Childid[1])) {
        if (Childid[1] && targetUrl) {
          window.CKobject.getObjectById(Childid[1]).newAddress(`{f->${targetUrl}}`)
        }
      }
    }
    this.setState({
      tabId: item.id,
      type: item.id,
    })
  }
  /**
  *
  * @param { Number } index 下标
  * @param { Boolean } isMaster 是否是背景
  * @description 动态计算播放器外层的样式和右边遮罩的位置
  */
  computeStyle(isMaster = false) {
    let { playerW, playerH, playerMasterBG } = this.state;
    let style = {
      width: playerW - 4,
      height: playerH - 4
    };
    if (isMaster) {
      style.background = playerMasterBG;
    }
    return style;
  }
  render() {
    const { domId, tabId, playUrl, Childid, getUrlError } = this.state;
    // console.log(window.CKobject.getObjectById(Childid[1]));
    console.log('playUrl', playUrl);

    return (
      <div>
        <div className="yh-player" style={{ width: this.state.playerW, height: this.state.playerH }}>
          <div id={domId[0]} style={this.computeStyle(true)}></div>
          {
            getUrlError ?
              <div className="yh-noData" style={{ width: this.state.playerW - 2, height: this.state.playerH - 2 }}>
                <div>
                  <img src={noData} title="" alt="" />
                  无视频数据
                </div>
              </div>
              : <div>
                {playUrl && playUrl[0] && playUrl[0].url == null ?
                  <div className="yh-noData" style={{ width: this.state.playerW - 2, height: this.state.playerH - 2 }}>
                    <div>
                      <img src={noData} title="" alt="" />
                      无视频数据
                    </div>
                  </div>
                  : ""
                }
              </div>
          }
          <div className="yh-type-box">
            <div className="active"> <SVG type="teacher" title="学院" />教师</div>
          </div>
        </div>
        <div className="yh-player" style={{ width: this.state.playerW, height: this.state.playerH }}>
          <div id={domId[1]} style={this.computeStyle(true)}></div>
          {
            getUrlError ?
              <div className="yh-noData" style={{ width: this.state.playerW - 2, height: this.state.playerH - 2 }}>
                {/* <div><SVG type="shipin" title="shipin" />暂无录播视频</div> */}
                <div>
                  <img src={noData} title="" alt="" />
                  无视频数据
                </div>
              </div>
              :
              <div>
                {playUrl && playUrl[1] && playUrl[1].url == null ?
                  <div className="yh-noData" style={{ width: this.state.playerW - 2, height: this.state.playerH - 2 }}>
                    {/* <div><SVG type="shipin" title="shipin" />暂无录播视频</div> */}
                    <div>
                      <img src={noData} title="" alt="" />
                      无视频数据
                    </div>
                  </div>
                  : ""
                }
              </div>
          }
          <div className="yh-type-box">
            {
              this.tabs.map((item, i) => {
                return (
                  <div key={item.id} onClick={() => this.tabChange(item)} className={tabId === i + 2 ? "active" : ''}><SVG type={item.id === 2 ? 'bofangxuesheng1' : 'duomeitibofang'} title={item.name} />{item.name}</div>
                )
              })
            }
            {/* <div className="active"> <SVG type="teacher" title="学院" />教师</div>
            <div className=""> <SVG type="teacher" title="学院" />多媒体</div> */}
          </div>
        </div>
      </div>

    )
  }
}
export default CheckPlayerRecord