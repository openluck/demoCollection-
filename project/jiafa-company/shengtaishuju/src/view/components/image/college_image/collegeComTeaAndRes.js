/*
 * @Author: yrj
 * @Date: 2019-02-10 13:35:50
 * @Last Modified by: yrj
 * @Last Modified time: 2020-02-27 14:15:19
 */

/**
 * @description 学院画像-教研情况
 */

import React, { Fragment as F, useState, useEffect } from "react";
import CollegeComHead from "./collegeComHead";
import CollegeComDashEcharts from "./collegeComDashEcharts";
import CollegeComClu from "./collegeComClu";
export default function CollegeComTeaAndRes(props) {
  const [sortValue, setSortValue] = useState(1);
  function checkSort(value) {
    //设置sort
    setSortValue(value);
  }
  return (
    <F>
      {/* <CollegeComHead title={"教研情况"} /> */}
      <div className="teaAndRes_con">
        <div className="con_l">
          <div className="l_box">
            <div className="l_box_head">任务进度</div>
            <div className="l_box_echarts">
              <CollegeComDashEcharts data={33} pieColor={"rgb(24,144,255)"} />
            </div>
            <div className="l_box_bottom">已完成 20人次 {sortValue}</div>
            <div className="l_box_bottom">总任务量 120人次</div>
          </div>
        </div>
        <div className="con_l">
          <CollegeComClu
            title={"任务完成对比分析"}
            showTeaCheck={false}
            showTable={false}
            sort={sortValue}
            sortCallback={e => checkSort(e)}
            barData={{
              xData: [
                "数学学院",
                "数学学院",
                "数学学院",
                "数学学院",
                "数学学院",
                "数学学院",
                "数学学院",
                "数学学院"
              ], //x轴数据  Array
              yData: [20, 30, 10, 40, 50, 70, 40, 100] //y轴数据  Array
            }}
          />
        </div>
      </div>
    </F>
  );
}
