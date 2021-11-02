/*
 * @Author: lxx
 * @Date: 2020-01-22 16:07:48
 * @Last Modified by: kyl
 * @Last Modified time: 2021-01-22 10:21:49
 * 学院画像
 */
import React, { Component } from "react";
import { message } from "antd";
import RollContainer from "../../components/image/rollContainer";
import Jbxx from "../../components/image/college_image/college_jbxx";
import CollegeComAtten from "./../../components/image/college_image/collegeComAtten";
import CollegeComClassAtten from "./../../components/image/college_image/collegeComClassAtten";
import CollegeComFrontSit from "./../../components/image/college_image/collegeComFrontSit";
import CollegeComSleep from "./../../components/image/college_image/collegeComSleep";
import CollegeComClassVio from "./../../components/image/college_image/collegeComClassVio";
import CollegeComMedia from "./../../components/image/college_image/collegeComMedia";
import CollegeComInter from "./../../components/image/college_image/collegeComInter";
import CollegeComTeaAndRes from "./../../components/image/college_image/collegeComTeaAndRes";
import CollegeComTeaAna from "./../../components/image/college_image/collegeComTeaAna";
import CollegeComStuFeedBack from "./../../components/image/college_image/collegeComStuFeedBack";
import ItemImg from '../../components/image/itemImg';
import "./../../../style/yrj_collegeImage.scss";
import { request } from './../../../util/request';
class OrganImg extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topParams: {},
      params: {},
      scopeParams: {},
      list: [],
    };
    this.getList = this.getList.bind(this);
    this.isGetList = this.isGetList.bind(this);
  }
  /**
   * @description 请求列表
   * @param {Object} params 参数
   */
  getList (params) {
    params = { ...params, searchValue: "" };
    request('api/public/getCourseList', params, (res) => {
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
  render () {
    let { params, topParams } = this.state;
    let { match } = this.props;
    return (
      <RollContainer editTopParams={this.editTopParams.bind(this)} noData={topParams.collegeId ? false : true} match={match} key={"college"} type={"college"}>
        <div id="jbxx">
          <Jbxx topParams={topParams} editParams={this.editParams.bind(this)}></Jbxx>
        </div>
        <div className="ws-portrayal-hint">教学秩序</div>
        {
          G.ISCED_setInfo.isTeacherCheck === "1"
            ? <ItemImg params={params} id="jskq" className="yrj_col_box" title={"教师考勤"} height={1820} >
              <CollegeComAtten params={this.state.params} selectList={this.state.list} />
            </ItemImg>
            : ""
        }
        <ItemImg params={params} id="dkl" className="yrj_col_box" title={"到课率"} height={1820} >
          <CollegeComClassAtten params={this.state.params} selectList={this.state.list} />
        </ItemImg>

        {
          G.ISCED_setInfo.isFrontRate === "1"
            ? <ItemImg params={params} id="qpjzl" className="yrj_col_box" title={"前排就座率"} height={1820} >
              <CollegeComFrontSit params={this.state.params} selectList={this.state.list} />
            </ItemImg>
            : ""
        }
        {
          G.ISCED_setInfo.isHeadLow === "1"
            ? <ItemImg params={params} id="sjl" className="yrj_col_box" title={"低头率"} height={1820} >
              <CollegeComSleep params={this.state.params} selectList={this.state.list} />
            </ItemImg>
            : ""
        }
        {
          G.ISCED_setInfo.ifClassroomDiscipline === "1" ?
            <ItemImg params={params} id="ktwj" className="yrj_col_box" title={"巡课违纪"} height={1820} >
              <CollegeComClassVio params={this.state.params} selectList={this.state.list} />
            </ItemImg> : ""
        }
        {
          G.ISCED_setInfo.dataAnalyze === "1" ?
            <React.Fragment>
              <div className="ws-portrayal-hint">教学质量</div>
              {/* <div id="jyqk"  className="yrj_col_box" style={{ height: 440 }}>
              <CollegeComTeaAndRes/>
              </React.Fragment> */}
              <ItemImg params={params} id="jxfx" className="yrj_col_box" title={"教学分析"} height={550} >
                <CollegeComTeaAna params={this.state.params} selectList={this.state.list} />
              </ItemImg>
              <ItemImg params={params} id="xstjfk" className="yrj_col_box" title={"学生听讲反馈"} height={800} >
                <CollegeComStuFeedBack params={this.state.params} selectList={this.state.list} />
              </ItemImg>
              {/* v1.21版本删除 */}
              {/* <ItemImg params={params} id="kthd" className="yrj_col_box" title={"课堂互动"} height={1400} >
                <CollegeComInter params={this.state.params}  selectList={this.state.list}/>
              </ItemImg> */}
            </React.Fragment> : ""
        }
        {
          G.ISCED_setInfo.multimediaUse === "1" ?
            <React.Fragment>
              <div className="ws-portrayal-hint">资源情况</div>
              <ItemImg params={params} id="dmtsy" className="yrj_col_box" title={"多媒体使用"} height={1400} >
                <CollegeComMedia params={this.state.params} selectList={this.state.list} />
              </ItemImg>
            </React.Fragment> : ""
        }
      </RollContainer>
    );
  }
}

export default OrganImg;
