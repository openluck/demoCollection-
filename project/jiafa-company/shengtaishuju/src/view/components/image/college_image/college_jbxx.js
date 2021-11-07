/*
 * @Author: wangsong 
 * @Date: 2020-02-12 10:04:15 
 * @Last Modified by: hf
 * @Last Modified time: 2021-03-24 13:48:18
 * 学院画像-基本信息
 */
import React, { Component } from 'react';
import { Select, message } from "antd";
import SelTime from "../ws-selTime";
import ReactEcharts from 'echarts-for-react';
import SelInput from "../../../public/searSel/element";
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
        majorCount: 0,
        courseCount: 0,
        classesCount: 0,
        coursePlan: 0,
        alreadyHour: 0,
        totalHour: 0,
        lecturerCount: 0,
        perCapitaHour: 0
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
    request('/api/image/getCollegeBaseInfo', topParams, (res) => {
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
  getOption () {
    let { baseInfo } = this.state;
    let
      option = {
        grid: {
          left: '0%',
          right: '0%',
          containLabel: false
        },
        xAxis: {
          type: 'value',
          show: false
        },
        yAxis: {
          type: 'category',
          show: false
        },
        series: [
          {
            type: 'bar',
            stack: '总量',
            barWidth: 10,
            itemStyle: {
              normal: {
                color: '#eeb356',
                barBorderRadius: [20, 0, 0, 20],
              }
            },
            data: [baseInfo.coursePlan]
          },
          // {
          //     type: 'bar',
          //     stack: '总量',
          //     barGap: '10%',

          //     itemStyle:{
          //         normal: {
          //             color: '#0e88fd',
          //             height:50,
          //             barMinWidth: 50,
          //             shadowBlur: [0, 0, 0, 0],
          //             shadowColor: '#ff5624',
          //             shadowOffsetY: 0,
          //         }
          //     },
          //     data: [10]
          // },
          {  // 灰色背景柱状图
            type: 'bar',
            barGap: '-100%',
            barWidth: 10,
            legendHoverLink: false,
            itemStyle: {
              normal: {
                color: '#f0f2f5',
                barBorderRadius: [20, 20, 20, 20],
              }
            },
            zlevel: -9,
            data: ['100']
          },
        ]
      };
    return option
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
        <div className="ws-col-jbxx-exhibition">
          <div>
            {/* <div>
                            <div>
                                <SVG type="img_zy" /><span>专业数量</span>
                                <span>{baseInfo.majorCount}</span><span>个</span>
                            </div>
                            <div>
                                <SVG type="img_kc" /><span>课程数量</span>
                                <span>{baseInfo.courseCount}</span><span>门</span>
                            </div>
                            <div>
                                <SVG type="img_jxb" /><span>教学班数量</span>
                                <span>{baseInfo.classesCount}</span><span>个</span>
                            </div>
                        </div> */}
          </div>
          {/* <div>
                        <div><SVG type="img_sk" />课程进度</div>
                        <div>{baseInfo.coursePlan}%</div>
                        <div>
                            <ReactEcharts
                                option={this.getOption()}
                                style={{ height: '30%', width: '100%' }}
                            />
                        </div>
                        <div>
                            <span>已上课时/总课时</span>
                            <span>{baseInfo.alreadyHour}/{baseInfo.totalHour}</span>
                        </div>
                    </div> */}
          <div>
            <div><SVG type="img_sk" />授课情况</div>
            <div>
              <div>
                <p>授课教师数</p>
                <p><span>{baseInfo.lecturerCount}</span><span>人</span></p>
              </div>
              <div>
                <p>人均节次</p>
                <p><span>{baseInfo.perCapitaHour}</span><span>节</span></p>
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
