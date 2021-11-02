/*
 * @Author: mzc 
 * @Date: 2021-08-02 15:42:02 
 * @Last Modified by: mzc
 * @Last Modified time: 2021-08-03 15:26:45
 * @desc 双屏组件 调用参照demo.js
 * baseWidth { Number } 基础宽度
 * playerId { String } 播放器唯一标识ID
 * doubleList { Array }  视频数据列表 二维数组
 * screenShot { function } 截屏函数 return {base64}
 * needScreenShot { boolean } 是否需要截屏
 */
import React, { useCallback, useState } from "react";
import OneScreen from "./oneScreen";
const TwoScreen = (props) => {
  const { width, doubleList, needScreenShot, height } = props;
  const { screenShot } = props;
  return (
    <div
      className="mzc-videoTwo"
      style={{ width, height, }}
    >
      <OneScreen
        playerId="first"
        key="first"
        width={width / 2}
        height={height}
        screenShot={screenShot}
        screenList={doubleList[0]}
        needScreenShot={needScreenShot}
      />
      <OneScreen
        playerId="second"
        key="second"
        width={width / 2}
        height={height}
        screenShot={screenShot}
        screenList={doubleList[1]}
        needScreenShot={needScreenShot}
      />
    </div>
  );
};

export default TwoScreen;
