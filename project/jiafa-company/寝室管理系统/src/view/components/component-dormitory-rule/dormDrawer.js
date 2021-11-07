/*
 * @Author: junjie.lean
 * @Date: 2021-02-05 15:23:00
 * @Last Modified by: yhc
 * @Last Modified time: 2021-04-28 15:57:01
 */

import React, { Fragment as F, useState, useEffect } from "react";
import {
  Button,
  Space,
  Drawer,
  DatePicker,
  Select,
  Table,
  Input,
  message as MessageNotify,
  Spin,
  Checkbox,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { PaginationPonent } from "./../common";
import moment from "moment";
import lodash from "lodash";
import { useHistory } from "react-router-dom";
import {
  getPersonGroupList_request,
  deletePersonGroup_request,
  getGroupDetail_request,
  submitGroupDetial_request,
  getDefaultGroupData_request,
  getExceptiveList_request,
  getManagePlanDetail_request,
  addExceptive_request,
  updateManagePlan_request,
  deleteExceptive_request,
} from "./../../../request/page-dorm/dormRule.request";
import SVG from "./../../public/public-component-svg";

/**
 * @description 例外计划日期设置
 * @constructor
 * @param {Boolean} drawerState 抽屉显隐状态控制
 * @param {Function} setDrawerState 抽屉显隐状态控制函数
 * @param {Object} renderData 当前渲染数据
 * @param {Function} getExceptListData 获取例外列表的函数
 * @return {FunctionComponent}   例外计划日期设置函数组件
 */
export const ExceptivePlanDrawer = ({
  drawerState,
  setDrawerState,
  renderData,
  getExceptListData,
  ...props
}) => {
  const [timeRangeArr, setTimeRangeArr] = useState([
    renderData?.invokeStartDate,
    renderData?.invokeEndDate,
  ]);
  const [invokeWeek, setInvokeWeek] = useState(renderData.invokeWeek ?? []);

  /**
   * @description 初始化第一级抽屉的函数,
   * @function initDrawer
   * @return void
   */
  const initDrawer = () => {
    // setInvokeWeek([]);
    setTimeRangeArr([renderData?.invokeStartDate, renderData?.invokeEndDate]);
  };

  const weekOptions = [
    {
      label: "星期一",
      value: 1,
    },
    {
      label: "星期二",
      value: 2,
    },
    {
      label: "星期三",
      value: 3,
    },
    {
      label: "星期四",
      value: 4,
    },
    {
      label: "星期五",
      value: 5,
    },
    {
      label: "星期六",
      value: 6,
    },
    {
      label: "星期天",
      value: 7,
    },
  ];

  /**
   * @description 修改例外计划函数
   * @async
   * @function modifyExceptivePlan
   * @return void
   */
  const modifyExceptivePlan = async () => {
    const pr = {
      ...renderData,
      invokeStartDate: timeRangeArr[0],
      invokeEndDate: timeRangeArr[1],
      invokeWeek,
    };
    // MessageNotify.warn('缺少时间或周期，该计划无法生效')
    const modifyRes = await updateManagePlan_request(pr);
    const { message, result, code } = modifyRes;
    if (code === "200" && result) {
      if(pr.invokeStartDate && pr.invokeEndDate && invokeWeek.length){
        MessageNotify.success("设置时间范围成功!");
      }
      else{
        MessageNotify.warn('缺少时间或周期，该计划无法生效')
      }
      initDrawer();
      getExceptListData();
      setTimeout(() => {
        setDrawerState(false);
      }, 200);
    } else {
      MessageNotify.warning(message);
    }
  };

  return (
    <Drawer
      closable
      width={750}
      title={"时间计划设置"}
      maskClosable={false}
      visible={drawerState}
      onClose={() => {
        initDrawer();
        setDrawerState(false);
      }}
    >
      <div style={{ postion: "relative" }}>
        <span className="lean-dromrule-verticalLine-icon">时间范围</span>
        <hr className="lean-dromrule-splitLine-icon" />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 40,
            marginBottom: 100,
          }}
        >
          <span style={{ width: 120, textAlign: "right" }}>选择日期范围：</span>

          <DatePicker.RangePicker
            allowClear={false}
            value={timeRangeArr?.map((item) => {
              return item ? moment(item) : null;
            })}
            style={{ width: 500 }}
            format={"YYYY-MM-DD"}
            onChange={(A) => {
              let V = A.map((item) => moment(item).unix() * 1000);
              setTimeRangeArr(A);
            }}
          />
        </div>
        <span className="lean-dromrule-verticalLine-icon">应用周期</span>
        <hr className="lean-dromrule-splitLine-icon" />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 20,
          }}
        >
          <Checkbox.Group
            value={invokeWeek}
            style={{ marginTop: 20 }}
            options={weekOptions}
            onChange={(v) => {
              setInvokeWeek(v);
            }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 20,
            paddingTop: 20,
            borderTop: "1px solid #e3e4e4",
            display: "flex",
            width: "100%",
            justifyContent: "center",
          }}
        >
          <Space size={10}>
            <Button
              type="primary"
              onClick={() => {
                modifyExceptivePlan();
              }}
            >
              保存
            </Button>
            <Button
              onClick={() => {
                initDrawer();
                setDrawerState(false);
              }}
            >
              取消
            </Button>
          </Space>
        </div>
      </div>
    </Drawer>
  );
};

