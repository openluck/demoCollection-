/*
 * @Author: yrj
 * @Date: 2019-02-10 13:35:50
 * @Last Modified by: tj
 * @Last Modified time: 2020-07-30 13:17:11
 */

/**
 * @description 学院画像-学院画像-基本数据组件（尾）
 */

import React, { Fragment as F, useState, useEffect } from "react";
import ColorsPieEcharts from "./../public/ColorsPieEcharts.js";
import CollageNoData from "./collegeNoData";
import Loading from "./loading";

export default function CollegeComBottom(props) {
  return (
    <F>
      <div className="clu_head" style={{ marginTop: "30px" }}>
        <span>{props.title}</span>
      </div>
      <div className="f_clu_head">
        <span>{props.ftitle_l}</span>
        <span>{parseInt(props.tobig) || 0}</span>
        <span>{props.ftitle_r}</span>
      </div>
      <div className="bottom_box">
        <div className="bottom_box_l">
          <div className="head">课程分布</div>
          <div className="echarts_box">
            {props.classPie && props.classPie.length ? (
              props.classPie !== "loading" ? (
                <ColorsPieEcharts
                  title="课程" //title="人次" title="%"
                  titleSize={16}
                  titleSubSize={10}
                  other={5}
                  color={[
                    "#e7ad66",
                    "#ebcd54",
                    "#a294f4",
                    "#56bbee",
                    "#7bd9e3",
                    "#7ba7e3",
                    "#ebe954"
                  ]} //每一个，对应scaleData对应下标的颜色
                  type={2} //  1 2 不传type 3种样式
                  radius={[45, 55]}
                  scaleData={props.classPie}
                />
              ) : (
                <Loading />
              )
            ) : (
              <CollageNoData />
            )}
          </div>
        </div>
        <div className="bottom_box_l">
          <div className="head">教师分布</div>
          <div className="echarts_box">
            {props.teacherPie && props.teacherPie.length ? (
              props.teacherPie !== "loading" ? (
                <ColorsPieEcharts
                  title="课程" //title="人次" title="%"
                  titleSize={5}
                  titleSubSize={5}
                  other={5}
                  color={[
                    "#e7ad66",
                    "#ebcd54",
                    "#a294f4",
                    "#56bbee",
                    "#7bd9e3",
                    "#7ba7e3",
                    "#ebe954"
                  ]} //每一个，对应scaleData对应下标的颜色
                  // "#00ffff",
                  //   "#00cfff",
                  //   "#006ced",
                  //   "#ffe000",
                  //   "#ffa800",
                  //   "#ff5b00",
                  //   "#ff3000"
                  type={2} //  1 2 不传type 3种样式
                  radius={[45, 55]}
                  scaleData={props.teacherPie}
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
    </F>
  );
}
