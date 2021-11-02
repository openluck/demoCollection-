/*
 * @Author: junjie.lean
 * @Date: 2021-01-18 10:16:05
 * @Last Modified by: yhc
 * @Last Modified time: 2021-04-28 17:07:52
 */

import React, { Fragment as F, useState, useEffect } from "react";
import {
  Button,
  Space,
  Switch,
  TimePicker,
  Modal,
  message as MessageNotify,
  Spin,
} from "antd";
import { useHistory } from "react-router-dom";
import moment from "moment";
import SVG from "./../../public/public-component-svg";
import { Plan } from "./dormPlan";
import { ExceptiveConfigDrawer } from "./dormDrawer";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import {
  getManageTime_request,
  updateManageState_request,
  updateManageTime_requeist,
  getManageRuleList_request,
  addManageRule_request,
  deleteManageRule_request,
} from "./../../../request/page-dorm/dormRule.request";

/**
 * @component
 */
export default (props) => {
  const history = useHistory();
  //在寝规则
  const [currentType, setCurrentType] = useState(1);
  const [switchLoading, setSwitchLoadingState] = useState(false);
  const [renderData, setRenderData] = useState({});
  const [renderResData, setRenderResData] = useState({});

  const [manageDataIsReady, setManageDataIsReady] = useState(false);
  const [exceptiveList, setExceptiveList] = useState([]);
  const [expectiveListDataIsReady, setExceptiveListDataIsReady] = useState(
    false
  );

  //人员组
  const [drawerState, setDrawerState] = useState(false);
  const [drawerChildState, setDrawerChildState] = useState(false);

  //设置例外
  const [exceptiveDrawerState, setExceptiveDrawerState] = useState(false);
  const [exceptiveDrawerChildState, setExceptiveDrawerChildState] = useState(
    false
  );

  const allowMaxExceptiveListLength = 8; //允许例外计划创建的最大条数
  const currentTypeString =
    currentType === 1
      ? "mornManage"
      : currentType === 2
      ? "noonManage"
      : currentType === 3
      ? "nightManage"
      : "";

  const currentTypeChineseString =
    currentType === 1
      ? "早寝"
      : currentType === 2
      ? "午寝"
      : currentType === 3
      ? "晚寝"
      : "";

  //管理计划的启停
  const switchChangeHandle = async (checked) => {
    const makeChange = async () => {
      setSwitchLoadingState(true);
      setRenderData({
        ...renderData,
        isUse: renderData.isUse === 1 ? 0 : 1,
      });
      await updateManageState(renderData.isUse === 1 ? 0 : 1);
      setSwitchLoadingState(false);
    };
    if (!checked) {
      if (parseInt(sessionStorage.firstNotic) !== 1) {
        Modal.confirm({
          title: "注意",
          icon: <ExclamationCircleOutlined />,
          content:
            "关闭当前规则时，会删除当前规则下所有计划设置，确认删除吗?",
          okText: "确认",
          cancelText: "取消",
          onOk() {
            makeChange();
            setExceptiveList([]); //将例外列表清除
            sessionStorage.firstNotic = 1;
          },
          onCancel() {
            return false;
          },
        });
        // sessionStorage.firstNotic = 1;
      } else {
        makeChange();
        setExceptiveList([]); //将例外列表清除
      }
    } else {
      sessionStorage.firstNotic = 2;
      await makeChange();
    }
  };

  //根据切换类型设置当前的渲染数据
  const setRenderDataByType = () => {
    setRenderData(renderResData[currentTypeString]);
  };

  //获取三项检查规则
  const getManageTime = async () => {
    const pr = {};
    // setManageDataIsReady(false);
    const manageTimeRes = await getManageTime_request(pr);
    const { code, message, result, data } = manageTimeRes;
    if (code === "200" && result) {
      setRenderResData(data);
      setRenderData(data[currentTypeString]);
    } else {
      MessageNotify.warning(message);
    }
    setManageDataIsReady(true);
  };

  //修改在寝检查规则状态
  const updateManageState = async (isUse) => {
    const pr = {
      ...renderData,
      isUse,
    };
    let submitUseState = await updateManageState_request(pr);
    const { code, message, result, data } = submitUseState;
    if (code === "200" && result) {
      await getManageTime();
    } else {
      MessageNotify.warning(message);
    }
  };

  //修改在寝检查规则时间
  const updateManageTime = async (time, type) => {
    let startTime = renderData?.checkStartTime;
    let endTime = renderData?.checkEndTime;

    let typeString = type === "startTime" ? "检查开始时间点" : "检查结束时间点";
    if (type === "startTime") {
      startTime = time;
      endTime = renderData?.checkEndTime ?? 0;
      if (startTime > endTime) {
        // console.log(startTime, endTime);
        MessageNotify.warning("开始时间应当小于结束时间!");
        return false;
      }
    } else {
      startTime = renderData?.checkStartTime ?? 0;
      endTime = time;

      // console.log(startTime, endTime);
      if (endTime < startTime) {
        MessageNotify.warning("结束时间应当大于开始时间!");
        return false;
      }
    }

    let pr = {
      ruleType: currentType,
      checkStartTime: startTime,
      checkEndTime: endTime,
    };

    let opt = {
      ...renderResData,
    };

    opt[currentTypeString] = {
      ...opt[currentTypeString],
      ...pr,
    };
    setRenderResData(opt);
    setRenderData({
      ...renderData,
      ...pr,
    });
    const updataTimeRes = await updateManageTime_requeist(pr);

    const { code, message, data, result } = updataTimeRes;
    if (code === "200" && result) {
      MessageNotify.success(
        `设置全校${currentTypeChineseString}${typeString}成功!`
      );
      await getManageTime();
    } else {
      MessageNotify.warning(message);
      await getManageTime();
    }
  };

  //获取例外设置列表
  const getExceptListData = async (ruleType = currentType) => {
    const pr = {
      ruleType,
    };
    setExceptiveListDataIsReady(false);
    const exceptListRes = await getManageRuleList_request(pr);
    const { code, result, data, message } = exceptListRes;
    if (code === "200" && result) {
      // console.log(data);
      setExceptiveList(data?.managePlanList ?? []);
    } else {
      MessageNotify.warning(message);
    }
    setExceptiveListDataIsReady(true);
  };

  //添加额外计划
  const addExceptList = async (ruleType = currentType) => {
    const pr = {
      ruleType,
    };
    if (exceptiveList.length === allowMaxExceptiveListLength) {
      MessageNotify.warning(
        "最多只允许创建" + allowMaxExceptiveListLength + "条例外计划!"
      );
      return false;
    }
    const addManageRuleRes = await addManageRule_request(pr);
    const { code, result, data, message } = addManageRuleRes;
    if (code === "200" && result) {
      await getExceptListData();
    } else {
      MessageNotify.warning(message);
    }
  };

  //删除例外计划
  const deleteExceptItem = async (planId) => {
    const pr = {
      planId,
    };
    const deleteRes = await deleteManageRule_request(pr);
    const { code, result, message } = deleteRes;
    if (code === "200" && result) {
      await getExceptListData();
    } else {
      MessageNotify.warning(message);
    }
  };

  useEffect(() => {
    setRenderDataByType(currentType);
    getExceptListData(currentType);
  }, [currentType]);

  useEffect(() => {
    getManageTime();
    getExceptListData();
  }, []);

  return (
    <div className="lean-dromrule-container">
      <div className="lean-dormrule-header">
        <span style={{ fontSize: 20 }}>自动化在寝检查规则</span>
        <Button
          type="primary"
          onClick={() => {
            history.push("/home/dorm/dormRule/person");
          }}
          style={{ borderRadius: 4 }}
        >
          去设置人员组
        </Button>
        {/* <PersonGroupDrawer
          drawerState={drawerState}
          setDrawerState={setDrawerState}
          drawerChildState={drawerChildState}
          setDrawerChildState={setDrawerChildState}
        /> */}
      </div>

      <div className="lean-dormrule-manageContent">
        <div className="lean-dormrule-manageButton">
          <Space size={0}>
            <Button
              type={currentType === 1 ? "primary" : ""}
              onClick={() => {
                setCurrentType(1);
              }}
            >
              早寝管理
            </Button>
            <Button
              type={currentType === 2 ? "primary" : ""}
              onClick={() => {
                setCurrentType(2);
              }}
            >
              午寝管理
            </Button>
            <Button
              type={currentType === 3 ? "primary" : ""}
              onClick={() => {
                setCurrentType(3);
              }}
            >
              晚寝管理
            </Button>
          </Space>

          <div className="lean-dormrule-manageSet">
            {manageDataIsReady && renderData !== undefined ? (
              <F>
                <div>
                  <span style={{ marginRight: 15 }}>
                    {currentTypeChineseString}管理
                  </span>
                  <Switch
                    checkedChildren="启用"
                    unCheckedChildren="关闭"
                    checked={renderData?.isUse === 1}
                    onChange={switchChangeHandle}
                    loading={switchLoading}
                  />
                </div>
                <div
                  style={{ marginTop: 15, color: "#a7abae", marginBottom: 15 }}
                >
                  时间点设置必须在{currentTypeChineseString}管理时间范围内
                </div>
                <div>
                  <div style={{ display: "inline-block", marginRight: 20 }}>
                    <span>全校{currentTypeChineseString}检查开始时间点：</span>
                    <TimePicker
                      inputReadOnly
                      type="time"
                      showNow={false}
                      allowClear={false}
                      style={{ width: 168 }}
                      value={moment(renderData?.checkStartTime)}
                      disabled={renderData?.isUse === 0}
                      getPopupContainer={(trigger) => trigger.parentNode}
                      onChange={(v) => {
                        let unixTime = new Date(v).getTime();
                        updateManageTime(unixTime, "startTime");
                      }}
                    />
                  </div>
                  <div style={{ display: "inline-block" }}>
                    <span>全校{currentTypeChineseString}检查结束时间点：</span>
                    <TimePicker
                      inputReadOnly
                      type="time"
                      showNow={false}
                      allowClear={false}
                      style={{ width: 168 }}
                      value={moment(renderData?.checkEndTime)}
                      getPopupContainer={(trigger) => trigger.parentNode}
                      disabled={renderData?.isUse === 0}
                      onChange={(v) => {
                        let unixTime = new Date(v).getTime();
                        updateManageTime(unixTime, "endTime");
                      }}
                    />
                  </div>
                </div>
              </F>
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Spin tip="数据正在加载..."></Spin>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="lean-dormrule-exceptiveList">
        <div className="lean-dormrule-exceptiveList-header">
          <SVG
            type="shezhikaobei3"
            style={{ fill: "#2d8ae6", marginRight: 10 }}
          />
          <span
            style={{ color: "#2d8ae6", cursor: "pointer" }}
            onClick={() => {
              setExceptiveDrawerState(true);
            }}
          >
            设置例外
          </span>
          <ExceptiveConfigDrawer
            drawerState={exceptiveDrawerState}
            setDrawerState={setExceptiveDrawerState}
            drawerChildState={exceptiveDrawerChildState}
            setDrawerChildState={setExceptiveDrawerChildState}
          />
        </div>
        <div className="lean-dormrule-exceptiveList-content">
          {expectiveListDataIsReady ? (
            <F>
              {exceptiveList.map((item, index) => {
                return (
                  <Plan
                    th={index}
                    key={index}
                    data={item}
                    currentType={currentType}
                    currentTypeChineseString={currentTypeChineseString}
                    currentRenderData={renderData}
                    deleteExceptItem={deleteExceptItem}
                    getExceptListData={getExceptListData}
                  />
                );
              })}

              {exceptiveList.length === allowMaxExceptiveListLength ? (
                ""
              ) : (
                <div
                  className="lean-dormrule-exceptiveList-addPlan"
                  onClick={() => {
                    addExceptList();
                  }}
                >
                  <SVG
                    type="tianjiarenyuan"
                    style={{ width: 35, height: 35, fill: "inherit" }}
                  />
                  <div style={{ marginTop: 5, color: "inherit" }}>
                    添加在寝管理计划
                  </div>
                </div>
              )}
            </F>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                width: "100%",
                minHeight: 350,
              }}
            >
              <Spin tip="数据正在加载..." />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
