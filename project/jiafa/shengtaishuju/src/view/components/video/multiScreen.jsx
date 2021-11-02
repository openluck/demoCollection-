/*
 * @Author: junjie.lean
 * @Date: 2019-07-23 10:55:17
 * @Last Modified by: lxx
 * @Last Modified time: 2020-09-02 14:27:49
 * 三屏视频播放组件
 * summer 重写CKPlayer调用逻辑，手写控制条
 */

import React, { Component } from 'react'
import './multiScreen.css'
import noData from "./../../../media/picture/img_noData.png";
import { message, Row, Col, Icon, Tooltip, Select } from 'antd'
import _ from 'lodash'
import imgURL from './../../../media/picture/img_noData.png';

const { Option } = Select
let needPlay = true
let twoPlay = true
let threePlay = true
let isFull = false
let isCancel = false // 是否可关闭全屏

/**
 * @description 基于CKplayer6.8三屏播放组件
 * @props key=baseWidth type=Number 外层容器的宽度  播放器所有尺寸均按照这个来计算    ！！！
 * @props key=isLive type=Number 是否是直播流  0：录播  1：直播
 * @props key=url type=Array [主播放器地址,主屏播放地址, 右上播放地址，右下播放地址]，需要在父组件做空值容错，本组件不做处理
 * @props key=bgColor type=String 播放器的背景颜色  非必填
 * @props key=volume type=Number 0-100的主屏播放器音量
 * @props key=playerLoad type=Number 播放器加载后，对视频的处理逻辑，0是暂停不播，1是直接播放，2是不加载
 * @props key=screenShot type=Function 双击截屏 通过参数的形式抛出图片
 * @props key=getUrlError type=Boolean 父组件是否未请求到流地址，默认为false，如果传入true,则播放器组件做错误提示
 */

export default class Multiscreen extends Component {
  constructor(props) {
    super(props)
    // 测试流地址
    let testurl = [{
      _url_: 'rtmp://10.4.3.47:1936/live|rtspstd_hik/10.4.2.141/554/1/main/admin/jfkj12345',
      type: 1
    }]
    console.log(props)
    let BaseWidth = props.baseWidth || 1366
    let BaseHeight = props.baseHeight || 600;
    console.log(BaseWidth, BaseHeight)
    let isLive = props.isLive
    let getUrlError = props.getUrlError
    // 只渲染三个视频，但是需要4个流地址，原因是最早的设计是3+1的播放模式，后来改成只有三个播放器，第一个流地址可以填空；
    // let url = [ testurl, testurl, testurl];
    let url = props.url || [testurl, testurl, testurl, testurl]
    console.log(url)
    let bgColor = props.bgcolor || '#000000'
    let volume = props.volume
      ? props.volume > 100
        ? 100
        : props < 0
          ? 0
          : 60
      : 60
    let playerLoad = props.playerLoad || 1
    /* yh0821修改 */
    // let playUrl = [];
    // for (let i = 1; i < url.length; i++) {
    //   if (url[i]._url_ == undefined) {
    //     // console.log("不渲染第", i, "个接口");
    //     continue;
    //   }
    //   playUrl.push(url[i]);
    // }
    /* yh0821修改 */
    // let perCell = BaseWidth / 2
    let perCell = BaseWidth / 3
    // let ratio = 16 / 9
    // console.log("perCell", perCell)
    this.state = {
      DOMid: [], // 播放器挂载的元素的id
      Childid: [], // 播放器实例id，这两个id均是随机数
      // 播放器的宽高均根据基础宽度动态计算
      playerWidth: [
        BaseWidth,
        perCell * 2,
        perCell,
        perCell
      ],
      playerHeight: [
        BaseHeight,
        BaseHeight,
        BaseHeight / 2 - 28,
        BaseHeight / 2 - 28
      ],
      // playerHeight: [
      //   BaseHeight,
      //   BaseHeight,
      //   BaseHeight / 2 - 28,
      //   BaseHeight / 2 - 28
      // ],
      playerMasterBG: bgColor,
      isLive,
      url,
      volume,
      playerLoad,
      getUrlError,
      allUrls: props.viUrls,
      fullId: 0, // 全屏下标
      // playUrl
    }
    // 循环多次  创建一个随机id
    for (let i = 0; i < url.length; i++) {
      this.state.DOMid.push('ckplayer' + i) // + Math.floor(Math.random() * 1e10));
      this.state.Childid.push('ckplayerid' + i) // Math.floor(Math.random() * 1e10));
    }
    console.log(this.state.DOMid, this.state.Childid)
    // Array.from({ length: url.length }).map(() => {
    //   this.state.DOMid.push("rd" + Math.floor(Math.random() * 1e10));
    //   this.state.Childid.push("rd" + Math.floor(Math.random() * 1e10));
    // });

    // bind this
    this.insPlayer.bind(this)
    this.computeStyle.bind(this)
    this.videoPlayOrPause.bind(this)
    this.videoSeeking.bind(this)
    this.onChangeEqu.bind(this)
    // 播放定时器，延迟播放，解决右侧视频不播放问题
    this.timer = ''
  }

