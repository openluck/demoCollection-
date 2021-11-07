/*
 * @Author: yh 
 * @Date: 2020-02-13 18:56:32 
 * @Last Modified by: tj
 * @Last Modified time: 2020-03-20 14:00:33
 * 视频组件
 */

import React, { Component } from 'react';
import 'video.js/dist/video-js.min.css'
import videojs from 'video.js'

let playNum = 0;

class VideoPlayer extends Component {
  constructor(props) {
    super(props)
    this.state = {

    };
    this.myPlayer;
    this.currentTime = 0;
  }
  componentDidMount() {
    let { url } = this.props;
    console.log(url)
    this.initVideoPlayer(url)
  }

  componentDidUpdate(props) {
    if (props.url !== this.props.url) {
      console.log(this.props.url)
      // this.initVideoPlayer(this.props.url)
    }
  }
  componentWillUnmount() {
    this.myPlayer.dispose()
  }
  initVideoPlayer = (url) => {
    let options = {
      "poster": "",
      "loop": false,
      "preload": 'metadata'
    };
    let errorTip = document.querySelector('.yh-error-tip');
    this.myPlayer = videojs('my-player', options, function onPlayerReady() {
      let _this = this;
      this.on('suspend', function () {//延迟下载
        console.log("延迟下载")
      });
      this.on('loadstart', function () { //客户端开始请求数据
        console.log("客户端开始请求数据")
      });
      this.on('progress', function () {//客户端正在请求数据
        console.log("客户端正在请求数据")
      });
      this.on('abort', function () {//客户端主动终止下载（不是因为错误引起）
        console.log("客户端主动终止下载")
      });
      this.on('error', function () {//请求数据时遇到错误
        console.log("请求数据时遇到错误")
        this.errorDisplay.close();
        errorTip.style.display = "flex"
        playNum ++
        if(playNum < 5) {
          _this.load(url);
        }
      });
      this.on('stalled', function () {//网速失速
        console.log("网速失速")
      });
      this.on('play', function () {//开始播放
        console.log("开始播放")
      });
      this.on('pause', function () {//暂停
        console.log("暂停")
      });
      this.on('loadedmetadata', function () {//成功获取资源长度
        errorTip.style.display = "none"
        // _this.play();
        console.log("成功获取资源长度")
      });
      this.on('loadeddata', function () {//渲染播放画面
        console.log("渲染播放画面")
      })

      this.on('waiting', function () {//等待数据，并非错误
        console.log("等待数据")
        
      });
      this.on('playing', function () {//开始回放
        console.log("开始回放")
      });
      this.on('canplay', function () {//可以播放，但中途可能因为加载而暂停
        console.log("可以播放，但中途可能因为加载而暂停")
      });
      this.on('canplaythrough', function () { //可以播放，歌曲全部加载完毕
        console.log("可以播放，歌曲全部加载完毕")
      });
      this.on('seeking', function () { //寻找中
        console.log("寻找中")
      });
      this.on('seeked', function () {//寻找完毕
        console.log("寻找完毕")
      });
      // // 时间播放更新
      // this.on("timeupdate", function () {
      //   let currentTime = _this.currentTime();
      //   let duration = this.duration()
      //   _this.props.getTime({
      //     currentTime,
      //     duration
      //   })
      //   _this.currentTime = currentTime
      // })
      this.on('ended', function () {//播放结束
        console.log("播放结束")
      });
      this.on('ratechange', function () {//播放速率改变
        console.log("播放速率改变")
      });
      this.on('durationchange', function () {//资源长度改变
        errorTip.style.display = "none"
        console.log("资源长度改变")
      });
      this.on('volumechange', function () {//音量改变
        console.log("音量改变")
      });
      this.src(url);
      this.load(url);
      this.play();

    });
  }
  render() {
    const { height, url, width } = this.props
    return (
      <div className="video-wrap">
        <div className="yh-error-tip" style={{ width: width + '%', height: height + '%' }}>抱歉，无法加载视频</div>
        <video
          id="my-player"
          style={{ width: width + '%', height: height + '%' }}
          className="video-js vjs-big-play-centered"
          controls={false}
          autoPlay={true}
          muted={false}
          preload="metadata"
          data-setup="{}"
        >
          {/* <source src={url} ></source> */}
          <p className="vjs-no-js ">
            To view this video please enable JavaScript, and consider upgrading to a
            web browser that
            <a href="https://videojs.com/html5-video-support/" target="_blank">
              supports HTML5 video
            </a>
          </p>
        </video>
        <style>
          {
            `
              .video-wrap{
                width:100%;
                height:100%;
                position: relative;
              }
              .video-wrap .yh-error-tip{
                position: absolute;
                top: 0;
                left: 0;
                background-color: #000000;
                z-index: 100;
                color: #ffffff;
                text-align: center;
                justify-content: center;
                align-items: center;
                display: none;
              }

            `
          }
        </style>
      </div>
    )
  }
}
export default VideoPlayer

