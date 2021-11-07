/*
 * @Author: mzc
 * @Date: 2021-08-02 16:05:57
 * @Last Modified by: mzc
 * @Last Modified time: 2021-08-11 17:02:58
 * width { Number } 基础宽度
 * src { String } 视频地址
 */
import React, { useEffect } from "react";
import { useState } from "react";
import Play from "./i/play.png";
import Pause from "./i/pause.png";
import Out from "./i/out.png";
import Full from "./i/full.png";
import Volume from "./i/volume.png";
import Muted from "./i/muted.png";
import { useCallback } from "react";

let vlcInitialTimer = null;
let vlcInitialTimerFlag = false;
let vlcInitailTime = 0; // 初始值时间，用于拖拽和点击操作
let vlcTotal = 0;
let vlcTimer = null; //获取时间定时器
let vlc_t = 0;
let vlcdoGoUrl = "";

const VlcObject = (props) => {
  const clientWidth = window.screen.availWidth;
  const clientHeight = window.screen.availHeight;
  const { src, width, height } = props;
  const [err, setErr] = useState(false);
  const [play, setPlay] = useState(true);
  const [full, setFull] = useState(false);
  const [reload, setReload] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(50);
  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState(src);
  //屏幕显示
  useEffect(() => {
    // 状态重置
    clearInterval(vlcInitialTimer);
    clearInterval(vlcTimer);
    vlcInitialTimerFlag = false;
    vlcInitailTime = 0; // 初始值时间，用于拖拽和点击操作
    vlcTotal = 0;
    vlcdoGoUrl = src;
    setTimeout(() => {
      resetMarginTop();
      doGo(vlcdoGoUrl);
    }, 500);
    if (src.indexOf("_") > -1) {
      //海康
      initialHK();
    } else {
      //大华
      setTimeout(() => {
        initialDH();
      }, 3000);
    }
  }, []);
  //初始化海康设备执行函数
  function initialHK() {
    //进度条总长初始化
    vlcInitialTimer = setInterval(() => {
      getProgress();
    }, 500);
    //判断该视频错误
    setTimeout(() => {
      if (vlcInitialTimerFlag) {
        console.log("有一次调用");
        vlcTimer = setInterval(() => {
          getVlcTime();
        }, 500);
      } else {
        // setErr(true);
        clearInterval(vlcInitialTimer);
      }
    }, 10000);
  }
  function initialDH() {
    console.log("src", src);
    let endIndex = src.indexOf("&end");
    let initialStart = src.substring(endIndex - 7, endIndex - 1);
    let initialEnd = src.substring(endIndex + 18, endIndex + 24);
    const startH = initialStart.substring(0, 2);
    const startM = initialStart.substring(2, 4);
    const startS = initialStart.substring(4);
    const endH = initialEnd.substring(0, 2);
    const endM = initialEnd.substring(2, 4);
    const endS = initialEnd.substring(4);
    const h = endH - startH;
    const m = endM - startM;
    const s = endS - startS;
    vlcTotal = h * 3600 + m * 60 + s;
    vlcInitailTime = 0;
    vlc_t = 0;
    vlcTimer = setInterval(() => {
      getVlcDHTime();
    }, 1000);
  }
  // 进度条获取
  function getProgress() {
    const vlc = getVLC();
    if (vlc) {
      const position = vlc.input.position;
      const time = vlc.input.time;
      console.log("position", position);
      console.log("time", time);
      if (time) {
        if (position) {
          let total = time / 1000 / position;
          vlcTotal = total;
        }
        vlcInitialTimerFlag = true;
        clearInterval(vlcInitialTimer);
      }
    }
  }

  function getVlcTime() {
    const vlc = getVLC();
    if (vlc) {
      const time = vlc.input.time;
      console.log("time", time);
      if (time) {
        let _time = time / 1000 + vlcInitailTime;
        let progress = (_time / vlcTotal) * 100;

        setProgress(progress);
      }
    }
  }
  function getVlcDHTime() {
    vlc_t++;
    if (vlc_t > vlcTotal) {
      clearInterval(vlcTimer);
    }
    let pro = ((vlc_t + vlcInitailTime) / vlcTotal) * 100;
    pro = pro > 100 ? 100 : pro
    setProgress(pro);
  }

  // 播放暂停
  const hendlePlayPause = useCallback(() => {
    var vlc = getVLC();
    if (vlc) {
      if (play) {
        setPlay(false);
        vlc.playlist.stop()();
      } else {
        setPlay(true);
        vlc.playlist.play();
      }
    }
  }, [play]);

  const handleFullOut = useCallback(() => {
    const _full = !full;
    console.log("_full", _full);
    setFull(_full);
    if (_full) {
      launchIntoFullscreen(".mzc-vlc");
    } else {
      exitFullscreen();
    }

    setReload(true);
    setTimeout(() => {
      setReload(false);
      setTimeout(() => {
        resetMarginTop();
        doGo(vlcdoGoUrl);
      }, 0);
    }, 100);
  }, [full]);

  //解决退出全屏状态问题
  useEffect(() => {
    document.onkeydown = function (ev) {
      const oEvent = ev || event;
      console.log("oEvent", oEvent);
      if (oEvent.keyCode == 27) {
        setFull(false);
        setReload(true);
        setTimeout(() => {
          setReload(false);
          setTimeout(() => {
            resetMarginTop();
            doGo(vlcdoGoUrl);
          }, 0);
        }, 100);
      }
    };
  }, []);

  // 声音处理
  const moveFun = useCallback((e) => {
    e = e || window.event;
    pauseEvent(e);
    const clientX = e.clientX;
    const width = $(".mzc-vlcControlPlayback-operationVolumeLine").clientWidth;
    const _timeLineBaseX = getPos(
      $(".mzc-vlcControlPlayback-operationVolumeLine")
    ).left;
    const left = clientX - _timeLineBaseX;
    let _res = parseInt((left / width) * 100);
    if (_res < 0) _res = 0;
    if (_res > 100) _res = 100;
    setVolume(_res);
  }, []);

  const onVolumeMouseDown = (e) => {
    if (err) return;
    e = e || window.event;
    pauseEvent(e);
    document.addEventListener("mouseup", (i) => {
      i = i || window.event;
      pauseEvent(i);
      document.removeEventListener("mousemove", moveFun);
      document.removeEventListener("mousemove", progressMoveFun);
    });
    document.addEventListener("mousemove", moveFun);
  };
  const onVolumeLine = (e) => {
    if (err) return;
    const width = $(".mzc-vlcControlPlayback-operationVolumeLine").clientWidth;
    const _timeLineBaseX = getPos(
      $(".mzc-vlcControlPlayback-operationVolumeLine")
    ).left;
    const left = e.clientX; //相对于窗口
    const length = width - (left - _timeLineBaseX);
    let _res = parseInt((1 - length / width) * 100);
    if (_res < 0) _res = 0;
    if (_res > 100) _res = 100;
    setVolume(_res);
  };
  useEffect(() => {
    var vlc = getVLC("vlc");
    if (vlc) {
      // vlc.audio.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (muted) {
      const vlc = getVLC("vlc");
      if (vlc) {
        // vlc.audio.toggleMute();
      }
    }
  }, [muted]);

  // 进度处理
  const onProgressLine = (e) => {
    if (!vlcTotal || err) return;
    if (vlcTimer) clearInterval(vlcTimer);
    const width = $(".mzc-vlcProgressBase").clientWidth;
    const _timeLineBaseX = getPos($(".mzc-vlcProgressBase")).left;
    const left = e.clientX; //相对于窗口
    const length = width - (left - _timeLineBaseX);
    let _res = parseInt((1 - length / width) * 100);
    if (_res < 0) _res = 0;
    if (_res > 100) _res = 100;
    setProgress(_res);
    goUrl(_res);
  };

  const mouseUpFun = (i) => {
    i = i || window.event;
    pauseEvent(i);
    document.removeEventListener("mousemove", progressMoveFun);
    const progress = progressUpFun(i);
    goUrl(progress);
    document.removeEventListener("mouseup", mouseUpFun);
  };
  const onProgressMouseDown = (e) => {
    if (!vlcTotal || err) return;
    if (vlcTimer) clearInterval(vlcTimer);
    e = e || window.event;
    pauseEvent(e);
    document.addEventListener("mouseup", mouseUpFun);
    document.addEventListener("mousemove", progressMoveFun);
  };
  const progressUpFun = useCallback((e) => {
    e = e || window.event;
    pauseEvent(e);
    const clientX = e.clientX;
    const width = $(".mzc-vlcProgressBase").clientWidth;
    const _timeLineBaseX = getPos($(".mzc-vlcProgressBase")).left;
    const left = clientX - _timeLineBaseX;
    let _res = parseInt((left / width) * 100);
    if (_res < 0) _res = 0;
    if (_res > 100) _res = 100;
    // setVolume(_res);
    return _res;
  }, []);
  const progressMoveFun = useCallback((e) => {
    e = e || window.event;
    pauseEvent(e);
    if (vlcTimer) clearInterval(vlcTimer);
    const clientX = e.clientX;
    const width = $(".mzc-vlcProgressBase").clientWidth;
    const _timeLineBaseX = getPos($(".mzc-vlcProgressBase")).left;
    const left = clientX - _timeLineBaseX;
    let _res = parseInt((left / width) * 100);
    if (_res < 0) _res = 0;
    if (_res > 100) _res = 100;
    setProgress(_res);
  }, []);
  //视频更换地址，刷新
  const goUrl = (progress) => {
    // vlcInitailTime
    setReload(true);
    vlcInitailTime = (progress / 100) * vlcTotal;
    const url = getVlcUrl(vlcInitailTime, src);
    setUrl(url);
    setTimeout(() => {
      setReload(false);
      setPlay(true);
      setTimeout(() => {
        resetMarginTop();
        doGo(vlcdoGoUrl);
      }, 200);
      vlc_t = 0;
      vlcTimer = setInterval(() => {
        if (src.indexOf("_") > -1) {
          getVlcTime();
        } else {
          getVlcDHTime();
        }
      }, 1000);
    }, 100);
  };

  //错误重载
  function reloadVlc() {
    setErr(false);
    clearInterval(vlcTimer);
    clearInterval(vlcInitialTimer);
    vlcInitialTimerFlag = false;
    vlcInitailTime = 0; // 初始值时间，用于拖拽和点击操作
    vlcTotal = 0;
    setReload(true);
    setPlay(true);
    setTimeout(() => {
      setReload(false);
      vlcInitialTimer = setInterval(() => {
        getProgress();
      }, 500);
      //判断该视频错误
      setTimeout(() => {
        if (vlcInitialTimerFlag) {
          vlcTimer = setInterval(() => {
            getVlcTime();
          }, 500);
        } else {
          console.log("vlcInitialTimerFlag", vlcInitialTimerFlag);
          // setErr(true);
          clearInterval(vlcInitialTimer);
        }
      }, 10000);
    }, 100);
  }
  return (
    <div
      className="mzc-vlc"
      style={{
        width: width,
        height,
      }}
    >
      <div
        style={{
          width: full ? clientWidth : width,
          height: full ? clientHeight - 10 : height - 50,
          textAlign: "center",
          backgroundColor: "#000",
        }}
      >
        {reload ? null : err ? (
          <div className="mzc-vlc-err">
            视频错误，请<a onClick={reloadVlc}>点击</a>重试!
          </div>
        ) : (
          <object
            classid="clsid:9BE31822-FDAD-461B-AD51-BE1D1C159921"
            codebase="https://downloads.videolan.org/pub/videolan/contrib/win32/axvlc.cab" //3.0.2
            // codebase="http://download.videolan.org/pub/videolan/vlc/last/win32/axvlc.cab" // 2.2.4
            // codebase='http://downloads.videolan.org/pub/videolan/vlc/latest/win32/axvlc.cab' //3.0.8
            id="vlc"
            // type='application/x-vlc-plugin'
            hspace="500px"
            width={full ? clientWidth - 1 : width}
            height={full ? clientHeight - 10 : height - 50}
            events="true"
          >
            <param name="Src" value={url} />
            <param name="ShowDisplay" value="True" />
            <param name="AutoLoop" value="True" />
            <param name="AutoPlay" value="True" />
            <param name="Toolbar" value="false" />
            {/* <param name="Controls" value="false" /> */}
          </object>
        )}
      </div>

      <div
        className="mzc-vlcControl"
        style={{ width: full ? clientWidth : width }}
      >
        {/* <div className="mzc-vlcControlLive"></div> */}
        <div className="mzc-vlcControlPlayback">
          {/* 进度条 */}
          <div className="mzc-vlcProgressBox">
            <div className="mzc-vlcProgressBase" onClick={onProgressLine}></div>
            <div
              className="mzc-vlcProgressDis"
              style={{ width: progress + "%" }}
              onClick={onProgressLine}
            ></div>
            <div
              className="mzc-vlcProgressBall"
              style={{ left: progress + "%" }}
              onMouseDown={onProgressMouseDown}
              onMouseUp={() => {
                document.removeEventListener("mouseup", mouseUpFun);
                document.removeEventListener("mousemove", progressMoveFun);
              }}
            >
              <i></i>
            </div>
          </div>
          <div className="mzc-vlcControlPlayback-operation">
            {/* 播放暂停 */}
            <div className="mzc-vlcControlPlayback-operationLeft">
              <img src={play ? Pause : Play} alt="" onClick={hendlePlayPause} />
            </div>
            <div className="mzc-vlcControlPlayback-operationRight">
              {/* 声音 */}
              <div className="mzc-vlcControlPlayback-operationVolume">
                <img
                  src={muted ? Muted : Volume}
                  onClick={() => setMuted(!muted)}
                />
                <div className="mzc-vlcControlPlayback-operationVolumeMask">
                  <div
                    className="mzc-vlcControlPlayback-operationVolumeLine"
                    onClick={onVolumeLine}
                  >
                    <div
                      className="mzc-vlcControlPlayback-operationVolumeLinePro"
                      style={{ width: muted ? 0 : volume + "%" }}
                    />
                    <div
                      className="mzc-vlcControlPlayback-operationVolumeLineBall"
                      onMouseDown={onVolumeMouseDown}
                      // onMouseUp={onVolumeMouseUp}
                      style={{ left: muted ? 0 : volume + "%" }}
                    >
                      <i />
                    </div>
                  </div>
                </div>
              </div>
              {/* 全屏 */}
              <div
                className="mzc-vlcControlPlayback-operationPing"
                onClick={handleFullOut}
              >
                <img src={full ? Out : Full} alt="" />
                <span>{full ? "退出全屏" : "全屏"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const $ = (selector) => document.querySelector(selector);
const getVLC = () => {
  if (window.document["vlc"]) {
    return window.document["vlc"];
  }
  if (navigator.appName.indexOf("Microsoft Internet") == -1) {
    if (document.embeds && document.embeds["vlc"])
      return document.embeds["vlc"];
  } else {
    return document.getElementById("vlc");
  }
};
const getVlcUrl = (time, src) => {
  let _src = "";
  let h =
    Math.floor(time / 3600) < 10
      ? "0" + Math.floor(time / 3600)
      : Math.floor(time / 3600);

  let m =
    Math.floor((time / 60) % 60) < 10
      ? "0" + Math.floor((time / 60) % 60)
      : Math.floor((time / 60) % 60);
  let s =
    Math.floor(time % 60) < 10
      ? "0" + Math.floor(time % 60)
      : Math.floor(time % 60);

  if (src.indexOf("_") > -1) {
    let endIndex = src.indexOf("&end");
    let initialHour = parseInt(src.substring(endIndex - 8, endIndex - 6));
    h = parseInt(h) + initialHour;
    h = h < 10 ? "0" + h : h;
    let startPos = src.indexOf("starttime=");
    let startSrc = src.substring(0, startPos + 21);
    let endSrc = src.substring(endIndex);
    _src = startSrc + h + "_" + m + "_" + s + endSrc;
  } else {
    let endIndex = src.indexOf("&end");
    let initialStart = src.substring(endIndex - 7, endIndex - 1);
    const initialHour = parseInt(initialStart.substring(0, 2));
    h = parseInt(h) + initialHour;
    h = h < 10 ? "0" + h : h;
    const startSrc = src.substring(0, endIndex - 7);
    const endSrc = src.substring(endIndex);
    _src = startSrc + h + m + s + endSrc;
  }
  vlcdoGoUrl = _src;
  return _src;
};
const resetMarginTop = () => {
  const mzcvlc = $("#vlc");
  if (mzcvlc) {
    mzcvlc.style.marginTop = "1px";
    setTimeout(() => {
      mzcvlc.style.marginTop = 0;
    }, 100);
  }
};

function getPos(obj) {
  var pos = { left: 0, top: 0 };
  while (obj) {
    pos.left += obj.offsetLeft;
    pos.top += obj.offsetTop;
    obj = obj.offsetParent;
  }
  return pos;
}

const doGo = (targetURL) => {
  var vlc = document.querySelector("#vlc");
  if (vlc) {
    vlc.playlist.items.clear();
    var options = [":rtsp-tcp"];
    var itemId = vlc.playlist.add(targetURL, "", options);
    if (itemId != -1) {
      // play MRL
      vlc.playlist.playItem(itemId);
    } else {
      alert("cannot play at the moment !");
    }
    // doItemCount();
  }
};

function launchIntoFullscreen(selector) {
  const el = $(selector);
  if (window.ActiveXObject) {
    var WsShell = new ActiveXObject('WScript.Shell')
    WsShell.SendKeys('{F11}');
}
  if (el.requestFullscreen) {
    el.requestFullscreen();
  } else if (el.mozRequestFullScreen) {
    el.mozRequestFullScreen();
  } else if (el.webkitRequestFullscreen) {
    el.webkitRequestFullscreen();
  } else if (el.msRequestFullscreen) {
    el.msRequestFullscreen();
  }
}

function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitCancelFullScreen) {
    document.webkitCancelFullScreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}

/**
 * @desc 清除默认事件
 */
function pauseEvent(e) {
  if (e.stopPropagation) e.stopPropagation();
  if (e.preventDefault) e.preventDefault();
  e.cancelBubble = true;
  e.returnValue = false;
  return false;
}
export default VlcObject;