  /**
   * 设置三屏样式
   * @param { Number } index 下标
   * @param { Boolean } isMaster 是否是背景
   * @description 动态计算播放器外层的样式和右边遮罩的位置
   */
  computeStyle(index, isMaster = false) {
    let { playerHeight, playerWidth, playerMasterBG } = this.state
    let style = {
      width: playerWidth[index],
      height: playerHeight[index]
    }
    if (isMaster) {
      style.background = playerMasterBG
    }

    if (index === 3) {
      // 第三个播放器的top值等于第二个播放器的高度
      style.top = playerHeight[2]
    }

    if (index === 10 || index === 12) {
      // 右方两个进度条的遮罩；
      let modalHeight = 14
      let modalOffset = 46
      style.name = 'modal' + index
      style.height = modalHeight
      style.width = playerWidth[2]
      style.right = 0
      if (index == 10) {
        style.top = playerHeight[2] - modalOffset
      } else {
        style.top = playerHeight[3] + playerHeight[2] - modalOffset
      }
    }

    if (index === 11 || index === 13) {
      // 右方两个控制栏遮罩；
      let fullScreenWidth = 33 // 全屏按钮的宽度
      let modalHeight = 40 // 遮罩的高度
      style.height = modalHeight
      style.width = playerWidth[2] - fullScreenWidth
      style.right = fullScreenWidth
      if (index === 11) {
        style.top = playerHeight[2] - modalHeight
      } else {
        style.top = playerHeight[3] + playerHeight[2] - modalHeight
      }
    }
    return style
  }

