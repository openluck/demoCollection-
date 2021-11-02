/*
 * @Author: junjie.lean
 * @Date: 2020-07-28 17:05:12
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2021-02-22 09:32:38
 */

import React, { Profiler } from "react";

const isDev = process.env.NODE_ENV == "development";

/**
 * @description 业务组件的性能分析方法,在生产模式下本功能不启用,开发模式下也慎用,会增加渲染时间
 * @param {Object} children 需要监听的子组件
 * @param {Boolean} open 是否需要使用此功能 如果使用,则会增加渲染时间
 * @param {String} id 组件的唯一ID标识
 * @param {function} callback  回调函数,可不用加
 * @return {Fibler} 返回子组件
 */
export default ({ children, open, id, callback }) => {
  if (id == null) {
    throw new Error("调用性能分析组件 'public-profile' 必须添加id属性!");
  }

  if (!isDev) {
    console.warn("生产环境已禁用性能分析组件");
  }

  if (!callback) {
    callback = (id, phase, actualDuration) => {
      console.log(
        `
        组件id:${id},
        渲染方式:${phase == "update" ? "更新" : "挂载"},
        渲染耗时:${Math.round(actualDuration * 1000)}μs
        `
      );
    };
  }
  return isDev && open ? (
    <Profiler id={id} onRender={callback}>
      {children}
    </Profiler>
  ) : (
    children
  );
};
