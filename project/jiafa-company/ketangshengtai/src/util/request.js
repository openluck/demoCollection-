/*
 * @Author: junjie.lean
 * @Date: 2019-08-06 14:21:02
 * @Last Modified by: xm
 * @Last Modified time: 2021-02-07 09:37:48
 */

/**
 * @description axios 单后台请求方式封装
 */

import axios from "axios";
import _ from "lodash";
import { Modal, message } from 'antd';

/**
 * 数据请求相关配置
 */

let requestConfig = {
  dataService: "", //数据服务入口
  version: "2.32",
  alias: "web",
  token: "",
  orgcode: ""
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
    const roleInfo = JSON.parse(sessionStorage.getItem('roleInfo'));
    let postData = {
      version: opts.version,
      data: params || {},
      alias: opts.alias,
      token: opts.token || "",
      orgCode: opts.orgcode || "",
      roleId: roleInfo && roleInfo.roleId || ''
    };
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };
    if (isBlob) {
      config.responseType = "blob";
    }
    const ajaxObj = axiosIns.post(
      `/${method}`,
      `${JSON.stringify(postData)}`,
      config
    );
    ajaxObj.then(response => {
      if (response.data.code == '501') {
        if (document.querySelector('.ant-modal-confirm-error')) {
          return false
        } else {
          Modal.error({
            title: "系统异常",
            content: "当前登录用户已失效，请重新登录！",
            onOk: () => {
              let url = window.location;
              // sessionStorage.clear();
              console.log(process.env.NODE_ENV);
              if (process.env.NODE_ENV === "production") {
                if (navigator.userAgent.indexOf("MSIE") > 0) {
                  if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
                    window.opener = null;
                    window.close();
                  } else {
                    window.open('', '_top');
                    window.top.close();
                  }
                } else if (navigator.userAgent.indexOf("Firefox") > 0) {
                  window.location.href = 'about:blank ';
                } else {
                  window.opener = null;
                  window.open('', '_self', '');
                  window.close();
                }
              } else {
                window.opener = null;
                window.open('', '_self');
                window.close();
              }
            }
          });
          return false;
        }
      } else if (response.data.code == '505') {
        message.error('当前登录用户已失效，请重新登录！')
      } else if (typeof success === "function") {
        success(response.data);
      }
    }).catch(err => {
      if (typeof fail === "function") {
        fail({ code: err.code, msg: err.message });
      } else {
        console.log("request fail");
      }
    });
    return ajaxObj;
  } else {
    throw new Error("缺失参数‘Method’");
  }
};

// 用于听评课的请求方法
export const requestForListen = (method, params, success = () => { }, fail = () => { }) => {
  let token = sessionStorage.getItem("token");
  let orgcode = sessionStorage.getItem("orgCode") || '';
  let stationUid = sessionStorage.getItem("stationUid") || '';
  // let orgId = sessionStorage.getItem("teachOrgId");
  var opts = requestConfig;
  if (!opts.dataService) {
    throw new Error(
      "需要设置数据服务地址，请执行_x.util.request.setConfig进行设置"
    );
  }

  if (method) {
    if (opts.testmode) {
      success({
        IsSuccess: true,
        ErrMsg: "",
        Data: testData[method]
      });
    } else {
      // params.orgId = orgId
      var postData = {
        version: opts.version,
        data: params || {},
        alias: opts.alias,
        token: token || "",
        orgCode: orgcode || "",
        stationUid: stationUid || "",
      };
      const config = {
        headers: {
          "Content-Type": "application/json"
        }
      };

      const ajaxObj = axiosIns.post(
        `/${method}`,
        `${JSON.stringify(postData)}`,
        config
      );
      ajaxObj
        .then(function (response) {
          if (response.data.code == "501") {
            if (document.querySelector(".ant-modal-confirm-error")) {
              return false;
            } else {
              Modal.error({
                // title: G.baseinfo.teacherid + '的异常：' || '异常',
                title: "登录异常",
                content: "当前登录用户已失效，请重新登录！",
                onOk: () => {
                  let url = window.location;
                  sessionStorage.clear();
                  console.log(process.env.NODE_ENV);
                  if (process.env.NODE_ENV === "production") {
                    if (navigator.userAgent.indexOf("MSIE") > 0) {
                      if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
                        window.opener = null;
                        window.close();
                      } else {
                        window.open("", "_top");
                        window.top.close();
                      }
                    } else if (navigator.userAgent.indexOf("Firefox") > 0) {
                      window.location.href = "about:blank ";
                    } else {
                      window.opener = null;
                      window.open("", "_self", "");
                      window.close();
                    }
                  } else {
                    window.opener = null;
                    window.open(" ", "_self", "");
                    window.close();
                  }
                }
              });
              return false;
            }
          } else if (response.data.code == '500') {
            message.warning('当前登录用户已失效，请重新登录！')
          } else {
            if (typeof success === "function") {
              success(response.data);
            }
          }
        })
        .catch(() => { });

      if (typeof fail === "function") {
        ajaxObj.catch(fail);
      } else if (opts.globalFail) {
        ajaxObj.catch(opts.globalFail);
      }

      return ajaxObj;
    }
  } else {
    throw new Error("请求数据需要指定方法，参数method不能为空");
  }
};

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
 * 包含上传文件和普通请求的表单方式
 * @author:Jcheng.Liu
 * @param {Object} params 请求具体参数
 */
