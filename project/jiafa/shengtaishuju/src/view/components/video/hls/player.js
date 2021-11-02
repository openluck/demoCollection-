/*
 * @Author: mzc 
 * @Date: 2021-07-27 14:21:15 
 * @Last Modified by: mzc
 * @Last Modified time: 2021-08-16 10:49:00
 * 插件地址：<script src="//unpkg.byted-static.com/xgplayer/2.9.6/browser/index.js" charset="utf-8"></script>
    <script src="//unpkg.byted-static.com/xgplayer-hls.js/2.2.2/browser/index.js" charset="utf-8"></script>
 */
import React from "react";
import { useEffect, useCallback } from "react";
import { useState } from "react";
import axios from "axios";
import { Spin } from "antd";

const Player = (props) => {
  const { src, width, playerId, isLive, height } = props;
  const [canPlay, setCanPlay] = useState(true);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    //解决窗口变化频繁渲染问题

    if (window["_" + playerId]) clearTimeout(window["_" + playerId]);

    window["_" + playerId] = setTimeout(() => {
      load(src, width);
    }, 100);
  }, [width]);

  useEffect(() => {
    window[playerId + "HlsNum"] = 1;
    return () => {
      try {
        window[playerId] &&
          window[playerId].destroy &&
          window[playerId].destroy();
      } catch (err) { }
    };
  }, []);

  // 清理未销毁的多余video
  const clearVideos = () => {
    const videos = document.querySelectorAll(`#${playerId} video`)
    if (videos && videos.length) {
      for (let i = 0; i < videos.length; i++) {
        if (i !== 0) {
          let one = videos[i]
          one.parentNode.removeChild(one);
        }
      }
    }
  }

  const load = async (src, width) => {
    try {
      window[playerId] &&
        window[playerId].destroy &&
        window[playerId].destroy();
    } catch (err) { }
    let canPlay = true;
    console.log("413131");
    setLoading(true);
    try {
      // const res = await axios.get(src);
      // if (res.status !== 200) {
      //   canPlay = false;
      // } else {
      //   window[playerId + "HlsNum"] = 1;
      // }
    } catch (err) {
      window[playerId + "HlsNum"]++;
      if (window[playerId + "HlsNum"] > 6) {
        canPlay = false;
        window[playerId + "HlsNum"] = 1;
      } else {
        load(src, width);
        return;
      }
    }
    setLoading(false);
    setCanPlay(canPlay);
    if (!canPlay) return;
    // 初始化视频
    window[playerId] = new window.HlsJsPlayer({
      id: playerId,
      url: src,
      isLive,
      volume: playerId === "first" ? 0.5 : 0,
      // error: true,
      autoplay: true,
      playsinline: true,
      width,
      height,
    });
    // 监听播放报错
    window[playerId].on("error", function (error) {
      // console.log("error", error);
      try {
        window[playerId] &&
          window[playerId].destroy &&
          window[playerId].destroy();
      } catch (err) { }
      setCanPlay(false);
    });

    // 监听正常播放
    window[playerId].on("canplay", function (e) {
      window[playerId].play();
    });
    // 流不稳定情况下，触发播放
    setTimeout(() => {
      window[playerId].play();
      clearVideos()
    }, 1000);
  };
  return (
    <div
      className="mzc-v"
      style={{
        width: width,
        height,
        backgroundColor: "#ccc",
      }}
    >
      <div
        className="mzc-v-loading"
        style={{ display: loading ? "flex" : "none" }}
      >
        <Spin />
      </div>
      <div
        id={playerId}
        style={{ display: !loading && canPlay ? "block" : "none" }}
      />
      <div
        className="mzc-v-cantPlay"
        style={{ display: !loading && !canPlay ? "flex" : "none" }}
      >
        视频加载失败，请
        <a onClick={() => load(src, width)} style={{ color: "#36B4F3" }}>
          点击
        </a>
        重试！
      </div>
    </div>
  );
};

export default Player;
