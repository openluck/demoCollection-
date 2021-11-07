import { request } from "../../../../util/request";

export const getTourcourseList = (params) => {
  return request("tourCourInfo/getTourCourseList", params);
};

export const getTourCourseDetail = (params) => {
  return request("tourCourInfo/getTourCourseDetail", params);
};

export const getRecordList = (params) => {
  return request("tourCourRecord/getRecordList", params);
};

export const saveRecord = (params) => {
  return request("tourCourRecord/saveRecord", params);
};

export const getRecordTabList = (params) => {
  return request("tourCourRecord/getRecordTabList", params);
};

export const getAttendance = (params) => {
  return request("tourCourInfo/getAttendance", params);
};

export const getIcidentList = (params) => {
  return request("tourCourRecord/getIcidentList", params);
};

export const getTourCourseVideo = (params) => {
  return request("tourCourInfo/getTourCourseVideo   ", params);
};

export const getRobotStatus = (params) => {
  return request("funcSet/getRobotStatus", params);
};
