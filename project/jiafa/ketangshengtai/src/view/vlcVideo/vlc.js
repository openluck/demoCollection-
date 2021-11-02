/*
 * @Author: mzc
 * @Date: 2021-08-02 16:04:57
 * @Last Modified by: mzc
 * @Last Modified time: 2021-09-03 09:47:05
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
  }, [src]);

  const isIE = () => {
    let activeXObject = false;
    let userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    let isIE11 =
      userAgent.indexOf("Trident") > -1 && userAgent.indexOf("rv:11.0") > -1;
    if (isIE11) {
      activeXObject = true;
    }
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

  const download = (fileName) => {
    let { host, pathname } = window.location;
    let end = pathname.indexOf("/index.html");
    let baseName = end > -1 ? pathname.slice(0, end) : "";
    let url = `http://${host}${baseName}/downfile/${fileName}`;
    console.log("url", url);
    if (isIE()) {
      window.open(url);
    } else {
      let elink = document.createElement("a");
      const evt = document.createEvent("MouseEvents");
      evt.initMouseEvent(
        "click",
        true,
        false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      );
      elink.download = fileName;
      elink.href = url;
      elink.dispatchEvent(evt);
    }
  };
  return (
    <div style={{ width, height, backgroundColor: "#000" }}>
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
                <VlcObject src={src} width={width} height={height} />
              ) : (
                <div className="mzc-vlc-nodata">抱歉，暂无视频！</div>
              )}
            </div>
          ) : (
            <div className="mzc-not-install" style={{ height, width: width }}>
              <p>
                您没有安装vlc插件，无法播放视频，请
                <a
                  // href="https://mirrors.tuna.tsinghua.edu.cn/videolan-ftp/vlc/3.0.2/win32/vlc-3.0.2-win32.exe"
                  onClick={() => download("vlc插件.zip")}
                >
                  点击此处
                </a>
                下载安装最新的vlc插件。
              </p>
              <p>安装成功后，请刷新浏览器</p>
            </div>
          )
        ) : (
          <div className="mzc-not-support" style={{ height, width: width }}>
            本浏览器不支持回放，请用360浏览器兼容模式播放。
            <a onClick={() => download("360浏览器固定版本.zip")}>下载链接</a>
          </div>
        )
      ) : null}
    </div>
  );
};

export default Vlc;
