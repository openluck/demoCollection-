/*
 * @Author: junjie.lean
 * @Date: 2019-07-29 15:14:32
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-11-18 14:42:13
 */

/**
 * 教学反思的多屏版本实现
 */

import React from "react";
import "./../../../style/jxfs/jxfs.scss";
import "./jxfsVideoMs.css";
import JxfsMSPlayer from "./../../components/jxfs/jxfsMsPlayer";
export default class JXFSMSVideo extends React.Component {
  render() {
    return (
      <div className="clearfix lean-msScreen">
        <JxfsMSPlayer />
      </div>
    );
  }
}
