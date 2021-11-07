/*
 * @Author: lxx 
 * @Date: 2020-01-22 16:07:48 
 * @Last Modified by: kyl
 * @Last Modified time: 2021-01-22 10:19:33
 * 学校画像
 */
import React, { Component } from 'react';
import { message } from "antd";
import RollContainer from "../../components/image/rollContainer";
import Jskq from '../../components/image/scl_image/Jskq';
import Jbxx from "../../components/image/scl_image/scl_jbxx";
import Jxfx from '../../components/image/scl_image/Jxfx';
import Tjfk from '../../components/image/scl_image/Tjfk';
import Jsqk from '../../components/image/scl_image/Jsqk';
import Kthd from '../../components/image/scl_image/Kthd';
import Dmt from '../../components/image/scl_image/Dmt';
import SclPublic from '../../components/image/scl_image/Scl_public';
import "../../../style/lj_xxhx.scss";
import ItemImg from '../../components/image/itemImg';
import { request } from './../../../util/request';
class OrganImg extends Component {
  constructor(props) {
    super(props);
    this.state = {
      params: {},
      topParams: {},
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
    params = { ...params, searchValue: "", courseId: "", teacherId: "" };
    request('api/public/getDepartmentList', params, (res) => {
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
    this.setState({
      params
    })
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
  componentDidMount () {

  }
  render () {
    let { params, topParams } = this.state;
    let { match } = this.props;
    return (
      <RollContainer 
        editTopParams={this.editTopParams.bind(this)} 
        noData={topParams.semesterId ? false : true} 
        match={match} 
        key={"organ"} 
        type={"organ"}
      >
        <div id="jbxx"><Jbxx topParams={topParams} editParams={this.editParams.bind(this)} /></div>
        <div className="ws-portrayal-hint">教学秩序</div>
        {
          G.ISCED_setInfo.isTeacherCheck === "1"
            ? <ItemImg params={params} id="jskq" title={"教师考勤"} height={1850} >
              <Jskq params={params} list={this.state.list} />
            </ItemImg>
            : ""
        }
        <ItemImg params={params} id="dkl" title={"到课率"} height={1850} >
          <SclPublic params={params} type={'dkl'} list={this.state.list} />
        </ItemImg>
        {
          G.ISCED_setInfo.isFrontRate === "1"
            ? <ItemImg params={params} id="qpjzl" title={"前排就座率"} height={1850} >
              <SclPublic params={params} type={'jzl'} list={this.state.list} />
            </ItemImg>
            : ""
        }
        {
          G.ISCED_setInfo.isHeadLow === "1"
            ? <ItemImg params={params} id="sjl" title={"低头率"} height={1850} >
              <SclPublic params={params} type={'sjl'} list={this.state.list} />
            </ItemImg>
            : ""
        }
        {
          G.ISCED_setInfo.ifClassroomDiscipline === "1" ?
            <ItemImg params={params} id="ktwj" title={"巡课违纪"} height={1850} >
              <SclPublic params={params} type={'ktwj'} list={this.state.list} />
            </ItemImg> : ""
        }
        {
          G.ISCED_setInfo.dataAnalyze === "1" ?
            <React.Fragment>
              <div className="ws-portrayal-hint">教学质量</div>
              <ItemImg params={params} id="jxfx" title={"教学分析"} height={560} >
                <Jxfx params={params} list={this.state.list} />
              </ItemImg>
              <ItemImg params={params} id="xstjfk" title={"学生听讲反馈"} height={810} >
                <Tjfk params={params} list={this.state.list} />
              </ItemImg>
              {/* v1.21删除课堂互动 */}
              {/* <ItemImg params={params} id="kthd" title={"课堂互动"} height={1254} >
                            <Kthd params={params} list={this.state.list}/>
                        </ItemImg> */}
            </React.Fragment> : ""
        }
        <div className="ws-portrayal-hint">资源情况</div>
        <ItemImg params={params} id="jssy" title={"教室使用"} height={320} >
          <Jsqk params={params} list={this.state.list} />
        </ItemImg>
        {
          G.ISCED_setInfo.multimediaUse === "1" ?
            <React.Fragment>
              <ItemImg params={params} id="dmtsy" title={"多媒体使用"} height={1374} >
                <Dmt params={params} list={this.state.list} />
              </ItemImg>
            </React.Fragment> : ""
        }

      </RollContainer>
    );
  }
}

export default OrganImg;