/*
 * @Author: junjie.lean
 * @Date: 2020-01-20 15:51:04
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-09-17 15:24:27
 */

//表单编辑父组件
//数据存储与展示在此组件内控制，但是数据的变更由子组件控制
//控制变淡数据的展示
import React from "react";
import PropTypes from "prop-types";
import { Button, Modal, Input, message } from "antd";
import _ from "lodash";

import "./../../../../style/tpk/pksz/lean-form.scss";
import FormReshow from "./form-reshow";
import { SubjectiveComment, TotalComment } from "./form-reshow";
import SVG from "./../../../public/public-component-svg";
import { commitDOMJson, getDOMJsonByFormId, formEdit } from "./form-request";
import { defaultComponentWidgetList } from "./form-defaultComponentList";
import RouterPrompt from './../../RoutePrompt'

//表单展示组件,包含反显和编辑,预览三种模式.
//isEdit控制是否是编辑模式,如果是,则允许用户与表单交互.
//isPreview控制表单是否是预览模式,如果是,则关闭用户与表单的交互.
export class DynamicForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: props.isEdit,
      isPreview: props.isPreview,
      componentList: props.componentList
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      ...nextProps
    };
  }

  changeDOMValue(vd = {}) {
    const { domID } = vd;
    const { componentList } = this.state;
    let ind = _.findIndex(componentList, { domID });
    componentList[ind] = vd;
    this.setState({
      ...this.state,
      componentList
    });
  }

  async commitCurrentComponentList(comType, classID, jobID, perID, courseID) {
    const domJson = JSON.stringify(this.state.componentList);
    //统计值,如果统计项变动,则需要改动这里.目前是写死只统计主观评价和整体评价.
    const statistic = [
      {
        statisticType: -1,
        statisticKey: "主观评价",
        statisticValue: this.state.componentList[1].domValue || [""]
      },
      {
        statisticType: -2,
        statisticKey: "整体评价",
        statisticValue: this.state.componentList[2].defaultChecked || [""]
      }
    ];

    const pr = {
      domJson,
      jobID,
      perID,
      classID,
      courseID,
      statistic,
      comType: comType === "save" ? 1 : 2
    };

    let v1 = statistic[0].statisticValue[0].replace(/\s/g, "");
    let v2 = statistic[1].statisticValue[0].replace(/\s/g, "");
    if (v1 === "") {
      message.warning("主观评价未填写!");
      return false;
    }

    if (v2 === "") {
      message.warning("整体评价未填写!");
      return false;
    }

    const res = await commitDOMJson(pr);
    if (res.result && res.code === "200" && res.data) {
      console.log(this.props);
      // this.props.history.push('./')
      window.location.reload();
    } else {
      message.warning("调用接口出错!");
    }
  }

  render() {
    return (
      <>
        {/* 标题 */}
        {this.state.isEdit || this.state.isPreview ? null : <h2>1.标题</h2>}
        {this.state.componentList
          .filter(item => item.domType === 0) //只渲染标题
          .map((item, index) => {
            return (
              //表单的主标题组件
              //isEdit属性标识编组状态,该状态和表单的编辑状态取反,表单可填写的时候,标题是不可编辑状态
              <FormReshow
                key={index}
                vd={item}
                ind={index}
                isEdit={!this.state.isEdit}
                isPreview={this.state.isPreview}
                setFormTitle={this.props.setFormTitle}
              />
            );
          })}

        {this.state.componentList
          .filter(item => item.domType === -1)
          .map((item, index) => {
            return (
              <div key={index}>
                <HrStyle mt={0} />
                {/* 主观评价 */}
                <h2>
                  {this.state.isEdit || this.state.isPreview ? 1 : 2}.主观评价
                  <span style={{ color: "red" }}>*</span>
                </h2>
                <SubjectiveComment
                  key={Math.random()}
                  isEdit={this.state.isEdit}
                  isPreview={this.state.isPreview}
                  changeDOMValue={this.changeDOMValue.bind(this)}
                  {...item}
                />
              </div>
            );
          })}

        {this.state.componentList
          .filter(item => item.domType === -2)
          .map((item, index) => {
            return (
              <div key={index}>
                <HrStyle mt={0} />
                {/* 整体评价 */}
                <h2>
                  {this.state.isEdit || this.state.isPreview ? 2 : 3}.整体评价
                  <span style={{ color: "red" }}>*</span>
                </h2>
                <TotalComment
                  key={Math.random()}
                  isEdit={this.state.isEdit}
                  isPreview={this.state.isPreview}
                  changeDOMValue={this.changeDOMValue.bind(this)}
                  {...item}
                />
              </div>
            );
          })}

        <>
          {this.state.componentList.length > 3 ? (
            <>
              <HrStyle mt={0} />
              <h2>
                {this.state.isEdit || this.state.isPreview ? 3 : 4}.评议指标
              </h2>
            </>
          ) : null}

          {this.state.componentList.length <= 3 &&
            !this.state.isEdit &&
            !this.state.isPreview ? (
              <>
                <h2>4.评议指标</h2>
                <div className="lean-form-suggestAddComponent">
                  <span>点击左侧组件添加自定义指标</span>
                </div>
              </>
            ) : null}
        </>

        {/* 自定义组件 */}
        {this.state.componentList
          .filter(item => item.domType > 0)
          .map((item, index) => {
            return (
              <FormReshow
                key={index}
                vd={item}
                ind={index}
                changeDOMValue={this.changeDOMValue.bind(this)}
                {...this.props}
              />
            );
          })}

        {/* <HrStyle mt={0} /> */}
      </>
    );
  }
}

