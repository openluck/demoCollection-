/*
 * @Author: yrj
 * @Date: 2019-02-10 13:35:50
 * @Last Modified by: kyl
 * @Last Modified time: 2021-01-22 09:57:56
 */

/**
 * @description 学院画像-通用柱状图
 */

import React, { Fragment as F, useState, useEffect } from "react";
import SVG from "./../../../public/svg.js";
import Tea_btm_cont from "./../public/tea_btm_cont";
import CollageNoData from "./collegeNoData";
import Loading from "./loading";
export default function CollegeComClu(props) {
  // const [sortValue, setSortValue] = useState(props.sort||1);
  // const [tablueOn, setTablueOn] = useState(0);
  const tableList = ["正常", "迟到", "早退", "缺勤", "调换课", "请假"];
  return (
    <F>
      <div className="clu_head">
        <span>
          {props.title}
        </span>
        <span className="sort_svg">
          <SVG
            type={"de_sort3"}
            color={props.sort !== '0' ? "#1890ff" : "#a1adb3"}
            onClick={() => {
              if (props.sortCallback) {
                props.sortCallback('1');
              }
            }}
          />
          <SVG
            type={"de_sort2"}
            color={props.sort == '0' ? "#1890ff" : "#a1adb3"}
            onClick={() => {
              if (props.sortCallback) {
                props.sortCallback('0');
              }
            }}
          />
        </span>
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
              教师上下讲台
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
        {
          props.barData == 'loading' ?
            <Loading /> :
            props.barData ?
              <Tea_btm_cont barData={props.barData}
                barType={props.showTeaCheck ? "hd" : null}

              /> :
              <CollageNoData />
        }
        {/* {props.barData ? (
          props.barData !== "loading" ? (
            <Tea_btm_cont barData={props.barData} />
          ) : (
            <Loading />
          )
        ) : (
          <CollageNoData />
        )} */}
      </div>
    </F>
  );
}
