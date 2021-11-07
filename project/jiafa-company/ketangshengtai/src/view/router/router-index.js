import React, { useEffect, useState } from "react";
import { HashRouter as Router, Route, Redirect, } from "react-router-dom";
import { AnimatedSwitch as Switch } from "react-router-transition";
import { request } from './../../util/request';
import { message, Modal } from "antd";
import { G } from './../../config/g';
import Menu from './../page/menu';

import Loading from "../page/layout-loading";
import Home from "../page/layout-home";

import { toHHmmss } from "./../page/zxxk/zxxk/format";

export default function RouterRelation(props) {
  function customConfirm(message, callback) {
    Modal.confirm({
      title: message,
      onCancel: () => {
        callback(false);
      },
      onOk: () => {
        callback(true);
      }
    })
  }
  return (
    <Router basename="/" getUserConfirmation={customConfirm}>
      <Switch atEnter={{ opacity: 0 }} atLeave={{ opacity: 0 }} atActive={{ opacity: 1 }} className="switch-wrapper">
        <Route exact path="/" component={Comfirmation} />
        <Route path="/loading" component={Loading} />
        <Route path="/home" component={Home} />
        <Redirect to="/" />
      </Switch>
    </Router>
  );
}

function Comfirmation(props) {
  useEffect(() => {
    logIn();
  }, [])

  const logIn = () => {
    let token = G.token;
    // console.log(token);
    if (token) {
      request('loginSSO', { token }, res => {
        let res1 = {
          "result": true,
          "data": {
            "accountId": "74F3FE040E7D8E2645ED2E9AECE79335",
            "userId": "74F3FE040E7D8E2645ED2E9AECE79335",
            "photo": null, "sex": 0, "userName": "张亮", "orgId": null, "collegeId": "305",
            "token": "D57F21490F1144AB83534CC05C401A35", "orgCode": "32011500001", "orgtype": null,
            "orglevel": null,
            "role": [
              {
                "roleName": "课堂生态校级管理员", "roleLevel": 0, "roleId": "05FB4368FFE94AB49DDE4F40D878B960",
                "function": [
                  // { "functionId": "6001080101", "functionName": "任务列表" },
                  // { "functionId": "6001080201", "functionName": "任务进度" },
                  // { "functionId": "6001080202", "functionName": "任务结果" },
                  // { "functionId": "6001080301", "functionName": "评议表管理" },
                  // { "functionId": "60010803", "functionName": "评课设置" },
                  // { "functionId": "60010801", "functionName": "任务管理" },

                  { "functionId": "60010805", "functionName": "教研任务" },
                  { "functionId": "60010806", "functionName": "教研设置" },
                  { "functionId": "6001080601", "functionName": "教研计划管理" },
                  { "functionId": "6001080602", "functionName": "教研组管理" },
                  { "functionId": "6001080603", "functionName": "教研评价管理" },
                  { "functionId": "60010807", "functionName": "随堂听任务" },
                  { "functionId": "60010304", "functionName": "随堂听设置" },
                  { "functionId": "6001030401", "functionName": "随堂听任务指标设置" },
                  { "functionId": "6001030402", "functionName": "授课员权限审批设置" },
                  { "functionId": "60010305", "functionName": "我的任务" },
                  { "functionId": "60010306", "functionName": "我的教研课" },
                  { "functionId": "60010307", "functionName": "我的随堂听" },

                  { "functionId": "600108", "functionName": "听评课(新)" },
                  { "functionId": "60010802", "functionName": "任务跟踪" },

                  { "functionId": "600104", "functionName": "教学反思" },
                ], "sort": 0, "stationUid": "BE3CDFE11D78DCF7F59E69D6BE56E5C3"
              },
              {
                "roleName": "课堂生态校级", "roleLevel": 0, "roleId": "05FB4368FF0D878B960",
                "function": [
                  { "functionId": "6001080101", "functionName": "任务列表" },
                  { "functionId": "6001080201", "functionName": "任务进度" },
                  { "functionId": "6001080202", "functionName": "任务结果" },
                  { "functionId": "6001080301", "functionName": "评议表管理" },
                  { "functionId": "60010803", "functionName": "评课设置" },
                  { "functionId": "60010801", "functionName": "任务管理" },
                  { "functionId": "600108", "functionName": "听评课(新)" },
                  { "functionId": "60010802", "functionName": "任务跟踪" },
                ], "sort": 0, "stationUid": "BE3CDFE11D78DCF7F59E69D6BE56E5C3"
              }
            ]
          },
        }
        if (res.result) {
          let data = res.data,
            { role } = data;

          G.orgCode = data.orgCode;
          sessionStorage.setItem('orgCode', data.orgCode);

          if (role && role.length) {
            let roleItem = role[0],
              modelConfig = Menu(roleItem.function);

            G.baseinfo = data;
            sessionStorage.setItem('baseinfo', JSON.stringify(data));

            G.modelConfig = modelConfig;
            sessionStorage.setItem('modelConfig', JSON.stringify(modelConfig));

            G.roleInfo = { roleId: roleItem.roleId, roleLevel: roleItem.roleLevel };
            sessionStorage.setItem('roleInfo', JSON.stringify(G.roleInfo));

            props.history.push('/loading');
          } else {
            message.info('没有用户信息，请重新登录！');
            window.close();
          }
        } else {
          message.error(res.message || '登录错误，请重新登录', 2, () => {
            func()
          });
        }
      })
    } else {
      message.error('没有用户token，请重新登录', 2, () => {
        func()
      });
    }
  }
  const func = () => {
    let url = window.location;
    sessionStorage.clear();
    // console.log(process.env.NODE_ENV);
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
      // console.log(11);
      window.opener = null;
      window.open("", "_self", "");
      window.close();
    }
  };

  return null;
}
