/*
 * @Author: junjie.lean
 * @Date: 2020-01-20 15:49:40
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-07-24 09:26:31
 */

/**
 * @description 根据virtual dom渲染表单列表
 */

import React from "react";
import PropTypes from "prop-types";
import { Input, Checkbox, Radio, InputNumber, Button } from "antd";

import "./../../../../style/tpk/pksz/lean-form.scss";

//主观评价组件
export class SubjectiveComment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: props.isEdit,
      isPreview: props.isPreview,
      domID: props.domID,
      domValue: props.domValue,
      tmpValue: props.domValue ? props.domValue[0] : ""
    };
  }

  DOMEdit() {
    let vd = {
      domType: -1,
      domValue: [this.state.tmpValue],
      domID: "dom-1"
    };
    this.props.changeDOMValue(vd);
  }

  changeHandle(value) {
    this.setState({
      ...this.state,
      tmpValue: value
    });
  }

  render() {
    const editClass = this.state.isEdit
      ? "lean-form-userWidget"
      : "lean-form-userWidget  lean-formstate-lock";
    const previewClass = this.state.isPreview ? "lean-formstate-lock" : "";
    const className = editClass + " " + previewClass;
    return (
      <div className={className}>
        <h3>意见和建议</h3>
        <Input.TextArea
          data-domid={this.state.domID ? this.state.domID : "dom-1"} //意见和建议
          autoSize={{ maxRows: 5, minRows: 5 }}
          style={{ resize: "none" }}
          value={this.state.tmpValue}
          onChange={({ target: { value } }) => {
            this.changeHandle(value);
          }}
          onBlur={() => {
            this.DOMEdit();
          }}
          maxLength={200}
        />
      </div>
    );
  }
}

//打分组件 - 课堂整体评价
export class TotalComment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      val: [
        {
          label: "优",
          value: "A"
        },
        {
          label: "良",
          value: "B"
        },
        {
          label: "中",
          value: "C"
        },
        {
          label: "合格",
          value: "D"
        },
        {
          label: "不合格",
          value: "E"
        }
      ],
      isEdit: props.isEdit,
      isPreview: props.isPreview
    };
  }

  DOMEdit(val) {
    let vd = {
      domType: -2,
      domValue: this.state.val,
      defaultChecked: [val],
      domID: "dom-2"
    };
    // console.log("radio change:", vd);
    this.props.changeDOMValue(vd);
  }

  render() {
    const editClass = this.state.isEdit
      ? "lean-form-userWidget"
      : "lean-form-userWidget  lean-formstate-lock";
    const previewClass = this.state.isPreview ? "lean-formstate-lock" : "";
    const className = editClass + " " + previewClass;
    return (
      <div className={className}>
        <h3>课堂整体评价</h3>
        <Radio.Group
          style={{ marginBottom: 40 }}
          options={this.state.val}
          data-domid={this.props.domID ? this.props.domID : "dom-2"}
          defaultValue={
            this.props.defaultChecked ? this.props.defaultChecked[0] : ""
          }
          onChange={({ target: { value } }) => {
            this.DOMEdit(value);
          }}
        />
        {/* 产品口头要求去掉打分 */}
        {/*
         <h3>2.课堂整体评分</h3>
        <div>
          分值:
          <InputNumber
            min={0}
            max={100}
            placeholder={"请输入"}
            step={1}
            data-domid="totalPoint"
            defaultValue={0}
            formatter={value => Math.round(parseInt(value))}
          />
        </div> */}
      </div>
    );
  }
}

//编辑和删除按钮组件
class EditBtn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  deleteHandleClick(ind) {
    this.props.delComponentInListByIndex(ind + 3);
  }

  editHandleClick(ind) {
    this.props.editComponentInListByIndex(ind + 3);
  }

  render() {
    return (
      <div className="lean-form-editBtnZone">
        {/* {this.state.canDel ? <Button type="danger">删除</Button> : null} */}
        <Button
          type="danger"
          onClick={this.deleteHandleClick.bind(this, this.props.ind)}
        >
          删除
        </Button>
        <Button
          type="primary"
          onClick={this.editHandleClick.bind(this, this.props.ind)}
        >
          编辑
        </Button>
      </div>
    );
  }
}

