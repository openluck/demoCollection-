/*
 * @Author: xq 
 * @Date: 2021-01-15 11:06:43 
 * @Last Modified by: xq
 * @Last Modified time: 2021-02-01 13:35:03
 * @desc 配置向导
 */
import { request,formRequest } from "./../../util/request";
import { saveAs } from 'file-saver';
import { message } from 'antd';

// 上传文件
export const uploadConfigs_request = (params = {},scb, fcb,pro) => {
    return formRequest("config/uploadConfigs", params, scb, fcb, pro);
};

// 下载错误文件
export const downloadConfigErr_request = (params = {}) => {
    request('config/errFileDownload', params, (res,resHead) => {
        let filename = resHead['content-disposition'];
        let blob = new Blob([res], { type: 'application/x-xls' });
        let newname = filename.split('=')[1];
        saveAs(blob, decodeURI(newname));
        }, () => {
            message.warning('下载失败，请刷新页面或者联系管理员', 2)
        },  true
    )

    
}