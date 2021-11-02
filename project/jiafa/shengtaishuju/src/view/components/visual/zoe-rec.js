/*
 * @Author: zoe ღ
 * @Date: 2020-02-18 18:56:24
 * @Last Modified by: tj
 * @Last Modified time: 2021-03-22 15:25:00
 */

import React, { Component } from "react";
import { connect } from "react-redux";
import { Spin } from "antd";
@connect(state => state.zoe_recInfo, {})
class ZoeRec extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { ResMes, ResMesLoad } = this.props;
    return (
      <div
        className="zoe-rec-info"
      >
        <div className="zoe-rec-head">资源概况</div>
        <div style={{ height: "calc(100% - 40px)", width: "100%", position: 'relative' }}>
          {ResMesLoad ? (
            <Spin />
          ) : (
              <div style={{ height: "100%", width: '100%' }}>
                <div className="zoe-address-cont">
                  <div className="zoe-address-cont-item">
                    <div className="zoe-address-item"   onClick={() => this.props.history.push("/home/img/org/jbxx")}>
                      <div>
                        <p>教室</p>
                        <p>总数</p>
                      </div>
                      <div>
                        <p>{ResMes.buildingNum || '-'}</p>
                        <p>间</p>
                      </div>
                    </div>
                    <div className="zoe-address-item" onClick={() => this.props.history.push("/home/img/org/jbxx")}>
                      <div>
                        <p>建设</p>
                        <p>教室</p>
                      </div>
                      <div>
                        <p>{ResMes.buildTeacherNum || '-'}</p>
                        <p>间</p>
                      </div>
                    </div>
                  </div>
                  <div className="zoe-res-bg"></div>
                  <div className="zoe-address-cont-item">
                    <div className="zoe-address-item" onClick={() => this.props.history.push("/home/img/org/jbxx")}>
                      <div>
                        <p>授课</p>
                        <p>教师</p>
                      </div>
                      <div>
                        <p>{ResMes.teachTeacherNum || '-'}</p>
                        <p>人</p>
                      </div>
                    </div>
                    <div className="zoe-address-item" onClick={() => this.props.history.push("/home/img/org/jbxx")}>
                      <div>
                        <p>人均</p>
                        <p>授课</p>
                      </div>
                      <div>
                        <p>{ResMes.aveSec || '-'}</p>
                        <p>节次</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="zoe-cnBg">
                  <div className="zoe-Ai-cont">
                    <div className="zoe-Ai-item">
                      <div className="zoe-Ai-left">
                        <span>教室类型</span>
                      </div>
                      <div className="zoe-Ai" onClick={() => this.props.history.push("/home/img/org/jbxx")}>
                        <p>AI录播教室</p>
                        <p>
                          {ResMes.resData.aiRoom}
                          <span>间</span>
                        </p>
                      </div>
                      <div className="zoe-Ai" onClick={() => this.props.history.push("/home/img/org/jbxx")}>
                        <p>常态录播教室</p>
                        <p>
                          {ResMes.resData.rdRoom}
                          <span>间</span>
                        </p>
                      </div>
                      <div className="zoe-Ai" onClick={() => this.props.history.push("/home/img/org/jbxx")}>
                        <p>标考录播教室</p>
                        <p>
                          {ResMes.resData.plRoom}
                          <span>间</span>
                        </p>
                      </div>
                    </div>
                    <div className="zoe-Ai-item">
                      <div className="zoe-Ai-left" >
                        <span>AI监管</span>
                      </div>
                      <div className="zoe-Ai" onClick={() => this.props.history.push("/home/img/org/jbxx")}>
                        <p>学生出勤监测</p>
                        <p>
                          {ResMes.resData.stuAtten}
                          <span>间</span>
                        </p>
                      </div>
                      <div className="zoe-Ai" onClick={() => this.props.history.push("/home/img/org/jbxx")}>
                        <p>教师考勤监测</p>
                        <p>
                          {ResMes.resData.teaAtten}
                          <span>间</span>
                        </p>
                      </div>
                      {/* <div className="zoe-Ai" onClick={() => this.props.history.push("/home/img/org/jbxx")}>
                        <p>课堂行为监测</p>
                        <p>
                          {ResMes.resData.brAtten}
                          <span>间</span>
                        </p>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
    );
  }
}

export default ZoeRec;
