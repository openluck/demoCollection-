/*
 * @Author: yrj
 * @Date: 2019-02-10 13:35:50
 * @Last Modified by: tj
 * @Last Modified time: 2020-07-30 13:18:05
 */

/**
 * @description 学院画像-学生互动模块
 */

import React, { Fragment as F, useState, useEffect } from "react";
import SVG from "./../../../public/svg.js";
import CollageNoData from "./collegeNoData";
import Loading from "./loading";

export default function CollegeInterPart1(props) {
  return (
    <div className="col_part1_box">
      <div className="part1_left">
      {  props.studentStandCont?props.studentStandCont!=="loading"?<div className="left_info">
          <div>
            <div style={{ color: "#000" }}>
              <i
                style={{
                  fontSize: "14px",
                  fontStyle: "normal"
                }}
              >
                平均
              </i>
              {props.studentStandNum || 0}
              <i
                style={{
                  fontSize: "14px",
                  fontStyle: "normal"
                }}
              >
                次/课程
              </i>
            </div>
            <div>学生起立</div>
          </div>
          <div>
            {props.studentStandCont
              ? props.studentStandCont.name || null
              : null}
          </div>
          <span>
            {/* //"imgUp" */}
            {props.studentStandCont ? (
              props.studentStandCont.sortType === 1 ? (
                <SVG type={"imgUp"} />
              ) : (
                <SVG type={"imgDown"} /> || null
              )
            ) : null}
          </span>
          <span>
            {" "}
            {props.studentStandCont
              ? props.studentStandCont.prop||'--' + "%"
              : null}
          </span>
        </div>:<Loading/>:<CollageNoData/>}
      </div>
      <div className="part1_left">
        { props.teacherPatrolCont? props.teacherPatrolCont!=="loading"?<div className="left_info">
          <div>
            <div style={{ color: "#000" }}>
              <i
                style={{
                  fontSize: "14px",
                  fontStyle: "normal"
                }}
              >
                平均
              </i>
              {props.teacherPatrolNum || 0}
              <i
                style={{
                  fontSize: "14px",
                  fontStyle: "normal"
                }}
              >
                次/课程
              </i>
            </div>
            <div>教师上下讲台</div>
          </div>
          <div>
            {" "}
            {props.teacherPatrolCont
              ? props.teacherPatrolCont.name || null
              : null}
          </div>
          <span>
            {/* //"imgUp" */}
            {props.teacherPatrolCont ? (
              props.teacherPatrolCont.sortType === 1 ? (
                <SVG type={"imgUp"} />
              ) : (
                <SVG type={"imgDown"} /> || null
              )
            ) : null}
          </span>
          <span>
            {props.teacherPatrolCont
              ? props.teacherPatrolCont.prop ||'--'+ "%" 
              : null}
          </span>
        </div>:<Loading/>:<CollageNoData/>}
      </div>
    </div>
  );
}
