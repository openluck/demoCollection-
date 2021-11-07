/*
 * @Author: junjie.lean
 * @Date: 2020-02-13 18:25:37
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-08-19 15:52:54
 */

/**
 * 表单在视频中的的反显组件
 */

import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  Fragment as F
} from "react";
import { Select, Button, message, Spin } from "antd";
import noneData from './../../../../media/picture/noneData.png';
import "./../../../../style/tpk/pksz/lean-form.scss";
import { DynamicForm } from "./form-createOrDesign";
import {
  getFormList,
  getDOMJsonByClassId,
  getDOMJsonByFormId
} from "./form-request";

const { Option } = Select;

const defaultComponentList = [
  //标题vd不能被注释,不能被清除
  {
    domType: 0, //0 表单标题; 1 单行输入框;2 多行输入框;3 单选框;4 多选框;5 分值题,
    domTitle: "标题", //展示给用户看到的标题
    domMark: "", //展示给用户看到的备注
    domID: "dom0", //DOM-id 单选框是否同组互斥也由此值控制
    domValue: ["表单标题"]
  },
  { domType: -1, domID: "dom-1", domValue: ["意见与建议"] },
  { domType: -2, domID: "dom-2", domValue: ["A"] },
  {
    domType: 1,
    domTitle: "单行输入框",
    domMark: "单上输入框的副标题",
    domID: "1",
    domValue: [""]
  },
  {
    domType: 2,
    domTitle: "多行输入框",
    domMark: "多行输入框副标题",
    domID: "2",
    domValue: [""]
  },
  {
    domType: 3,
    domTitle: "单选框",
    domMark: "单选框测试",
    domID: "3",
    domValue: ["选项1", "选项2", "选项3"],
    defaultChecked: []
  },
  {
    domType: 4,
    domTitle: "复选框",
    domMark: "复选框测试",
    domID: "4",
    domValue: ["选项1", "选项2", "选项3"],
    defaultChecked: []
  },
  {
    domType: 5,
    domTitle: "分值题",
    domMark: "分数填写0-100之间的整数",
    domID: "5",
    domValue: [0]
  }
];

