/*
 * @Autor: lxx
 * @Date: 2020-01-22 16:07:48 
 * @LastEditors: xq
 * @LastEditTime: 2020-02-21 14:25:21
 * 课程画像
 */

import React, { Component } from 'react';
import { message } from "antd";
import RollContainer from "../../components/image/rollContainer";
import '../../../style/xqKchx.scss';
import Jbxx from "../../components/image/cour_image/cour_jbxx";
import JXZLJskq from '../../components/image/cour_image/kchxJskq'
import JXZLDkl from '../../components/image/cour_image/kchxDkl'
import JXZLQpjzl from '../../components/image/cour_image/kchxQpjzl'
import JXZLSjl from '../../components/image/cour_image/kchxSjl'
import JXZLKtwj from '../../components/image/cour_image/kchxKtwj'
import JxzlJxfx from '../../components/image/cour_image/jxzlJxfx'
import JxzlTjfk from '../../components/image/cour_image/jxzlTjfk'
import JxzlKthd from '../../components/image/cour_image/jxzlKthd'
import JxzlZyqk from '../../components/image/cour_image/jxzlZyqk'
import ItemImg from '../../components/image/itemImg';
import { request } from './../../../util/request';
class CourseImg extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topParams: {},
      params: {},
      scopeParams: {},
      list: []
    };
    this.getList = this.getList.bind(this);
    this.isGetList = this.isGetList.bind(this);
  }
  /**
   * @description 请求列表
   * @param {Object} params 参数
   */
  getList (params) {
    params = { ...params, teacherId: "" };
    request('api/public/teaClassList', params, (res) => {
      if (res.result && res.data) {
        this.setState({
          list: res.data
        });
      } else {
        message.warning(res.message);
      }
    })
  }
  /**
   * @description 判断是否需要请求列表
   * @param {Object} params 参数
   */
  isGetList (params) {
    let scopeParams = { ...params };
    delete scopeParams.selTime;
    delete scopeParams.timeType;
    if (JSON.stringify(scopeParams) !== JSON.stringify(this.state.scopeParams)) {
      this.getList(scopeParams);
      this.setState({ scopeParams });
    }
  }

  /**
   * @description 基础信息选择条件修改回调
   * @param {Object} params 参数
   */
  editParams (params) {
    this.isGetList(params);
    this.setState({ params });
  }
  /**
 * @description 头部下拉修改回调
 * @param {Object} params 参数
 */
  editTopParams (params) {
    this.setState({
      topParams: { ...params }
    })
  }
  render () {
    let { params, topParams, list } = this.state;
    let { match } = this.props;
    return (
      <RollContainer editTopParams={this.editTopParams.bind(this)} noData={topParams.courseId ? false : true} match={match} key={"course"} type={"course"}>
        <div id="jbxx"><Jbxx topParams={topParams} editParams={this.editParams.bind(this)}></Jbxx></div>
        <div className="ws-portrayal-hint">教学秩序</div>
        {/* 教师考勤 */}
        {
          G.ISCED_setInfo.isTeacherCheck === "1"
            ? <ItemImg params={params} id="jskq" title={"教师考勤"} height={1400} >
              <JXZLJskq faParam={params} />
            </ItemImg>
            : ""
        }
        {/* 到课率 */}
        <ItemImg params={params} id="dkl" title={"到课率"} height={1486} >
          <JXZLDkl faParam={params} list={list} />
        </ItemImg>
        {/* 前排就座率 */}
        {
          G.ISCED_setInfo.isFrontRate === "1"
            ? <ItemImg params={params} id="qpjzl" title={"前排就座率"} height={1486} >
              <JXZLQpjzl faParam={params} list={list} />
            </ItemImg>
            : ""
        }
        {/* 低头率 */}
        {
          G.ISCED_setInfo.isHeadLow === "1"
            ? <ItemImg params={params} id="sjl" title={"低头率"} height={1486} >
              <JXZLSjl faParam={params} list={list} />
            </ItemImg>
            : ""
        }
        {/* 课堂违纪 */}
        {
          G.ISCED_setInfo.ifClassroomDiscipline === "1" ?
            <ItemImg params={params} id="ktwj" title={"巡课违纪"} height={1436} >
              <JXZLKtwj faParam={params} list={list} />
            </ItemImg> : ""
        }
        {
          G.ISCED_setInfo.dataAnalyze === "1" ?
            <React.Fragment>
              <div className="ws-portrayal-hint">教学质量</div>
              {/* 教学分析 */}
              <ItemImg params={params} id="jxfx" title={"教学分析"} height={600} >
                <JxzlJxfx faParam={params} />
              </ItemImg>
              {/* 学生听讲分析 */}
              <ItemImg params={params} id="xstjfk" title={"学生听讲反馈"} height={850} >
                <JxzlTjfk faParam={params} />
              </ItemImg>
              {/* v1.21版本删除课堂互动 */}
              {/* <ItemImg params={params} id="kthd" title={"课堂互动"} height={1056} >
                            <JxzlKthd faParam={params} list={list} />
                        </ItemImg> */}
            </React.Fragment> : ""
        }
        {
          G.ISCED_setInfo.multimediaUse === "1" ?
            <React.Fragment>
              <div className="ws-portrayal-hint">资源情况</div>
              <ItemImg params={params} id="dmtsy" title={"多媒体使用"} height={1091} >
                <JxzlZyqk faParam={params} list={list} />
              </ItemImg>
            </React.Fragment> : ""
        }
      </RollContainer>
    );
  }
}

export default CourseImg;