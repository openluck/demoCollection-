/*
 * @Author: yrj
 * @Date: 2019-02-10 13:35:50
 * @Last Modified by: tj
 * @Last Modified time: 2021-03-22 14:35:55
 */

/**
 * @description 学院画像-基本数据组件（头）
 */

import React, { Fragment as F, useState, useEffect } from "react";
import SVG from "./../../../public/svg.js";
import ColorsPieEcharts from "./../public/ColorsPieEcharts.js";
import CollageNoData from "./collegeNoData";
import {realData} from './../scl_image/scl_public_function.js';
import Loading from "./loading";
export default function CollegeComPart1(props) {
  return (
    <div className="col_part1_box">
      <div className="part1_left">
        {props.checkProp ? (
          props.checkProp !== "loading" ? (
            <div className="left_info">
              <div>
                <div
                  style={
                    props.title_part1_headColor
                      ? { color: props.title_part1_headColor }
                      : {}
                  }
                >
                  {realData(props.normalProp) + "%"}
                </div>
                <div>{props.title_part1_l || "正常率"}</div>
              </div>
              <div>{props.checkProp ? props.checkProp.name : null}</div>
              <span>
                {/* //"imgUp" */}
                {props.checkProp ? (
                  props.checkProp.sortType === 1 ? (
                    <SVG type={"imgUp"} />
                  ) : 
                  props.checkProp.sortType === 2 ? (
                    <SVG type={"imgDown"} />
                  )
                  :null
                ) : null}
              </span>
              <span>
                {realData(props.checkProp.changeProp) + "%"}
              </span>
            </div>
          ) : (
            <Loading style={{ marginTop: "40px" }} />
          )
        ) : (
          <CollageNoData style={{ marginTop: "40px" }} />
        )}
      </div>
      <div className="part1_right">
        <div className="right_head">
          {props.title_part1_r || "考勤分布情况"}
        </div>
        <div className="right_info">
          {props.scaleData && props.scaleData.length ? (
            props.scaleData !== "loading" ? (
              <ColorsPieEcharts
                title={props.title_part1_l == '违纪率' ? '次' : '课程'} //title="人次" title="%"
                color={[
                    "#4ecb73",
                    "#eed46d",
                    "#f47a8f",
                    "#3aa1ff",
                    "#975fe5",
                    "#f66464",
                  ]} //每一个，对应scaleData对应下标的颜色
                other={props.other}
                type={props.pie_part1_type || 1} //  1 2 不传type 3种样式
                radius={[60, 75]}
                scaleData={props.scaleData}
                goRouter={props.goRouter}
              />
            ) : (
              <Loading />
            )
          ) : (
            <CollageNoData />
          )}
        </div>
      </div>
    </div>
  );
}
