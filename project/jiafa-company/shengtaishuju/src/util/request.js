/*
 * @Author: junjie.lean
 * @Date: 2019-08-06 14:21:02
 * @Last Modified by: lxx
 * @Last Modified time: 2021-02-03 13:42:14
 */

/**
 * @description axios 单后台请求方式封装
 */

import axios from "axios";
import _ from "lodash";
import { Modal, Button } from 'antd';
import G from './../config/g'

/**
 * 数据请求相关配置
 */
let requestConfig = {
  dataService: "", //数据服务入口
  // version: "0.2.0",
  // alias: "web",
  // token: "",
  // orgcode: ""
},
  axiosIns;
/**
 * 请求数据服务
 * @param {String} method 请求的方法
 * @param {JSON} params 提交参数
 */
export const request = (method, params, success, fail, isBlob) => {
  let opts = requestConfig;
  if (!opts.dataService) {
    throw new Error("需要设置数据服务地址，请执行setConfig进行设置");
  }

  if (method) {
    let belOrg = '';
    if (G.ISCED_curRoleInfo) {
      belOrg = G.ISCED_curRoleInfo.belongOrgId || ''
    }
    let postData = {
      data: params || {},
      belongOrgId: belOrg // 学校id 32011500001 学院id 0507000
    };
    const config = {
      headers: {
        "Content-Type": "application/json"
      },
      timeout: method.indexOf('getVideo') > -1 ? 1000 * 60 * 5 : 30000
    };
    if (isBlob) {
      config.responseType = "blob";
    }

    const ajaxObj = axiosIns.post(
      method,
      postData,
      config
    );
    ajaxObj
      .then(response => {
        if (typeof success === "function") {
          // console.log("______scb", response);
          if (isBlob) {
            let fileName = response.headers['content-disposition'].split(';')[1].split('=')[1];
            fileName = fileName.replace(/\"/g, "");
            success(response.data, decodeURIComponent(fileName));
          } else {
            success(response.data);
          }

        }
      })
      .catch(err => {
        // let errStri = JSON.stringify(err);
        console.log(err)
        if (err.response.status === 401) {
          if (document.querySelector('.ant-modal-confirm-error')) {
            return false
          } else {
            Modal.error({
              title: '异常', // G.EXSMS_userInfo ? G.EXSMS_userInfo.accountName + '的异常：' :
              content: "当前登录用户已失效，请重新登录！",
              onOk: () => {
                let url = window.location;
                window.location.href = url.pathname;
                sessionStorage.clear();
              }
            });
            return false;
          }
        } else if (typeof fail === "function") {
          fail({ code: err.code, msg: err.message });
        } else {
          console.log(err);
        }
      });
    return ajaxObj;
  } else {
    throw new Error("缺失参数‘Method’");
  }
};

/**
 * 文件上传的表单方式
 * @param {*} method 请求地址
 * @param {*} params 参数
 * @param {*} success 成功回调
 * @param {*} fail 失败回调
 */
export const formtRequst = (method, params, success, fail) => {
  let paramObj = params;
  let formDataObj = new FormData();
  let belOrg = '';
  if (G.ISCED_curRoleInfo) {
    belOrg = G.ISCED_curRoleInfo.belongOrgId || ''
  }
  // formDataObj.append('data', JSON.stringify(params));
  formDataObj.append('belongOrgId', belOrg);
  if (paramObj.file && paramObj.file.length > 0) {
    for (var file of paramObj.file) {
      formDataObj.append("file", file);
    }
  }
  let ajaxObj = axiosIns.post(method, formDataObj, {
    headers: {
      "Content-Type": 'multipart/form-data'
    }
  });
  if (typeof success === 'function') {
    ajaxObj
      .then(response => {
        if (typeof success === "function") {
          success(response.data);
        }
      })
      .catch(err => {
        // let errStri = JSON.stringify(err);
        console.log("err", err.response)
        // alert(err.response)
        if (err.response && err.response.status === 401) {
          // if (errStri.indexOf("401") > -1) {
          if (document.querySelector('.ant-modal-confirm-error')) {
            return false
          } else {
            Modal.error({
              title: '异常', // G.EXSMS_userInfo ? G.EXSMS_userInfo.accountName + '的异常：' :
              content: "当前登录用户已失效，请重新登录！",
              onOk: () => {
                let url = window.location;
                window.location.href = url.pathname;
                sessionStorage.clear();
              }
            });
            return false;
          }
        } else if (typeof fail === "function") {
          fail({ code: err.code, msg: err.message });
        } else {
          console.log(err);
        }
      });
    return ajaxObj;
  }
}

/**
 * @description 同时进行多个请求，全部完成时执行回调
 * @param {Array} requestList 请求列表[{method:'',params:{}}...]
 */
export const requestMultiple = (requestList, success, fail) => {
  let reqlist, axiosobj;
  requestList = requestList || [];
  if (requestList.length === 0) {
    throw new Error("arguments 不能为空");
  }
  reqlist = requestList.map(item => {
    return request(item.method, item.params, item.success, item.fail);
  });
  axiosobj = axios.all(reqlist);
  if (typeof success === "function") {
    axiosobj.then(
      axios.spread(function () {
        let rets = [];
        for (let i = 0; i < arguments.length; i++) {
          rets.push(arguments[i]);
        }
        success(...rets);
      })
    );
  }

  if (typeof fail === "function") {
    axiosobj.catch(fail);
  }
};

/**
 * @description 设置数据服务配置
 * @param {String} dataService 数据服务地址
 */
export const setConfig = (dataService, token, orgcode) => {
  dataService = dataService || "/";
  if (!_.endsWith(dataService, "/")) {
    dataService = dataService + "/";
  }
  requestConfig.dataService = dataService;
  axios.defaults.timeout = 30000;
  axios.defaults.headers.common["Token"] = token ? token : G.ISCED_token ? G.ISCED_token : '';
  axios.defaults.headers.common["OrganId"] = orgcode ? orgcode : G.ISCED_orgcode ? G.ISCED_orgcode : '';
  axiosIns = axios.create({
    baseURL: dataService
  });
};

/**
 *
 * @param { String } url
 * @param { Object } params
 * @param { Function } success
 * @param { Function } fail
 */
export const requestSingle = (
  url,
  params,
  success = res => { },
  fail = () => { }
) => {
  let _params = "data=" + JSON.stringify(params);
  return axios
    .post(url, _params)
    .then(_res => {
      success(_res);
    })
    .catch(err => {
      fail();
    });
};
