/*
 * @Author: yrj
 * @Date: 2019-02-10 13:35:50
 * @Last Modified by: tj
 * @Last Modified time: 2020-03-04 16:15:32
 */

/**
 * @description 学院画像-基本数据组件（头）
 */

import React, { Fragment as F, useState, useEffect } from "react";
import SVG from "./../../../public/svg.js";
import CollegeMediaPie from "./collegeMediaPie";
import CollageNoData from "./collegeNoData";
import Loading from "./loading";
export default function CollegeMediaPart1(props) {
  //学院-参数值

  return (
    <div className="col_part1_box">
      <div className="p1_box_head">多媒体使用率</div>
      <div className="p1_box_con">
        {props.meidaUseCont ? (
          props.meidaUseCont !== "loading" ? (
            <F>
              <div className="p1_left">
                <div className="p1_echarts">
                  <CollegeMediaPie
                    radius={["55", "65"]}
                    center={["50%", "80"]}
                    color={["#56bbee", "#fbfcfd"]}
                    data={props.meidaUseProp || 0}
                    fontSize={18}
                    title=""
                  />
                </div>
                <div>多媒体使用率</div>
              </div>
              <div className="p1_right">
                <span>
                  {props.meidaUseCont ? props.meidaUseCont.name : "未知"}
                </span>
                <span>
                  {props.meidaUseCont ? (
                    props.meidaUseCont.sortType === 1 ? (
                      <SVG type={"imgUp"} />
                    ) : (
                      <SVG type={"imgDown"} />
                    )
                  ) : null}
                </span>
                <span>
                  {props.meidaUseCont ? props.meidaUseCont.prop||'--' : "0"}%
                </span>
              </div>
            </F>
          ) : (
            <Loading />
          )
        ) : (
          <CollageNoData />
        )}
      </div>
    </div>
  );
}