export default function VideoForm(props) {
  const courseId = props.match.params.id;
  const jobId = props.match.params.jobId;
  const perId = props.match.params.perId;
  const classId = props.match.params.classId;
  const editParam = props.match.params.isEdit;
  //外层loading
  const [loadingState, setLoadingState] = useState(true);
  //内层loading
  const [innerLoadingState, setInnerLoadingState] = useState(true);
  //表单列表
  const [formList, setFormList] = useState([]);
  //当前课堂的提交状态
  const [hasCommit, setCommitState] = useState(0);
  //组件列表
  const [componentList, setComponentList] = useState([]);

  //表单对象:
  const DynamicFormRef = useRef();

  const getDOMByFormId = async fid => {
    let res = await getDOMJsonByFormId(fid);
    if (res.result && res.code === "200" && res.data) {
      setInnerLoadingState(false);
      // console.log(res.data.domJson,JSON.parse(res.data.domJson));

      setComponentList(JSON.parse(res.data.domJson));
    } else {
      message.warning("接口调用失败");
    }
  };

  // 表单数据回显
  const getDOMByClassId = async (cid, jid, perId) => {
    let res = await getDOMJsonByClassId(cid, jid, perId, courseId);
    if (res.result && res.code === "200" && res.data) {
      setCommitState(res.data.hasCommit);
      //判断当前课堂时候已经有过表单的提交数据
      if (res.data.hasCommit === 0) {
        if (formList.length) {
          getDOMByFormId(formList[0].formId);
        }
      } else {
        setInnerLoadingState(false);
        setLoadingState(false);
        setComponentList(JSON.parse(res.data.domJson));
      }
    } else {
      message.warning("调用接口报错");
    }
  };

  const getFromList = async () => {
    let res = await getFormList();
    // if (res.result && res.code === "200") {
    if (res.result && res.code === "200" && res.data) {
      // getDOMByClassId(classId, jobId, perId);
      // console.log('formList:',res.data)
      setFormList(res.data);
      setLoadingState(false);
    } else {
      message.warning("调用接口报错");
    }
  };

  const formListChangeHandle = async formId => {
    setInnerLoadingState(true);
    const res = await getDOMJsonByFormId(formId);
    if (res.result && res.code === "200" && res.data) {
      const {
        data: { domJson }
      } = res;
      // console.log(res, domJson, JSON.parse(domJson));

      setComponentList(JSON.parse(domJson));
      setInnerLoadingState(false);
    } else {
      message.warning("接口调用失败!");
      setInnerLoadingState(false);
    }
  };

  const commitForm = async (commitType = "save") => {
    DynamicFormRef.current.commitCurrentComponentList(
      commitType,
      classId,
      jobId,
      perId,
      courseId
    );
  };

  //1.先去取表单列表
  useEffect(() => {
    if (editParam === "1") {
      // console.log('-1--1-1-');
      getFromList();
    } else {
      // console.log('-2-2-2-2');
      getDOMByClassId(classId, jobId, perId);
    }
  }, []);
  //2.再去取当前课堂的状态
  useEffect(() => {
    // if (formList.length !== 0) {
    //   // console.log('3-3-3-3-');
    getDOMByClassId(classId, jobId, perId);
    // }
  }, [formList]);

  return (
    <F>
      <div className="lean-vf-container">
        {loadingState ? (
          <F>
            <div className="lean-vf-loadingContainer">
              <Spin size={"large"} />
            </div>
          </F>
        ) : (
            <F>
              {/* 如果已经提交,则不再展示此区域 */}
              {hasCommit === 2 || editParam !== "1" ? null : (
                <div className="lean-vf-formSelectZone">
                  <div id="lean-vf-formSelectParent">
                    {formList && formList.length > 0 ? (
                      <>
                        <span>选择评课表:</span>
                        <Select
                          style={{ width: 300, marginLeft: 30 }}
                          defaultValue={formList[0].formName}
                          getPopupContainer={() =>
                            document.querySelector("#lean-vf-formSelectParent")
                          }
                          onChange={formListChangeHandle}
                        >
                          {formList &&
                            formList.map((item, index) => {
                              return (
                                <Option key={index} value={item.formId}>
                                  {item.formName}
                                </Option>
                              );
                            })}
                        </Select>
                      </>
                    ) : null}
                  </div>
                  {(formList.length === 0 && componentList.length === 0) ||
                    editParam !== "1" ? null : (
                      <div className="lean-vf-formBtnZone">
                        <Button
                          style={{ background: "#5acb9b" }}
                          onClick={() => {
                            commitForm("save");
                          }}
                        >
                          保存
                    </Button>
                        <Button
                          style={{ background: "#59a6ee" }}
                          onClick={() => {
                            commitForm("commit");
                          }}
                        >
                          提交
                    </Button>
                      </div>
                    )}
                </div>
              )}
              <div className="lean-vf-formShowZone">
                {// innerLoadingState ? (
                  //   <div className="lean-vf-loadingContainer">
                  //     <Spin size={"large"} />
                  //   </div>
                  // ) : (
                  formList.length === 0 && componentList.length === 0 ? (
                    <div style={{ textAlign: "center" }}>
                      <img style={{ width: 200, height: 200, marginBottom: 20 }} src={noneData} />
                      <p>暂无可用评议表，请先添加评议表模板</p>
                    </div>
                  ) : (
                      <DynamicForm
                        componentList={componentList}
                        isEdit={true}
                        isPreview={hasCommit === 2}
                        ref={DynamicFormRef}
                        {...props}
                      />
                    )
                  // )
                }
              </div>
            </F>
          )}
      </div>
    </F>
  );
}
