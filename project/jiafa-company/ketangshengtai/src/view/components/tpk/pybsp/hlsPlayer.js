/*
 * @Author: yh 
 * @Date: 2020-02-10 17:32:38 
 * @Last Modified by: yh
 * @Last Modified time: 2020-02-24 16:29:37
 * 评议表--视频组件
 */
import React, { Component } from 'react'
import 'video.js/dist/video-js.min.css'
import videojs from 'video.js'
export default class HlsPlayer extends Component {
  constructor(props) {
    super(props)
    this.state = {

    };
    this.myPlayer;
    this.currentTime = 0;
  }
  componentDidMount() {
    let videoPlayer = document.getElementById('yh-video-player');
    let videoW = videoPlayer.offsetWidth;
    // videoPlayer.style.height = ((3*videoW) / 4) + 'px'
    let { urlData } = this.props;
    this.initVideoPlayer(urlData.url)
  }
  componentDidUpdate(props) {
    if (props.urlData.url !== this.props.urlData.url) {
      this.initVideoPlayer(this.props.urlData.url)
    }
  }
  componentWillUnmount() {
    this.myPlayer.dispose()
  }
  initVideoPlayer = (url) => {
    let options = {
      // "width": this.props.width,
      // "height": this.props.height,
      "poster": "",
      // "controls": true,
      // "autoplay": false,
      // "techOrder": ["html5", "flash"],
      "loop": false,
      "muted": false,
      "preload": 'metadata',
      // "aspectRatio":'4:3'
    };
    let _this = this;
    let errorTip = document.querySelector('.yh-error-tip');
    this.myPlayer = videojs('my-player', options, function onPlayerReady() {
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
        errorTip.style.display="flex"
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
      // 时间播放更新
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
        console.log("资源长度改变")
      });
      this.on('volumechange', function () {//音量改变
        console.log("音量改变")
      });
      this.src(url);
      this.load(url);
      // this.play();
    });
  }
  render() {
    const {width, height } = this.props;
    return (
      <div className="yh-video-player" id='yh-video-player'>
        <div className="yh-error-tip" style={{width: width + '%', height: height + '%'}}>抱歉，无法加载视频</div>
        <video
          id="my-player"
          // height={height}
          // width={width}
          style={{ width: width + '%', height: height + '%' }}
          className="video-js vjs-big-play-centered"
          controls={true}
          autoPlay={false}
          preload="auto"
          data-setup="{}">
          {/* <source src={url} ></source> */}
          <p className="vjs-no-js ">
            To view this video please enable JavaScript, and consider upgrading to a
            web browser that
            <a href="https://videojs.com/html5-video-support/" target="_blank">
              supports HTML5 video
            </a>
          </p>
        </video>
      </div>
    )
  }
}
