/*
 * @Author: lxx 
 * @Date: 2020-07-29 13:55:43 
 * @Last Modified by: lxx
 * @Last Modified time: 2021-03-29 12:57:56
 * 课堂视频信息
 * data 课堂信息（） 
 */
import React, { useEffect, useState, useRef } from 'react'
import SVG from './../../public/svg'
// import { getSection } from "./../../../util/file";
import _x from './../../../util/file'
import './../../../style/lxx_video.scss'
import { request } from './../../../util/request'
// import MultiScreen from './multiScreen'
import _ from 'lodash'
import G from '../../../config/g';

import OneScreen from './hls/oneScreen'
import TwoScreen from './hls/twoScreen'
import MultiScreen from './hls/multiScreen'
import Vlc from './vlc/vlc'
import { message, Spin, Select } from 'antd';
import imgURL from './../../../media/picture/img_noData.png';

const { Option } = Select
const getSection = _x.getSection;

const showInfo = [{
  name: '课程类型',
  key: 'couTypeName',
  icon: 'kechengleibie',
},
{
  name: '课程号',
  key: 'courseNum',
  icon: 'kechenghao',
}, {
  name: '课序号',
  key: 'lessonNum',
  icon: 'xuhao',
},
{
  name: '时间',
  key: 'date',
  icon: 'shijian',
}, {
  name: '课表教师',
  key: 'teacherName',
  icon: 'jiaoshi',
}, {
  name: '地点',
  key: 'claAddress',
  icon: 'dizhi',
}, {
  name: '学生应到人数',
  key: 'stuNum',
  icon: 'xuesheng',
}]

const TypeList = [{
  key: '1',
  name: '单屏',
  isShow: true
}, {
  key: '2',
  name: '多屏',
  isShow: true
}]

