/*
 * @Author: wangsong 
 * @Date: 2020-02-12 10:04:15 
 * @Last Modified by: hf
 * @Last Modified time: 2021-03-24 13:42:58
 * 学校画像-基本信息
 */
import React, { Component } from 'react';
import { Select, message } from "antd";
import SelTime from "../../../components/image/ws-selTime";
import G from "../../../../config/g";
import { request } from './../../../../util/request';
import moment from 'moment';
import SVG from './../../../public/svg';
const { Option } = Select;
class Jbxx extends Component {
  constructor(props) {
    super(props);
    this.state = {
      params: {
        couTypeId: G.ISCED_courseTypeList[0].couTypeId,
        timeType: "1",
        selTime: ""
      },
      topParams: {
      },
      baseInfo: {
        collegeCount: 0,
        majorCount: 0,
        courseCount: 0,
        teaStuRatio: "0:0",
        teacherCount: 0,
        studenCount: 0,
        bdRoom: 0,
        totalRoom: 0,
        aiRoom: 0,
        rbRoom: 0,
        paRoom: 0,
        stRoom: 0,
        teRoom: 0,
        clRoom: 0,
      },
      inception: false//初始    

    };
    this.onChangeCouType = this.onChangeCouType.bind(this);
  }
  componentDidMount () {
    let { params } = this.state;
    G.ISCED_semesterList.map((item) => {
      if (item.semesterId === this.props.topParams.semesterId) {
        if (item.semesterId === G.ISCED_cutSemesterData.semesterId
          && G.ISCED_cutSemesterData.isCutSemester === "1") {
          params.selTime = moment(new Date()).format('YYYY-MM-DD');
        } else {
          params.selTime = item.startTime;
        }
      }
    });
    this.setState({ params, topParams: this.props.topParams, inception: true });
    this.getBaseInfo(this.props.topParams);
    this.props.editParams({ ...params, ...this.props.topParams });

  }
  componentWillReceiveProps (props) {
    //头部条件改变
    if (this.state.inception && Object.getOwnPropertyNames(props.topParams).length && JSON.stringify(props.topParams) !== JSON.stringify(this.state.topParams)) {
      let { params } = this.state;
      G.ISCED_semesterList.map((item) => {
        if (item.semesterId === props.topParams.semesterId) {
          if (item.semesterId === G.ISCED_cutSemesterData.semesterId
            && G.ISCED_cutSemesterData.isCutSemester === "1") {
            params.selTime = moment(new Date()).format('YYYY-MM-DD');
          } else {
            params.selTime = item.startTime;
          }
        }
      });
      params.timeType = "1";
      params.couTypeId = G.ISCED_courseTypeList[0].couTypeId;
      this.setState({ params, topParams: props.topParams });
      this.getBaseInfo(props.topParams);
      this.props.editParams({ ...params, ...props.topParams });
    }
  }
  /**
   * @description 获取基本信息
   */
  getBaseInfo (topParams) {
    request('/api/image/getSchoolBaseInfo', topParams, (res) => {
      if (res.result) {
        this.setState({ baseInfo: res.data });
      } else {
        message.warning(res.message);
      }
    })
  }
  /**
   * @description 改变课程类型
   */
  onChangeCouType (value) {
    let { params, topParams } = this.state;
    params.couTypeId = value;
    this.setState({
      params
    });
    this.props.editParams({ ...params, ...topParams });
  }
  /**
   * @description 修改统计时间
   */
  editTime (obj) {
    let { params, topParams } = this.state;
    params = { ...params, ...obj };
    this.setState({
      params
    });
    this.props.editParams({ ...params, ...topParams });
  }
  render () {
    let { params, topParams, baseInfo } = this.state;
    return (
      <div className="ws-scl_jbxx">
        <div className="ws-scl-jbxx-exhibition">
          <div className="ws-exhibition-count">
            {/* <div>
                            <div>
                                <SVG type="img_xy" /><span>学院数量</span>
                                <span>{baseInfo.collegeCount}</span><span>个</span>
                            </div>
                            <div>
                                <SVG type="img_zy" /><span>专业数量</span>
                                <span>{baseInfo.majorCount}</span><span>个</span>
                            </div>
                            <div>
                                <SVG type="img_kc" /><span>课程数量</span>
                                <span>{baseInfo.courseCount}</span><span>门</span>
                            </div>
                        </div> */}
          </div>
          <div className="ws-exhibition-ratio">
            {/* <div><SVG type="img_ssb" />师生比</div>
                        <div>{baseInfo.teaStuRatio}</div>
                        <div><span>授课教师人数 : </span><span>{baseInfo.teacherCount}</span></div>
                        <div><span>学生人数 : </span><span>{baseInfo.studenCount}</span></div> */}
          </div>
          <div className="ws-exhibition-build">
            <div><SVG type="img_js" />教室建设</div>
            <div>
              <div>
                <div>{baseInfo.bdRoom}/{baseInfo.totalRoom}</div>
                <div>建设教室/总教室</div>
              </div>
              <div>
                <div>
                  <div>教室类型</div>
                  <div>
                    <div>{baseInfo.aiRoom}间</div>
                    <div>AI录播教室</div>
                  </div>
                  <div>
                    <div>{baseInfo.rbRoom}间</div>
                    <div>常态录播教室</div>
                  </div>
                  <div>
                    <div>{baseInfo.paRoom}间</div>
                    <div>标考录播教室</div>
                  </div>
                </div>
                <div>
                  <div>AI监管</div>
                  <div>
                    <div>{baseInfo.stRoom}间</div>
                    <div>学生出勤监测</div>
                  </div>
                  <div>
                    <div>{baseInfo.teRoom}间</div>
                    <div>教师考勤监测</div>
                  </div>
                  {/* <div>
                                        <div>{baseInfo.clRoom}间</div>
                                        <div>课堂行为监测</div>
                                    </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="ws-scl-jbxx-selTime" id="stick-nav">
          <div className="ws-selOption-shell">
            <Select dropdownClassName={"ws-topType-down"} getPopupContainer={triggerNode => triggerNode.parentNode} className="ws-select" placeholder={"请选择课程类别"} onChange={this.onChangeCouType} value={params.couTypeId}>
              {
                G.ISCED_courseTypeList.map((item, index) => (
                  <Option key={item.couTypeId} value={item.couTypeId}>{item.couTypeName}</Option>
                ))
              }

            </Select>
            <SelTime topParams={topParams} editTime={this.editTime.bind(this)} />
          </div>
        </div>
      </div>
    );
  }
}

export default Jbxx;
