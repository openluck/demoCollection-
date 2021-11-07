import { request } from "../util/request";

// 获得问题下发基础数据
export const getAllotInfo = params => {
    return request("api/improve/getIssueStatic", params);
    // return request("api/improve/getAllotInfo", params);
};

// 获得问题处理统计基础数据
export const getHandleInfo = params => {
    return request("api/improve/getReplyStatic", params);
    // return request("api/improve/getHandleInfo", params);
};


// 获得问题学院top5柱状图
export const getHandleCoBar = params => {
    return request("api/improve/getTrackNumAndBar", params);
    // return request("api/improve/getHandleCoBar", params);
};

