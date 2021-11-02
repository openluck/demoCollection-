/*
 * @Author: xq.zhao
 * @Date: 2019-11-2 10:38:59
 * @Last Modified by: tj
 * @Last Modified time: 2020-07-22 11:25:50
 */

/**
 * @description 报告中心数据请求
 */

import { request } from "../util/request";
import { message} from 'antd';
// 自定义报告
export const addCusReport = (params) => {
    return request('/api/report/customReport/addReport',params);
}
export const getCusTableData = (params) => {
    return request('/api/report/customReport/queryReportList',params);
}
export const downLoadCusTable = (params) => {
    return request('/api/report/customReport/downReport',params);
}
export const genCusReport = (params) => {
    return request('/api/report/customReport/generReport',params);
}

// 系统报告
export const getTableData = (params) => {
    return request('/api/report/systemReport/Listselect',params);
}
export const downLoadTable = (params) => {
    return request('/api/report/systemReport/downReport',params);
}
export const genReport = (params) => {
    return request('/api/report/systemReport/generReport',params);
}