//表单逻辑组件,数据控制层.
export default class FormCreateOrDesign extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isCreateNewForm: props.match.params.formEditType == "0",
      currentFormID: props.match.params.formId || "",
      loadingState: true,
      isPreviewBoxHide: false,
      componentList: [],
      componentWidgetList: props.componentWidgetList,
      editModalOpenState: [0, 0, 0, 0, 0], //新增组件时的编辑框状态
      reeditModalState: [0, 0], //重新打开两种(1,2,5为一种,3,4为一种)模式的修改编辑框
      editModalTmpData: [{}, {}, {}, {}, {}],
      checkboxList: [{ canDel: false }, { canDel: false }], //增加单选框的默认数据,默认应该有两个选项,并且不可删除
      radioList: [{ canDel: false }, { canDel: false }],
      currentEditVD: {}, //当前正在编辑的vd
      oldEditVD: {},      //mj-add:编辑状态修改未确定表单已经变化
      isTip: false,       //mj-add2.3,提示编辑状态
    };
  }

  componentDidMount() {
    if (!this.state.isCreateNewForm) {
      //如果不是新增模式,而是编辑模式,则需要去取数据:
      this.getInitialFormData(this.state.currentFormID);
    } else {
      this.setState({
        ...this.state,
        componentList: [
          {
            domType: 0, //0 表单标题; 1 单行文本框;2 多行文本框;3 单选框;4 多选框;5 分值题,-1 主观评价,写死;-2 整体评价,写死;
            domTitle: "标题", //展示给用户看到的标题
            domMark: "", //展示给用户看到的备注
            domID: "dom0", //DOM-id 单选框是否同组互斥也由此值控制
            domValue: ["新增评议表"]
          },
          {
            domType: -1,
            domID: "dom-1",
            domValue: [""]
          },
          {
            domType: -2,
            domID: "dom-2",
            domValue: [""]
          }
        ],
        loadingState: false
      });
    }
  }

  //获取初始化数据:
  async getInitialFormData(formID) {
    const res = await getDOMJsonByFormId(formID);

    if (res.result && res.code === "200" && res.data) {
      let {
        data: { domJson }
      } = res;
      this.setState({
        ...this.state,
        componentList: JSON.parse(domJson),
        loadingState: false
      });
    } else {
      message.warning("获取初始化表单数据接口异常!");
    }
  }

  //是否打开预览遮罩
  isShowPreviewBox(state) {
    this.setState({
      ...this.state,
      isPreviewBoxHide: state
    });
  }

  //变更组件列表数据,会被多次调用,调用后会重新渲染表单
  updateComponentList(newComponentList = []) {
    this.setState({
      ...this.state,
      componentList: newComponentList
    });
  }

  //传回变更数据,处理componentList变更的操作:
  componentChange(changeType, vd) {
    //changeType有三种情况,add/delete/edit
    let { componentList } = this.state;
    if ("add" === changeType) {
      componentList.push(vd);
    } else if ("edit" === changeType) {
      let { domID } = vd;
      let editIndex = _.findIndex(componentList, { domID });
      componentList[editIndex] = vd;
    } else if ("delete" === changeType) {
      let { domID } = vd;
      let editIndex = _.findIndex(componentList, { domID });
      componentList.splice(editIndex, 1);
      // console.log(editIndex, componentList);
    }

    this.updateComponentList(componentList);
  }

  //删除已添加到页面的组件
  delComponentInListByIndex(index) {
    console.log(index, this.state.componentList[index]);
    this.componentChange("delete", this.state.componentList[index]);
  }

  //打开组件的编辑框
  openComponentEditModal(domType) {
    let { editModalOpenState } = this.state;
    editModalOpenState[domType - 1] = 1;
    this.setState({
      ...this.state,
      editModalOpenState
    });
  }

  //关闭组件的编辑框
  closeComponentEditModal() {
    this.setState({
      ...this.state,
      editModalOpenState: [0, 0, 0, 0, 0], //关闭所有弹窗,将所有数据恢复成初始化
      editModalTmpData: [{}, {}, {}, {}, {}],
      checkboxList: [{ canDel: false }, { canDel: false }],
      radioList: [{ canDel: false }, { canDel: false }]
    });
  }

  //编辑已添加到页面的组件
  editReopenComponentEditModal(ind) {
    let currentEditVD = this.state.componentList[ind];
    let { reeditModalState } = this.state;
    if (
      currentEditVD.domType === 1 || //单行
      currentEditVD.domType === 2 || //多行
      currentEditVD.domType === 5 //分值
    ) {
      reeditModalState[0] = 1;
    } else {
      //单选框 && 复选框
      reeditModalState[1] = 1;
    }
    this.setState({
      ...this.state,
      currentEditVD,
      oldEditVD: JSON.parse(JSON.stringify(currentEditVD)),
      reeditModalState
    });
  }

  //关闭修改组件的编辑框
  closeComponentReeditModal() {
    this.setState({
      ...this.state,
      currentEditVD: {},
      oldEditVD: {},
      reeditModalState: [0, 0]
    });
  }

  //将新增的virtualDOM提交到componentList里
  commitVirtualDOM(ind) {
    let vd = this.state.editModalTmpData[ind];
    // console.log("点击确定时,对应的domTitle", vd, ind);
    let dt = vd.domTitle ? vd.domTitle : "";
    if (!dt.replace(/\s/g, "")) {
      message.warning("标题不能为空!");
      return;
    }

    //检测数组里是否有数据了
    const checkHasValue = arr => {
      for (let item of arr) {
        if (!item.hasOwnProperty("val")) {
          return -2;
        }
        if (item.val.replace(/\s/g, "") === "") {
          return -1;
        }
      }
      let uniqData = _.uniqBy(arr, 'val');
      if (uniqData.length < arr.length) {
        return -3
      }
      return 0;
    };

    if (2 === ind) {
      //如果新增的是单选框,则还需要单选数据放到vd里
      let list = this.state.checkboxList;
      let check = checkHasValue(list);
      if (check === 0) {
        vd.domValue = list.map(item => item.val);
      } else if (check === -2) {
        message.warning("有选项未填写!");
        return;
      } else if (check === -1) {
        message.warning("请至少填写两个选项!");
        return;
      } else if (check === -3) {
        message.warning("选项名称重复，请修改！");
        return;
      }
    }

    if (3 === ind) {
      //如果新增的是多选框,则还需要多选数据放到vd里
      let check = checkHasValue(this.state.radioList);
      if (check === 0) {
        vd.domValue = this.state.radioList.map(item => item.val);
      } else if (check === -2) {
        message.warning("选项未填写!");
        return;
      } else if (check === -1) {
        message.warning("至少填写两个选项!");
        return;
      } else if (check === -3) {
        message.warning("选项名称重复，请修改！");
        return;
      }
    }

    // console.log(3);
    this.componentChange("add", vd);
    this.closeComponentEditModal();
  }

  //将重新修改的virtualDOM提交到componentList里
  commitReeditVirtualDOM() {
    //mj
    let doms = this.state.oldEditVD;
    //old
    // let doms = this.state.currentEditVD;
    let domTitleWithoutSpace = doms.domTitle.replace(/\s/g, "");
    console.log(doms);
    if (domTitleWithoutSpace === "") {
      message.warning("标题不能为空!");
      return;
    }
    //检测数组里是否有数据了
    const checkHasValue = arr => {
      let labelAll = false;
      let noneNum = 0;
      console.log(arr);
      for (let item of arr) {
        // mj
        if (!item.hasOwnProperty("label") || item.label === '') {
          labelAll = true;
          //old
          // if (!item.hasOwnProperty("label")) {
          // return -2;
        }
        if (item.label && item.label !== "") {
          //mj 
          noneNum++;
          //old
          // return -1;
        }
      }
      let uniqData = _.uniqBy(arr, 'label');
      if (labelAll) {
        return -2;
      } else if (noneNum < 2) {
        return -1;
      } else if (uniqData.length < arr.length) {
        return -3
      }
      return 0;
    };

    if (3 === doms.domType) {
      //如果新增的是单选框,则还需要单选数据放到vd里
      let list = doms.renderValue;
      let check = checkHasValue(list);
      if (check === -2) {
        message.warning("有选项未填写!");
        return;
      } else if (check === -1) {
        message.warning("请至少填写两个选项!");
        return;
      } else if (check === -3) {
        message.warning("选项名称重复，请修改！");
        return;
      }
    }

    if (4 === doms.domType) {
      //如果新增的是多选框,则还需要多选数据放到vd里
      let list = doms.renderValue;
      let check = checkHasValue(list);
      if (check === 0) {
        //old
        // doms.domValue = list.map(item => item.label);
      } else if (check === -2) {
        message.warning("选项未填写!");
        return;
      } else if (check === -1) {
        message.warning("至少填写两个选项!");
        return;
      } else if (check === -3) {
        message.warning("选项名称重复，请修改！");
        return;
      }
    }
    //mj 
    this.setState({ currentEditVD: this.state.oldEditVD })
    this.componentChange("edit", this.state.oldEditVD);
    //old
    // this.componentChange("edit", this.state.currentEditVD);

    this.closeComponentReeditModal();
  }

  //保存表单的操作
  //提取componentList转成json字符串发给后端保存
  async saveFormHandle() {
    // this.setState({ isTip: false })
    let formNameWithoutSpace = this.state.componentList[0].domValue[0].replace(
      /\s/g,
      ""
    );
    if (formNameWithoutSpace === "") {
      message.warning("评议表标题不能为空!");
      return;
    }

    let pr = {
      domJson: JSON.stringify(this.state.componentList),
      formName: this.state.componentList[0].domValue[0]
    };
    if (!this.state.isCreateNewForm) {
      pr.formID = this.state.currentFormID;
    }
    const res = await formEdit(pr);
    if (res.result && res.code === "200") {
      this.setState(
        {
          ...this.state,
          componentList: [
            {
              domType: 0, //0 表单标题; 1 单行文本框;2 多行文本框;3 单选框;4 多选框;5 分值题,-1 主观评价,写死;-2 整体评价,写死;
              domTitle: "标题", //展示给用户看到的标题
              domMark: "", //展示给用户看到的备注
              domID: "dom0", //DOM-id 单选框是否同组互斥也由此值控制
              domValue: ["新增评议表"]
            },
            {
              domType: -1,
              domID: "dom-1",
              domValue: [""]
            },
            {
              domType: -2,
              domID: "dom-2",
              domValue: [""]
            }
          ],
          isTip: false
        },
        () => {
          this.props.history.push("/home/tpk/pksz/pybgl");
          // this.props.history.goBack();
        }
      );
    } else {
      this.setState({ isTip: true })
      message.info(res.message)
    }
  }

  //设置表单主标题
  setFormTitle(value) {
    let { componentList } = this.state;
    componentList[0].domValue[0] = value;
    this.setState({
      ...this.state,
      componentList,
      isTip: true
    });
  }

  //设置virtual dom 的title
  //继承baseVD,设置相关参数
  setVDTitle(e, domType) {
    if (e.target.value) {
      let { editModalTmpData } = this.state;
      //将对应的对象合并
      let vd = {
        ...editModalTmpData[domType - 1],
        domType,
        domTitle: e.target.value,
        domID: `uid${Math.floor(Math.random() * 1e10).toString(16)}`
        // domValue: []
      };

      editModalTmpData[domType - 1] = vd;
      this.setState({
        ...this.state,
        editModalTmpData,
        isTip: true
      });
    }

    // domType: 1,
    // domTitle: "",
    // domMark: "",
    // domID: `uid${Math.floor(Math.random() * 1e10).toString(16)}`,
    // domValue: []
  }

  //编辑当前修改组件的title
  editCurrentVDTitle({ target: { value } }) {
    //mj
    let { oldEditVD } = this.state;
    oldEditVD.domTitle = value;
    this.setState({
      ...this.state,
      oldEditVD,
      isTip: true
    });

    //old
    // let { currentEditVD } = this.state;
    // currentEditVD.domTitle = value;
    // this.setState({
    //   ...this.state,
    //   currentEditVD
    // });
  }

  //设置vd副标题
  setVDMark(e, domType) {
    if (e.target.value) {
      let { editModalTmpData } = this.state;
      let vd = {
        ...editModalTmpData[domType - 1],
        domMark: e.target.value
      };
      editModalTmpData[domType - 1] = vd;
      this.setState({
        ...this.state,
        editModalTmpData,
        isTip: true
      });
    }
  }

  //编辑当前修改组件的副标题
  editCurrentVDMark({ target: { value } }) {
    //mj 
    let { oldEditVD } = this.state;
    oldEditVD.domMark = value;
    this.setState({
      ...this.state,
      oldEditVD,
      isTip: true
    });

    //old
    // let { currentEditVD } = this.state;
    // currentEditVD.domMark = value;
    // this.setState({
    //   ...this.state,
    //   currentEditVD
    // });
  }

  //编辑组件中增加单选按钮的点击事件
  addCheckboxInList() {
    let { checkboxList } = this.state;
    checkboxList.push({ canDel: true });
    this.setState({
      ...this.state,
      checkboxList,
      isTip: true
    });
  }

  //编辑组件中删除单选按钮的点击事件
  delCheckboxInList() {
    let { checkboxList } = this.state;
    checkboxList.pop();
    this.setState({
      ...this.state,
      checkboxList,
      isTip: true
    });
  }

  //单选框编辑事件
  checkboxItemEdit(index, value) {
    let { checkboxList } = this.state;
    checkboxList[index].val = value;
    this.setState({
      ...this.state,
      checkboxList,
      isTip: true
    });
  }

  //复选框增加
  addRadioInList() {
    let { radioList } = this.state;
    radioList.push({ canDel: true });
    this.setState({
      ...this.state,
      radioList,
      isTip: true
    });
  }

  //复选框删除
  delRadioInList() {
    let { radioList } = this.state;
    radioList.pop();
    this.setState({
      ...this.state,
      radioList,
      isTip: true
    });
  }

  //复选框编辑
  radioItemEdit(index, value) {
    let { radioList } = this.state;
    radioList[index].val = value;
    this.setState({
      ...this.state,
      radioList,
      isTip: true
    });
  }

  //编辑当前修改组件的选项值,只会针对于单选框和复选框
  editCurrentVDValue(changeType, value = "", ind = 0) {
    //mj
    let { oldEditVD } = this.state;
    if ("add" === changeType) {
      // console.log(ind);
      oldEditVD.domValue.push(value);
      oldEditVD.renderValue.push({ label: value, value: value + '-' + JSON.stringify(oldEditVD.domValue.length - 1) });
    } else if ("edit" === changeType) {
      oldEditVD.domValue[ind] = value;
      oldEditVD.renderValue[ind].label = value;
    } else if ("delete" === changeType) {
      oldEditVD.domValue.pop();
      oldEditVD.renderValue.pop();
    }

    // console.log(oldEditVD);
    this.setState({
      ...this.state,
      oldEditVD,
      isTip: true
    });

    //old
    // let { currentEditVD } = this.state;

    // if ("add" === changeType) {
    //   currentEditVD.domValue.push(value);
    // } else if ("edit" === changeType) {
    //   currentEditVD.domValue[ind] = value;
    // } else if ("delete" === changeType) {
    //   currentEditVD.domValue.pop();
    // }

    // this.setState({
    //   ...this.state,
    //   currentEditVD
    // });
  }

  render() {
    return (
      <>
        <div>
          <RouterPrompt promptBoolean={this.state.isTip}></RouterPrompt>
        </div>
        <div>
          <div className="lean-form-widgetList">
            {/* 组件选择范围 */}
            {/* <h3>选择组件</h3> */}
            {this.state.componentWidgetList.map((item, index) => {
              return (
                <Button
                  key={index}
                  className="lean-form-widgetAddBtn"
                  onClick={this.openComponentEditModal.bind(
                    this,
                    item.componentType
                  )}
                  style={{ background: item.bgColor }}
                >
                  {item.componentName}
                </Button>
              );
            })}
          </div>
          <div className="lean-form-formZone">
            <div className="lean-form-actionBar">
              {/* 表单顶部操作栏 */}
              <div>
                {" "}
                <span className="lean-form-actionBarTitle"></span>
                <span
                  style={{
                    fontWeight: 900,
                    fontSize: 18,
                    verticalAlign: "middle"
                  }}
                >
                  创建评议表
                </span>
              </div>
              <div>
                <Button
                  onClick={this.saveFormHandle.bind(this)}
                  style={{ background: "#5acc9a", border: 0, color: "#fff" }}
                >
                  保存
                </Button>
                <Button
                  onClick={this.isShowPreviewBox.bind(this, true)}
                  // style={{ background: "#5aa6ee", border: 0 }}
                  type="primary"
                >
                  预览
                </Button>
                <Button
                  onClick={() => {
                    // this.setState({
                    //   ...this.state,
                    //   componentList: this.props.componentList
                    // });
                    this.props.history.goBack();
                  }}
                  style={{ color: "#000" }}
                >
                  取消
                </Button>
              </div>
            </div>
            <HrStyle mt={0} />
            <DynamicForm
              isEdit={false}
              isPreview={false}
              componentList={this.state.componentList}
              delComponentInListByIndex={this.delComponentInListByIndex.bind(
                this
              )}
              editComponentInListByIndex={this.editReopenComponentEditModal.bind(
                this
              )}
              setFormTitle={this.setFormTitle.bind(this)}
            />
          </div>
        </div>
        {/* 表单预览Modal */}
        <Modal
          visible={this.state.isPreviewBoxHide}
          footer={null}
          onCancel={this.isShowPreviewBox.bind(this, false)}
          width="50%"
        >
          <DynamicForm
            isEdit={true}
            isPreview={true}
            componentList={this.state.componentList}
            delComponentInListByIndex={this.delComponentInListByIndex.bind(
              this
            )}
          />
        </Modal>
        {/* 表单组件编辑Modal */}
        {/* 单行文本框 */}
        <Modal
          visible={this.state.editModalOpenState[0] === 1}
          footer={null}
          onCancel={this.closeComponentEditModal.bind(this)}
          destroyOnClose={true}
        >
          <p style={{ textAlign: "center" }}>新建单行文本框</p>
          <HrStyle mt={0} />
          <div>
            <span style={{ color: "red" }}> * </span>标题 :{" "}
            <Input
              placeholder="标题"
              style={{ width: "85%" }}
              onBlur={e => {
                // 第一个参数e是取值,第二个参数是domType
                this.setVDTitle(e, 1);
              }}
              maxLength={20}
            />
            <br />
            <br />
            <span style={{ color: "#fff" }}> * </span>备注 :{" "}
            <Input.TextArea
              placeholder="备注"
              autoSize={{ maxRows: 5, minRows: 5 }}
              style={{ resize: "none", width: "85%", verticalAlign: "top" }}
              onBlur={e => {
                this.setVDMark(e, 1);
              }}
              maxLength={200}
            />
          </div>
          <HrStyle />
          <div className="lean-form-editModalFooter">
            <Button
              type="primary"
              onClick={this.commitVirtualDOM.bind(this, 0)}
            >
              确定
            </Button>
            <Button onClick={this.closeComponentEditModal.bind(this)}>
              取消
            </Button>
          </div>
        </Modal>
        {/* 多行文本框 */}
        <Modal
          visible={this.state.editModalOpenState[1] === 1}
          footer={null}
          onCancel={this.closeComponentEditModal.bind(this)}
          destroyOnClose={true}
        >
          <p style={{ textAlign: "center" }}>新建多行文本框</p>
          <HrStyle mt={0} />
          <div>
            <span style={{ color: "red" }}> * </span>标题 :{" "}
            <Input
              placeholder="标题"
              style={{ width: "85%" }}
              onBlur={e => {
                this.setVDTitle(e, 2);
              }}
              maxLength={20}
            />
            <br />
            <br />
            <span style={{ color: "#fff" }}> * </span>备注 :{" "}
            <Input.TextArea
              placeholder="备注"
              autoSize={{ maxRows: 5, minRows: 5 }}
              style={{ resize: "none", width: "85%", verticalAlign: "top" }}
              onBlur={e => {
                this.setVDMark(e, 2);
              }}
              maxLength={200}
            />
          </div>
          <HrStyle />
          <div className="lean-form-editModalFooter">
            <Button
              type="primary"
              onClick={this.commitVirtualDOM.bind(this, 1)}
            >
              确定
            </Button>
            <Button onClick={this.closeComponentEditModal.bind(this)}>
              取消
            </Button>
          </div>
        </Modal>
        {/* 单选框 */}
        <Modal
          visible={this.state.editModalOpenState[2] === 1}
          footer={null}
          onCancel={this.closeComponentEditModal.bind(this)}
          destroyOnClose={true}
        >
          <p style={{ textAlign: "center" }}>新建单选题</p>
          <HrStyle mt={0} />
          <div>
            <span style={{ color: "red" }}> * </span>标题 :{" "}
            <Input
              placeholder="标题"
              style={{ width: "85%" }}
              onBlur={e => {
                // 第一个参数e是取值,第二个参数是domType
                this.setVDTitle(e, 3);
              }}
              maxLength={20}
            />
            <br />
            <br />
            <span style={{ color: "#fff" }}> * </span>备注 :{" "}
            <Input.TextArea
              placeholder="备注"
              autoSize={{ maxRows: 5, minRows: 5 }}
              style={{ resize: "none", width: "85%", verticalAlign: "top" }}
              onBlur={e => {
                this.setVDMark(e, 3);
              }}
              maxLength={200}
            />
            <br />
            <br />
            <span style={{ color: "#fff" }}> * </span>选项 :{" "}
            <div className="lean-form-editCheckboxList">
              {this.state.checkboxList.map((item, index) => {
                return (
                  <div key={index} className="lean-form-editCheckboxItem">
                    <Input
                      placeholder={`选项${index + 1}`}
                      style={{ width: "85%" }}
                      onBlur={e => {
                        this.checkboxItemEdit(index, e.target.value);
                      }}
                      maxLength={20}
                    />
                    {item.canDel &&
                      this.state.checkboxList.length - 1 == index ? (
                        <SVG
                          title="删除"
                          type="quxiao"
                          style={{ fill: "red" }}
                          onClick={this.delCheckboxInList.bind(this)}
                        />
                      ) : (
                        ""
                      )}
                  </div>
                );
              })}
              <div
                className="lean-form-editCheckboxAddBtn"
                onClick={this.addCheckboxInList.bind(this)}
              >
                <SVG type="tj" title="添加选项" />{" "}
                <span style={{ color: "#64acef" }}>添加选项</span>
              </div>
            </div>
          </div>
          <HrStyle />
          <div className="lean-form-editModalFooter">
            <Button
              type="primary"
              onClick={this.commitVirtualDOM.bind(this, 2)}
            >
              确定
            </Button>
            <Button onClick={this.closeComponentEditModal.bind(this)}>
              取消
            </Button>
          </div>
        </Modal>
        {/* 多选框 - 新建 */}
        <Modal
          visible={this.state.editModalOpenState[3] === 1}
          footer={null}
          onCancel={this.closeComponentEditModal.bind(this)}
          destroyOnClose={true}
        >
          <p style={{ textAlign: "center" }}>新建多选题</p>
          <HrStyle mt={0} />
          <div>
            <span style={{ color: "red" }}> * </span>标题 :{" "}
            <Input
              placeholder="标题"
              style={{ width: "85%" }}
              onBlur={e => {
                // 第一个参数e是取值,第二个参数是domType
                this.setVDTitle(e, 4);
              }}
              maxLength={20}
            />
            <br />
            <br />
            <span style={{ color: "#fff" }}> * </span>备注 :{" "}
            <Input.TextArea
              placeholder="备注"
              autoSize={{ maxRows: 5, minRows: 5 }}
              style={{ resize: "none", width: "85%", verticalAlign: "top" }}
              onBlur={e => {
                this.setVDMark(e, 4);
              }}
              maxLength={200}
            />
            <br />
            <br />
            <span style={{ color: "#fff" }}> * </span>选项 :{" "}
            <div className="lean-form-editCheckboxList">
              {this.state.radioList.map((item, index) => {
                return (
                  <div key={index} className="lean-form-editCheckboxItem">
                    <Input
                      placeholder={`选项${index + 1}`}
                      style={{ width: "85%" }}
                      onBlur={e => {
                        this.radioItemEdit(index, e.target.value);
                      }}
                      maxLength={20}
                    />
                    {item.canDel && this.state.radioList.length - 1 == index ? (
                      <SVG
                        type="quxiao"
                        style={{ fill: "red" }}
                        onClick={this.delRadioInList.bind(this)}
                      />
                    ) : (
                        ""
                      )}
                  </div>
                );
              })}
              <div
                className="lean-form-editCheckboxAddBtn"
                onClick={this.addRadioInList.bind(this)}
              >
                <SVG type="tj" />{" "}
                <span style={{ color: "#64acef" }}>添加选项</span>
              </div>
            </div>
          </div>
          <HrStyle />
          <div className="lean-form-editModalFooter">
            <Button
              type="primary"
              onClick={this.commitVirtualDOM.bind(this, 3)}
            >
              确定
            </Button>
            <Button onClick={this.closeComponentEditModal.bind(this)}>
              取消
            </Button>
          </div>
        </Modal>
        {/* 分值题 */}
        <Modal
          visible={this.state.editModalOpenState[4] === 1}
          footer={null}
          onCancel={this.closeComponentEditModal.bind(this)}
          destroyOnClose={true}
        >
          <p style={{ textAlign: "center" }}>新建分值题</p>
          <HrStyle bgColor="#c0c0c0" mt={0} />
          <div>
            <span style={{ color: "red" }}> * </span>标题 :{" "}
            <Input
              placeholder="标题"
              style={{ width: "85%" }}
              onBlur={e => {
                // 第一个参数e是取值,第二个参数是domType
                this.setVDTitle(e, 5);
              }}
              maxLength={20}
            />
            <br />
            <br />
            <span style={{ color: "#fff" }}> * </span>备注 :{" "}
            <Input.TextArea
              placeholder="备注"
              autoSize={{ maxRows: 5, minRows: 5 }}
              style={{ resize: "none", width: "85%", verticalAlign: "top" }}
              onBlur={e => {
                this.setVDMark(e, 5);
              }}
              maxLength={200}
            />
          </div>
          <HrStyle bgColor="#c0c0c0" />
          <div className="lean-form-editModalFooter">
            <Button
              type="primary"
              onClick={this.commitVirtualDOM.bind(this, 4)}
            >
              确定
            </Button>
            <Button onClick={this.closeComponentEditModal.bind(this)}>
              取消
            </Button>
          </div>
        </Modal>

        {/* 单行 多行 分值 三种模式的 修改框 */}
        <Modal
          visible={this.state.reeditModalState[0] === 1}
          footer={null}
          destroyOnClose={true}
          onCancel={this.closeComponentReeditModal.bind(this)}
        >
          <p style={{ textAlign: "center" }}>编辑输入框组件</p>
          <HrStyle mt={0} />
          <div>
            <span style={{ color: "red" }}> * </span>标题 :{" "}
            <Input
              placeholder="标题"
              style={{ width: "85%" }}
              onBlur={e => {
                this.editCurrentVDTitle(e);
              }}
              maxLength={20}
              defaultValue={this.state.currentEditVD.domTitle || ""}
            />
            <br />
            <br />
            <span style={{ color: "#fff" }}> * </span>备注 :{" "}
            <Input.TextArea
              placeholder="备注"
              autoSize={{ maxRows: 5, minRows: 5 }}
              style={{ resize: "none", width: "85%", verticalAlign: "top" }}
              onBlur={e => {
                this.editCurrentVDMark(e);
              }}
              maxLength={200}
              defaultValue={this.state.currentEditVD.domMark || ""}
            />
          </div>
          <HrStyle />
          <div className="lean-form-editModalFooter">
            <Button
              type="primary"
              onClick={this.commitReeditVirtualDOM.bind(this)}
            >
              修改
            </Button>
            <Button onClick={this.closeComponentReeditModal.bind(this)}>
              取消
            </Button>
          </div>
        </Modal>
        {/* 单选 复选框 两种模式的 修改框 */}
        <Modal
          visible={this.state.reeditModalState[1] === 1}
          footer={null}
          destroyOnClose={true}
          onCancel={this.closeComponentReeditModal.bind(this)}
        >
          <p style={{ textAlign: "center" }}>编辑选择题组件</p>
          <HrStyle mt={0} />
          <div>
            <span style={{ color: "red" }}> * </span>标题 :{" "}
            <Input
              placeholder="标题"
              style={{ width: "85%" }}
              onBlur={e => {
                this.editCurrentVDTitle(e);
              }}
              maxLength={20}
              defaultValue={this.state.currentEditVD.domTitle || ""}
            />
            <br />
            <br />
            <span style={{ color: "#fff" }}> * </span>备注 :{" "}
            <Input.TextArea
              placeholder="备注"
              autoSize={{ maxRows: 5, minRows: 5 }}
              style={{ resize: "none", width: "85%", verticalAlign: "top" }}
              onBlur={e => {
                this.editCurrentVDMark(e);
              }}
              maxLength={200}
              defaultValue={this.state.currentEditVD.domMark || ""}
            />
            <br />
            <br />
            <span style={{ color: "#fff" }}> * </span>选项 :{" "}
            <div className="lean-form-editCheckboxList">
              {/* mj */}
              {this.state.oldEditVD.domValue &&
                this.state.oldEditVD.domValue.map((item, index) => {
                  //old
                  // {
                  //   this.state.currentEditVD.domValue &&
                  //   this.state.currentEditVD.domValue.map((item, index) => {
                  return (
                    <div key={index} className="lean-form-editCheckboxItem">
                      <Input
                        placeholder={`选项${index + 1}`}
                        style={{ width: "85%" }}
                        onBlur={e => {
                          this.editCurrentVDValue(
                            "edit",
                            e.target.value,
                            index
                          );
                        }}
                        maxLength={20}
                        defaultValue={item}
                      />
                      {index > 1 &&
                        // mj
                        this.state.oldEditVD.domValue.length - 1 == index ? (
                          // old
                          // this.state.currentEditVD.domValue.length - 1 == index ? (
                          <SVG
                            type="quxiao"
                            style={{ fill: "red" }}
                            onClick={this.editCurrentVDValue.bind(this, "delete")}
                          />
                        ) : (
                          ""
                        )}
                    </div>
                  );
                })
              }
              <div
                className="lean-form-editCheckboxAddBtn"
                onClick={this.editCurrentVDValue.bind(this, "add", "")}
              >
                <SVG type="tj" />{" "}
                <span style={{ color: "#64acef" }}>添加选项</span>
              </div>
            </div>
          </div>
          <HrStyle />
          <div className="lean-form-editModalFooter">
            <Button
              type="primary"
              onClick={this.commitReeditVirtualDOM.bind(this)}
            >
              修改
            </Button>
            <Button onClick={this.closeComponentReeditModal.bind(this)}>
              取消
            </Button>
          </div>
        </Modal>
      </>
    );
  }
}

class HrStyle extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <hr
        style={{
          marginTop: this.props.mt || 20,
          marginBottom: this.props.mb || 10,
          border: "none",
          background: this.props.bgColor || "#c0c0c0",
          height: 1
        }}
      />
    );
  }
}

FormCreateOrDesign.propTypes = {
  // componentList: PropTypes.array,
  componentWidgetList: PropTypes.array
};

FormCreateOrDesign.defaultProps = {
  componentWidgetList: defaultComponentWidgetList
  // componentList: defaultComponentListInitial
};