//单个表单组件的反显组件,循环调用以渲染完成表单
export default class FormReshow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: props.isEdit,
      isPreview: props.isPreview,
      vd: props.vd,
      ind: props.ind
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      ...nextProps
    };
  }

  DOMEdit(vd, domValue) {
    domValue = domValue && domValue[0] ? domValue : [0];
    const { domType } = vd;

    if (domType === 3 || domType === 4) {//单选 多选
      vd.defaultChecked = domValue;
    } else if (domType === 5) {
      let isNum = /^[0-9]*$/.test(domValue);//判断是不是纯数字
      vd.domValue = isNum ? domValue : 0;
    } else {
      vd.domValue = domValue;
    }
    this.props.changeDOMValue(vd);
  }

  //表单展示核心函数,修改请小心!!!
  //根据虚拟DOM返回antd组件.
  DOMCreate(item, index) {
    let dom;
    if (!item) {
      return null;
    }

    //组件的样式逻辑,要兼顾到三种表单模式;

    //表单组件编辑模式:
    const editClassName = this.state.isEdit
      ? ""
      : "lean-form-widgetContainer lean-formstate-lock";

    //表单组件预览模式:
    const previewClassName = this.state.isPreview
      ? "lean-form-widgetContainer-noHover lean-formstate-lock"
      : "";

    const className = editClassName + " " + previewClassName;

    switch (
    item.domType //0 表单标题; 1 单行输入框;2 多行输入框;3 单选框;4 多选框;5 分值题,
    ) {
      case 0: {
        dom = (
          <div className={"lean-form-widgetContainer-noHover"}>
            {/* 当表单属于预览模式或者禁止编辑模式 */}
            {this.state.isPreview || !this.state.isEdit ? (
              <h3
                style={{
                  textAlign: "center",
                  fontSize: 20,
                  fontWeight: "bold"
                }}
              >
                {item.domValue ? item.domValue[0] : ""}
              </h3>
            ) : (
                <Input
                  className={"lean-form-userWidget"}
                  data-domid={item.domID}
                  style={{ textAlign: "center", fontWeight: "bold" }}
                  value={item.domValue ? item.domValue[0] : ""}
                  onChange={({ target: { value } }) => {
                    this.props.setFormTitle(value);
                  }}
                  maxLength={20}
                />
              )}
            <br />
          </div>
        );
        break;
      }
      case 1: {
        dom = (
          <div className={className}>
            <h3>
              {index + 1} . {item.domTitle}
            </h3>
            <h6>{item.domMark}</h6>
            <Input
              className={"lean-form-userWidget"}
              data-domid={item.domID}
              value={item.domValue ? item.domValue[0] : ""}
              onChange={({ target: { value } }) => {
                this.DOMEdit(item, [value]);
              }}
            />
            <br />
            {this.state.isPreview || this.state.isEdit ? null : (
              <EditBtn {...this.props} />
            )}
          </div>
        );
        break;
      }
      case 2: {
        dom = (
          <div className={className}>
            <h3>
              {index + 1} . {item.domTitle}
            </h3>
            <h6>{item.domMark}</h6>
            <Input.TextArea
              className={"lean-form-userWidget"}
              data-domid={item.domID}
              autoSize={{ minRows: 5, maxRows: 5 }}
              style={{ resize: "none" }}
              value={item.domValue ? item.domValue[0] : ""}
              onChange={({ target: { value } }) => {
                this.DOMEdit(item, [value]);
              }}
            />
            <br />
            {this.state.isPreview || this.state.isEdit ? null : (
              <EditBtn {...this.props} />
            )}
          </div>
        );
        break;
      }
      case 3: {
        //单选
        item.renderValue = item.domValue.map((item, index) => {
          return { label: item, value: item + "-" + index };
        });
        dom = (
          <div className={className}>
            <h3>
              {index + 1} . {item.domTitle}
            </h3>
            <h6>{item.domMark}</h6>
            <Radio.Group
              className={"lean-form-userWidget"}
              options={item.renderValue}
              value={item.defaultChecked ? item.defaultChecked[0] : ""}
              onChange={({ target: { value } }) => {
                this.DOMEdit(item, [value]);
              }}
            />
            <br />
            {this.state.isPreview || this.state.isEdit ? null : (
              <EditBtn {...this.props} />
            )}
          </div>
        );
        break;
      }
      case 4: {
        //多选
        item.renderValue = item.domValue.map((item, index) => {
          return { label: item, value: item + "-" + index };
        });
        dom = (
          <div className={className}>
            <h3>
              {index + 1} . {item.domTitle}
            </h3>
            <h6>{item.domMark}</h6>
            <div className={"lean-form-userWidget"}>
              <Checkbox.Group
                options={item.renderValue}
                value={item.defaultChecked ? item.defaultChecked : []}
                onChange={checkValue => {
                  this.DOMEdit(item, checkValue);
                }}
              />
            </div>
            <br />
            {this.state.isPreview || this.state.isEdit ? null : (
              <EditBtn {...this.props} />
            )}
          </div>
        );
        break;
      }
      case 5: {
        dom = (
          <div className={className}>
            <h3>
              {index + 1} . {item.domTitle}
            </h3>
            <h6>{item.domMark}</h6>
            <div className={"lean-form-userWidget"}>
              分值 :{" "}
              <InputNumber
                min={0}
                max={100}
                defaultValue={0}
                value={item.domValue && item.domValue[0] ? item.domValue[0] : 0}
                step={1}
                formatter={value =>
                  value && /^[0-9]*$/.test(value)
                    ? Math.round(parseInt(value)) : 0
                }
                onChange={value => {
                  this.DOMEdit(item, [value]);
                }}
              />
            </div>
            <br />
            {this.state.isPreview || this.state.isEdit ? null : (
              <EditBtn {...this.props} />
            )}
          </div>
        );
        break;
      }
      default: {
        return null;
      }
    }
    return dom;
  }

  render() {
    return this.DOMCreate(this.state.vd, this.state.ind);
  }
}

FormReshow.propTypes = {
  vd: PropTypes.object.isRequired, //virtual dom
  ind: PropTypes.number.isRequired //dom index
};
