/*
 * @Author: yrj
 * @Date: 2019-02-10 13:35:50
 * @Last Modified by: kyl
 * @Last Modified time: 2021-01-22 10:27:24
 */

/**
 * @description 学院画像-通用线图
 */

import React, { Fragment as F, useState, useEffect } from "react";
import SVG from "./../../../public/svg.js";
import XqLine from "./../public/xqLine.js";
import { Select } from "antd";
import CollageNoData from "./collegeNoData";
import Loading from "./loading";
const { Option } = Select;

export default function CollegeComLine(props) {
  // const [teaCheckOn, setTeaCheckOn] = useState(0);
  // const [tablueOn, setTablueOn] = useState(0);
  const tableList = ["正常", "迟到", "早退", "缺勤", "调换课", "请假"];
  // function selectChageOne(e,option) {
  //   console.log('gagaga',e)
  //   if (props.idCallBackOne) {
  //     props.idCallBackOne(e,option);
  //   }
  // }
  // function selectChageTwo(e,option) {
  //   if (props.idCallBackTwo) {
  //     props.idCallBackTwo(e,option);
  //   }
  // }

  function selectChange(v, ind) {
    props.idCallBack(v, ind)
    // if(ind === 1) {
    //   props.idCallBackOne(v,1);
    // } else if(ind === 2) {
    //   props.idCallBackTwo(v,2);
    // }
  }
  // useEffect(()=>{
  //   console.log(props)
  // })
  return (
    <F>
      <div className="clu_head" style={{ marginTop: "20px" }}>
        <span>{props.title}</span>

        <div className="selectbox" id="selectbox">
          <div
            style={{
              height: "40px",
              lineHeight: "30px",
              width: "50px"
            }}
          >
            全部
          </div>
          &nbsp;&nbsp;&nbsp;<div className="vs"></div>&nbsp;&nbsp;&nbsp;
          <Select
            value={props.collegeIdOne}
            placeholder='请选择'
            onChange={(v) => selectChange(v, 1)}
            style={{ width: 120 }}
            getPopupContainer={() => document.getElementById("selectbox")}
          >
            {props.selectList ? props.selectList.map((v, k) => (
              <Option key={k} disabled={props.collegeIdTwo == v.courseId ? true : false} value={v.courseId}>{v.courseName}</Option>
            )) : null}

          </Select>
          &nbsp;&nbsp;&nbsp;<div className="vs"></div>&nbsp;&nbsp;&nbsp;
          <Select
            value={props.collegeIdTwo}
            placeholder='请选择'
            onChange={(v) => selectChange(v, 2)}
            style={{ width: 120 }}
            getPopupContainer={() => document.getElementById("selectbox")}
          >
            {props.selectList ? props.selectList.map((v, k) => (
              <Option key={k} disabled={props.collegeIdOne == v.courseId ? true : false} value={v.courseId}>{v.courseName}</Option>
            )) : null}
          </Select>
        </div>
        {props.showTeaCheck ? (
          <div className="teaCheck">
            <li
              onClick={() => {
                if (props.checkCallback) {
                  props.checkCallback(1);
                }
              }}
              className={props.checkType === 1 ? "teaCheckOn" : null}
            >
              学生起立
            </li>
            <li
              onClick={() => {
                if (props.checkCallback) {
                  props.checkCallback(2);
                }
              }}
              className={props.checkType === 2 ? "teaCheckOn" : null}
            >
              教师走下讲台
            </li>
          </div>
        ) : null}
        {props.showTable ? (
          <ul className="checkTable">
            {tableList.map((item, key) => (
              <span
                key={key}
                onClick={() => {
                  if (props.checkCallback) {
                    props.checkCallback(key + 1);
                  }
                }}
                className={props.checkType === key + 1 ? "tableOnClick" : ""}
              >
                {item}
              </span>
            ))}
          </ul>
        ) : null}
      </div>
      <div className="clu_con">
        {props.xData &&
          props.data &&
          props.xData.length &&
          props.data.length ? (
            <XqLine
              yName={props.yName || ''}
              color={props.color}
              xData={props.xData}
              data={props.data}
              type={props.timeType}
              max={props.max}
            />

          ) :
          props.loading ?
            (
              <Loading />
            ) :
            (
              <CollageNoData />
            )}
      </div>
    </F>
  );
}
