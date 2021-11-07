/*
 * @Author: yrj
 * @Date: 2019-02-10 13:35:50
 * @Last Modified by: yrj
 * @Last Modified time: 2019-02-10 13:35:50
 */

/**
 * @description 学院画像-教学分析
 */

import React, { Fragment as F, useState, useEffect } from "react";
import CollegeComTeaAna_L from "./collegeComTeaAna_L";
import WaveLine from "./../public/waveLine";
import { OmitProps } from "antd/lib/transfer/renderListBody";
import CollageNoData from "./collegeNoData";
import Loading from "./loading";

export default function CollegeComTeaAna_Module(props) {
  return (
    <F>
      <div className="teaAna_con">
        <div className="teaAna_con_l">
          <CollegeComTeaAna_L
            title={props.title}
            pieTitle={props.pieTitle} //title="人次" title="%"
            pieColor={props.pieColor} //每一个，对应scaleData对应下标的颜色
            pieRadius={props.pieRadius}
            pieType={props.pieType} //  1 2 不传type 3种样式
            pieScaleData={props.pieScaleData}
          />
        </div>
        <div className="teaAna_con_r">
          {props.xData && props.yData?props.xData!=="loading"&&props.yData!=="loading"?<WaveLine
            legend={props.legend}
            lineColor={props.lineColor}
            xData={props.xData}
            yData={props.yData}
            type={props.type}
          />:<Loading/>:<CollageNoData/>}
        </div>
      </div>
    </F>
  );
}
