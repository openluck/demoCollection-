/*
 * @Author: MinJ
 * @Date: 2020-01-19 13:57:33
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-07-24 09:43:51
 * 听评课V2.2——评议课视频播放页
 */

import React, { Component, Fragment as F } from "react";
import VideoForm from "./../../components/tpk/pksz/form-videoForm";
import VideoPlayer from "./../../components/tpk/pybsp/videoPlayer";
export default class TpkVideo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {}
  render() {
    return (
      <div className="yh-comment-video">
        {/* 视频播放组件 */}
        <VideoPlayer />
        {/* 视频中的表单操作组件 */}
        <VideoForm {...this.props} />
      </div>
    );
  }
}
