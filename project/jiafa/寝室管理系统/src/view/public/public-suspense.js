/*
 * @Author: junjie.lean
 * @Date: 2020-07-28 17:05:12
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2021-02-20 13:16:28
 */

import React, { Suspense } from "react";
import "./../../style/index.scss";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

/**
 * @description react组件懒加载的解决方案,在懒加载时
 * @module public-SuspenseFun
 * @param {React.Component} children
 * @return {Fiber} SuspenseFun
 * @exports module:public-SuspenseFun
 */
export default function SuspenseFun({ children }) {
  return (
    <Suspense
      fallback={
        <div className="lean-public-suspense">
          {
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            ></Spin>
          }
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