  /**
   *
   * @param { Number } index 下标，根据下标渲染第几个播放器
   * @param { String } url 流地址
   */
  insPlayer(index = 0, url) {
    let flashvars = {
      f: url, // 视频地址
      b: 0, // 是否允许和播放器进行交互 0允许   1 不允许
      // i: 'http://www.ckplayer.com/static/images/cqdw.jpg'   封面海报
      a: '', // 调用时的参数，只有当s>0的时候有效
      s: '0', // 调用方式，0=普通方法（f=视频地址），1=网址形式,2=xml形式，3=swf形式(s>0时f=网址，配合a来完成对地址的组装)
      c: index === 1 ? '0' : '1', // 是否读取文本配置,0不是，1是 默认1
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
      v: index === 1 ? this.state.volume : '0', // 默认音量，0-100之间
      p: '1', // this.state.playerLoad, //视频默认0是暂停，1是播放，2是不加载视频
      h: '4', // 播放http视频流时采用何种拖动方法，=0不使用任意拖动，=1是使用按关键帧，=2是按时间点，=3是自动判断按什么(如果视频格式是.mp4就按关键帧，.flv就按关键时间)，=4也是自动判断(只要包含字符mp4就按mp4来，只要包含字符flv就按flv来)
      // q: '',//视频流拖动时参考函数，默认是start
      // m: '',//让该参数为一个链接地址时，单击播放器将跳转到该地址
      // o: '',//当p=2时，可以设置视频的时间，单位，秒
      // w: '',//当p=2时，可以设置视频的总字节数
      // g: '',//视频直接g秒开始播放
      // j: '',//跳过片尾功能，j>0则从播放多少时间后跳到结束，<0则总总时间-该值的绝对值时跳到结束
      // k: '32|63',//提示点时间，如 30|60鼠标经过进度栏30秒，60秒会提示n指定的相应的文字
      // n: '这是提示点的功能，如果不需要删除k和n的值|提示点测试60秒',//提示点文字，跟k配合使用，如 提示点1|提示点2
      // wh: "16:9", //宽高比，可以自己定义视频的宽高或宽高比如：wh:'4:3',或wh:'1080:720'
      lv: this.state.isLive, // 是否是直播流，=1则锁定进度栏
      loaded: index === 1 ? `loadedMaster(1)` : `loadedChild(${index})` // 当播放器加载完成后发送该js函数loaded
      // loaded: index == 1 ? `loadedMaster(1)` : `loadedChild(${index})` //当播放器加载完成后发送该js函数loaded
    }
    var params = {
      bgcolor: '#000000',
      allowFullScreen: true,
      allowScriptAccess: 'always',
      wmode: 'transparent'
    }

    window.CKobject.embedSWF(
      './ckplayer/ckplayer.swf',
      this.state.DOMid[index], // 容器id
      this.state.Childid[index], // 实例化元素id
      this.state.playerWidth[index], // 宽高
      this.state.playerHeight[index],
      flashvars,
      params
    )
  }
  /* 窗口变化是 动态设置ck播放器的宽高 */
  // windowResize() {
  //   let contentDOM = document.querySelector('.lean-video-titleinfo')
  //   let baseWidth = 1300
  //   if (contentDOM) {
  //     baseWidth = contentDOM.clientWidth - 10
  //   }
  //   let { Childid } = this.state
  //   let perCell = baseWidth / 3
  //   let ratio = 16 / 9
  //   this.setState({
  //     playerWidth: [
  //       baseWidth,
  //       perCell * 2,
  //       perCell,
  //       perCell
  //     ],
  //     playerHeight: [
  //       perCell * 2 / ratio,
  //       perCell / ratio,
  //       perCell / ratio,
  //       perCell / ratio
  //     ]
  //   }, () => {
  //     Childid && Childid.map((item, i) => {
  //       this.computeStyle(i, true)
  //       let video = window.CKobject.getObjectById(item) // 判断ck播放器是否存在
  //       if (video) {
  //         window.CKobject.getObjectById(item).width = this.state.playerWidth[i]
  //         window.CKobject.getObjectById(item).height = this.state.playerHeight[i]
  //       }
  //     })
  //   })
  // }
  // componentWillUnmount() {
  //   // window.removeEventListener('resize', this.windowResize)
  //   clearTimeout(this.timer)
  // }

