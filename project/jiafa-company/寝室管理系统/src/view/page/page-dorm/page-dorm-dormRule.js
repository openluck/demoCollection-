/*
 * @Author: xq
 * @Date: 2021-01-08 13:35:09
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2021-02-26 12:59:19
 * @desc 在寝管理 - 在寝计算规则 - 规则设置
 */
import React from "react";
import { withRouter } from "react-router-dom";
import DormRule from "./../../components/component-dormitory-rule/dormRule";
import "./../../../style/lean-dormRuls.scss";

export { PersonGroupDrawer } from "./../../components/component-dormitory-rule/dormDrawer";

export default withRouter(() => {
  return <DormRule />;
});
