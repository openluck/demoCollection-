/*
 * @Author: JC.Liu 
 * @Date: 2019-04-13 00:50:52 
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-11-18 16:34:34
 * 视频截图modal
 */
import React, { Component } from "react";
import { Modal, Button, Input, message } from "antd";
// import { SVG } from "./../components/tpk/base.jsx";
import "./player.scss";
// import noImg from "./../../media/picture/xq-default-bg.png";
// import { G } from "./../../js/g";
// import _x from "./../../js/_x/index";
// const Request = _x.util.request.request;
import { request} from './../../util/request_2.12'
const { TextArea } = Input;
export default class ScreenShotModal extends Component {
  state = {
    list: [],
    textarea: ""
  };

  componentDidMount() {
    this.getWjLit();
  }

  componentWillReceiveProps(newPorps) {
    // console.log("new props:", newPorps);
  }

  handleLi = value => {
    // let allTypeList = G.wjList;
    let { list } = this.state;
    let index = list.indexOf(value);

    if (index > -1) {
      list.splice(index, 1);
    } else {
      list.push(value);
    }

    this.setState({
      list
    });
  };

  textarea = e => {
    this.setState({
      textarea: e.target.value
    });
  };

  getWjLit = () => {
    request("api/web/teacommon/allType", {}, res => {
      if (res.result && res.code === "200") {
        if (res.data && res.data.typelist && res.data.typelist.length) {
          this.setState({
            wjList: res.data.typelist
          });
        } else {
          this.setState({
            wjList: []
          });
        }
      } else {
        this.setState({
          wjList: []
        });
      }
    });
  };

  // 提交
  confirme = () => {
    let eventRecordTime = new Date().getTime();
    const { base64, id, time } = this.props;
    const { textarea, list } = this.state;

    request(
      "api/web/teacommon/addEvent",
      {
        // id
        curriculumallId: id,
        // base64 图片
        picture: base64,
        // 事件记录时间  点击提交的时间
        eventRecordTime,
        // 事件发生时间 点击截图那一刻的时间
        eventHappenTime: time,
        // 描述信息
        description: textarea,
        // 违纪类型id 数组
        eventTypeList: [...list]
        // // 未知
        // sourceType: 1
      },
      res => {
        if (res.result && res.code === "200") {
          message.success("提交成功！", 2);
          this.props.cancel();
          this.props.callback();
          this.setState({
            list: [],
            textarea: ""
          });
        } else {
          message.error(res.message || "提交失败！", 2);
        }
      }
    );
  };

  render() {
    const { list, textarea, wjList } = this.state;
    return (
      <>
        <Modal
          title="截图"
          footer={null}
          destroyOnClose={true}
          visible={this.props.visible}
          maskClosable={true}
          wrapClassName="JC-shotmodal"
          width={600}
        >
          <React.Fragment>
            <div className="JC-shotmodal-img">
              <img src={this.props.base64} />
            </div>
            <div className="JC-shotmodal-type">
              <ul>
                {wjList && wjList.length
                  ? wjList.map((item, index) => {
                    return (
                      <li
                        key={index}
                        className={
                          this.state.list.indexOf(item.eventTypeId) > -1
                            ? "JC-type-active"
                            : null
                        }
                        onClick={() => this.handleLi(item.eventTypeId)}
                      >
                        {item.eventName}
                      </li>
                    );
                  })
                  : null}
              </ul>
            </div>
            <div className="JC-shotmodal-content">
              <TextArea
                onChange={this.textarea}
                autosize={true}
                placeholder="请输入..."
                maxLength={500}
              />
            </div>
            <div className="JC-shotmodal-footer">
              <Button
                disabled={wjList && wjList.length>0 ? false : true}
                onClick={() => this.confirme()}
              >
                确定
              </Button>
              <Button
                onClick={() => {
                  this.setState({
                    list: [],
                    textarea: ""
                  });
                  this.props.cancel();
                }}
              >
                取消
              </Button>
            </div>
          </React.Fragment>
        </Modal>
      </>
    );
  }
}