/**
 * @description 例外计划中的人员组设置抽屉
 * @class
 * @component
 * @param {Boolean} drawerState 主抽屉显隐状态控制
 * @param {Function} setDrawerState 主抽屉显隐状态控制函数
 * @param {Boolean} drawerChildState 子抽屉显隐状态控制
 * @param {Function} setDrawerChildState 子抽屉显隐状态控制函数
 * @param {Function} getExceptListData 获取例外列表的函数
 * @param {Object} renderData  当前渲染数据
 * @return {FunctionComponent} 例外计划中的人员组设置抽屉
 */
export const ExceptivePersonGroupDrawer = ({
  drawerState,
  setDrawerState,
  drawerChildState,
  setDrawerChildState,
  getExceptListData,
  renderData,
}) => {
  //一级抽屉
  const [dataSource, setDataSource] = useState([]);
  const [selectedRowKeys, setSelectRowKeys] = useState(
    renderData?.invokePersonGroup ?? []
  );
  const [tableIsRequest, setTableRequestState] = useState(false);

  //二级抽屉
  const [currentData, setCurrentData] = useState({});
  const [detialIsReady, setDetialReadyState] = useState({});
  const [detialData, setDetialData] = useState({});

  const initPrimaryDrawer = () => {
    setSelectRowKeys([]);
    setTableRequestState(false);
  };

  const columns = [
    {
      title: "人员组名称",
      dataIndex: "groupName",
      key: "groupName",
    },
    {
      title: "人员",
      render(_, record) {
        return (
          <Button
            type="link"
            onClick={() => {
              setCurrentData(record);
              setDrawerChildState(true);
            }}
          >
            查看班级名单
          </Button>
        );
      },
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange(selectedRowKeys, selectedRows) {
      setSelectRowKeys(selectedRowKeys);
    },
    getCheckboxProps(record) {
      // console.log(record);
      return {
        disabled: record.isSelective === 0, //禁用不可选的数据
        // disabled: 0 === 0,
      };
    },
  };

  /**
   * 获取人员组的列表
   * @async
   * @function
   */
  const getTableData = async () => {
    const { ruleType, planId } = renderData;
    let pr = {
      pageSize: -1, //和后端约定,-1查所有
      pageIndex: 1,
      ruleType,
      planId,
    };

    setTableRequestState(true);
    const personGroupListRes = await getPersonGroupList_request(pr);
    const { message, data, code, result } = personGroupListRes;

    if (code === "200" && result) {
      setDataSource(
        data?.groupList?.map((item, index) => ({
          ...item,
          key: item?.groupId ?? index.toString(),
        })) ?? []
      );
      setSelectRowKeys(renderData?.invokePersonGroup ?? []);
    } else {
      MessageNotify.warning(message);
    }

    setTableRequestState(false);
  };

  //提交修改数据
  const updateManagePlan = async () => {
    const pr = {
      ...renderData,
      invokePersonGroup: selectedRowKeys,
    };

    const updateRes = await updateManagePlan_request(pr);
    const { message, result, code, data } = updateRes;
    if (code === "200" && result) {
      if(pr.invokePersonGroup.length){
        MessageNotify.success("修改成功");
      }
      else{
        MessageNotify.warn('未选择人员组或人员组为空')
      }
      getExceptListData();
      setTimeout(() => {
        setDrawerState(false);
      }, 200);
    } else {
      MessageNotify.warning(message);
    }
  };

  //获取组详情信息
  const getGroupDetail = async () => {
    const pr = {
      groupId: currentData.groupId,
    };
    setDetialReadyState(false);
    const detialRes = await getGroupDetail_request(pr);
    const { code, message, result, data } = detialRes;
    if (code === "200" && result) {
      setDetialData(data);
      //  console.log(data);
    } else {
      MessageNotify.warning(message);
    }
    setDetialReadyState(true);
  };

  useEffect(() => {
    if (drawerState) {
      // console.log(renderData)
      getTableData();
    }
  }, [drawerState]);

  useEffect(() => {
    if (drawerChildState) {
      getGroupDetail();
    }
  }, [drawerChildState]);

  return (
    <Drawer
      closable
      width={600}
      title={"人员组设置"}
      maskClosable={false}
      visible={drawerState}
      onClose={() => {
        initPrimaryDrawer();
        setDrawerState(false);
      }}
    >
      <div>
        <Table
          bordered
          loading={tableIsRequest}
          columns={columns}
          dataSource={dataSource}
          scroll={{ y: 650 }}
          rowSelection={rowSelection}
          pagination={false}
        />
        <div
          style={{ marginTop: 20, display: "flex", justifyContent: "center" }}
        >
          <Space size={10}>
            <Button
              type="primary"
              onClick={() => {
                updateManagePlan();
              }}
            >
              保存
            </Button>
            <Button
              onClick={() => {
                setDrawerState(false);
                initPrimaryDrawer();
              }}
            >
              取消
            </Button>
          </Space>
        </div>
        <Drawer
          closable
          width={530}
          title={"人员组设置"}
          maskClosable={false}
          visible={drawerChildState}
          onClose={() => {
            // initPrimaryDrawer();
            setDrawerChildState(false);
          }}
        >
          <div>
            <span className="lean-dromrule-verticalLine-icon">人员组</span>
            <hr className="lean-dromrule-splitLine-icon" />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "20px 0",
              }}
            >
              <span>人员组名称：</span>
              <span>{currentData?.groupName ?? "未设置"}</span>
            </div>

            <span className="lean-dromrule-verticalLine-icon">人员选择</span>
            <hr className="lean-dromrule-splitLine-icon" />
            <div>
              {detialIsReady ? (
                <F>
                  <div>
                    <p>适用年级</p>
                    {detialData?.gradeList
                      ?.filter((item) => item.isUse === 1)
                      ?.map((item, index) => (
                        <p
                          key={item?.gradeId ?? index.toString()}
                          style={{ paddingLeft: 4 }}
                        >
                          {item?.gradeName}
                        </p>
                      ))}
                  </div>
                  <div>
                    <p>适用班级</p>
                    {detialData?.classList
                      ?.filter((item) => item.isUse === 1)
                      ?.map((item, index) => (
                        <p key={item?.classId ?? index.toString()}>
                          {item?.className}
                        </p>
                      ))}
                  </div>
                </F>
              ) : (
                <div>
                  <Spin tip="请求数据中..." />
                </div>
              )}
            </div>
          </div>
        </Drawer>
      </div>
    </Drawer>
  );
};

