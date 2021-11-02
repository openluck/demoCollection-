/*
 * @Author: lxx 
 * @Date: 2020-08-27 18:13:40 
 * @Last Modified by: lxx
 * @Last Modified time: 2020-09-02 15:40:12
 * vlc组件 
 */
import React, { useState, useEffect, useRef } from 'react'
// import cab from './axvlc.cab'
import { Select, Spin } from 'antd';
import _ from 'lodash'
const { Option } = Select

// const cab = G.valService || 'https://downloads.videolan.org/pub/videolan/contrib/win32/axvlc.cab'
var UpdateNum = 0; // 流切换情况下，滚动条调整1px
const VlcScreen = (props) => {
  const [boxObj, setBoxObj] = useState(props.boxObj || { width: 1075, height: 600 }) // 视频播放占比宽高
  const [config, setConfig] = useState(props.config ||
  {
    isIE: null, // 是否是ie浏览器
    isNvr: null, // 是否是Nvr回放
    isVlcInstalled: null, // 是否安装了vlc播放插件
  }
  ) // 设置)
  const [allUrls, setAllUrls] = useState(props.viUrls || []) // 设备数据
  const [selEqu, setSelEqu] = useState(props.viUrls && props.viUrls.length ? props.viUrls[0].equipId : '') // 当前选中项设备
  const [rtspUrl, setRtspUrl] = useState(props.viUrls && props.viUrls.length ? props.viUrls[0].url : '') // 选中设备流
  const [isUpdate, setIsUpdate] = useState(false)

  useEffect(() => {
    if (props.viUrls) {
      console.log(props.viUrls)
      setAllUrls(props.viUrls)
      setSelEqu(props.viUrls && props.viUrls.length ? props.viUrls[0].equipId : '')
      setRtspUrl(props.viUrls && props.viUrls.length ? props.viUrls[0].url : '')
      UpdateNum = 1
    }
  }, [props.viUrls])

  useEffect(() => {
    goGo(rtspUrl)
  }, [rtspUrl])

  useEffect(() => {
    setBoxObj(props.boxObj)
  }, [props.boxObj])

  useEffect(() => {
    setConfig(props.config)
    console.log(G.valService)
    console.log('props.config', props.config)
  }, [props.config])

  // useEffect(() => {
  //     if(!isUpdate && UpdateNum) {
  //         let a = document.getElementsByClassName('ll-playPage')
  //         if(a) {
  //             a.scrollTop = 20
  //         }
  //         console.log(a)
  //         UpdateNum = 0
  //     }
  // }, [isUpdate])

  /**
   * 单屏设备切换
   * @param {String} value 
   */
  const onChangeEqu = (value) => {
    setIsUpdate(true)
    let newUrl = _.find(allUrls, o => { return o.equipId === value })
    setRtspUrl(newUrl ? newUrl.url : null)
    setSelEqu(value)
    setTimeout(() => {
      setIsUpdate(false)
      UpdateNum = 1
    }, 200)
  }

  /**
   * rtsp流切换成tcp，保证流文档
   * @param {*} url 
   */
  function goGo (url) {
    var vlc = document.getElementById('vlc')
    //初始化精度条
    if (vlc) {
      vlc.playlist.items.clear();
      var options = [":rtsp-tcp"];
      var itemId = vlc.playlist.add(url, "", options);
      if (itemId != -1) {
        vlc.playlist.playItem(itemId);
      } else {
        alert("cannot play at the moment !");
      }
    }
  }

  return <React.Fragment>
    {
      config.isIE // ie
        ? config.isVlcInstalled // 安装vlc
          ? <>
            <div style={{ position: 'absolute', top: 0, right: 0, zIndex: 10000 }}>
              <Select
                value={selEqu}
                style={{ width: 150 }}
                onChange={onChangeEqu}
                border={false}
                getPopupContainer={triggerNode => triggerNode.parentNode}
              >
                {
                  allUrls.map(dt => {
                    return <Option key={dt.equipId}>{dt.equipName}</Option>
                  })
                }
              </Select>
            </div>
            {
              isUpdate
                ? <Spin className="lxx-vd-g-load" tip="Loading..."></Spin>
                : <div className="yh-vlc-wrap">
                  {/* <object classid="clsid:9BE31822-FDAD-461B-AD51-BE1D1C159921" codebase="./axvlc.cab" width="1240" height="680" id="vlc" hspace="500px" */}
                  {/* <object classID="clsid:9BE31822-FDAD-461B-AD51-BE1D1C159921" codebase={cab} width={boxObj.width - 150} height={boxObj.width > 1520 ? 750 : boxObj.height} id="vlc" hspace="500px" */}
                  <object
                    classID="clsid:9BE31822-FDAD-461B-AD51-BE1D1C159921"
                    codebase={'https://downloads.videolan.org/pub/videolan/contrib/win32/axvlc.cab'}
                    width={boxObj.width - 150}
                    height={boxObj.width > 1520 ? 750 : boxObj.height}
                    id="vlc"
                    hspace="500px"
                    events="True">
                    <param name="Src" value={rtspUrl} />
                    {/* <param name="Src" value="rtsp://admin:wy881223@192.168.184.2:8000/cam/playback?channel=14&subtype=1&starttime=2021_03_24_10_00_00&endtime=2021_03_24_10_45_00" /> */}
                    {/* <param name="Src" value="rtsp://admin:admin@192.168.1.105:554/cam/playback?channel=14&subtype=1&starttime=2021_03_24_10_00_00&endtime=2021_03_24_10_45_00" /> */}
                    <param name="ShowDisplay" value="True" />
                    <param name="AutoLoop" value="True" />
                    <param name="AutoPlay" value="True" />
                  </object>
                </div>
            }

          </>
          : <div className="yh-not-install"> {/*未安装*/}
            <div>
              {/* <p>您没有安装vlc插件，无法播放视频，请<a href="https://get.videolan.org/vlc/2.0.5/win32/vlc-2.0.5-win32.exe">点击此处下载安装最新的vlc插件</a></p> */}
              <p>您没有安装vlc插件，无法播放视频，请<a href="https://mirrors.tuna.tsinghua.edu.cn/videolan-ftp/vlc/3.0.8/win32/vlc-3.0.8-win32.exe" download="vlc-3.0.2-win32.exe">点击此处下载安装最新的vlc插件</a></p>
              <p>安装成功后，请刷新浏览器</p>
            </div>
          </div>
        : <div className="yh-not-support">本浏览器不支持播放，请用IE浏览器播放</div>
    }
  </React.Fragment>
}

export default VlcScreen
