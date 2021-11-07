import React, { Component } from 'react';
import OneScreen from './oneScreen'
import TwoScreen from './twoScreen'
import Multiscreen from './multiScreen'
export default class MultiScreenMatch extends Component {
  constructor(props){
  super(props);
    // 测试流地址
    let testurl =
      "rtmp://10.4.3.47:1936/live|rtspstd_hik/10.4.2.141/554/1/main/admin/jfkj12345";
    let BaseWidth = props.baseWidth || 1366;
    let isLive = props.isLive;
    let getUrlError = props.getUrlError;
    //只渲染三个视频，但是需要4个流地址，原因是最早的设计是3+1的播放模式，后来改成只有三个播放器，第一个流地址可以填空；
    let url = props.url;
    let bgColor = props.bgcolor || "#000";
    let volume = props.volume
      ? props.volume > 100
        ? 100
        : props < 0
        ? 0
        : 60
      : 60;
    let playerLoad = props.playerLoad || 1;
    this.state={
      videoConfig:{
        BaseWidth:BaseWidth,
        isLive,
        getUrlError,
        bgColor,
        playerLoad,
        url
      },
      url,
    }
  }
  componentDidUpdate(nextProps){
  //  console.log('nextProps',nextProps);
    if (nextProps.url !== this.state.url) {
      let {url} = this.state;
      // console.log('url-------',url);
      let playUrl = []
      for (let i = 1; i < nextProps.url.length; i++) {
        if (nextProps.url[i] == undefined) {
          // console.log("不渲染第", i, "个接口");
          continue;
        }
        // document.querySelector(`.v${i+1}`).className = `lean-video-mount v${i+1}`;
        // this.insPlayer(i, url[i]);
        playUrl.push(nextProps.url[i])
      }
      this.setState({
      url:playUrl
    })
    }
  }
  static getDerivedStateFromProps(props, state) {
    // console.log('props9++++', props);
    if (props.url !== state.url) {
      return {
        url: props.url,
        videoConfig: {
          BaseWidth: props.BaseWidth,
          isLive:props.isLive,
          getUrlError:props.getUrlError,
          bgColor:props.bgColor,
          playerLoad:props.playerLoad,
          url:props.url
        }
      }
    }
    return { ...state }
  }
  render() {
    // console.log('this.state.url',this.state.url);
    const {url} = this.state;
    // console.log('url00000000000',url);
    let playUrl=[]
    for (let i = 1; i < url.length; i++) {
      if (url[i]._url_ == undefined) {
        continue;
      }
      playUrl.push(url[i])
    }
    // console.log('playUrl',playUrl);
    // playUrl=[
    //   {
    //     _url_:"rtmp://10.4.3.47:1936/live|rtspstd_hik/10.4.2.141/554/1/main/admin/jfkj12345",
    //     type:1
    //   },{
    //     _url_:'rtmp://10.4.3.47:1936/vod|/file/local://D:/fms_TRMS/data/file/20190814/multi/18/d1510629fed543c2b12d01738ce73c25.mp4',
    //     type:2
    //   }
    // ];
    return (
      <div className="yh">
      {/* <OneScreen {...this.state.videoConfig} /> */}
       {
         playUrl.length === 1?
         <OneScreen {...this.state.videoConfig} screenShot={this.props.screenShot} /> 
         : playUrl.length === 2?
         <TwoScreen {...this.state.videoConfig} screenShot={this.props.screenShot}/>:null
       }
      </div>
    )
  }
}
