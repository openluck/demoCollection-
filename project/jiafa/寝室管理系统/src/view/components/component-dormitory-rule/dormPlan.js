/*
 * @Author: junjie.lean
 * @Date: 2021-02-05 15:23:00
 * @Last Modified by: yhc
 * @Last Modified time: 2021-04-28 15:58:17
 */

import React, { Fragment as F, useState, useEffect } from "react";
import { Button, TimePicker, message as MessageNotify,Modal } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import SVG from "./../../public/public-component-svg";
import { ExceptivePlanDrawer, ExceptivePersonGroupDrawer } from "./dormDrawer";
import { updateManagePlan_request } from "./../../../request/page-dorm/dormRule.request";
import moment from "moment";
//额外设置列表
export const Plan = (props) => {
  const {
    th,
    data,
    currentTypeChineseString,
    deleteExceptItem,
    getExceptListData,
  } = props;

  const [dailyPlanDrawserState, setDailyPlanDrawerState] = useState(false);
  const [personGroupDrawerState, setPersonGroupDrawerState] = useState(false);
  const [
    personGroupChildDrawerState,
    setPersonGroupChildDrawerState,
  ] = useState(false);

  const updateTime = async (timeNumber, timeType) => {
    const pr = {
      ...data,
      [timeType]: timeNumber,
    };
    const updateTimeRes = await updateManagePlan_request(pr);
    const { message, code, result } = updateTimeRes;
    if (code === "200" && result) {
      MessageNotify.success("修改时间成功!");
      await getExceptListData();
    } else {
      MessageNotify.warning(message);
    }
  };

  useEffect(() => {
    // console.log(th);
    // console.log(data);
    // console.log(currentType);
    // console.log(currentRenderData);
  }, []);

  return (
    <div className="lean-dormrule-exceptiveList-planItem">
      <div
        className="lean-dormrule-exceptiveList-deletebtn"
        onClick={() => {
          Modal.confirm({
            title:'计划删除',
            content:'确认删除该在寝管理计划吗？',
            onOk:()=>{deleteExceptItem(data.planId);},
            className:'yhc-modal-marginTop'
          })
        }}
      >
        <CloseOutlined />
      </div>

      <span className="lean-dormrule-exceptiveList-planItem-flags">
        <SVG
          type="xiebiaoqian"
          fill="#2d8ae6"
          style={{ width: 60, height: 60 }}
        />
        <span>计划{th - 0 + 1}</span>
      </span>
      <div className="lean-dormrule-exceptiveList-planItem-times">
        <div>
          <span>{currentTypeChineseString}检查时间点：</span>
          {/* PS: 时间检查点后端给的字段名有歧义 */}
          <TimePicker
            type="time"
            showNow={false}
            allowClear={false}
            value={moment(data?.nightCheckPoint)}
            style={{ width: 168 }}
            getPopupContainer={(trigger) => trigger.parentNode}
            onChange={(v) => {
              // console.log()
              updateTime(moment(v).unix() * 1000, "nightCheckPoint");
            }}
          />
        </div>
        <div>
          <span>{currentTypeChineseString}晚出检查时间点：</span>
          {/* PS: 时间检查点后端给的字段名有歧义 */}
          <TimePicker
            type="time"
            showNow={false}
            allowClear={false}
            value={moment(data?.mornCheckPoint)}
            style={{ width: 168 }}
            getPopupContainer={(trigger) => trigger.parentNode}
            onChange={(v) => {
              updateTime(moment(v).unix() * 1000, "mornCheckPoint");
            }}
          />
        </div>
      </div>
      <div className="lean-dormrule-exceptiveList-planItem-times">
        <div>
          <p style={{ marginBottom: 0 }}>
            <SVG
              type="riqikaobei2"
              fill="#2d8ae6"
              style={{ width: 20, height: 20, marginRight: 5 }}
            />
            <span>日常计划</span>
            {data.currentState === 0 ? (
              <F>
                <span className="lean-dormrule-exceptiveList-planState-0">
                  已过期
                </span>
              </F>
            ) : data.currentState === 1 ? (
              <F>
                <span className="lean-dormrule-exceptiveList-planState-1">
                  进行中
                </span>
              </F>
            ) : data.currentState === 2 ? (
              <F>
                <span className="lean-dormrule-exceptiveList-planState-2">
                  未开始
                </span>
              </F>
            ) : (
              ""
            )}
          </p>
          <p>
            设置应用时间计划：
            <Button
              type="link"
              style={{ padding: 5 }}
              onClick={() => {
                setDailyPlanDrawerState(true);
              }}
            >
              时间计划
            </Button>
          </p>
          <ExceptivePlanDrawer
            renderData={data}
            drawerState={dailyPlanDrawserState}
            getExceptListData={getExceptListData}
            setDrawerState={setDailyPlanDrawerState}
          />
        </div>
        <div>
          <p
            className="lean-dormrule-exceptiveList-detial"
            style={{ marginBottom: 0 }}
          >
            <SVG
              type="renyuanzu"
              fill="#2d8ae6"
              style={{ width: 20, height: 20, marginRight: 5 }}
            />
            <span>人员范围</span>
          </p>
          <p>
            设置应用人员群体：
            <Button
              type="link"
              style={{ padding: 5 }}
              onClick={() => {
                setPersonGroupDrawerState(true);
              }}
            >
              人员组设置
            </Button>
          </p>
          <ExceptivePersonGroupDrawer
            renderData={data}
            drawerState={personGroupDrawerState}
            getExceptListData={getExceptListData}
            setDrawerState={setPersonGroupDrawerState}
            drawerChildState={personGroupChildDrawerState}
            setDrawerChildState={setPersonGroupChildDrawerState}
          />
        </div>
      </div>
      
    </div>
  );
};
