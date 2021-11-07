/*
 * @Author: junjie.lean
 * @Date: 2019-07-23 10:55:17
 * @Last Modified by: xm
 * @Last Modified time: 2021-02-04 12:46:12
 * 三屏视频播放组件
 * summer 重写CKPlayer调用逻辑，手写控制条
 */

import React, { Component } from 'react'
import './multiScreen.scss'
// import noData from './../../icon/nodata1.png'
import { message, Row, Col, Icon, Tooltip, Select, Spin } from 'antd'
import _ from 'lodash'
import { keepOnLine } from './videoFun'

const { Option } = Select

let needPlay = true

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
    this.state = {
      DOMid: [], // 播放器挂载的元素的id
      Childid: [], // 播放器实例id，这两个id均是随机数
      // 播放器的宽高均根据基础宽度动态计算
      stuScreen: '',
      teaScreen: '',
      otherScreen: '',
      stuScreenList: [],
      teaScreenList: [],
      otherScreenList: [],
      isLive: props.isLive,
      url: props.url || [undefined, '', '', ''],
      volume: props.volume || 60,
      loading_1: true,
      loading_2: true,
      loading_3: true,
      noUrl_1: false,
      noUrl_2: false,
      noUrl_3: false
    }

    // 循环多次  创建一个随机id
    for (let i = 0; i < 4; i++) {
      this.state.DOMid.push('ckplayer' + i) // + Math.floor(Math.random() * 1e10));
      this.state.Childid.push('ckplayerid' + i) // Math.floor(Math.random() * 1e10));
    }


    this.handleChangeScreen = this.handleChangeScreen.bind(this)
    this.insPlayer.bind(this)
    this.videoPlayOrPause.bind(this)
    this.videoSeeking.bind(this)
    // 播放定时器，延迟播放，解决右侧视频不播放问题
    this.timer = ''
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
      // c: '0', // 是否读取文本配置,0不是，1是 默认1
      c: index === 1 ? '0' : '1', // 是否读取文本配置,0不是，1是 默认1
      // x: index !== 1 ? './ckplayer/ckplayer.xml' : '',//调用配置文件路径，只有在c=1时使用。默认为空调用的是ckplayer.xml
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
      '100%', // 宽高
      '100%',
      flashvars,
      params
    )
  }
  componentWillUnmount() {
    clearTimeout(this.timer)
    clearInterval(this.timerSession)
  }
  // 地址变化，重新刷新
  componentDidUpdate(prevProps, prevState) {
  }
  componentDidMount() {
    this.timerSession = setInterval(() => {
      const token = sessionStorage.getItem('token')
      if (token) {
        keepOnLine(token)
      }
    }, 4 * 60 * 1000);
    let { url } = this.state
    // let that = this
    // 根据url来控制播放器实例，第一个是原设计的是背景播放器， 现在不实例了，所以跳过第一个url
    for (let i = 1; i < url.length; i++) {
      if (i === 1) {
        let flag = true
        if (url[i]) {
          flag = false
        }
        this.setState({
          loading_1: false,
          noUrl_1: flag
        }, () => {
          !flag ? this.insPlayer(i, url[i]) : ''
        })

      } else if (i === 2) {
        let flag = true
        if (url[i]) {
          flag = false
        }
        this.setState({
          loading_2: false,
          noUrl_2: flag
        }, () => {
          !flag ? this.insPlayer(i, url[i]) : ''
        })
      } else if (i === 3) {
        let flag = true
        if (url[i]) {
          flag = false
        }
        this.setState({
          loading_3: false,
          noUrl_3: flag
        }, () => {
          !flag ? this.insPlayer(i, url[i]) : ''
        })
      }
      // this.insPlayer(i, url[i])
    }

    // ckplayer的全局事件注册，只做事件触发监听，不做任何逻辑处理，逻辑放在组件内的函数调用里
    {
      let _num = 0
      let _this = this
      window.state = _this.state
      window.captureImageToJs = img => {
        let imgBase64 = 'data:image/jpeg;base64,' + img
        _this.props.screenShot(imgBase64)
        let { Childid } = _this.state
        Childid.map(item => {
          if (window.CKobject.getObjectById(item)) {
            CKobject.getObjectById(item).videoPlay();
          }
        });
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen()
        } else if (typeof window.ActiveXObject !== "undefined") {//for Internet Explorer
          var wscript = new ActiveXObject("WScript.Shell");
          console.log('wscript', wscript)
          if (wscript !== null) {
            wscript.SendKeys("{F11}");
          }
        }
      }

      window.masterPausedHandle = (isPaused = false) => {
        // console.log('isPaused', isPaused)
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
        let id = Childid[index]
        window.CKobject.getObjectById(id).addListener(
          'buffer',
          `childBufferHandle`
        )
      }
      window.bufferHandle = function (e) {
        const Childid = _this.state.Childid
        let playerid = Childid[1]
        let player = window.CKobject.getObjectById(playerid)
        let status = player.getStatus()

      }
      window.childBufferHandle = function (e) {
        // console.log('child', e)
        const Childid = _this.state.Childid
        if (Childid.length > 2) {
          for (let i = 2; i < Childid.length; i++) {
            let playerid = Childid[i]
            let player = window.CKobject.getObjectById(playerid)
            let status = player.getStatus()
            // if (needPlay && !status.play && status >= 100) {
            //   player.videoPlay()
            // } else if (status.play) {
            //   player.videoPause()
            // }
          }
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
  }

  // 控制函数-播放
  videoPlay() {
    let { Childid } = this.state
    needPlay = true
    Childid.forEach((item, index) => {
      if (index === 0) {
        return
      }
      if (window.CKobject.getObjectById(item)) {
        CKobject.getObjectById(item).videoPlay();
      }
      // let player = window.CKobject.getObjectById(item)
      // if (player) {
      //   let status = player.getStatus()
      //   player.videoPlay()
      //   // console.log(status)
      //   // // if (!status.play && status.buffer >= 100) {
      //   //   if (!status.play) {
      //   //   player.videoPlay()
      //   // }
      // }
    })
  }

  // 控制函数-暂停
  videoPause() {
    let { Childid } = this.state
    needPlay = false
    Childid.forEach((item, index) => {
      // if (index <= 1) {
      //   return
      // }
      if (index === 0) {
        return
      }
      if (window.CKobject.getObjectById(item)) {
        CKobject.getObjectById(item).videoPause();
      }
      // let player = window.CKobject.getObjectById(item)
      // if (player) {
      //   let status = player.getStatus()
      //   // if (status.play) {
      //   //   player.videoPause()
      //   // }
      // }
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

  handleFullscreen(index) {
    let domid = this.state.DOMid[index]
    let dom = document.getElementById(domid)
    // let dom = document.querySelector('#' + domid + ' object')
    console.log('dom', dom)
    if (dom.msRequestFullscreen) {
      dom.msRequestFullscreen()
    } else if (dom.mozRequestFullScreen) {
      dom.mozRequestFullScreen()
    } else if (dom.webkitRequestFullScreen) {
      dom.webkitRequestFullScreen()
    } else if (dom.requestFullScreen) {
      dom.requestFullScreen()
    }
  }

  // 切换镜头
  handleChangeScreen(id) {
    const type = parseInt(id.substr(0, 1))
    const { teaScreenList, stuScreenList, otherScreenList } = this.props
    switch (type) {
      case 1:
        this.setState({
          loading_1: true
        }, () => {
          teaScreenList.some(item => {
            if (item.id === id) {
              this.setState({
                teaScreen: item.id
              })
              const url = item.url[0].list[0].url
              if (url) {
                this.setState({
                  loading_1: false,
                  noUrl_1: false
                }, () => {
                  console.log('有地址')
                  this.insPlayer(1, url)
                })
              } else {
                this.setState({
                  loading_1: false,
                  noUrl_1: true
                })
              }

              return true
            }
          })
        })
        break
      case 2:
        this.setState({
          loading_2: true
        }, () => {
          stuScreenList.some(item => {
            if (item.id === id) {
              this.setState({
                stuScreen: item.id
              })
              const url = item.url[0].list[0].url
              if (url) {
                this.setState({
                  loading_2: false,
                  noUrl_2: false
                }, () => {
                  console.log('有地址')
                  this.insPlayer(2, url)
                })
              } else {
                this.setState({
                  loading_2: false,
                  noUrl_2: true
                })
              }

              return true
            }
          })
        })
        break
      default:
        this.setState({
          loading_3: true
        }, () => {
          otherScreenList.some(item => {
            if (item.id === id) {
              this.setState({
                teaScreen: item.id
              })
              const url = item.url[0].list[0].url
              if (url) {
                this.setState({
                  loading_3: false,
                  noUrl_3: false
                }, () => {
                  console.log('有地址')
                  this.insPlayer(3, url)
                })
              } else {
                this.setState({
                  loading_3: false,
                  noUrl_3: true
                })
              }

              return true
            }
          })
        })
    }
  }
  render() {

    const { stuScreenList, teaScreenList, otherScreenList, fullScreen, baseWidth } = this.props
    const { teaScreen, stuScreen, otherScreen, DOMid, loading_1,
      loading_2, loading_3, noUrl_1, noUrl_2, noUrl_3 } = this.state

    let tea = teaScreen ? teaScreen : (
      teaScreenList && teaScreenList[0] ? teaScreenList[0].id : ''
    )
    let stu = stuScreen ? stuScreen : (
      stuScreenList && stuScreenList[0] ? stuScreenList[0].id : ''
    )
    let other = otherScreen ? otherScreen : (
      otherScreenList && otherScreenList[0] ? otherScreenList[0].id : ''
    )

    return (
      <div>
        <Row className='xt-video-box' style={{ height: baseWidth / 1371 * 551 }}>
          <Col span={16}>
            <div className='xt-video xt-main'>
              <Select className='xm-screen'
                style={{ position: 'absolute', left: 0, top: 0, width: 110, backgroundColor: 'transparent', color: '#fff' }}
                dropdownStyle={{ backgroundColor: '#fff' }}
                bordered={false}
                value={tea}
                suffixIcon={<span></span>}
                onChange={this.handleChangeScreen}
              >
                {
                  teaScreenList && teaScreenList[0] && teaScreenList.map(item => {
                    return <Option key={item.id} value={item.id}>{item.name}</Option>
                  })
                }
              </Select>
              {
                loading_1 ?
                  <div className='xm-playerloading'>
                    <Spin size='middle' />
                    <span className='xm-span'>Loading...</span>
                  </div> :
                  (
                    noUrl_1 ? <div className='xm-playerNoUrl'>抱歉，无法找到视频</div> :
                    <div className='xt-player' id={DOMid[1]}></div>

                  )
              }
              <Tooltip title='全屏播放'>
                <div className='xt-ctrl'>
                  <img src={fullScreen} onClick={() => this.handleFullscreen(1)} />
                </div>
              </Tooltip>
            </div>
          </Col>
          <Col span={8}>
            <div className='xt-video'>
              <Select className='xm-screen'
                style={{ width: 110, backgroundColor: 'transparent', color: '#fff', position: 'absolute', left: 0, top: 0 }}
                dropdownStyle={{ backgroundColor: '#fff' }}
                bordered={false}
                value={stu}
                // defaultValue={}
                suffixIcon={<span></span>}
                onChange={this.handleChangeScreen}
              >
                {
                  stuScreenList && stuScreenList[0] && stuScreenList.map(item => {
                    return <Option key={item.id} value={item.id}>{item.name}</Option>
                  })
                }
              </Select>
              {
                loading_2 ?
                  <div className='xm-playerloading'>
                    <Spin size='middle' />
                    <span className='xm-span'>Loading...</span>
                  </div> :
                  (
                    noUrl_2 ? <div className='xm-playerNoUrl'>抱歉，无法找到视频</div> :
                      <div className='xt-player' id={DOMid[2]} ></div>
                  )
              }
              <Tooltip title='全屏播放'>
                <div className='xt-ctrl'>
                  <img src={fullScreen} onClick={() => this.handleFullscreen(2)} />
                </div>
              </Tooltip>
            </div>
            <div className='xt-video'>
              {/* <p className='xm-duomeiti'>多媒体</p> */}
              <Select className='xm-screen'
                style={{ width: 110, position: 'absolute', left: 0, top: 0, backgroundColor: 'transparent', color: '#fff' }}
                dropdownStyle={{ backgroundColor: '#fff' }}
                bordered={false}
                value={other}
                // defaultValue={}
                suffixIcon={<span></span>}
                onChange={this.handleChangeScreen}
              >
                {
                  otherScreenList && otherScreenList[0] && otherScreenList.map(item => {
                    return <Option key={item.id} value={item.id}>{item.name}</Option>
                  })
                }
              </Select>
              {
                loading_3 ?
                  <div className='xm-playerloading'>
                    <Spin size='middle' />
                    <span className='xm-span'>Loading...</span>
                  </div> :
                  (
                    noUrl_3 ? <div className='xm-playerNoUrl'>抱歉，无法找到视频</div> :
                      <div className='xt-player' id={DOMid[3]} ></div>
                  )
              }
              <Tooltip title='全屏播放'>
                <div className='xt-ctrl'>
                  <img src={fullScreen} onClick={() => this.handleFullscreen(3)} />
                </div>
              </Tooltip>
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}