  componentWillReceiveProps(nextprops) {
    let { playerWidth, playerHeight, url, Childid } = this.state
    if (nextprops.baseHeight !== playerHeight[0] || nextprops.baseWidth !== playerWidth[0]) {
      // console.log('新高', nextprops.baseHeight, nextprops.baseWidth)
      // let perCell = nextprops.baseWidth / 2
      let perCell = nextprops.baseWidth / 3
      let BaseWidth = nextprops.baseWidth
      let BaseHeight = nextprops.baseHeight
      this.setState({
        playerWidth: [
          BaseWidth,
          perCell * 2,
          perCell,
          perCell
        ],
        playerHeight: [
          BaseHeight,
          BaseHeight,
          BaseHeight / 2 - 28,
          BaseHeight / 2 - 28
        ],
        // playerWidth: [
        //   nextprops.baseWidth,
        //   perCell,
        //   perCell,
        //   perCell
        // ],
        // // playerHeight: [
        // //   perCell / ratio,
        // //   (perCell / ratio )* 2,
        // //   perCell / ratio,
        // //   perCell / ratio - 45
        // // ]
        // playerHeight: [
        //   BaseHeight,
        //   BaseHeight,
        //   BaseHeight / 2 - 28,
        //   BaseHeight / 2 - 28
        // ],
      }, () => {
        Childid && Childid.map((item, i) => {
          this.computeStyle(i, true)
          let video = window.CKobject.getObjectById(item) // 判断ck播放器是否存在
          if (video) {
            window.CKobject.getObjectById(item).width = this.state.playerWidth[i]
            window.CKobject.getObjectById(item).height = this.state.playerHeight[i]
          }
        })
      })
      // this.setState({
      //   playerHeight: [nextprops.baseHeight],
      //   playerWidth: [nextprops.baseWidth]
      // }, () => {
      //   Childid && Childid.map((item, i) => {
      //     let video = CKobject.getObjectById(item); //判断ck播放器是否存在
      //     if (video) {
      //       CKobject.getObjectById(item).width = this.state.playerWidth[i];
      //       CKobject.getObjectById(item).height = this.state.playerHeight[i];
      //     }
      //   })
      // })
    }
    // if(nextprops.baseWidth !== playerWidth[0]) {
    //   this.setState({

    //   })
    // }
    // let isUpdate = false
    // nextprops.url.map(dt => {
    //   let nw = _.find(url, {_url_: dt._url_})
    //   if(!nw) {
    //     isUpdate = true
    //   }
    // })
    // if(isUpdate) {
    //   this.setState({
    //     url: nextprops.url
    //   })
    //   isUpdate = false
    // }
  }
  componentDidMount() {
    // window.addEventListener('resize', this.windowResize)
    // console.log("播放器内部：", this.state);
    let { url } = this.state
    // 根据url来控制播放器实例，第一个是原设计的是背景播放器， 现在不实例了，所以跳过第一个url
    if (this.state.getUrlError) {
      // 父组件获取流地址失败，不做播放器初始化操作以节省性能；
      return
    } else {
      let { Childid } = this.state
      for (let i = 1; i < url.length; i++) {
        if (!url[i] || typeof url[i]._url_ === 'undefined' || !url[i]._url_) {
          // console.log("不渲染第", i, "个接口");
          continue
        }
        // document.querySelector(`.v${i + 1}`).className = `lean-video-mount v${i + 1}`;
        this.insPlayer(i, url[i]._url_)
      }
      Childid && Childid.map((item, i) => {
        this.computeStyle(i, true)
        let video = window.CKobject.getObjectById(item) // 判断ck播放器是否存在
        if (video) {
          window.CKobject.getObjectById(item).width = this.state.playerWidth[i]
          window.CKobject.getObjectById(item).height = this.state.playerHeight[i]
        }
      })
    }

    // ckplayer的全局事件注册，只做事件触发监听，不做任何逻辑处理，逻辑放在组件内的函数调用里
    {
      let _num = 0
      let _this = this
      window.state = _this.state
      window.captureImageToJs = img => {
        let imgBase64 = 'data:image/jpeg;base64,' + img
        _this.props.screenShot(imgBase64)
      }

      window.masterPausedHandle = (isPaused = false) => {
        if (isPaused) {
          // console.log("主播放器暂停事件触发");
          this.videoPause()
        } else {
          // console.log("主播放器播放事件触发");
          this.videoPlay()
        }
      }

      window.masterSeekingHandle = num => {
        // console.log(`主播放器进度跳转到${num}`);
        this.videoSeeking(num)
      }
      window.masterSendNetStreamHandle = () => {
        // console.log('播放器接受到视频流');
        /*
        this.timer = setTimeout(() => {
          this.videoPlay()
        }, 500);
        */
      }
      window.masterEededHandle = () => {
        let { Childid } = this.state
        Childid && Childid.map((item, i) => {
          if (window.CKobject.getObjectById(item)) {
            window.CKobject.getObjectById(item).removeListener('sendNetStream', 'masterSeekingHandle')
          }
        })
      }

      window.loadedChild = function (index) {
        let { Childid } = _this.state
        let id = Childid[index];
        window.CKobject.getObjectById(id).addListener(
          'buffer',
          `childBufferHandle${index}`
        )
      }
      window.childBufferHandle2 = function (e) {
        const Childid = _this.state.Childid;
        let playerid = Childid[2]
        let player = window.CKobject.getObjectById(playerid)
        let status = player.getStatus()
        console.log('child2', e, status.play, twoPlay)
        if (twoPlay && !status.play && e >= 100) {
          player.videoPlay()
        }
        // else if (typeof e === 'undefined' || e < 100) {
        //   player.videoPause()
        // }
      }
      window.childBufferHandle3 = function (e) {
        const Childid = _this.state.Childid;
        let playerid = Childid[3]
        let player = window.CKobject.getObjectById(playerid)
        let status = player.getStatus()
        console.log('child3', e, status.play, twoPlay)
        if (threePlay && !status.play && e >= 100) {
          player.videoPlay()
        }
        // else if (typeof e === 'undefined' || e < 100) {
        //   player.videoPause()
        // }
      }

      window.bufferHandle = function (e) {
        const Childid = _this.state.Childid
        let playerid = Childid[1]
        let player = window.CKobject.getObjectById(playerid)
        let status = player.getStatus()
        console.log('000', status.play, e, needPlay)
        if (needPlay && !status.play && e >= 100) {
          player.videoPlay()
        } else if (status.play && e < 100) {
          player.videoPause()
        }
      }
      window.errorHandle = function () {
        let { Childid } = _this.state
        if (_num > 0) {
          Childid.map((item, index) => {
            if (window.CKobject.getObjectById(item)) {
              window.CKobject.getObjectById(item).videoPlay()
            }
          })
        } else {
          _num++
          Childid.map((item, index) => {
            if (window.CKobject.getObjectById(item)) {
              window.CKobject.getObjectById(item).videoPause()
            }
          })
        }
        message.warning('加载失败')
      }

      window.loadedMaster = function (index) {
        let { Childid } = _this.state
        let masterId = Childid[index]

        // window.CKobject.getObjectById(masterId).changeFace(false);

        window.CKobject.getObjectById(masterId).addListener(
          'paused',
          `masterPausedHandle`
        )
        window.CKobject.getObjectById(masterId).addListener(
          'seeking',
          `masterSeekingHandle`
        )
        window.CKobject.getObjectById(masterId).addListener(
          'buffer',
          `bufferHandle`
        )
        window.CKobject.getObjectById(masterId).addListener(
          'sendNetStream',
          `masterSendNetStreamHandle`
        )
        window.CKobject.getObjectById(masterId).addListener(
          'ended',
          `masterEededHandle`
        )
        window.CKobject.getObjectById(masterId).addListener(
          'error',
          `errorHandle`
        )
      }
    }
    let _this = this
    document.addEventListener('fullscreenchange', function () {
      // console.log('进行全屏操作了')
      // 监听全屏操作
      let { playerWidth, playerHeight, fullId, Childid, DOMid } = _this.state
      // console.log('document.body', document.body)
      if(isCancel === false) {
        isFull = true
      } else if (isCancel) {
        isFull = false
      }
      // console.log('isFull', isCancel, isFull)
      if (isFull === false) {
        _this.setState({
          fullId: 0
        })
      }
      setTimeout(() => {
        let width = document.body.clientWidth;
        let height = document.body.clientHeight;
        Childid && Childid.map((item, i) => {
          // this.computeStyle(i, true)
          let video = window.CKobject.getObjectById(item) // 判断ck播放器是否存在
          if (video && fullId === i) {
            // console.log('isFull', isFull, width, height, i - 1)
            window.CKobject.getObjectById(item).width = isFull ? width : playerWidth[fullId]
            window.CKobject.getObjectById(item).height = isFull ? height : playerHeight[fullId]
            let dom = document.getElementsByTagName(`object`)[i - 1]
            dom.style.top = 0
            dom.style.transform = 'none'
            if(isFull) {
              isCancel = true
            }
          }
        })
      }, 100)


    });
  }

