/*
 * @Author: mzc 
 * @Date: 2021-08-02 16:04:57 
 * @Last Modified by: mzc
 * @Last Modified time: 2021-08-09 14:06:28
 * width { Number } 基础宽度
 * height { Number } 基础高度
 * src { String } 视频地址
 */
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import "./vlc.css";
import VlcObject from "./vlcObject";
let _vlcTimers = null;
const Vlc = (props) => {
  const { width, src, height } = props;
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (_vlcTimers) clearTimeout(_vlcTimers);
    setLoading(true);
    _vlcTimers = setTimeout(() => {
      setLoading(false);
    }, 200);
  }, [src, width]);

  const isIE = () => {
    let activeXObject = false;
    let userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    // let isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
    // var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
    let isIE11 =
      userAgent.indexOf("Trident") > -1 && userAgent.indexOf("rv:11.0") > -1;
    if (isIE11) {
      activeXObject = true;
    }
    // console.log('activeXObject', userAgent, activeXObject, isIE11, isIE)
    return activeXObject;
  };

  /* vlc判断 */
  const isInstalledVlc = () => {
    let vlcObj = null;
    try {
      vlcObj = new ActiveXObject("VideoLAN.Vlcplugin.2");
      if (vlcObj != null) {
        return true;
      }
    } catch (e) {
      return false;
    }
  };

  // const src =
  // "rtsp://admin:12345@10.4.3.90/streaming/tracks/101/?starttime=20210729T145000Z&endtime=20210729T155000Z"
  // "http://10.20.5.190/ms/live.m3u8?path=rtsp://admin:jfkj1234@10.7.2.103:554/h264/ch1/main/av_stream" // 直播
  // "rtsp://admin:jfkj1234@10.7.2.103/cam/playback?channel=1&subtype=0&starttime=2021_08_02_07_00_00&endtime=2021_08_02_08_00_00" // 直播
  // "rtsp://admin:jfkj8888@10.9.13.212/cam/playback?channel=1&subtype=0&starttime=2021_08_02_07_00_00&endtime=2021_08_02_08_00_00" // 直播
  // "rtsp://aaaaa:123456aa@10.20.5.52/cam/playback?channel=1&subtype=0&starttime=2021_08_02_07_00_00&endtime=2021_08_02_08_00_00"
  return (
    <div style={{ width, height, backgroundColor: '#000' }}>
      {!loading ? (
        isIE() ? (
          // true ? (
          isInstalledVlc() ? (
            // true ?(
            <div
              className="mzc-vlcs"
              style={{
                width: width,
                height,
              }}
            >
              {src ? (
                <VlcObject src={src} width={width} height={height}/>
              ) : (
                <div className="mzc-vlc-nodata">抱歉，暂无视频！</div>
              )}
            </div>
          ) : (
            <div
              className="mzc-not-install"
              style={{ height, width: width }}
            >
              <div>
                {/* <p>您没有安装vlc插件，无法播放视频，请<a href="https://get.videolan.org/vlc/2.0.5/win32/vlc-2.0.5-win32.exe">点击此处下载安装最新的vlc插件</a></p> */}
                <p>
                  您没有安装vlc插件，无法播放视频，请
                  <a
                    href="https://mirrors.tuna.tsinghua.edu.cn/videolan-ftp/vlc/3.0.2/win32/vlc-3.0.2-win32.exe"
                    download="vlc-3.0.2-win32.exe"
                  >
                    点击此处下载安装最新的vlc插件
                  </a>
                </p>
                {/* <p>您没有安装vlc插件，无法播放视频，请<a href="https://get.videolan.org/vlc/3.0.8/win32/vlc-3.0.8-win32.exe" download="vlc-3.0.8-win32.exe">点击此处下载安装最新的vlc插件</a></p> */}
                {/* <p>您没有安装vlc插件，无法播放视频，请<a onClick={() => {
    // href="https://get.videolan.org/vlc/3.0.8/win32/vlc-3.0.8-win32.exe"
    window.open('https://get.videolan.org/vlc/3.0.8/win32/vlc-3.0.8-win32.exe')
  }}>点击此处下载安装最新的vlc插件并安装在桌面</a></p> */}
                {/* <p>您没有安装vlc插件，无法播放视频，请<a onClick={() => {
                window.open('https://get.videolan.org/vlc/2.2.4/win32/vlc-2.2.4-win32.exe')
              }}>点击此处下载安装最新的vlc插件并安装在桌面</a></p> */}
                {/* <p>您没有安装vlc插件，无法播放视频，请<a href="https://get.videolan.org/vlc/2.2.4/win32/vlc-2.2.4-win32.exe" download="vlc-2.2.4-win32.exe">点击此处下载安装最新的vlc插件</a></p> */}
                <p>安装成功后，请刷新浏览器</p>
              </div>
            </div>
          )
        ) : (
          <div
            className="mzc-not-support"
            style={{ height, width: width }}
          >
            本浏览器不支持回放，请用360浏览器兼容模式播放。下载链接
          </div>
        )
      ) : null}
    </div>
  );
};

export default Vlc;
