/*
 * @Author: xq
 * @Date: 2021-01-08 13:44:37
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2021-02-26 13:00:40
 * @desc 项目路由配置
 */

import React, { Fragment as F } from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import ConfigGuide from "./../page/page-room/page-room-configGuide";
import StudentCheckIn from "./../page/page-room/page-room-studentCheckIn";
import DistributeManage from "./../page/page-room/page-room-distributeManage";
import StudentRule from "./../page/page-room/page-room-studentRule";
import ManageRule from "./../page/page-room/page-room-manageRule";
import DeviceManage from "./../page/page-device/page-deviceManage";
import CountOverview from "./../page/page-dorm/page-dorm-countOverview";
import CountClass from "./../page/page-dorm/page-dorm-countClass";
import CountBuilding from "./../page/page-dorm/page-dorm-countBuilding";
import StudentDetail from "./../page/page-dorm/page-dorm-studentDetail";
import PersonRule from "./../page/page-dorm/page-dorm-personRule";
import DormRule, {
  PersonGroupDrawer,
} from "./../page/page-dorm/page-dorm-dormRule";

/**
 * 包含住宿管理和在寝管理两部分的路由组件
 * @module router-home
 * @return {Fiber} router component
 * @exports module:router-home
 */
export const WithoutLayoutRouter = () => {
  let baseHash = "/home";
  return (
    <F>
      <RoomRoutes baseHash={baseHash} />
      <Switch>
        <Route path={baseHash + "/device"} component={DeviceManage} />
      </Switch>
      <DormRoutes baseHash={baseHash} />
    </F>
  );
};

/**
 * @description 住宿管理部分的组件
 * @memberof module:router-home
 * @function RoomRoutes
 * @param {Object} props
 * @return {Fiber} room router component
 */
const RoomRoutes = (props) => {
  let baseHash = props.baseHash;
  return (
    <Switch>
      <Route path={baseHash + "/room/configGuide"} component={ConfigGuide} />
      <Route
        path={baseHash + "/room/studentCheckIn"}
        component={StudentCheckIn}
      />
      <Route
        path={baseHash + "/room/distributeManage"}
        component={DistributeManage}
      />
      <Route
        path={baseHash + "/room/rule/studentRule"}
        component={StudentRule}
      />
      <Route path={baseHash + "/room/rule/manageRule"} component={ManageRule} />
    </Switch>
  );
};

/**
 * @descriptin 在寝管理部分的组件
 * @memberof module:router-home
 * @function DormRoutes
 * @param {Object} props
 * @return {Fiber} dorm router component
 */
const DormRoutes = (props) => {
  let baseHash = props.baseHash;
  return (
    <Switch>
      <Route
        path={baseHash + "/dorm/count/countOverview"}
        component={CountOverview}
      />
      <Route
        path={baseHash + "/dorm/count/countClass"}
        component={CountClass}
      />
      <Route
        path={baseHash + "/dorm/count/countBuilding"}
        component={CountBuilding}
      />
      <Route
        path={baseHash + "/dorm/studentDetail"}
        component={StudentDetail}
      />
      <Route
        exact
        path={baseHash + "/dorm/dormRule/personRule"}
        component={PersonRule}
      />
      <Route exact path={baseHash + "/dorm/dormRule"} component={DormRule} />
      <Route
        exact
        path={baseHash + "/dorm/dormRule/person"}
        component={PersonGroupDrawer}
      />
    </Switch>
  );
};
