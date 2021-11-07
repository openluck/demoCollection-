/*
 * @Author: MinJ
 * @Date: 2020-01-19 13:57:33
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-09-21 14:07:32
 * 听评课V2.2——播放页
 */
import React, { Component } from "react";

import ClassInfo from "./classInfo";
import _ from "lodash";
import { Select, message } from "antd";
import { withRouter } from "react-router-dom";

import OneScreen from './../../../publicComponent/oneScreen.jsx'

import HlsPlayer from "./hlsPlayer";
import VlcPlayer from "./vlcPlayer";
import NoVideo from "./noVideo";
import Robot from "./robot";
import { requestForListen } from '../../../../util/request';
const Request = requestForListen;
const { Option } = Select;
const $ = selector => document.querySelector(selector)
@withRouter
export default class VideoPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      baseInfo: {},
      addrList: [],
      channelList: [],
      hslList: [],
      rtspList: [],
      curVideo: {},
      channelVal: "",
      hasVideo: null,//是否有视频
      isRtsp: null, //是否是rtsp
      isIE: null, //是否是ie
      isVlcInstalled: null,//是否安装vlc
      robotShow: false,
      robotInfo: {},
      baseWidth: 800,
      baseHeight: 525
    }
    this.getVideoInfo = this.getVideoInfo.bind(this)
    this.getRobotData = this.getRobotData.bind(this)
    this.channelChange = this.channelChange.bind(this)
    this.isIE = this.isIE.bind(this)
    this.isInstalledVlc = this.isInstalledVlc.bind(this)
    this.slideRobotClick = this.slideRobotClick.bind(this)
  }
  componentDidMount() {
    const id = this.props.match.params.classId;
    this.getVideoInfo(id);
    // this.getVideoInfo("f25b144478272b61cc883bdedb93f9a5");
    this.getRobotData(id)
    this.isIE();
    if (this.isIE()) {
      this.isInstalledVlc();
    }
    setTimeout(() => {
      const baseWidth = $('.yh-video-wrap').clientWidth
      console.log(baseWidth);
      const baseHeight = baseWidth / 100 * 42 + 152 + 15 + 'px';
      $('.yh-video-wrap').style.height = baseHeight
      this.setState({ baseWidth, baseHeight })
    }, 0);
  }
  /**
   * @description 获取视频基本信息
   * @param {} id
   */
  getVideoInfo(id) {
    let _res = {
      "result": true,
      "code": "200",
      "message": "查询成功",
      "data": {
        "baseInfo": {
          "college": "理学院",
          "teacher": "潘丽君",
          "stuNum": 116,
          "subject": "复变函数Ⅱ",
          "attendRate": 0,
          "secTime": "第八节(17:10:00-23:00:00)"
        },
        "isLive": false,
        "isNvr": false,
        // "addrList":[],
        "addrList": [
          {
            "type": 3,
            "channelId": "A1322B76F6424F85A25ABF608F979816",
            "channelName": "将军路10101常态录播主机",
            "ip": "1.2.5.9",
            // "urlList": [],
            "urlList": [
              {
                "playtype": "hd",
                "list": [
                  {
                    "videotype": "rtsp",
                    "url": "rtmp://110.185.174.59:51936/live|rtspstd_hik/1.2.5.9/554/5/main/admin/admin"
                  },
                  {
                    "videotype": "hls",
                    "url": "https://img.tukuppt.com/video_show/2269348/00/02/23/5b52ff923e41e.mp4"
                  }
                ]
              },
              {
                "playtype": "ld",
                "list": [
                  {
                    "videotype": "rtsp",
                    "url": "rtmp://110.185.174.59:51936/live|rtspstd_hik/1.2.5.9/554/5/sub/admin/admin"
                  },
                  {
                    "videotype": "hls",
                    "url": "http://110.185.174.59:10184/rtspstd_hik/1.2.5.9/554/5/sub/admin/admin/live.m3u8"
                  }
                ]
              }
            ],
            "equipTypeNum": 103
          },
          {
            "type": 3,
            "channelId": "A1322B76F6424F85A25ABF608F979817",
            "channelName": "大帅路10101常态录播主机",
            "ip": "1.2.5.9",
            "urlList": [
              {
                "playtype": "hd",
                "list": [
                  {
                    "videotype": "rtsp",
                    "url": "rtmp://110.185.174.59:51936/live|rtspstd_hik/1.2.5.9/554/5/sub/admin/admin"
                  },
                  {
                    "videotype": "hls",
                    "url": "https://img.tukuppt.com/video_show/3987418/00/02/53/5b79300cbb144.mp4"
                  },
                  // {
                  //   "videotype": "hls",
                  //   "url": "http://110.185.174.59:10184/rtspstd_hik/1.2.5.9/554/5/sub/admin/admin/live.m3u8"
                  // }
                ]
              },
              {
                "playtype": "ld",
                "list": [
                  {
                    "videotype": "rtsp",
                    "url": "rtmp://110.185.174.59:51936/live|rtspstd_hik/1.2.5.9/554/5/sub/admin/admin"
                  },
                  {
                    "videotype": "hls",
                    "url": "http://110.185.174.59:10184/rtspstd_hik/1.2.5.9/554/5/sub/admin/admin/live.m3u8"
                  }
                ]
              }
            ],
            "equipTypeNum": 103
          }
        ]
      },
      "version": "v2.2",
      "total": 0
    }

    Request("myTask/getVideo", { classId: id }, (res) => {
      if (res.result) {
        let { data } = res;
        // let urlList = [];
        let hasVideo = null;
        if (data) {
          let channelList = [], //视频通道
            _addrList = []; //视频通道地址
          let { isLive, isNvr } = data;
          /* 获取视频通道 */
          if (data.hasOwnProperty("addrList") && data.addrList.length > 0) {
            _addrList = data.addrList;
            channelList = _addrList.map(item => {
              let obj = {};
              obj.channelName = item.channelName;
              obj.channelId = item.channelId;
              return obj;
            });
          } else {
            _addrList = [];
            channelList = [];
          }
          // console.log('_addrList', _addrList);
          let hdList = _addrList.map((item) => {
            let { urlList } = item;
            let temp = {}
            if (urlList.length > 0) {
              temp = _.find(urlList, { playtype: "HD" });
              // temp = _.find(urlList, { playtype: "hd" });
              temp.channelId = item.channelId
            }
            return temp
          })
          // console.log(data);
          let ifRtsp = false
          let urlList = hdList.map((item) => {
            let url = {};
            if (Object.keys(item).length > 0) {
              if (item.hasOwnProperty('list') && item.list.length > 0) {
                let { list } = item;
                if (isLive) {
                  url = _.find(list, { videotype: "rtmp" })
                  // url = _.find(list, { videotype: "hls" })
                  url.channelId = item.channelId
                  ifRtsp = false
                } else {
                  let isrtmp = _.find(list, { videotype: "rtmp" })
                  let isrtsp = _.find(list, { videotype: "rtsp" })
                  let ishls = _.find(list, { videotype: "hls" })
                  url = isrtmp ? isrtmp : isrtsp ? isrtsp : ishls
                  // console.log(url);
                  ifRtsp = isrtmp ? false : isrtsp ? true : false
                  url.channelId = item.channelId
                  // if (isNvr) {
                  //   url = _.find(list, { videotype: "rtsp" })
                  //   url.channelId = item.channelId
                  // } else {
                  //   url = _.find(list, { videotype: "rtmp" })
                  //   // url = _.find(list, { videotype: "hls" })
                  //   url.channelId = item.channelId
                  // }
                }
              }
            }
            return url
          })
          if (urlList.length > 0 && urlList[0]['url']) {
            hasVideo = true;
          } else {
            hasVideo = false;
          }
          this.setState({
            baseInfo: data.baseInfo,
            addrList: data.addrList,
            channelList: channelList,
            channelVal: channelList.length ? channelList[0].channelId : '',
            urlList: urlList,//直播：rtmp，非直播：先判断有无rtmp，然后rtsp（vlc），最后hls；
            curVideo: urlList[0],
            hasVideo: hasVideo,
            isRtsp: ifRtsp,
            // isRtsp: data.isLive ? false : !data.isNvr ? false : true, //直播：rtmp，nvr：rtsp，非nvr：rtmp
            // isRtsp: data.isLive ? false : data.isNvr ? true : false, //true-调用vlc，false-调用原有逻辑播放rtsp
          })
        }
      } else {
        message.warn(res.message)
      }
    })
  }
  /**
   * @description 获取机器人信息
   * @param id--课堂id
   */
  getRobotData(id) {
    let res = {
      "result": true,
      "data": {
        "teaStatus": "教师考勤正在努力分析中...",
        "stuNum": 32,
        "shouldNum": 60,
        "countTime": new Date()
      }
    }
    Request('myTask/getRobot', { classId: id }, (res) => {
      let teaStatus = ''
      if (res.result) {
        if (res.data) {
          switch (res.data.teaStatus) {
            case 0:
              teaStatus = '教师正常授课哦'
              break;
            case 1:
              teaStatus = '教师授课异常'
              break;
            case 2:
              teaStatus = '教室授课迟到'
              break;
            case 3:
              teaStatus = '教师私自调课'
              break;
            case 4:
              teaStatus = '无人授课'
              break;
            case -1:
              teaStatus = '当前不在授课状态'
              break;
            case -2:
              teaStatus = '教师考勤正在努力分析中...'
              break;
            default:
              teaStatus = ''
              break;
          }
          res.data.teaState = teaStatus;
          this.setState({
            robotInfo: res.data
          })
        } else {
          this.setState({
            robotInfo: {}
          })
        }
      } else {
        message.warn(res.message)
      }
    })
  }
  /**
   * @description 视频通道切换
   * @param {*} val
   */
  channelChange(val) {
    const { urlList } = this.state;

    let curVideo = _.find(urlList, { channelId: val });
    this.setState({
      curVideo: curVideo,
      channelVal: val,
      hasVideo: curVideo && curVideo.url ? true : false
    });
  }
  /* 判断是否是ie浏览器 */
  isIE() {
    let activeXObject = !!window.ActiveXObject || "ActiveXObject" in window;
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
        });
      }
    } catch (e) {
      this.setState({
        isVlcInstalled: false
      });
    }
  }
  /**
   * @description 机器人点击
   */
  slideRobotClick() {
    const id = this.props.match.params.classId;
    this.setState({
      robotShow: true
    }, () => {
      setTimeout(() => {
        this.setState({
          robotShow: false
        })
      }, 5000)
    })
    this.getRobotData(id)
  }

  render() {
    const { baseInfo, addrList, channelList, curVideo, hasVideo, channelVal, isRtsp, isIE, isVlcInstalled,
      robotShow, robotInfo, baseWidth, baseHeight } = this.state;
    // console.log('baseWidth', baseWidth);

    return (
      <>
        <ClassInfo baseInfo={baseInfo} />
        <div className="yh-video-wrap">
          <div className="yh-video-top">
            <Select
              value={channelVal}
              style={{ width: 240 }}
              onChange={this.channelChange}
            >
              {channelList.length &&
                channelList.map((item, i) => {
                  return (
                    <Option key={item.channelId} value={item.channelId}>
                      {item.channelName}
                    </Option>
                  );
                })}
            </Select>
          </div>
          {
            hasVideo ? !isRtsp ?
              // <HlsPlayer
              //   urlData={curVideo}
              //   // urlData={{ videotype: "rtmp", url: "rtmp://110.185.174.59:41936/vod|/file/local://D:/fms_TRMS/data/file/20200907/multi/15/f9680f3ec93645c6bc5d712f3bde3b0f.mp4", channelId: "12B3F44ED471452FBE8FC75D8519545C" }}
              //   width={100}
              //   height={100}
              // />
              <OneScreen
                baseWidth={baseWidth - 270}
                isLive={0}
                url={[undefined, curVideo.url]}
                bgColor="#ccc"
                volume={50}
                playerLoad={1}
                screenShot={() => { }}
              /> :
              <VlcPlayer
                urlData={curVideo}
                // urlData={{ videotype: "rtmp", url: "rtsp://110.185.174.59:2554/file/local://D:/fms_TRMS/data/file/20200907/multi/15/f9680f3ec93645c6bc5d712f3bde3b0f.mp4", channelId: "12B3F44ED471452FBE8FC75D8519545C" }}
                isIE={isIE}
                baseWidth={baseWidth - 270}
                baseHeight={'820px'}
                isInstalledVlc={isVlcInstalled}
              />
              :
              <NoVideo />
          }
          <Robot
            robotShow={robotShow}
            robotInfo={robotInfo}
            click={this.slideRobotClick}
          />
        </div>
      </>
    );
  }
}
