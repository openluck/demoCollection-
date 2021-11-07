/*
 * @Author: junjie.lean
 * @Date: 2020-07-28 16:40:34
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2021-02-20 13:16:01
 */

import React from "react";
import { withRouter } from "react-router-dom";
import { Spin } from "antd";

/**
 * @description react组件加载中的的一个解决方案,在加载时,展示加载中的组件,加载完毕后展示子组件
 * @module public-Spin
 * @param {Boolean} isLoading
 * @param {React.Component} children
 * @return {Fiber} Spin or children component
 * @exports module:public-Spin
 */
export default withRouter((props) => {
  const { isLoading, children } = props;
  return isLoading ? <Spin /> : children;
});