/**
 * @description 人员组抽屉,修改为人员组页面
 * @class
 * @component
 * @return {FunctionComponent} React.Component 人员组抽屉
 */
export const PersonGroupDrawer = (props) => {
  const history = useHistory();
  //第一层抽屉展示框的数据：
  const [createOrReview, setChildDrawerEditState] = useState("");
  const [selectRows, setSelectRows] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [tableRequestState, setTableRequestState] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [requestTrigger, setRequestTrigger] = useState(0);

  //第二层抽屉，新建或编辑人员组展示框的数据：
  const [interactionIsReady, setInteractionStateReady] = useState(false);
  const [currentEditId, setCurrentEditId] = useState("");
  const [currentEditName, setCurrentEditName] = useState("");
  const [renderGradeList, setRenderGradeList] = useState([]);
  const [renderClassList, setRenderClassList] = useState([]);
  const [currentSelectGradeList, setCurrentSelectGradeList] = useState([]);
  const [currentSelectClassList, setCurrentSelectClassList] = useState([]);
  const [isSubmitLoading, setSubmitLoadingState] = useState(false);

  const [drawerChildState, setDrawerChildState] = useState(false);

  const pageChange = (index) => {
    setPageIndex(index);
  };

  const columns = [
    {
      title: "人员组名称",
      dataIndex: "groupName",
      key: "groupName",
    },
    {
      title: "操作",
      width: 100,
      align: "center",
      render(_, record) {
        return (
          <Button
            type="link"
            onClick={() => {
              // console.log(record);
              setDrawerChildState(true);
              setChildDrawerEditState("edit");
              setCurrentEditId(record.groupId);
              setCurrentEditName(record.groupName);
            }}
          >
            编辑
          </Button>
        );
      },
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectRows(selectedRows);
    },
  };

  //请求人员组的函数
  const getTableData = async () => {
    const pr = {
      pageSize,
      pageIndex,
    };
    setTableRequestState(true);
    const personGroupList = await getPersonGroupList_request(pr);
    const { code, message, data, result } = personGroupList;
    if (code === "200" && result) {
      const renderData = data?.groupList ?? [];
      const renderTotal = data?.total ?? 0;
      setDataSource(renderData);
      setTotal(renderTotal);
    } else {
      MessageNotify.warning(message);
    }
    setTableRequestState(false);
  };

  //删除人员组
  const deleteTableSelectData = async () => {
    if (dataSource.length === 0) {
      MessageNotify.warning("无需要删除的人员组!");
      return false;
    }

    if (selectRows.length === 0) {
      MessageNotify.warning("未选择需要删除的人员组!");
      return false;
    }

    const pr = {
      deleteGroupList: selectRows.map((item) => item.groupId),
    };

    const deleteGroupRes = await deletePersonGroup_request(pr);
    const { code, message, data, result } = deleteGroupRes;
    if (code === "200" && result) {
      MessageNotify.success("删除成功!");
      if (pageIndex === 1) {
        //第一页，则直接刷新当前页码
        setRequestTrigger(requestTrigger + 1);
      } else {
        //非第一页，则处理页码后，会自动刷新页面
        setPageIndex(1);
      }
    } else {
      MessageNotify.warning(message);
    }
  };

  //获取当前编辑组的默认渲染数据
  const getSelectGroupDetialData = async () => {
    const pr = {
      groupId: currentEditId,
    };
    setInteractionStateReady(false);
    let selectGroupData = await getGroupDetail_request(pr);
    const { message, data, result, code } = selectGroupData;
    if (code === "200" && result) {
      const gradeList = data?.gradeList ?? [];
      const classList = data?.classList ?? [];
      setRenderGradeList(gradeList);
      // setRenderGradeList([gradeList[0], gradeList[1]]);
      setRenderClassList(classList);
      // setRenderClassList([classList[0], classList[1], classList[2]]);
      setCurrentSelectGradeList(
        gradeList.filter((item) => item.isUse === 1).map((item) => item.gradeId)
      );
      setCurrentSelectClassList(
        classList.filter((item) => item.isUse === 1).map((item) => item.classId)
      );
    } else {
      MessageNotify.warning(message);
    }
    setInteractionStateReady(true);
  };

  //获取新建编辑组的默认渲染数据
  const getDefaultGroupDetialData = async () => {
    const pr = {};
    setInteractionStateReady(false);
    let detaultData = await getDefaultGroupData_request(pr);

    const { message, data, result, code } = detaultData;
    if (code === "200" && result) {
      const gradeList = data?.gradeList ?? [];
      const classList = data?.classList ?? [];
      setRenderGradeList(gradeList);
      setRenderClassList(classList);
    } else {
      MessageNotify.warning(message);
    }
    setInteractionStateReady(true);
  };

  //单选框变更
  const selectChangeHandle = (type, result) => {
    if (type === "grade") {
      setCurrentSelectGradeList(result);
    } else {
      setCurrentSelectClassList(result);
    }
  };

  //修改后的提交
  const submitCurrentGroupDetial = async () => {
    if (currentEditName.trim() === "") {
      MessageNotify.warning("请填写人员组名称!");
      return false;
    }
    let pr = {
      groupId: currentEditId,
      groupName: currentEditName,
      usedGradeList: currentSelectGradeList,
      usedClassList: currentSelectClassList,
    };
    setSubmitLoadingState(true);
    let submitRes = await submitGroupDetial_request(pr);
    const { code, result, message } = submitRes;
    if (code === "200" && result) {
      MessageNotify.success(
        currentEditId ? "编辑人员组成功" : "新建人员组成功"
      );
      initChildDrawer();
    } else {
      MessageNotify.warning(message);
    }
    setSubmitLoadingState(false);
  };

  //初始化子级抽屉数据
  const initChildDrawer = async () => {
    return new Promise((res, rej) => {
      setTimeout(() => {
        setDrawerChildState(false);
        setCurrentEditId("");
        setCurrentEditName("");
        setRenderGradeList([]);
        setRenderClassList([]);
        setCurrentSelectGradeList([]);
        setCurrentSelectClassList([]);
        setInteractionStateReady(false);
        setSubmitLoadingState(false);
        if (pageIndex === 1) {
          setRequestTrigger(requestTrigger + 1);
        } else {
          setPageIndex(1);
        }
        res(true);
      }, 200);
    });
  };

  //初始化父级抽屉数据
  const initPrimaryDrawer = async () => {
    return new Promise((res, rej) => {
      setTimeout(() => {
        // setDrawerState(false);
        setSelectRows([]);
        setDataSource([]);
        setTableRequestState(false);
        setPageIndex(1);
        setTotal(0);
        res(true);
      }, 200);
    });
  };

  useEffect(() => {
    //打开第一层抽屉时
    getTableData();
  }, [requestTrigger]);

  useEffect(() => {
    setRequestTrigger(requestTrigger + 1);
  }, [pageIndex]);

  useEffect(() => {
    //打开第二层抽屉时
    if (drawerChildState) {
      if (currentEditId) {
        // 编辑状态
        getSelectGroupDetialData();
      } else {
        // 新增状态
        getDefaultGroupDetialData();
      }
    }
  }, [currentEditId, drawerChildState]);

  return (
    <div style={{ padding: 10 }}>
      <div
        style={{
          marginBottom: 10,
          display: "flex",
          justifyContent: "space-between",
          cursor: "pointer",
        }}
      >
        <div
          onClick={() => {
            history?.goBack();
          }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SVG type="fanhuishangyiji" />
          <span style={{ marginLeft: 4 }}>人员组设置</span>
        </div>
        <Space size={10}>
          <Button
            type="primary"
            onClick={() => {
              setChildDrawerEditState("create");
              setDrawerChildState(true);
            }}
          >
            <PlusOutlined />
            新建人员组
          </Button>
          <Button type="danger" ghost onClick={deleteTableSelectData}>
            删除人员组
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={dataSource.map((item, index) => ({
          key: item.groupId,
          ...item,
        }))}
        rowSelection={rowSelection}
        loading={tableRequestState}
        bordered
        pagination={false}
        style={{ marginBottom: 20 }}
      />
      <PaginationPonent
        total={total}
        pageSize={pageSize}
        pageIndex={pageIndex}
        pageChange={pageChange}
      />
      {/* <div>
            <Button type="primary">确定</Button>
            <Button>取消</Button>
          </div> */}
      <Drawer
        closable
        title={createOrReview === "create" ? "新建人员组" : "班级详细名单"}
        width={620}
        maskClosable={false}
        visible={drawerChildState}
        onClose={initChildDrawer}
      >
        <div style={{ position: "relative", height: "100%" }}>
          {interactionIsReady ? (
            <F>
              <span className="lean-dromrule-verticalLine-icon">人员组</span>
              <hr className="lean-dromrule-splitLine-icon" />

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "20px 0",
                }}
              >
                <span>人员组名称：</span>
                <Input
                  style={{ width: 320 }}
                  value={currentEditName}
                  onChange={({ target: { value } }) =>
                    setCurrentEditName(value)
                  }
                />
              </div>

              <span className="lean-dromrule-verticalLine-icon">人员选择</span>
              <hr className="lean-dromrule-splitLine-icon" />

              <div style={{ minHeight: "calc(100% - 200px)" }}>
                <span>适用年级</span>
                <div className="lean-dromrule-checkbox-warp">
                  <Checkbox.Group
                    options={renderGradeList.map((item) => ({
                      label: item?.gradeName ?? "",
                      value: item?.gradeId ?? "",
                      disabled: item.canUse === 0,
                    }))}
                    value={currentSelectGradeList}
                    onChange={(changeResult) => {
                      selectChangeHandle("grade", changeResult);
                    }}
                  />
                </div>
                <span>适用班级</span>
                <div className="lean-dromrule-checkbox-warp">
                  <Checkbox.Group
                    options={renderClassList.map((item) => {
                      return {
                        label: item?.className ?? "",
                        value: item?.classId ?? "",
                        disabled: item.canUse === 0,
                      };
                    })}
                    value={currentSelectClassList}
                    onChange={(changeResult) => {
                      selectChangeHandle("class", changeResult);
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  // position: "absolute",
                  bottom: -24,
                  height: 70,
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderTop: "1px solid #e3e4e4",
                }}
              >
                {/* <hr className="lean-dromrule-splitLine-icon" /> */}
                <Space
                  size={10}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <Button
                    type="primary"
                    onClick={submitCurrentGroupDetial}
                    loading={isSubmitLoading}
                  >
                    保存
                  </Button>
                  <Button onClick={initChildDrawer}>取消</Button>
                </Space>
              </div>
            </F>
          ) : (
            <div
              style={{
                display: "flex",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Spin tip={"正在准备数据"} size="large"></Spin>
            </div>
          )}
        </div>
      </Drawer>
    </div>
  );
};

/**
 * @description 例外设置抽屉
 * @class
 * @component
 * @param {Boolean} drawerState  主抽屉显隐状态控制
 * @param {Function} setDrawerState 主抽屉显隐状态控制函数
 * @param {Boolean} drawerChildState 子抽屉显隐状态控制
 * @param {Function} setDrawerChildState 子抽屉显隐状态控制函数
 * @return {FunctionComponent} 例外设置抽屉
 */
export const ExceptiveConfigDrawer = ({
  drawerState,
  setDrawerState,
  drawerChildState,
  setDrawerChildState,
  ...props
}) => {
  //第一级抽屉
  const [selectRows, setSelectRows] = useState([]);
  const [dataSource, setDataSrouce] = useState([]);
  const [exceptiveTableRequest, setExceptiveTableRequest] = useState(false);
  const [renderData, setRenderData] = useState();
  const [renderType, setRenderType] = useState("");
  const [renderId, setRenderId] = useState("");

  //第二级抽屉
  const [timeRangeIsRequest, setTimeRangeRequestState] = useState(true);
  const [timeRange, setTimeRange] = useState(Date.now());
  const [exceptiveRangeData, setExceptiveRangeData] = useState({});
  const [mornIndeterminate, setMornIndeterminate] = useState(false);
  const [mornCheckAll, setMornCheckAll] = useState(false);
  const [noonIndeterminate, setNoonIndeterminate] = useState(false);
  const [noonCheckAll, setNoonCheckAll] = useState(false);
  const [nightIndeterminate, setNightIndeterminate] = useState(false);
  const [nightCheckAll, setNightCheckAll] = useState(false);
  const [exceptiveType, setExceptiveType] = useState();

  //初始化第一级抽屉
  const initPrimaryDrawer = () => {
    setDrawerState(false);
    setSelectRows([]);
  };

  //初始化第二级抽屉
  const initChildDrawer = () => {
    // setDrawerChildState(false);
    // initPrimaryDrawer();
    setExceptiveRangeData({});
    setMornIndeterminate(false);
    setMornCheckAll(false);
    setNoonIndeterminate(false);
    setNoonCheckAll(false);
    setNightIndeterminate(false);
    setNightCheckAll(false);
  };

  const columns = [
    {
      title: "日期",
      dataIndex: "exceptiveDate",
      key: "exceptiveDate",
      render(number) {
        return number ? (
          <span>{moment(number).format("YYYY-MM-DD")}</span>
        ) : (
          "--"
        );
      },
    },
    {
      title: "例外类型",
      dataIndex: "exceptiveType",
      key: "exceptiveType",
      render(number) {
        return (
          <span>
            {number === 0
              ? "不需签到"
              : number === 1
              ? "需要签到"
              : "非码表定义"}
          </span>
        );
      },
    },
    {
      title: "状态",
      dataIndex: "exceptiveState",
      key: "exceptiveState",
      render(number) {
        return (
          <span>
            {number === 0
              ? "未开始"
              : number === 1
              ? "进行中"
              : number === 2
              ? "已完成"
              : "非码表定义"}
          </span>
        );
      },
    },
    {
      title: "计划范围",
      dataIndex: "exceptiveState",
      key: "planRange",
      render(number, record) {
        const word = number === 0 ? "编辑" : "查看";
        return (
          <Button
            type="link"
            onClick={() => {
              setTimeRange(record?.exceptiveDate ?? Date.now());
              setExceptiveType(record?.exceptiveType);
              setRenderType(number === 0 ? "edit" : "review");
              setRenderId(record?.exceptiveItemId);
              setDrawerChildState(true);
            }}
          >
            {word}
          </Button>
        );
      },
    },
  ];

  const rowSelection = {
    selectedRowKeys: selectRows,
    onChange(selectedRowKeys, selectedRows) {
      // console.log(selectedRowKeys);
      setSelectRows(selectedRowKeys);
    },
  };

  //获取例外设置列表
  const getExceptiveList = async () => {
    const pr = {};
    setExceptiveTableRequest(true);
    const exceptiveRes = await getExceptiveList_request(pr);
    const { code, message, result, data } = exceptiveRes;
    if (code === "200" && result) {
      setDataSrouce(
        data?.exceptiveList?.map((item) => ({
          ...item,
          key: item?.exceptiveItemId ?? "无ID",
        })) ?? []
      );
    } else {
      MessageNotify.warning(message);
    }
    setExceptiveTableRequest(false);
  };

  //根据所选时间,获取当前时间下可以选择的例外范围管理计划
  const getExceptiveRangeByDate = async (seleteDate = new Date().getTime()) => {
    const pr = {
      seleteDate,
      ...(renderType !== "create"
        ? {
            exceptiveItemId: renderId,
          }
        : {}),
    };

    initChildDrawer();
    setTimeRangeRequestState(true);
    const renderExceptiveList = await getManagePlanDetail_request(pr);
    const { data, code, result, message } = renderExceptiveList;
    if (code === "200" && result) {
      setExceptiveRangeData(data ?? {});
    } else {
      MessageNotify.warning(message);
    }
    setTimeRangeRequestState(false);
  };

  //节流器-获取当前时间下可以选择的例外范围管理计划
  const getExceptiveRangeByDate_throttle = lodash.throttle(
    getExceptiveRangeByDate,
    1000
  );

  //范围全选的处理
  const checkAllChange = (type, value) => {
    if (type === "mornManageList") {
      setMornCheckAll(value);
      setMornIndeterminate(false);
    } else if (type === "noonManageList") {
      setNoonCheckAll(value);
      setNoonIndeterminate(false);
    } else {
      setNightCheckAll(value);
      setNightIndeterminate(false);
    }

    let currentType = type;
    let currentData = { ...exceptiveRangeData };

    let currentList = exceptiveRangeData?.[currentType]?.map((item) => {
      return item.isSelective === 1
        ? {
            ...item,
            isUse: value ? 1 : 0,
          }
        : item;
    });
    currentData[currentType] = currentList;
    setExceptiveRangeData(currentData);
  };

  //  ( isUse === 1 )  ==> 选中
  //  ( isSelective === 0)  ==> 不可选,已被其他计划选中

  //范围半选的处理
  const chackIndeterminateChange = (type, currentData) => {
    let currentType = type;
    let currentList = currentData?.[currentType];

    let isNullSelect =
      currentList
        .filter((item) => item.isSelective !== 0)
        .filter((item) => item.isUse === 1).length === 0;

    let isFullSelect = !currentList
      .filter((item) => item.isSelective !== 0)
      .some((item) => item.isUse === 0); //只要有一个为未选中,则全选状态为false

    if (type === "mornManageList") {
      if (isNullSelect) {
        setMornCheckAll(false);
        setMornIndeterminate(false);
      } else if (isFullSelect) {
        setMornCheckAll(true);
        setMornIndeterminate(false);
      } else {
        setMornIndeterminate(true);
      }
    } else if (type === "noonManageList") {
      if (isNullSelect) {
        setNoonCheckAll(false);
        setNoonIndeterminate(false);
      } else if (isFullSelect) {
        setNoonCheckAll(true);
        setNoonIndeterminate(false);
      } else {
        setNoonIndeterminate(true);
      }
    } else {
      if (isNullSelect) {
        setNightCheckAll(false);
        setNightIndeterminate(false);
      } else if (isFullSelect) {
        setNightCheckAll(true);
        setNightIndeterminate(false);
      } else {
        setNightIndeterminate(true);
      }
    }
  };

  //范围内部的处理checkbox change
  const checkItemChange = (type, value) => {
    let currentType = type;
    let currentData = { ...exceptiveRangeData };
    let currentList = exceptiveRangeData?.[currentType]?.map((item) => ({
      ...item,
      isUse: 0,
    }));

    if (type === "mornManageList") {
      setMornIndeterminate(false);
    } else if (type === "noonManageList") {
      setNoonIndeterminate(false);
    } else {
      setNightIndeterminate(false);
    }
    value.map((item) => {
      currentList = currentList?.map((innerItem) => {
        return {
          ...innerItem,
          ...(innerItem.planId === item
            ? {
                isUse: 1,
              }
            : {}),
        };
      });
    });

    currentData[currentType] = currentList;

    setExceptiveRangeData(currentData);
    chackIndeterminateChange(type, currentData);
  };

  //添加例外设置
  const addExceptive = async () => {
    let exceptiveRangeIdList = [];
    Reflect.ownKeys(exceptiveRangeData).map((item) => {
      exceptiveRangeIdList = exceptiveRangeIdList.concat(
        exceptiveRangeData[item]
          .filter((innerItem) => innerItem.isUse === 1)
          .map((innerItem) => innerItem.planId)
      );
    });

    const pr = {
      exceptiveDate: timeRange,
      exceptiveType,
      exceptiveRangeIdList,
      ...(renderId
        ? {
            exceptiveItemId: renderId,
          }
        : {}),
    };

    const exceptiveAddRes = await addExceptive_request(pr);
    const { message, code, data, result } = exceptiveAddRes;
    if (code === "200" && result) {
      getExceptiveList();
      MessageNotify.success("添加成功");
      setTimeout(() => {
        initChildDrawer();
        setDrawerChildState(false);
        setRenderId("");
      }, 200);
    } else {
      MessageNotify.warning(message);
    }
  };

  //删除选中的例外设置
  const deleteExceptive = async () => {
    console.log(selectRows);

    if (dataSource.length === 0) {
      MessageNotify.warning("没有需要删除的数据!");
      return false;
    }

    if (selectRows.length === 0) {
      MessageNotify.warning("未选择需要删除的数据");
      return false;
    }

    const pr = {
      deleteIdList: selectRows,
    };

    const deleteRes = await deleteExceptive_request(pr);
    const { message, code, result } = deleteRes;
    if (code === "200" && result) {
      MessageNotify.success("批量删除成功!");
      await getExceptiveList();
    } else {
      MessageNotify.warning(message);
    }
  };

  useEffect(() => {
    if (drawerChildState) {
      //打开第二级抽屉的时候触发
      getExceptiveRangeByDate(timeRange);
    }
  }, [renderId, timeRange, drawerChildState]);

  useEffect(() => {
    if (drawerState) {
      getExceptiveList();
    }
  }, [drawerState]);

  return (
    <Drawer
      closable
      width={600}
      title={"例外设置"}
      maskClosable={false}
      visible={drawerState}
      onClose={initPrimaryDrawer}
    >
      <div style={{ postion: "relative" }}>
        <Space size={10}>
          <Button
            type="primary"
            onClick={() => {
              setRenderType("create");
              setDrawerChildState(true);
            }}
          >
            <PlusOutlined />
            添加
          </Button>
          <Button
            type="danger"
            ghost
            onClick={() => {
              deleteExceptive();
            }}
          >
            批量删除
          </Button>
        </Space>

        <Table
          bordered
          columns={columns}
          dataSource={dataSource}
          style={{ marginTop: 15 }}
          rowSelection={rowSelection}
          loading={exceptiveTableRequest}
          pagination={1 === 2}
        />
        <Drawer
          closable
          width={520}
          title={
            renderType === "create"
              ? "添加设置"
              : renderType === "edit"
              ? "编辑设置"
              : "查看设置"
          }
          maskClosable={false}
          visible={drawerChildState}
          onClose={() => {
            initChildDrawer();
            setDrawerChildState(false);
            setTimeRange(Date.now())//yhc-edit
          }}
        >
          <div style={{ postion: "relative" }}>
            <span className="lean-dromrule-verticalLine-icon">时间范围</span>
            <hr className="lean-dromrule-splitLine-icon" />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 20,
              }}
            >
              <span style={{ width: 120, textAlign: "right" }}>
                选择日期范围：
              </span>
              <DatePicker
                allowClear={false}
                value={moment(timeRange)}
                style={{ width: 280 }}
                onChange={(v) => {
                  setTimeRange(moment(v).unix() * 1000);
                }}
                disabled={renderType === "review"}
              />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 20,
              }}
            >
              <span style={{ width: 120, textAlign: "right" }}>例外类型：</span>
              <Select
                value={exceptiveType}
                style={{ width: 280 }}
                onChange={(v) => {
                  setExceptiveType(v);
                }}
                disabled={renderType === "review"}
              >
                <Select.Option value={1}>需要签到</Select.Option>
                <Select.Option value={0}>不需签到</Select.Option>
              </Select>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 40,
              }}
            >
              <span style={{ width: 120, textAlign: "right" }}></span>
              <span
                style={{
                  width: 280,
                  fontSize: 12,
                  color: "gray",
                  fontWeight: 500,
                }}
              >
                当天计划内学生不用签到/当天计划内学生需要签到
              </span>
            </div>

            <span className="lean-dromrule-verticalLine-icon">例外范围</span>
            <hr className="lean-dromrule-splitLine-icon" />
            <div>
              {timeRangeIsRequest ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: 300,
                  }}
                >
                  <Spin tip={"正在请求数据"} />
                </div>
              ) : (
                <div>
                  {/*
                      * 1 早寝
                        2 午寝
                        3 晚寝 
                        一个数组循环渲染 
                     */}
                  {Reflect.ownKeys(exceptiveRangeData).map((name) => {
                    let currentType = name;
                    let options =
                      exceptiveRangeData?.[currentType]?.map((item, index) => {
                        return {
                          // label: item.planName,
                          label: "计划" + (index + 1),
                          value: item.planId,
                          disabled: item.isSelective === 0,
                        };
                      }) ?? [];

                    let values = exceptiveRangeData?.[currentType]
                      .filter((item) => item.isUse === 1)
                      .map((item) => item.planId);

                    return options.length > 0 ? (
                      <div key={name} style={{ margin: "20px 0" }}>
                        <Checkbox
                          indeterminate={
                            name === "mornManageList"
                              ? mornIndeterminate
                              : name === "noonManageList"
                              ? noonIndeterminate
                              : nightIndeterminate
                          }
                          onChange={({ target: { checked } }) => {
                            checkAllChange(name, checked);
                          }}
                          checked={
                            name === "mornManageList"
                              ? mornCheckAll
                              : name === "noonManageList"
                              ? noonCheckAll
                              : nightCheckAll
                          }
                          disabled={renderType === "review"}
                        >
                          {name === "mornManageList"
                            ? "早寝管理"
                            : name === "noonManageList"
                            ? "午寝管理"
                            : name === "nightManageList"
                            ? "晚寝管理"
                            : ""}
                        </Checkbox>
                        <div style={{ margin: 20 }}></div>
                        <Checkbox.Group
                          style={{ marginLeft: 10 }}
                          options={options}
                          value={values}
                          onChange={(v) => {
                            checkItemChange(name, v);
                          }}
                          disabled={renderType === "review"}
                        />
                      </div>
                    ) : null;
                  })}
                </div>
              )}
            </div>
            <div
              style={{
                position: "absolute",
                bottom: 20,
                paddingTop: 20,
                borderTop: "1px solid #e3e4e4",
                display: "flex",
                width: "100%",
                justifyContent: "center",
              }}
            >
              {renderType === "review" ? null : (
                <Space size={10}>
                  <Button
                    type="primary"
                    onClick={() => {
                      // console.log(timeRange);
                      // console.log(exceptiveRangeData);
                      // console.log(exceptiveType);
                      // setTimeRange(Date.now())//yhc-edit
                      addExceptive();
                    }}
                  >
                    确定
                  </Button>
                  <Button
                    onClick={() => {
                      initChildDrawer();
                      setDrawerChildState(false);
                      setTimeRange(Date.now())//yhc-edit
                    }}
                  >
                    取消
                  </Button>
                </Space>
              )}
            </div>
          </div>
        </Drawer>
      </div>
    </Drawer>
  );
};
