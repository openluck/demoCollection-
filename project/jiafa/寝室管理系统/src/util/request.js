/*
 * @Author: junjie.lean
 * @Date: 2019-08-06 14:21:02
 * @Last Modified by: xq
 * @Last Modified time: 2021-02-08 15:46:47
 */

/**
 * @description axios 单后台请求方式封装
 */

import axios from "axios";
import _ from "lodash";
import { dealRequest } from "./../view/public/public-request-allow";

/**
 * 数据请求相关配置
 */
let requestConfig = {
    dataService: "", //数据服务入口
    version: "0.2.0",
    alias: "web",
    token: "",
    orgcode: "",
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
    let postData = {
      version: opts.version,
      data: params || {},
      alias: opts.alias,
      token: opts.token || "",
      orgCode: opts.orgcode || "",
    };
    const config = {
      headers: {
        "Content-Type": "application/json",
        token: opts.token || "token",
        orgCode: opts.orgcode || "123",
      },
    };
    if (isBlob) {
      config.responseType = "blob";
    }
    const ajaxObj = axiosIns.post(
      `/${method}`,
      `${JSON.stringify(postData)}`,
      config
    );
    ajaxObj
      .then((response) => {
        if (typeof success === "function") {
          success(response.data, response.headers);
        }
      })
      .catch((err) => {
        if (typeof fail === "function") {
          fail({ code: err.code, msg: err.message });
        } else {
          console.log("request fail");
        }
      });

    // if (typeof fail === "function") {
    //   ajaxObj.catch(fail);
    // } else if (opts.globalFail) {
    //   ajaxObj.catch(opts.globalFail);
    // }

    return ajaxObj;
  } else {
    throw new Error("缺失参数‘Method’");
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
  reqlist = requestList.map((item) => {
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
  axiosIns = axios.create({
    baseURL: dataService,
  });

  //响应拦截
  axiosIns.interceptors.response.use(function (response) {
    let res = response;
    // console.log("拦截器处理:", res);
    //文件流 不拦截
    if (res?.headers?.["content-type"]?.indexOf("application/json") === -1) {
      // console.log(
      //   "流:",
      //   res?.headers?.["content-type"]?.indexOf("application/json")
      // );
      return res;
    }
    //正常返回 不拦截
    if (res.data.code === "200" || res.data.code === 200) {
      return res;
    } else {
    //   return dealRequest(res.data);  // 2021-2-8 改动前 xq
      return dealRequest(res);  // 2021-2-8 改动后 xq
    }
  });

  requestConfig.token = token;
  requestConfig.dataService = dataService;
  requestConfig.orgcode = orgcode;
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
  success = (res) => {},
  fail = () => {}
) => {
  let _params = "data=" + JSON.stringify(params);
  return axios
    .post(url, _params)
    .then((_res) => {
      success(_res);
    })
    .catch((err) => {
      fail();
    });
};

/**
 * @desc 文件上传
 * @param {*} method
 * @param {*} params
 * @param {*} successCallback
 * @param {*} failCallback
 * @param {*} progressCallback
 */

let cancelData = null;
export const formRequest = function (
  method,
  params,
  successCallback = () => {},
  failCallback = () => {},
  progressCallback = () => {}
) {
  let opts = requestConfig;
  let formDataObj = new FormData();
  for (let o in params) {
    if (o == "files" || o == "file") {
      continue;
    }
    formDataObj.append(o, params[o]);
  }
  formDataObj.append("token", opts.token);
  formDataObj.append("orgCode", opts.orgcode);
  if (params.files && params.files.length) {
    params.files.forEach((item) => {
      formDataObj.append("files", item);
    });
  }
  let config = {
    headers: {
      "Content-Type": "multipart/form-data",
      token: opts.token || "",
      orgCode: opts.orgcode || "",
    },
    onUploadProgress: (progressEvent) => {
      let v = ((progressEvent.loaded / progressEvent.total) * 100) | 0;
      progressCallback(v);
    },
    cancelToken: new axios.CancelToken((c) => {
      // 中断请求
      cancelData = c;
    }),
  };

  let ajaxObj = axiosIns.post(`/${method}`, formDataObj, config);

  if (typeof successCallback === "function") {
    ajaxObj.then(function (response) {
      if (typeof successCallback === "function") {
        successCallback(response.data, response.headers);
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

export const cancelReq = () => {
  cancelData({ message: "文件上传已中断！", isCancel: true });
};
