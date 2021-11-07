/*
 * @Author: yrj
 * @Date: 2019-02-10 13:35:50
 * @Last Modified by: yrj
 * @Last Modified time: 2019-02-10 13:35:50
 */

/**
 * @description 学院画像-教学分析-左侧
 */

import React, { Fragment as F, useState, useEffect } from "react";
import ColorsPieEcharts from "./../public/ColorsPieEcharts";
import CollageNoData from "./collegeNoData";
import Loading from "./loading";

export default function CollegeComTeaAna_L(props) {
  return (
    <F>
      <div className="TeaAna_L_head">{props.title}</div>
      <div className="TeaAna_L_head_echarts">
        {console.log( props.pieScaleData)}
       {props.pieScaleData? props.pieScaleData!=="loading"?<ColorsPieEcharts
          title={props.pieTitle} //title="人次" title="%"
          color={props.pieColor} //每一个，对应scaleData对应下标的颜色
          radius={props.pieRadius}
          type={props.pieType} //  1 2 不传type 3种样式
          scaleData={props.pieScaleData}
        />:<Loading/>:<CollageNoData/>}
      </div>
    </F>
  );
}
