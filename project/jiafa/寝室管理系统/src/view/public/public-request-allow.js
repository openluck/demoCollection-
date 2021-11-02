/*
 * @Author: kyl
 * @Date: 2020-05-19 18:35:02
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2021-02-20 13:23:35
 */

import React from "react";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal, message } from "antd";
const tipModal = Modal.confirm;

/**
 * @description axios响应拦截器的处理函数,
 * @module public-Axios-response
 * @param {Axios.Response.data} res
 * @returns {Axios.Response.data} res
 * @export module:public-Axios-response
 */
export const dealRequest = (res) => {
  switch (res.code) {
    //token异常
    case "-1":
      // message.warn("token不存在或已过期！");
      // console.log(1);
      tipModal({
        className: "kyl-modal-confirm",
        icon: <ExclamationCircleOutlined />,
        content: res?.message ?? "token不存在或已过期，请关闭页面重新登录。",
        okText: "确定",
        onOk: () => {
          window.open("about:blank", "_self").close();
        },
      });
      break;
    case "其他":
      tipModal({
        className: "kyl-modal-confirm",
        icon: <ExclamationCircleOutlined />,
        content: res?.message ?? "获取缓存失败，请联络管理员处理!",
        okText: "确定",
        onOk: () => {
          window.open("about:blank", "_self").close();
        },
      });
      break;
    //接口调用异常
    case 1002:
      //   console.log(1002);
      message.warn("接口异常");
      break;
    //数据异常
    case 1003:
      message.warn("数据异常");
      break;
    //机构代码异常
    case 1004:
      tipModal({
        className: "kyl-modal-confirm",
        icon: <ExclamationCircleOutlined />,
        content: "机构代码异常！",
        okText: "确定",
        onOk: () => {
          window.open("about:blank", "_self").close();
        },
      });
      break;
    //权限不足
    case 1009:
      tipModal({
        className: "kyl-modal-confirm",
        icon: <ExclamationCircleOutlined />,
        content: "权限不足！",
        okText: "确定",
        onOk: () => {
          window.open("about:blank", "_self").close();
        },
      });
      break;
    default:
      return res;
  }
  return res;
};
