/*
 * @Author: mzc 
 * @Date: 2021-08-02 15:31:46 
 * @Last Modified by: mzc
 * @Last Modified time: 2021-08-03 15:32:36
 * @desc 三屏组件 调用参照demo.js
 * baseWidth { Number } 基础宽度
 * MultiList { Array }  视频数据列表 二维数组
 * screenShot { function } 截屏函数 return {base64}
 * needScreenShot { boolean } 是否需要截屏
 */
import React, { useCallback, useState } from "react";
import OneScreen from "./oneScreen";
const MultiScreen = (props) => {
  const { width, MultiList, needScreenShot, height } = props;
  const { screenShot } = props;
  return (
    <div
      className="mzc-videoMulti"
      style={{ width, height, backgroundColor: '#ccc' }}
    >
      <div className="mzc-videoMultiLeft">
        <OneScreen
          playerId="first"
          width={width / 10 * 6}
          height={height}
          screenShot={screenShot}
          screenList={MultiList[0]}
          needScreenShot={needScreenShot}
        />
      </div>
      <div className="mzc-videoMultiRight">
        <OneScreen
          playerId="second"
          width={width / 10 * 4}
          height={height / 2}
          screenShot={screenShot}
          screenList={MultiList[1]}
          needScreenShot={needScreenShot}
        />
        <OneScreen
          playerId="third"
          width={width / 10 * 4}
          height={height / 2}
          screenShot={screenShot}
          screenList={MultiList[2]}
          needScreenShot={needScreenShot}
        />
      </div>
    </div>
  );
};

export default MultiScreen;