  componentWillUnmount() {
    this.setState({
      fullId: 0
    })
    window.removeEventListener('fullscreenchange', () => {})
  }

  // 控制函数-播放
  videoPlay() {
    let { Childid } = this.state
    needPlay = true
    twoPlay = true
    threePlay = true
    Childid.forEach((item, index) => {
      if (index <= 1) {
        return
      }
      let player = window.CKobject.getObjectById(item)
      if (player) {
        let status = player.getStatus()
        if (!status.play && status.buffer >= 100) {
          player.videoPlay()
        }
      }
    })
  }

  // 控制函数-暂停
  videoPause() {
    let { Childid } = this.state
    needPlay = false
    twoPlay = false
    threePlay = false
    Childid.forEach((item, index) => {
      if (index <= 1) {
        return
      }
      let player = window.CKobject.getObjectById(item)
      if (player) {
        let status = player.getStatus()
        if (status.play) {
          player.videoPause()
        }
      }
    })
  }

  // 控制函数-切换
  videoPlayOrPause() {
    let { Childid } = this.state
    Childid.map((item, index) => {
      if (index === 1) {

      } else {
        if (window.CKobject.getObjectById(item)) {
          window.CKobject.getObjectById(item).playOrPause()
        }
      }
    })
  }

  // 控制函数-进度跳转
  videoSeeking(num) {
    let { Childid } = this.state
    let _num = num - 0
    Childid.map((item, index) => {
      if (index === 0) {

      } else {
        if (window.CKobject.getObjectById(item)) {
          window.CKobject.getObjectById(item).videoSeek(_num)
        }
      }
    })
  }

