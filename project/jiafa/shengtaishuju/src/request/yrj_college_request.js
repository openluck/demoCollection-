import { request } from "../util/request";
import { message } from "antd";

//教师考勤 getCollegeTeaAtten,getCollegeAttenAna,getCollegeTeachAna,getCollegeAttenTrend
export const getCollegeTeaAtten = params => {
  //获取头部和底部基本信息
  return request("api/image/getCollegeTeaAtten", params);
};

export const getCollegeAttenAna = params => {
  //获取课程对比数据
  return request("api/image/getCollegeAttenAna", params);
};

export const getCollegeTeachAna = params => {
  //获取教师对比数据
  return request("api/image/getCollegeTeachAna", params);
};

export const getCollegeAttenTrend = params => {
  //获取趋势线图数据
  return request("api/image/getCollegeAttenTrend", params);
};

export const getColStuZhRade = params => {
  //获取综合情况雷达图
  return request("api/image/getCollegeStuRadar", params);
};

export const getColStuZhLine = params => {
  //获取课堂类型线图
  return request("api/image/getCollegeStuLine", params);
};

//到课率 getCollegeClass,getCollegeClassAna,getCollegeClassAna,getCollegeClassTrend
export const getCollegeClass = params => {
  //获取头部和底部基本信息
  return request("api/image/getCollegeClass", params);
};

export const getCollegeClassAna = params => {
  //获取课程对比数据
  return request("api/image/getCollegeClassAna", params);
};

export const getCollegeClassTeaAna = params => {
  //获取教师对比数据
  return request("api/image/getCollegeClassTeaAna", params);
};

export const getCollegeClassTrend = params => {
  //获取趋势线图数据
  return request("api/image/getCollegeClassTrend", params);
};

//前排就坐率 getCollegeSeat,getCollegeSeatAna,getCollegeSeatTeaAna,getCollegeSeatTrend
export const getCollegeSeat = params => {
  //获取头部和底部基本信息
  return request("api/image/getCollegeSeat", params);
};

export const getCollegeSeatAna = params => {
  //获取课程对比数据
  return request("api/image/getCollegeSeatAna", params);
};

export const getCollegeSeatTeaAna = params => {
  //获取教师对比数据
  return request("api/image/getCollegeSeatTeaAna", params);
};

export const getCollegeSeatTrend = params => {
  //获取趋势线图数据
  return request("api/image/getCollegeSeatTrend", params);
};

//低头率 getCollegeSleepAtten,getCollegeSleepAttenAna,getCollegeSleepAna,getCollegeSleepAttenLine
export const getCollegeSleepAtten = params => {
  //获取头部和底部基本信息
  return request("api/image/getCollegeSleepAtten", params);
};

export const getCollegeSleepAttenAna = params => {
  //获取课程对比数据
  return request("api/image/getCollegeSleepAttenAna", params);
};

export const getCollegeSleepAna = params => {
  //获取教师对比数据
  return request("api/image/getCollegeSleepAna", params);
};

export const getCollegeSleepAttenLine = params => {
  //获取趋势线图数据
  return request("api/image/getCollegeSleepAttenLine", params);
};

//课堂违纪 getCollegeVioAtten,getCollegeVioAna,getCollegeVioAttenAna,getCollegeVioAttenLine
export const getCollegeVioAtten = params => {
  //获取头部和底部基本信息
  return request("api/image/getCollegeVioAtten", params);
};

export const getCollegeVioAttenAna = params => {
  //获取课程对比数据
  return request("api/image/getCollegeVioAttenAna", params);
};

export const getCollegeVioAna = params => {
  //获取教师对比数据
  return request("api/image/getCollegeVioAna", params);
};

export const getCollegeVioAttenLine = params => {
  //获取趋势线图数据
  return request("api/image/getCollegeVioAttenLine", params);
};

//教学分析 getCollegeTeaBehPie,getCollegeDesPie,getCollegeTypePie,getCollegeDesLine,getCollegeTeaBehLine,getCollegeTypehLine
export const getCollegeTeaBehPie = params => {
  //获取教师行为饼图
  return request("api/image/getCollegeTeaBehPie", params);
};

export const getCollegeDesPie = params => {
  //获取教学设计饼图
  return request("api/image/getCollegeDesPie", params);
};

export const getCollegeTypePie = params => {
  //获取教师课堂类型饼图
  return request("api/image/getCollegeTypePie", params);
};

export const getCollegeDesLine = params => {
  //获取教学设计线图
  return request("api/image/getCollegeDesLine", params);
};

export const getCollegeTeaBehLine = params => {
  //获取教师行为线图
  return request("api/image/getCollegeTeaBehLine", params);
};

export const getCollegeTypehLine = params => {
  //获取教师课堂类型线图
  return request("api/image/getCollegeTypehLine", params);
};

//学生听讲反馈
export const getCollegeBehPie = params => {
  //学生行为饼图
  return request("api/image/getCollegeBehPie", params);
};

export const getCollegeFacPie = params => {
  //学生表情饼图
  return request("api/image/getCollegeFacPie", params);
};

export const getCollegeFacLine = params => {
  //学生表情线图
  return request("api/image/getCollegeFacLine", params);
};

export const getCollegeBehLine = params => {
  // 学生行为线图
  return request("api/image/getCollegeBehLine", params);
};

//课堂互动 getCollegeInterAttenAna,getCollegeInterAttenAna,getCollegeInterAna,getCollegeInterAttenLine
export const getCollegeInterAtten = params => {
  //获取头部和底部基本信息
  return request("api/image/getCollegeInterAtten", params);
};

export const getCollegeInterAttenAna = params => {
  //获取课程对比数据
  return request("api/image/getCollegeInterAttenAna", params);
};

export const getCollegeInterAna = params => {
  //获取教师对比数据
  return request("api/image/getCollegeInterAna", params);
};

export const getCollegeInterAttenLine = params => {
  //获取趋势线图数据
  return request("api/image/getCollegeInterAttenLine", params);
};

//多媒体使用 getCollegeMediaAtten,getCollegeMediaAttenAna,getCollegeMediaAna,getCollegeMediaAttenLine
export const getCollegeMediaAtten = params => {
  //获取头部基本信息
  return request("api/image/getCollegeMediaAtten", params);
};

export const getCollegeMediaAttenAna = params => {
  //获取课程对比数据
  return request("api/image/getCollegeMediaAttenAna", params);
};

export const getCollegeMediaAna = params => {
  //获取教师对比数据
  return request("api/image/getCollegeMediaAna", params);
};

export const getCollegeMediaAttenLine = params => {
  //获取趋势线图数据
  return request("api/image/getCollegeMediaAttenLine", params);
};