let newInfo = showInfo
const ViedoInfo = (props) => {
  const [data, setData] = useState(null) // 课堂信息
  const [boxObj, setBoxObj] = useState({ width: 1075, height: 600 }) // 视频播放占比宽高
  const [selId, setSelId] = useState('') // 选中课堂小节次
  const [selType, setSelType] = useState('') // 视频播放类型
  const [frontConfig, setFrontConfig] = useState({
    // isLive: 1, // 0录播，1直播
    isIE: null, // 是否是ie浏览器
    isVlcInstalled: null, // 是否安装了vlc播放插件
    rtspRtmp: null, //判断是否调用vlc false-调用hls ， true-条用vlc
  })
  const [videoConfig, setVideoConfig] = useState({
    getUrlError: false,
    isLive: null, // 是否是直播
    isNvr: null, // 是否是Nvr回放
    url: []
  })
  const [saveUrls, setSaveUrls] = useState([]) // 视频存储地址
  const [vlcUrl, setVlcUrl] = useState({
    id: "",
    name: "",
    url: ""
  }) // nvr播放视频地址
  const [isLoading, setIsLoading] = useState(true) // 视频加载
  const [secConfig, setSecConfig] = useState({
    isShow: false,
    width: 0,
    left: 0
  })
  const boxRef = useRef(null)
  const secRef = useRef(null)

  useEffect((e) => {
    let { isClassOrder } = G.ISCED_setInfo
    // 剔除不展示配置项
    if (isClassOrder === '0') {
      newInfo = _.filter(newInfo, o => (o.key !== 'courseNum' && o.key !== 'lessonNum'))
    } else {
      newInfo = showInfo
    }
    changeViewBox()
    // 监听窗口变化，修改视频占比
    window.addEventListener("resize", changeViewBox, false);
    return () => {
      window.removeEventListener('resize', changeViewBox)
      initData()
      setSelId('')
      setData(null)

    }
  }, [])

  useEffect(() => {
    console.log('props.data', props.data)
    if (props.data && props.data.claRoomId) {
      // 更新课堂信息
      setData(props.data)
      let { courseSection } = props.data
      if (courseSection && courseSection.length) {
        // 计算滑动宽度
        let parw = secRef.current.clientWidth;
        let wd = courseSection.length * 250
        if (wd > parw) {
          // 大于一屏展示
          setSecConfig({ ...secConfig, width: wd, isShow: true })
        } else {
          setSecConfig({ ...secConfig, width: 0, isShow: false })
        }
        let t = _.find(courseSection, { sectionStatus: '1' })
        if (t) {
          setSelId(t.sectionId)
        } else {
          // console.log(props.data.courseSection[0].sectionId)
          setSelId(props.data.courseSection[0].sectionId)
        }
      } else {
        setSecConfig({ ...secConfig, width: 0, isShow: false })
      }
      // console.log(props.data)

    } else {
      setSaveUrls([])
      setSelType('')
      setSelId('')
      setData(null)
    }
  }, [props.data])

  useEffect(() => {
    if (selId) {
      // 请求小节次数据
      getVideo(props.claRoomId, selId)
    }
  }, [selId])

  // useEffect(() => {
  //   let config = videoConfig
  //   config.baseWidth = boxObj.width
  //   config.baseHeight = boxObj.width > 1520 ? 750 : boxObj.height
  //   // console.log('config', config)
  //   setVideoConfig({ ...config })
  // }, [boxObj])

  /**
   * 计算视频播放组件占比相关数据
   */
  const changeViewBox = () => {
    // 高宽比例为9:16，及0.56
    let isHasNav = document.getElementsByClassName('ant-layout-sider') ? true : false
    let allWidth = document.body.clientWidth
    if (boxRef && boxRef.current) {
      let parw = boxRef.current.clientWidth;
      let num = 0; // 左侧菜单宽度
      if (isHasNav && (allWidth - parw) < 220) {
        num = 220
      }
      let wd = parw - 30 - num; // 视频占比宽度
      let ht = parseInt(wd * 0.48) //视频占比高度
      // console.log(wd, ht)
      setBoxObj({ width: wd, height: ht })
    }
  }

  /**
   * 数据初始化
   */
  const initData = () => {
    console.log('我进来了')
    setIsLoading(true)
    setVideoConfig({
      // baseWidth: boxObj.width,
      // baseHeight: boxObj.height,
      getUrlError: false,
      isNvr: null, // 是否是Nvr回放
      isLive: null,// 0录播，1直播
      url: []
    })
    setSaveUrls([])
    // setRtspUrl('')
    setSelType('')
  }

  /**
   * 获取视频数据
   * @param {String} cId 课堂id
   * @param {String} sId 节次id
   */
  const getVideo = (cId, sId) => {
    initData()
    request('api/public/getVideo', { claRoomId: cId, sectionId: sId }, (res) => {
      // 直播
      res = {
        "result": true,
        "code": "200",
        "message": null,
        "data": {
          "isLive": true,
          "list": [{
            "equipId": "4723167DC20B4741AEF0F51A68AC0EF9",
            "equipName": "学生跟踪",
            "type": "2",
            "urlList": [{
              "videoType": "rtmp",
              "url": "rtmp://10.4.3.47:1936/live|rtspstd_hik/10.4.2.102/554/1/main/admin/jfkj1234"
            }, {
              "videoType": "hls",
              "url": "http://10.20.5.190/ms/live.m3u8?path=rtsp://admin:jfkj1234@10.7.2.106:554/h264/ch1/main/av_stream"
            }],
            "isNvr": false
          },
          {
            equipId: '123',
            equipName: '教师全景1',
            type: "1",
            isNvr: false,
            urlList: [{
              videoType: 'rtmp',
              // url: 'rtmp://110.185.174.59:41936/vod|/file/local://D:/fms_TRMS/data/file/20200316/multi/17/5c13427b401948368046ab6e824b69ef.mp4'
              url: 'rtmp://110.185.174.59:41936/live|rtspstd_hik/10.7.2.106/554/1/main/admin/jfkj1234'
            }, {
              videoType: 'hls',
              url: 'http://10.20.5.190/ms/live.m3u8?path=rtsp://admin:jfkj1234@10.7.2.106:554/h264/ch1/main/av_stream'
            }, {
              videoType: 'rtsp',
              url: 'rtsp://admin:jfkj1234@10.7.2.104:554/h264/ch1/main/stream3'
            }]
          },
          {
            equipId: '1231',
            equipName: '教师全景2',
            type: "1",
            isNvr: false,
            urlList: [{
              videoType: 'rtmp',
              url: 'rtmp://110.185.174.59:41936/vod|/file/local://D:/fms_TRMS/data/file/20200316/multi/17/5c13427b401948368046ab6e824b69ef.mp4'
              // url: 'rtmp://10.20.5.101:1936/live|rtspstd_hik/10.7.2.106/554/1/main/admin/jfkj1234'
            }, {
              videoType: 'hls',
              url: 'http://10.20.5.190/ms/live.m3u8?path=rtsp://admin:jfkj1234@10.7.2.106:554/h264/ch1/main/av_stream'
            }, {
              videoType: 'rtsp',
              url: 'rtsp://admin:jfkj1234@10.7.2.106:554/h264/ch1/main/stream3'
            }]
          },
            {
              equipId: '1234',
              equipName: '多媒体',
              type: "3",
              isNvr: false,
              urlList: [{
                videoType: 'rtmp',
                // url: 'rtmp://110.185.174.59:41936/vod|/file/local://D:/fms_TRMS/data/file/20200316/multi/17/5c13427b401948368046ab6e824b69ef.mp4'
                url: 'rtmp://110.185.174.59:41936/live|rtspstd_hik/10.7.2.104/554/1/main/admin/jfkj1234'
              }, {
                videoType: 'hls',
                url: 'http://10.20.5.190/ms/live.m3u8?path=rtsp://admin:jfkj1234@10.7.2.106:554/h264/ch1/main/av_stream'
              }, {
                videoType: 'rtsp',
                url: 'rtsp://10.254.6.80:554/stream0/high'
              }]
            }
          ]
        },
        "version": "v2.0.0",
        "total": 0
      }
      // 云存储回放
      // res = {
      //   "result": true,
      //   "code": "200",
      //   "message": null,
      //   "data": {
      //     "isLive": false,
      //     "list": [{
      //       "equipId": "4723167DC20B4741AEF0F51A68AC0EF9",
      //       "equipName": "学生跟踪",
      //       "type": "2",
      //       "urlList": [{
      //         "videoType": "rtmp",
      //         "url": "rtmp://10.4.3.47:1936/live|rtspstd_hik/10.4.2.102/554/1/main/admin/jfkj1234"
      //       }, {
      //         "videoType": "hls",
      //         "url": "http://10.4.3.88:84/file/local://D:/fms_TRMS/data/file/20210525/multi/11/d2a586787092438ba7b86ebe0f17fbdb.mp4/1/1621911599/1621914598/0/playback.m3u8"
      //       }],
      //       "nvr": false
      //     },
      //     {
      //       equipId: '123',
      //       equipName: '教师全景1',
      //       type: "1",
      //       nvr: false,
      //       urlList: [{
      //         videoType: 'rtmp',
      //         // url: 'rtmp://110.185.174.59:41936/vod|/file/local://D:/fms_TRMS/data/file/20200316/multi/17/5c13427b401948368046ab6e824b69ef.mp4'
      //         url: 'rtmp://110.185.174.59:41936/live|rtspstd_hik/10.7.2.106/554/1/main/admin/jfkj1234'
      //       }, {
      //         videoType: 'hls',
      //         url: 'http://10.4.3.88:84/file/local://D:/fms_TRMS/data/file/20210525/multi/11/d2a586787092438ba7b86ebe0f17fbdb.mp4/1/1621911599/1621914598/0/playback.m3u8'
      //       }, {
      //         videoType: 'rtsp',
      //         url: 'rtsp://admin:jfkj1234@10.7.2.104:554/h264/ch1/main/stream3'
      //       }]
      //     },
      //     {
      //       equipId: '1231',
      //       equipName: '教师全景2',
      //       type: "1",
      //       nvr: false,
      //       urlList: [{
      //         videoType: 'rtmp',
      //         url: 'rtmp://110.185.174.59:41936/vod|/file/local://D:/fms_TRMS/data/file/20200316/multi/17/5c13427b401948368046ab6e824b69ef.mp4'
      //         // url: 'rtmp://10.20.5.101:1936/live|rtspstd_hik/10.7.2.106/554/1/main/admin/jfkj1234'
      //       }, {
      //         videoType: 'hls',
      //         url: 'http://10.4.3.88:84/file/local://D:/fms_TRMS/data/file/20210525/multi/11/d2a586787092438ba7b86ebe0f17fbdb.mp4/1/1621911599/1621914598/0/playback.m3u8'
      //       }, {
      //         videoType: 'rtsp',
      //         url: 'rtsp://admin:jfkj1234@10.7.2.106:554/h264/ch1/main/stream3'
      //       }]
      //     },
      //       // {
      //       //   equipId: '1234',
      //       //   equipName: '多媒体',
      //       //   type: "3",
      //       //   nvr: false,
      //       //   urlList: [{
      //       //     videoType: 'rtmp',
      //       //     // url: 'rtmp://110.185.174.59:41936/vod|/file/local://D:/fms_TRMS/data/file/20200316/multi/17/5c13427b401948368046ab6e824b69ef.mp4'
      //       //     url: 'rtmp://110.185.174.59:41936/live|rtspstd_hik/10.7.2.104/554/1/main/admin/jfkj1234'
      //       //   }, {
      //       //     videoType: 'hls',
      //       //     url: 'http://10.4.3.88:84/rtspstd_hik/10.4.2.102/554/01/sub/admin/jfkj1234/live.m3u8'
      //       //   }, {
      //       //     videoType: 'rtsp',
      //       //     url: 'rtsp://10.254.6.80:554/stream0/high'
      //       //   }]
      //       // }
      //     ]
      //   },
      //   "version": "v2.0.0",
      //   "total": 0
      // }
      // nvr回放
      // res = {
      //   "result": true,
      //   "code": "200",
      //   "message": null,
      //   "data": {
      //     "isLive": false,
      //     "list": [{
      //       "equipId": "4723167DC20B4741AEF0F51A68AC0EF9",
      //       "equipName": "学生跟踪",
      //       "type": "2",
      //       "urlList": [{
      //         "videoType": "rtsp",
      //         "url": "rtsp://admin:12345@10.4.3.90/streaming/tracks/101/?starttime=20210729T145000Z&endtime=20210729T155000Z"
      //       }, {
      //         "videoType": "hls",
      //         "url": "http://10.4.3.88:84/file/local://D:/fms_TRMS/data/file/20210525/multi/11/d2a586787092438ba7b86ebe0f17fbdb.mp4/1/1621911599/1621914598/0/playback.m3u8"
      //       }],
      //       "nvr": false
      //     },
      //     {
      //       equipId: '123',
      //       equipName: '教师全景1',
      //       type: "1",
      //       nvr: false,
      //       urlList: [{
      //         videoType: 'rtmp',
      //         // url: 'rtmp://110.185.174.59:41936/vod|/file/local://D:/fms_TRMS/data/file/20200316/multi/17/5c13427b401948368046ab6e824b69ef.mp4'
      //         url: 'rtmp://110.185.174.59:41936/live|rtspstd_hik/10.7.2.106/554/1/main/admin/jfkj1234'
      //       }, {
      //         videoType: 'hls',
      //         url: 'http://10.4.3.88:84/file/local://D:/fms_TRMS/data/file/20210525/multi/11/d2a586787092438ba7b86ebe0f17fbdb.mp4/1/1621911599/1621914598/0/playback.m3u8'
      //       }, {
      //         videoType: 'rtsp',
      //         url: 'rtsp://admin:12345@10.4.3.90/streaming/tracks/101/?starttime=20210729T145000Z&endtime=20210729T155000Z'
      //       }]
      //     },
      //     {
      //       equipId: '1231',
      //       equipName: '教师全景2',
      //       type: "1",
      //       nvr: false,
      //       urlList: [{
      //         videoType: 'rtmp',
      //         url: 'rtmp://110.185.174.59:41936/vod|/file/local://D:/fms_TRMS/data/file/20200316/multi/17/5c13427b401948368046ab6e824b69ef.mp4'
      //         // url: 'rtmp://10.20.5.101:1936/live|rtspstd_hik/10.7.2.106/554/1/main/admin/jfkj1234'
      //       }, {
      //         videoType: 'hls',
      //         url: 'http://10.4.3.88:84/file/local://D:/fms_TRMS/data/file/20210525/multi/11/d2a586787092438ba7b86ebe0f17fbdb.mp4/1/1621911599/1621914598/0/playback.m3u8'
      //       }, {
      //         videoType: 'rtsp',
      //         url: 'rtsp://admin:12345@10.4.3.90/streaming/tracks/101/?starttime=20210729T145000Z&endtime=20210729T155000Z'
      //       }]
      //     },
      //     {
      //       equipId: '1234',
      //       equipName: '多媒体',
      //       type: "3",
      //       nvr: false,
      //       urlList: [{
      //         videoType: 'rtmp',
      //         // url: 'rtmp://110.185.174.59:41936/vod|/file/local://D:/fms_TRMS/data/file/20200316/multi/17/5c13427b401948368046ab6e824b69ef.mp4'
      //         url: 'rtmp://110.185.174.59:41936/live|rtspstd_hik/10.7.2.104/554/1/main/admin/jfkj1234'
      //       }, {
      //         videoType: 'hls',
      //         url: 'http://10.4.3.88:84/file/local://D:/fms_TRMS/data/file/20210525/multi/11/d2a586787092438ba7b86ebe0f17fbdb.mp4/1/1621911599/1621914598/0/playback.m3u8'
      //       }, {
      //         videoType: 'rtsp',
      //         url: 'rtsp://admin:12345@10.4.3.90/streaming/tracks/101/?starttime=20210729T145000Z&endtime=20210729T155000Z'
      //       }]
      //     }
      //     ]
      //   },
      //   "version": "v2.0.0",
      //   "total": 0
      // }
      // nvr回放
      // res = {
      //   "result": true,
      //   "code": "200",
      //   "message": null,
      //   "data": {
      //     "isLive": false,
      //     "list": [{
      //       "equipId": "4723167DC20B4741AEF0F51A68AC0EF9",
      //       "equipName": "学生跟踪",
      //       "type": "2",
      //       "urlList": [{
      //         "videoType": "rtsp",
      //         "url": "rtsp://admin:12345@10.4.3.90/streaming/tracks/101/?starttime=20210729T145000Z&endtime=20210729T155000Z"
      //       }, {
      //         "videoType": "hls",
      //         "url": "http://10.4.3.88:84/file/local://D:/fms_TRMS/data/file/20210525/multi/11/d2a586787092438ba7b86ebe0f17fbdb.mp4/1/1621911599/1621914598/0/playback.m3u8"
      //       }],
      //       "nvr": true
      //     },
      //     {
      //       equipId: '123',
      //       equipName: '教师全景1',
      //       type: "1",
      //       nvr: true,
      //       urlList: [{
      //         videoType: 'rtmp',
      //         // url: 'rtmp://110.185.174.59:41936/vod|/file/local://D:/fms_TRMS/data/file/20200316/multi/17/5c13427b401948368046ab6e824b69ef.mp4'
      //         url: 'rtmp://110.185.174.59:41936/live|rtspstd_hik/10.7.2.106/554/1/main/admin/jfkj1234'
      //       }, {
      //         videoType: 'hls',
      //         url: 'http://10.4.3.88:84/file/local://D:/fms_TRMS/data/file/20210525/multi/11/d2a586787092438ba7b86ebe0f17fbdb.mp4/1/1621911599/1621914598/0/playback.m3u8'
      //       }, {
      //         videoType: 'rtsp',
      //         url: 'rtsp://admin:12345@10.4.3.90/streaming/tracks/101/?starttime=20210729T145000Z&endtime=20210729T155000Z'
      //       }]
      //     },
      //     {
      //       equipId: '1231',
      //       equipName: '教师全景2',
      //       type: "1",
      //       nvr: true,
      //       urlList: [{
      //         videoType: 'rtmp',
      //         url: 'rtmp://110.185.174.59:41936/vod|/file/local://D:/fms_TRMS/data/file/20200316/multi/17/5c13427b401948368046ab6e824b69ef.mp4'
      //         // url: 'rtmp://10.20.5.101:1936/live|rtspstd_hik/10.7.2.106/554/1/main/admin/jfkj1234'
      //       }, {
      //         videoType: 'hls',
      //         url: 'http://10.4.3.88:84/file/local://D:/fms_TRMS/data/file/20210525/multi/11/d2a586787092438ba7b86ebe0f17fbdb.mp4/1/1621911599/1621914598/0/playback.m3u8'
      //       }, {
      //         videoType: 'rtsp',
      //         url: 'rtsp://admin:12345@10.4.3.90/streaming/tracks/101/?starttime=20210729T145000Z&endtime=20210729T155000Z'
      //       }]
      //     },
      //     {
      //       equipId: '1234',
      //       equipName: '多媒体',
      //       type: "3",
      //       nvr: true,
      //       urlList: [{
      //         videoType: 'rtmp',
      //         // url: 'rtmp://110.185.174.59:41936/vod|/file/local://D:/fms_TRMS/data/file/20200316/multi/17/5c13427b401948368046ab6e824b69ef.mp4'
      //         url: 'rtmp://110.185.174.59:41936/live|rtspstd_hik/10.7.2.104/554/1/main/admin/jfkj1234'
      //       }, {
      //         videoType: 'hls',
      //         url: 'http://10.4.3.88:84/file/local://D:/fms_TRMS/data/file/20210525/multi/11/d2a586787092438ba7b86ebe0f17fbdb.mp4/1/1621911599/1621914598/0/playback.m3u8'
      //       }, {
      //         videoType: 'rtsp',
      //         url: 'rtsp://admin:12345@10.4.3.90/streaming/tracks/101/?starttime=20210729T145000Z&endtime=20210729T155000Z'
      //       }]
      //     }
      //     ]
      //   },
      //   "version": "v2.0.0",
      //   "total": 0
      // }
      if (res.code === "200" && res.result) {
        let { data } = res
        console.log("data", data)
        let vConfig = JSON.parse(JSON.stringify(videoConfig))
        // 处理视频流
        let typeList = [[], [], []]
        if (data.list && data.list.length) {
          // 正序排列
          data.list.sort(function (a, b) {
            return Number(a.type) - Number(b.type)
          })
          // 剔除无视频数据
          let list = _.filter(data.list, o => o.urlList.length) || []
          console.log('list', list)
          if (list.length) {
            if (data.isLive) {
              // 直播,取hls格式
              vConfig.isLive = true
              vConfig.isNvr = false
              typeList = handleData(list, "1")
            } else {
              vConfig.isLive = false
              let _list = _.filter(list, o => o.nvr) || []
              console.log("_list", _list)
              if (_list.length) {
                vConfig.isNvr = true
                // nvr回放，取rtsp格式
                typeList = handleData(list, "3")
              } else {
                vConfig.isNvr = false
                // 云存储回放，取hls格式
                typeList = handleData(list, "2")

              }
            }
            // 剔除没有视频的分屏
            let lastList = _.filter(typeList, o => o.length)
            console.log("lastList", lastList)
            setSaveUrls(lastList)
            setSelType("1")
            // 将多路视频合为一路流
            let arr = []
            lastList.map(item => {
              arr = _.concat(arr, item)
            })
            console.log("arr", arr)
            vConfig.url = arr
            if (vConfig.isNvr && arr.length) {
              setVlcUrl(arr[0])
            }
            setVideoConfig(vConfig)
            setIsLoading(false)
          } else {
            setIsLoading(false)
            setSaveUrls([])
          }
        } else {
          setIsLoading(false)
        }
      } else {
        setIsLoading(false)
        setSaveUrls([])
      }
    })
  }


  /**
   * 遍历重组视频数据
   * @param {Array} data 视频数据
   * @param {String} type 视频类型 1直播 2云存储回放 3nvr回放
   */
  const handleData = (data, type) => {
    let _arr = [[], [], []]
    data.map(item => {
      let i = Number(item.type) // i 1教师 2学生 3多媒体
      let urlInfo
      if (type === "1" || type === "2") {
        // 获取hls地址
        urlInfo = _.find(item.urlList, o => o.videoType === "hls")
      } else if (type === "3") {
        // 获取rtsp地址
        urlInfo = _.find(item.urlList, o => o.videoType === "rtsp")
      }
      if (urlInfo) {
        // 存在该类型地址，存储；不存在该地址，不做记录
        _arr[i - 1].push({
          id: item.equipId,
          name: item.equipName,
          url: urlInfo.url
        })
      }
    })
    return _arr
  }

  /**
   * 单屏多屏切换
   * @param {Array} data 流地址
   * @param {String} type 类型
   */
  const changeVideoPlay = (data, type) => {
    let arr = []
    if (type === '2') {
      // 切成多屏
      let len = saveUrls.length
      console.log(len.toString())
      setSelType(len.toString())
      arr = JSON.parse(JSON.stringify(saveUrls))
    } else if (type === "1") {
      // 单屏
      data.map(item => {
        arr = _.concat(arr, item)
      })
      setSelType(type)
    }
    console.log('newarr', JSON.stringify(arr))
    setVideoConfig({
      ...videoConfig,
      url: arr
    })

  }

  /**
   * 单屏设备切换
   * @param {String} value 
   */
  const onChangeEqu = (value) => {
    let newUrl = _.find(videoConfig.url, o => { return o.id === value })
    setVlcUrl(newUrl ? newUrl : {
      id: "",
      name: "",
      url: ""
    })
  }

  /**
   * 节次滑动
   * @param {Number} type 按钮标识 1左 2右 
   */
  const changeMargin = (type) => {
    let config = JSON.parse(JSON.stringify(secConfig))
    let bw = secRef.current.clientWidth - 70;
    if (!config.left && type === 1) {
      return
    } else if ((bw - config.width) > config.left && type === 2) {
      return
    }
    switch (type) {
      case 1:
        config.left = config.left + 250
        break;
      case 2:
        config.left = config.left - 250
        break;
    }
    setSecConfig(config)
  }
  return <div className="lxx-g-box" ref={boxRef}>
    <div className={`${!videoConfig.isLive ? 'ov ' : ''}lxx-bx-g-video`} style={{ height: boxObj.width > 1520 ? 750 : boxObj.height }}>
      {
        isLoading
          // false
          ? <Spin className="lxx-vd-g-load" tip="Loading..."></Spin>
          : !saveUrls.length
            ? <div className='lxx-noData'>
              <img src={imgURL} />
              <p>暂无视频数据</p>
            </div>
            : videoConfig.isNvr  // 是否调vlc
              // : true
              ? <Vlc
                width={boxObj.width}
                height={boxObj.width > 1520 ? 750 : boxObj.height}
                src={vlcUrl.url}
              // src="rtsp://admin:12345@10.4.3.90:554/streaming/tracks/101/?starttime=20210816T170000Z&endtime=20210816T175000Z"
              // src="rtsp://admin:12345@10.4.3.90/streaming/tracks/101/?starttime=20210729T153000Z&endtime=20210729T155000Z"
              />
              : selType === '1'
                ? <OneScreen
                  playerId="first"
                  width={boxObj.width}
                  height={boxObj.width > 1520 ? 750 : boxObj.height}
                  needScreenShot={false}
                  screenList={videoConfig.url}
                />
                : selType === '2'
                  ? <TwoScreen
                    width={boxObj.width}
                    height={boxObj.width > 1520 ? 750 : boxObj.height}
                    needScreenShot={false}
                    doubleList={videoConfig.url}
                  />
                  : selType === "3"
                    ? <MultiScreen
                      width={boxObj.width}
                      height={boxObj.width > 1520 ? 750 : boxObj.height}
                      needScreenShot={false}
                      MultiList={videoConfig.url}
                    />
                    : <div className='lxx-noData'>
                      <img src={imgURL} />
                      <p>暂无视频数据</p>
                    </div>
      }
      {
        saveUrls.length > 1 && !isLoading && videoConfig.isNvr === false
          ? <div className="lxx-bx-m-type">
            {
              TypeList.map(item => {
                return <span
                  key={item.key}
                  className={(selType === item.key || (selType === "3" && item.key === "2")) ? 'active' : null}
                  onClick={() => changeVideoPlay(saveUrls, item.key)}
                >{item.name}</span>
              })
            }
          </div>
          : saveUrls.length > 1 && !isLoading && videoConfig.isNvr === true
            ? <div className="lxx-bx-m-select">
              <Select
                value={vlcUrl.id}
                style={{ width: 120 }}
                onChange={onChangeEqu}
                border={false}
                dropdownStyle={{ backgroundColor: "#fff" }}
                suffixIcon={<span> </span>}
                getPopupContainer={triggerNode => triggerNode.parentNode}
              >
                {
                  videoConfig.url.map(dt => {
                    return <Option key={dt.id}>{dt.name}</Option>
                  })
                }
              </Select>
            </div>
            : null
      }

    </div>
    <div className="lxx-bx-g-info">
      <div className="lxx-in-g-name">
        <span>{data && data.collegeName}-{data && data.subject}</span>
        {/* <label><SVG type="dizhi" />{data && data.campus ? `${data.campus} - ` : null}{data && data.claAddress}</label> */}
      </div>
      <div className="lxx-in-g-other">
        <ul className="lxx-g-flex">
          {
            newInfo.map(dt => {
              return <li key={dt.key}>
                <SVG type={dt.icon} />
                <label>{dt.name}: </label>
                {
                  [dt.key] === "claAddress"
                    ? <span>{data && data.campus ? `${data.campus} - ` : null}{data && data.claAddress}</span>
                    : <span>{data && data[dt.key] || '--'}</span>
                }
              </li>
            })
          }
        </ul>
      </div>
      <div className={`${secConfig.isShow ? 'sl ' : ''}lxx-in-g-sec lxx-g-flex`} ref={secRef}>
        <div className="lxx-in-m-left" onClick={() => changeMargin(1)}><SVG type="soushuo" /></div>
        <div className="lxx-in-g-box">
          <div style={{ width: secConfig.width ? secConfig.width : 'auto', marginLeft: `${secConfig.left}px` }} className="lxx-g-flex">
            {
              data && data.courseSection.map(item => {
                if (item.sectionStatus === '0') {
                  // 未开始节次
                  return null
                }
                return <div
                  className={`${item.sectionId === selId ? 'active ' : ''}lxx-in-m-sec`}
                  key={item.sectionId}
                  onClick={() => setSelId(item.sectionId)}
                >
                  <span>【{item.sectionStatus === '1' ? '直播' : item.sectionStatus === '2' ? '回放' : '--'}】</span>
                  <span>{`第${getSection(item.sectionName)}节`}</span>
                </div>
              })
            }
          </div>
        </div>
        <div className="lxx-in-m-right" onClick={() => changeMargin(2)}><SVG type="soushuo" /></div>
      </div>
    </div>
  </div>
}
export default ViedoInfo
