/*
 * @Author: yh 
 * @Date: 2019-08-21 09:48:40 
 * @Last Modified by: xm
 * @Last Modified time: 2021-02-04 12:42:04
 * 多屏适配-一屏
 */
import React, { Component } from "react";
import "./multiScreen.scss";
import { message, Select } from "antd";
import { getTimeFun, setTimeFun, delWeekVideo, keepOnLine } from "./videoFun";

/**
 * @description 基于CKplayer6.8三屏播放组件
 * @props key=baseWidth type=Number 外层容器的宽度  播放器所有尺寸均按照这个来计算    ！！！
 * @props key=isLive type=Number 是否是直播流  0：录播  1：直播
 * @props key=url type=Array [主播放器地址,主屏播放地址, 右上播放地址，右下播放地址]，需要在父组件做空值容错，本组件不做处理
 * @props key=bgColor type=String 播放器的背景颜色  非必填
 * @props key=volume type=Number 0-100的主屏播放器音量
 * @props key=playerLoad type=Number 播放器加载后，对视频的处理逻辑，0是暂停不播，1是直接播放，2是不加载
 * @props key=screenShot type=Function 双击截屏 通过参数的形式抛出图片
 * @props key=getUrlError type=Boolean 父组件是否为请求到流地址，默认为false，如果传入true,则播放器组件做错误提示
 */


let failedTimer = null


export default class OneScreen extends Component {
  constructor(props) {
    super(props);
    // 测试流地址
    let testurl =
      "rtmp://10.4.3.47:1936/live|rtspstd_hik/10.4.2.141/554/1/main/admin/jfkj12345";
    let BaseWidth = props.baseWidth || '1366';
    let isLive = props.isLive;
    let getUrlError = props.getUrlError;
    //只渲染三个视频，但是需要4个流地址，原因是最早的设计是3+1的播放模式，后来改成只有三个播放器，第一个流地址可以填空；
    let url = props.url || [testurl];
    let bgColor = props.bgcolor || "#212121";
    let volume = props.volume
      ? props.volume > 100
        ? 100
        : props < 0
          ? 0
          : 60
      : 60;
    let playerLoad = props.playerLoad || 1;
    let playUrl = [];
    // console.log('playerLoad0000', playerLoad);
    for (let i = 1; i < url.length; i++) {
      if (url[i] == undefined) {
        // console.log("不渲染第", i, "个接口");
        continue;
      }
      playUrl.push(url[i]);
    }
    this.handleChangeScreen = this.handleChangeScreen.bind(this)
    this.state = {
      playBackEnd: false,
      oneScreen: '',
      DOMid: [], //播放器挂载的元素的id
      Childid: [], //播放器实例id，这两个id均是随机数
      //播放器的宽高均根据基础宽度动态计算
      playerWidth: [
        BaseWidth,
        // (BaseWidth / 3) * 2,
        // BaseWidth / 3,
        // BaseWidth / 3
      ],
      playerHeight: [
        (BaseWidth / 16) * 9,
        // (BaseWidth / 100) * 42,
        // (BaseWidth / 100) * 21,
        // (BaseWidth / 100) * 21
      ],
      playerMasterBG: bgColor,
      isLive,
      url,
      volume,
      playerLoad,
      getUrlError,
      playUrl,
      resetUrl: '',
      failedNum: 0
    };

    //循环多次  创建一个随机id
    Array.from({ length: playUrl.length }).map(() => {
      this.state.DOMid.push("rd" + Math.floor(Math.random() * 1e10));
      this.state.Childid.push("rd" + Math.floor(Math.random() * 1e10));
    });

    //bind this
    this.insPlayer.bind(this);
    this.computeStyle.bind(this);
  }

  /**
   *
   * @param { Number } index 下标
   * @param { Boolean } isMaster 是否是背景
   * @description 动态计算播放器外层的样式和右边遮罩的位置
   */
  computeStyle(index, isMaster = false) {
    let { playerHeight, playerWidth, playerMasterBG } = this.state;
    let style = {
      width: playerWidth[index],
      height: playerHeight[index]
    };
    if (isMaster) {
      // style.background = playerMasterBG;
      style.background = '#000';
    }
    return style;
  }

