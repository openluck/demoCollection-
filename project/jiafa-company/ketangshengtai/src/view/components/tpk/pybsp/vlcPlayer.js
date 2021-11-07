import React, { Component } from 'react';
// import cab from "./../../axvlc.cab";
export default class VlcPlayer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      urlData: {},
      videoLoading: false,
    }
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    // console.log(nextProps);
    // console.log(prevState);

    if (nextProps.urlData != prevState.urlData) {
      return {
        ...prevState,
        urlData: nextProps.urlData
      }
    }
    return null
  }
  componentDidUpdate(prevProps) {
    if (prevProps.urlData !== this.props.urlData) {
      this.setState({
        urlData: this.props.urlData,
        videoLoading: true,
      })
      setTimeout(() => {
        this.setState({
          videoLoading: false,
        })
        setTimeout(() => {
          $('.mj-scroll').scrollTop = 1
          $('.mj-scroll').scrollTop = 0
        }, 0);
      }, 0);
    }
  }
  render() {
    const { isIE, isInstalledVlc, baseWidth, baseHeight } = this.props
    const { urlData, videoLoading } = this.state
    // console.log('videoLoading', videoLoading);
    return (
      <div className="mj-scroll" style={{ width: baseWidth, height: 'calc(100% - 48px)' }}>
        {
          isIE ? isInstalledVlc ? <div className="yh-vlc-wrap">
            {!videoLoading ? <object classid="clsid:9BE31822-FDAD-461B-AD51-BE1D1C159921"
              // codebase="https://downloads.videolan.org/pub/videolan/contrib/win32/axvlc.cab"
              codebase="/cab/axvlc.cab"
              width={baseWidth} height={baseHeight} id="vlc" hspace="500px"
              events="True">
              <param name="Mrl" value={urlData.url} />
              <param name="ShowDisplay" value="True" />
              <param name="AutoLoop" value="True" />
              <param name="AutoPlay" value="True" />
            </object> : null}
          </div> :
            <div className="yh-not-install">
              <div>
                <p>您没有安装vlc插件，无法播放视频，请<a href="https://mirrors.tuna.tsinghua.edu.cn/videolan-ftp/vlc/3.0.2/win32/vlc-3.0.2-win32.exe" download="vlc-3.0.2-win32.exe">点击此处下载安装最新的vlc插件</a></p>
                <p>安装成功后，请刷新浏览器</p>
              </div>
            </div>
            :
            <div className="yh-not-support">本浏览器不支持播放，请用IE浏览器播放</div>
        }
      </div>
    )
  }
}