export const formRequest = function (method, params, successCallback, failCallback) {
  let opts = requestConfig;
  let orgcode = sessionStorage.getItem("orgCode");
  let token = sessionStorage.getItem("token");
  let stationUid = sessionStorage.getItem("stationUid") || '';
  let formDataObj = new FormData();
  const roleInfo = JSON.parse(sessionStorage.getItem('roleInfo'));

  for (let o in params) {
    formDataObj.append(o, params[o]);
  }

  // formDataObj.append('file', params.file);
  // formDataObj.append('folderId', params.folderId);

  formDataObj.append("token", token);
  formDataObj.append("orgCode", orgcode);
  formDataObj.append("stationUid", stationUid);
  formDataObj.append("version", opts.version);
  formDataObj.append("alias", opts.alias);
  formDataObj.append("roleId", roleInfo && roleInfo.roleId || '');

  let ajaxObj = axiosIns.post(method, formDataObj, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });

  if (typeof successCallback === "function") {
    ajaxObj.then(function (response) {
      if (response.data.code == "501") {
        if (document.querySelector(".ant-modal-confirm-error")) {
          return false;
        } else {
          Modal.error({
            title: G.baseinfo.teacherid + "的异常：" || "异常",
            content: "当前登录用户已失效，请重新登录！",
            onOk: () => {
              let url = window.location;
              // window.location.href = url.origin + "/login";
              sessionStorage.clear();
              window.close();
            }
          });
          return false;
        }
      } else {
        if (typeof successCallback === "function") {
          successCallback(response.data);
        }
      }
    });
  }
  if (typeof failCallback === "function") {
    ajaxObj.catch(failCallback);
  } else if (opts.globalFail) {
    ajaxObj.catch(opts.globalFail);
  }
  return ajaxObj;
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
  axiosIns = axios.create({
    baseURL: dataService
  });

  requestConfig.token = token;
  requestConfig.orgcode = orgcode;
};

/**
 *
 * @param { String } url
 * @param { Object } params
 * @param { Function } success
 * @param { Function } fail
 */
// export const requestSingle = (
//   url,
//   params,
//   success = res => { },
//   fail = () => { }
// ) => {
//   let _params = "data=" + JSON.stringify(params);
//   return axios
//     .post(url, _params)
//     .then(_res => {
//       success(_res);
//     })
//     .catch(err => {
//       fail();
//     });
// };

export const requestSingle = (
  url,
  params,
  success = res => { },
  fail = () => { }
) => {
  let _params = "data=" + JSON.stringify(params);
  return axios
    .get(url, _params)
    .then(_res => {
      success(_res);
    })
    .catch(err => {
      fail();
    });
};