  /**
   * 全屏显示
   * @param {Number} index 
   */
  handleFullscreen(index) {
    let domid = this.state.DOMid[index]
    let dom = document.getElementById(domid)
    dom.requestFullscreen()
    // console.log('index', index)
    if (dom.requestFullscreen) {
      dom.requestFullscreen();
  } else if (dom.mozRequestFullScreen) {
      dom.mozRequestFullScreen();//火狐浏览器的请求全屏
  } else if (dom.webkitRequestFullScreen) {
      dom.webkitRequestFullScreen();//谷歌、Safari浏览器的请求全屏
  } else if (dom.msRequestFullscreen) {
      dom.msRequestFullscreen();//IE浏览器的请求全屏
  } else {
      console.log("进入全屏失败")
  }
    isCancel = false
    this.setState({
      fullId: index
    })
  }

  /**
   * 设备切换
   * @param {Number} value 选中设备id
   * @param {String} i 视频对应类型及播放器id
   */
  onChangeEqu(value, i) {
    console.log(this.state.allUrls)

    let { allUrls, url, Childid } = this.state
    allUrls[i].selEqu = value
    let newUrl = _.find(allUrls[i].list, o => { return o.equipId === value })
    url[i]._url_ = newUrl ? newUrl.url : ''
    console.log('value', url)
    // 重新渲染
    this.insPlayer(i, url[i]._url_)
    Childid && Childid.map((item, j) => {
      this.computeStyle(j, true)
      let video = window.CKobject.getObjectById(item) // 判断ck播放器是否存在
      if (video) {
        window.CKobject.getObjectById(item).width = this.state.playerWidth[j]
        window.CKobject.getObjectById(item).height = this.state.playerHeight[j]
      }
    })
    this.setState({
      allUrls: allUrls,
      url
    })
  }

