/*
 * @Author: junjie.lean
 * @Date: 2020-03-18 11:00:34
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2021-02-18 17:44:13
 */

import ReactLoading from "react-loading";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { message, Spin } from "antd";

import G from "./../../config/g";
import {
  getUserInfo_request,
  getBuildTree_request,
  getClassTree_request,
} from "./../../request/public.request";
import {
  getUserInfo_action,
  getBuildTree_action,
  getClassTree_action,
} from "../../redux/actions/public.action";

message.config({
  top: 100,
  duration: 2,
  maxCount: 1,
});

/**
 * @description loading初始化加载页面
 * @module
 * @param { REACT.PROPS } props index.js文件下发的属性
 */
export default function Loading(props) {
  const dispatch = useDispatch();
  /**
   * @desc 公共数据请求
   */
  useEffect(() => {
    initHandle();
  }, []);

  /**
   * @desc 处理角色权限
   * @param {array} list 角色列表 接口返的accTypeIdList**假定 管理员 0、班主任 1、宿管 2
   * @param {string} return 返回的角色 :'管理员 0'、'班主任 1'、'宿管 2'、'班主任&&宿管 3'
   */
  const roleHandle = (list) => {
    if (!list || list.length === 0) {
      // 角色列表为空
      message.warning("无法获取账户角色，请重新登录！");
      props.history.push("/error");
    }
    // list = [0]
    let gl = _.findIndex(list, (it) => it === 0);
    let zr = _.findIndex(list, (it) => it === 1);
    let sg = _.findIndex(list, (it) => it === 2);
    if (gl > -1) return "0";
    if (zr > -1 && sg === -1) return "1";
    if (sg > -1 && zr === -1) return "2";
    if (sg > -1 && zr > -1) return "3";
    if (gl === -1 && sg === -1 && zr === -1) {
      // 返回的角色列表参数不对
      message.warning("无法获取账户角色，请重新登录！");
      return false;
    }
  };

  /**
   * @desc 全局数据请求和处理
   */
  const initHandle = async () => {
    // 处理用户信息 roleTypeFront 角色权限 '管理员 0'、'班主任 1'、'宿管 2'、'班主任&&宿管 3'
    const userInfoRes = await getUserInfo_request();
    if (userInfoRes.result) {
      let type = roleHandle(userInfoRes.data.accTypeIdList);
      if (!type) return false;
      let roleNew = {
        roleTypeFront: type,
      };
      dispatch(getUserInfo_action({ ...userInfoRes.data, ...roleNew }));
    } else {
      dispatch(getUserInfo_action({}));
      message.warning(userInfoRes.message);
      return false;
    }

    const requestList = [getBuildTree_request(), getClassTree_request()];
    let promiseAll = await Promise.all(requestList)
      .then((res) => res)
      .catch((e) => {
        message.warning("系统错误,请联系系统管理员!");
        return false;
      });
    let buildTreeRes = promiseAll[0];
    let classesRes = promiseAll[1];

    // 处理楼栋树
    if (buildTreeRes.result) {
      dispatch(getBuildTree_action(buildTreeRes.data));
    } else {
      dispatch(getBuildTree_action({ buildTree: [] }));
      message.warning(buildTreeRes.message);
      return false;
    }
    // 处理班级树
    if (classesRes.result) {
      dispatch(getClassTree_action(classesRes.data));
    } else {
      dispatch(getClassTree_action({ list: [] }));
      message.warning(classesRes.message);
      return false;
    }
    setTimeout(() => {
      props.history.push("/home");
    }, 500);
  };
  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <div style={{ margin: "100px 100px" }}>
          <span
            style={{
              color: "#3687d9",
              margin: "0 0 30px",
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            宿舍管理系统
          </span>
          <ReactLoading type={"bars"} color="#3687d9" />
        </div>
        <div
          style={{
            position: "fixed",
            bottom: 20,
            right: 62,
          }}
        >
          <ReactLoading
            type={"spinningBubbles"}
            color="#3687d9"
            width="35px"
            height="35px"
          />
        </div>
      </div>
    </>
  );
}
