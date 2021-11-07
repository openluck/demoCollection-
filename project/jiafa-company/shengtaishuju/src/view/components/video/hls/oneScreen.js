/*
 * @Author: mzc
 * @Date: 2021-08-02 15:39:07
 * @Last Modified by: mzc
 * @Last Modified time: 2021-08-05 13:19:13
 * @desc 单屏组件 调用参照demo.js
 * width { Number } 基础宽度
 * playerId { String } 播放器唯一标识ID
 * screenList { Array }  视频数据列表 一维数组
 * screenShot { function } 截屏函数 return {base64}
 * needScreenShot { boolean } 是否需要截屏
 */
import React, { useCallback, useState } from "react";
import Player from "./player";
import { Select, Spin } from "antd";
import "./hls.css";
import { useEffect } from "react";
let hlsMoveMaskTimer = null;
const OneScreen = (props) => {
  const { playerId, width, screenList, needScreenShot, height } = props;
  const { screenShot } = props;
  const [screenId, setScreenId] = useState("");
  const [src, setSrc] = useState("");
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [move, setMove] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (screenList.length) {
      const one = screenList[0];
      console.log(one);
      setSrc(one.url);
      setScreenId(one.id);
      setIsLive(one.isLive);
    }
    setLoading(false);
  }, [screenList]);

  const onChange = useCallback(
    (id) => {
      setLoading(true);
      const one = screenList.find((item) => item.id === id);
      setSrc(one.url);
      setScreenId(one.id);
      setIsLive(one.isLive);
      setTimeout(() => {
        setLoading(false);
      }, 0);
    },
    [screenList]
  );

  const hlsScreenShot = () => {
    const video = document.querySelector(`#v${playerId} video`);
    var canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    const base64 = canvas.toDataURL();
    screenShot && screenShot(base64);
  };
  const onMouseMove = () => {
    setMove(true);
    if (hlsMoveMaskTimer) clearTimeout(hlsMoveMaskTimer);
    hlsMoveMaskTimer = setTimeout(() => {
      setMove(false);
    }, 3000);
  };
  const onMouseLeave = () => {
    setMove(false);
  }
  return (
    <div
      id={"v" + playerId}
      className="mzc-videoBox"
      style={{ width: width, height }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {loading ? (
        <div className="mzc-videoloading">
          <Spin />
        </div>
      ) : (
        <>
          <div
            className="mzc-videoseleMask"
            style={{ display: move ? "flex" : "none" }}
          >
            <div className="mzc-videoseleMask-box">
              <Select
                className="mzc-videoTopMask-select"
                style={{
                  width: 110,
                  backgroundColor: "transparent",
                  color: "#fff",
                }}
                dropdownStyle={{ backgroundColor: "#fff" }}
                value={screenId}
                onChange={onChange}
                suffixIcon={<span> </span>}
              >
                {screenList.map((item) => {
                  return (
                    <Select.Option key={item.id} value={item.id}>
                      {" "}
                      {item.name}{" "}
                    </Select.Option>
                  );
                })}
              </Select>
            </div>
            <div
              className="mzc-videoTopMask-wj"
              onClick={hlsScreenShot}
              style={{ display: needScreenShot && src ? "flex" : "none" }}
            >
              <span>违纪标记</span>
            </div>
          </div>
          {src ? (
            <Player
              key={playerId}
              playerId={playerId}
              width={width}
              height={height}
              src={src}
              isLive={isLive}
            />
          ) : (
            <div className="mzc-videoBox-noData">抱歉，暂无视频数据</div>
          )}
        </>
      )}
    </div>
  );
};

export default OneScreen;