  render() {
    let { DOMid, allUrls, url } = this.state
    let isBGModal = true
    return (
      <div className="lxx-video-box">
        {/* 父组件获取url地址错误时候的异常处理 */}
        {this.state.getUrlError ? (
          <div
            className='lean-video-getUrlError yh-video-getUrlError'
            style={this.computeStyle(0, isBGModal)}
          >
            <img src={noData} title='' alt='' />
            无视频数据
          </div>
        ) : (
            <Row className='xt-video-box'>
              <Col span={16}>
                <div className='xt-video xt-main'>
                  {
                    url[1] && url[1]._url_
                      ? <div className='xt-player' id={DOMid[1]} />
                      : <div className='lxx-noData'>
                        <img src={imgURL} />
                        <p>暂无教师视频数据</p>
                      </div>
                  }
                  {
                    url[1] && url[1]._url_
                      ? <div className='xt-ctrl'>
                        <Select
                          value={allUrls[1].selEqu}
                          style={{ width: 135 }}
                          onChange={(value) => this.onChangeEqu(value, 1)}
                          border={false}
                          getPopupContainer={triggerNode => triggerNode.parentNode}
                        >
                          {
                            allUrls[1].list.map(dt => {
                              return <Option key={dt.equipId}>{dt.equipName}</Option>
                            })
                          }
                        </Select>
                        <Tooltip title='全屏播放'>
                          <div className='xt-ctrl-item' onClick={() => this.handleFullscreen(1)}>
                            <Icon type='fullscreen' />
                          </div>
                        </Tooltip>
                      </div>
                      : null
                  }
                </div>
              </Col>
              <Col span={8}>
                <div className='xt-video two'>
                  {
                    url[2] && url[2]._url_
                      ? <div className='xt-player' id={DOMid[2]} />
                      : <div className='lxx-noData'>
                        <img src={imgURL} />
                        <p>暂无学生视频数据</p>
                      </div>
                  }
                  {
                    url[2] && url[2]._url_
                      ? <div className='xt-ctrl'>
                        <Select
                          value={allUrls[2].selEqu}
                          style={{ width: 135 }}
                          border={false}
                          onChange={(value) => this.onChangeEqu(value, 2)}
                          getPopupContainer={triggerNode => triggerNode.parentNode}
                        >
                          {
                            allUrls[2].list.map(dt => {
                              return <Option key={dt.equipId}>{dt.equipName}</Option>
                            })
                          }
                        </Select>
                        <Tooltip title='全屏播放'>
                          <div className='xt-ctrl-item' onClick={() => this.handleFullscreen(2)}>
                            <Icon type='fullscreen' />
                          </div>
                        </Tooltip>
                      </div>
                      : null
                  }

                </div>
                <div className='xt-video two'>
                  {
                    url[3] && url[3]._url_
                      ? <div className='xt-player' id={DOMid[3]} />
                      : <div className='lxx-noData'>
                        <img src={imgURL} />
                        <p>暂无多媒体视频数据</p>
                      </div>
                  }
                  {
                    url[3] && url[3]._url_
                      ?
                      <div className='xt-ctrl'>
                        <Select
                          value={allUrls[3].selEqu}
                          style={{ width: 135 }}
                          border={false}
                          onChange={(value) => this.onChangeEqu(value, 3)}
                          getPopupContainer={triggerNode => triggerNode.parentNode}
                        >
                          {
                            allUrls[3].list.map(dt => {
                              return <Option key={dt.equipId}>{dt.equipName}</Option>
                            })
                          }
                        </Select>
                        <Tooltip title='全屏播放'>
                          <div className='xt-ctrl-item' onClick={() => this.handleFullscreen(3)}>
                            <Icon type='fullscreen' />
                          </div>
                        </Tooltip>

                      </div>
                      : null
                  }

                </div>
              </Col>
            </Row>
          )}
      </div>
    )
  }
}