  /**
   *
   * @param { Number } index 下标，根据下标渲染第几个播放器
   * @param { String } url 流地址
   */
  insPlayer(index = 0, url) {
    let { isLive } = this.props
    let time = getTimeFun(url, 1)
    if (!time) time = 0
    let flashvars = {
      f: url, // 视频地址
      b: 0, // 是否允许和播放器进行交互 0允许   1 不允许
      // i: 'http://www.ckplayer.com/static/images/cqdw.jpg'   封面海报
      a: '0', //调用时的参数，只有当s>0的时候有效
      s: "0", //调用方式，0=普通方法（f=视频地址），1=网址形式,2=xml形式，3=swf形式(s>0时f=网址，配合a来完成对地址的组装)
      c: '0', //是否读取文本配置,0不是，1是 默认1
      // x: './ckplayer/ckplayer.xml',//调用配置文件路径，只有在c=1时使用。默认为空调用的是ckplayer.xml
      // i: 'http://www.ckplayer.com/static/images/cqdw.jpg',//初始图片地址
      // // d:'http://www.ckplayer.com/down/pause6.1_1.swf|http://www.ckplayer.com/down/pause6.1_2.swf',//暂停时播放的广告，swf/图片,多个用竖线隔开，图片要加链接地址，没有的时候留空就行
      // u: '',//暂停时如果是图片的话，加个链接地址
      // l:'http://www.ckplayer.com/down/adv6.1_1.swf|http://www.ckplayer.com/down/adv6.1_2.swf',//前置广告，swf/图片/视频，多个用竖线隔开，图片和视频要加链接地址
      // r: '',//前置广告的链接地址，多个用竖线隔开，没有的留空
      // t: '10|10',//视频开始前播放swf/图片时的时间，多个用竖线隔开
      // y: '',//这里是使用网址形式调用广告地址时使用，前提是要设置l的值为空
      // // z:'http://www.ckplayer.com/down/buffer.swf',//缓冲广告，只能放一个，swf格式
      // e: '8',//视频结束后的动作，0是调用js函数，1是循环播放，2是暂停播放并且不调用广告，3是调用视频推荐列表的插件，4是清除视频流并调用js功能和1差不多，5是暂停播放并且调用暂停广告
      v: index == 0 ? this.state.volume : "0", //默认音量，0-100之间
      p: '0', //视频默认0是暂停，1是播放，2是不加载视频
      h: "4", //播放http视频流时采用何种拖动方法，=0不使用任意拖动，=1是使用按关键帧，=2是按时间点，=3是自动判断按什么(如果视频格式是.mp4就按关键帧，.flv就按关键时间)，=4也是自动判断(只要包含字符mp4就按mp4来，只要包含字符flv就按flv来)
      // q: '',//视频流拖动时参考函数，默认是start
      // m: '',//让该参数为一个链接地址时，单击播放器将跳转到该地址
      // o: '1',//当p=2时，可以设置视频的时间，单位，秒
      // w: '',//当p=2时，可以设置视频的总字节数
      g: isLive === 0 ? time : '',//视频直接g秒开始播放
      // j: '',//跳过片尾功能，j>0则从播放多少时间后跳到结束，<0则总总时间-该值的绝对值时跳到结束
      // k: '32|63',//提示点时间，如 30|60鼠标经过进度栏30秒，60秒会提示n指定的相应的文字
      // n: '这是提示点的功能，如果不需要删除k和n的值|提示点测试60秒',//提示点文字，跟k配合使用，如 提示点1|提示点2
      // wh: "16:9", //宽高比，可以自己定义视频的宽高或宽高比如：wh:'4:3',或wh:'1080:720'
      lv: isLive, //是否是直播流，=1则锁定进度栏
      loaded: `loadedMaster(0)` //当播放器加载完成后发送该js函数loaded
    };
    var params = {
      bgcolor: "#FFF",
      allowFullScreen: true,
      allowScriptAccess: "always",
      wmode: "transparent"
    };
    window.CKobject.embedSWF(
      "./ckplayer/ckplayer.swf",
      this.state.DOMid[index], //容器id
      this.state.Childid[index], //实例化元素id
      this.props.baseWidth, //宽高
      this.props.baseWidth / 16 * 9,
      flashvars,
      params
    );
  }
  /* 窗口变化是 动态设置ck播放器的宽高 */
  windowResize = () => {
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.windowResize)
  }

  // 地址变化，重新刷新
  componentDidUpdate(prevProps, prevState) {

    const { url, onScreenList } = this.props
    if (url[1] != this.state.url[1]) {
      this.setState({
        url: [undefined, url[1]],
        getUrlError: false,

        resetUrl: url[1]
      }, () => {
        document.querySelector(`.v${1}`).className = `lean-video-mount v${1}`;
        this.insPlayer(0, url[1]);
        setTimeout(() => {
          this.setState({
            oneScreen: onScreenList && onScreenList[0] ? onScreenList[0].id : ''
          })
        }, 0);

      })

    }
    // if (this.state.url[1] !== this.state.resetUrl) {
    //   this.setState({
    //     failedNum: 0
    //   })
    // }
  }
  componentWillUnmount() {
    clearInterval(this.timer)
  }
  componentDidMount() {
    this.timer = setInterval(() => {
      const token = sessionStorage.getItem('token')
      if (token) {
        // request('keepOnLine', { token }, res => {
        //   console.log('res', res)
        // })
        keepOnLine(token)
      }
    }, 4 * 60 * 1000);
    window.addEventListener('resize', this.windowResize)

    delWeekVideo()

    let { url } = this.props;
    this.setState({
      resetUrl: url[1]
    })
    document.querySelector(`.v1`).className = `lean-video-mount v1`;
    this.insPlayer(0, url[1]);


    //ckplayer的全局事件注册，只做事件触发监听，不做任何逻辑处理，逻辑放在组件内的函数调用里
    {
      let _num = 0;
      let _this = this;
      window.state = _this.state;
      window.captureImageToJs = img => {
        // 双击截屏
        let imgBase64 = "data:image/jpeg;base64," + img;
        _this.props.screenShot(imgBase64);
        let { Childid } = _this.state
        Childid.map(item => {
          if (window.CKobject.getObjectById(item)) {
            CKobject.getObjectById(item).videoPlay();
          }
        });

      };

      // 当前播放时间
      window.masterSendTimeHandle = time => {
        let { resetUrl } = this.state
        let { isLive } = this.props
        if (resetUrl && isLive === 0 && time !== undefined && time !== 0) {
          setTimeFun(resetUrl, time, 1) // 1 单屏
        }
      }

      window.masterPausedHandle = (isPaused = false) => {
        if (isPaused) {
          // console.log("主播放器暂停事件触发");
          playing = false
          this.videoPause();
        } else {
          // console.log("主播放器播放事件触发");
          this.videoPlayOrPause();
        }
      };

      window.masterSeekingHandle = num => {
        this.videoSeeking(num);
      };

      window.masterSendNetStreamHandle = () => {
        console.log('播放器接受到视频流');
        const { isLive } = this.props
        const { playBackEnd, resetUrl } = this.state
        let that = this
        if (isLive === 0 && playBackEnd) {
          setTimeout(() => {
            that.videoPause()
          }, 500);
        } else {
          setTimeout(() => {
            that.videoPlay()
            // let time = getTimeFun(resetUrl)
            // if (time) {
            //   setTimeout(() => {
            //     that.videoSeeking(time)
            //   }, 2000);
            // }
          }, 500);
        }

      };
      //视频结束做操作
      window.masterEededHandle = () => {
        const { isLive, url } = this.props
        console.log('播放结束')
        if (isLive === 0) {
          this.setState({
            playBackEnd: true
          }, () => {
            document.querySelector(`.v1`).className = `lean-video-mount v1`;
            this.insPlayer(0, url[1] ? url[1] : '');
          })
        }
      };




      window.bufferHandle = function (e) {



      }
      // 加载失败提示
      window.errorHandle = function () {
        console.log('视频加载失败')
        // message.warning('视频加载失败')
        _this.setState({
          failedErr: true
        })
        if (failedTimer) clearTimeout(failedTimer)
        failedTimer = setTimeout(() => {
          let num = _this.state.failedNum
          console.log('num', num)
          if (num === 5) return
          _this.setState({
            failedNum: num + 1
          })
          let url = _this.state.resetUrl
          console.log('url', url)
          _this.insPlayer(0, url)
        }, 5000);
      }
      window.durationHandle = function (duration) {
        console.log('duration', duration)
      }
      window.loadedMaster = function (index) {
        let { Childid } = _this.state;
        let masterId = Childid[index];

        window.CKobject.getObjectById(masterId).addListener(
          "paused",
          `masterPausedHandle`
        );
        window.CKobject.getObjectById(masterId).addListener(
          "seeking",
          `masterSeekingHandle`
        );
        window.CKobject.getObjectById(masterId).addListener(
          "buffer",
          `bufferHandle`
        );
        window.CKobject.getObjectById(masterId).addListener(
          "sendNetStream",
          `masterSendNetStreamHandle`
        );
        window.CKobject.getObjectById(masterId).addListener(
          "time",
          `masterSendTimeHandle`
        );
        window.CKobject.getObjectById(masterId).addListener(
          "ended",
          `masterEededHandle`
        );
        window.CKobject.getObjectById(masterId).addListener(
          "error",
          `errorHandle`
        );
        window.CKobject.getObjectById(masterId).addListener(
          "duration",
          `durationHandle`
        );
        // window.CKobject.getObjectById(masterId).addListener(
        //   "screenshot",
        //   `screenshotHandle`
        // );
      };
    }
  }

  // 控制函数-播放
  videoPlay() {
    let { Childid } = this.state;
    Childid.map(item => {
      if (window.CKobject.getObjectById(item)) {
        CKobject.getObjectById(item).videoPlay();
      }
    });
  }

  // 控制函数-暂停
  videoPause() {
    let { Childid } = this.state;
    Childid.map((item, index) => {
      if (index == 1) {
        return;
      } else {
        if (window.CKobject.getObjectById(item)) {
          CKobject.getObjectById(item).videoPause();
        }
      }
    });

  }

  // 控制函数-切换
  videoPlayOrPause() {
    let { Childid } = this.state;
    Childid.map((item, index) => {
      if (window.CKobject.getObjectById(item)) {
        CKobject.getObjectById(item).playOrPause();
      }
    });
  }

  // 控制函数-进度跳转
  videoSeeking(num) {
    let { Childid } = this.state;
    let _num = num - 0;
    // console.log('进度', _num)
    Childid.map((item, index) => {
      if (window.CKobject.getObjectById(item)) {
        CKobject.getObjectById(item).videoSeek(_num);
      }
    });
  }

  handleChangeScreen(id) {
    const onScreenList = this.props.onScreenList
    let that = this
    this.setState({
      failedErr: false,
      failedNum: 0
    })
    onScreenList.some(item => {
      if (item.id === id) {
        this.setState({
          oneScreen: item.id
        })
        const url = item.url[0].list[0].url
        that.setState({
          resetUrl: url,
          // url: [undefined, url]
        })
        document.querySelector(`.v1`).className = `lean-video-mount v1`;
        this.insPlayer(0, url);
        return true
      }
    })
  }

  render() {
    let { DOMid, oneScreen } = this.state;
    let { isLive, onScreenList, posName, baseWidth } = this.props

    let one = oneScreen ? oneScreen : (onScreenList && onScreenList[0] ? onScreenList[0].id : '')

    return (
      <div className='lean-box'>
        {
          isLive === 1 &&
            onScreenList &&
            onScreenList[0] &&
            posName === 'xk' ?
            (
              <Select className='lean-box-select'
                style={{ width: 120, backgroundColor: 'transparent', color: '#fff' }}
                dropdownStyle={{ backgroundColor: '#fff' }}
                bordered={false}
                value={one}
                suffixIcon={<span></span>}
                onChange={this.handleChangeScreen}
              >
                {
                  onScreenList.map(item => {
                    return <Option key={item.id} value={item.id}>{item.name}</Option>
                  })
                }
              </Select>
            ) : ''
        }
        <div id="video-content"
          //  style={this.computeStyle(0, isBGModal)}
          style={{ height: baseWidth / 16 * 9 + 'px', width: baseWidth + 'px', backgroundColor: '#000' }}
        >
          <div
            className="lean-video v1"
            id={DOMid[0]}
            // style={this.computeStyle(0)}
            style={{
              height: baseWidth / 16 * 9 + 'px',
              width: baseWidth + 'px',
              backgroundColor: '#000',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          />
        </div>
        <style>
          {
            `
              .yh-video-header{
                  width:calc(100% - 10px);
                }
              `
          }
        </style>
      </div>
    );
  }
}
