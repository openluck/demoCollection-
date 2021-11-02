import { request } from "../util/request";
import { message } from "antd";

//教学质量-课堂 getOrdClassList,getOrdClassVideo,getOrdTeachMes
export const getOrdClassList = params => {
  //获取对应课堂列表数据（教学秩序-课堂）
  return request("api/visual/getOrdClassList", params);
};

export const getOrdClassVideo = params => {
  //获取视频
  return request("api/visual/getOrdClassVideo", params);
};

export const getOrdTeachMes = params => {
  //获取授课情况数据
  return request("api/visual/getOrdTeachMes", params);
};