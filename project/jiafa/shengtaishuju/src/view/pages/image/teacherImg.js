/*
 * @Author: lxx 
 * @Date: 2020-01-22 16:07:48 
 * @Last Modified by: kyl
 * @Last Modified time: 2021-01-22 10:30:44
 * 教师画像
 */
import React, { Component } from 'react';
import { message } from "antd";
import RollContainer from "../../components/image/rollContainer";
import Jbxx from "../../components/image/tea_image/tea_jbxx";
import Jskq from '../../components/image/tea_image/jskq';
import Dkl from '../../components/image/tea_image/dkl';
import Jxhd from '../../components/image/tea_image/kthd';
import Jxfx from '../../components/image/tea_image/jxfx';
import Jxtjfk from '../../components/image/tea_image/jxtjfk';
import { connect } from 'react-redux';
import ItemImg from '../../components/image/itemImg';
import { request } from './../../../util/request';
@connect(state => state, {})
class TeacherImg extends Component {
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
    params = { ...params, courseId: "" };
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
    this.setState({
      params
    })
  }

  componentWillUnmount () {

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
    let {
    } = this.props.kyl_teaImage_reducer
    // console.log(qpjzl_line)
    let { list, params, topParams } = this.state;
    let { match } = this.props;
    return (
      <RollContainer editTopParams={this.editTopParams.bind(this)} noData={topParams.teacherId ? false : true} match={match} key={"teacher"} type={"teacher"}>
        <div id="jbxx"><Jbxx topParams={topParams} editParams={this.editParams.bind(this)}></Jbxx></div>
        <div className="ws-portrayal-hint">教学秩序</div>
        {
          G.ISCED_setInfo.isTeacherCheck === "1"
            ? <ItemImg params={params} id="jskq" title={"教师考勤"} height={330} >
              <Jskq params={params}></Jskq>
            </ItemImg> : ""
        }
        <ItemImg params={params} id="dkl" title={"到课率"} height={1369} >
          <Dkl params={params} list={list} type={2} cond={1} >
          </Dkl>
        </ItemImg>
        {
          G.ISCED_setInfo.isFrontRate === "1"
            ? <ItemImg params={params} id="qpjzl" title={"前排就座率"} height={1369} >
              <Dkl params={params} list={list} type={2} cond={2} >
              </Dkl>
            </ItemImg> : ""
        }
        {
          G.ISCED_setInfo.isHeadLow === "1"
            ? <ItemImg params={params} id="sjl" title={"低头率"} height={1369} >
              <Dkl params={params} list={list} type={2} cond={3} >
              </Dkl>
            </ItemImg> : ""
        }
        {
          G.ISCED_setInfo.ifClassroomDiscipline === "1" ?
            <ItemImg params={params} id="ktwj" title={"巡课违纪"} height={1369} >
              <Dkl params={params} list={list} type={2} cond={4}>
              </Dkl>
            </ItemImg> : ""
        }
        {
          G.ISCED_setInfo.dataAnalyze === "1" ?
            <React.Fragment>
              <div className="ws-portrayal-hint">教学质量</div>
              <ItemImg params={params} id="jxfx" title={"教学分析"} height={650} >
                <Jxfx params={params}></Jxfx>
              </ItemImg>
              <ItemImg params={params} id="xstjfk" title={"学生听讲反馈"} height={900} >
                <Jxtjfk params={params}></Jxtjfk>
              </ItemImg>
              {/* v1.21版本删除课堂互动 */}
              {/* <ItemImg params={params} id="kthd" title={"课堂互动"} height={914} >
                            <Jxhd params={params} list={list}></Jxhd>
                        </ItemImg> */}
            </React.Fragment> : ""
        }
      </RollContainer>
    );
  }
}

export default TeacherImg;

