/*
 * @Author: 蒲飞 
 * @Date: 2017-09-20 10:41:43 
 * @Last Modified by: xm
 * @Last Modified time: 2021-02-02 09:54:35
 * 我的教研课--教研课查询--查询的内容---每一天的教研课数据
 */
import React, { Component } from 'react';
import { Link } from "react-router-dom";
import _ from 'lodash';
import { message } from 'antd';
import { withRouter } from 'react-router-dom';
import { G } from './../../../../config/g';
import './../../../../style/tpk/mj_searchContentWeekCourse.css';
import _util from './../../../../util/_util';
const { toChinese } = _util;
import env from './../../../../util/env';
const { one, loaded } = env;

@withRouter
class SearchContentWeekCourse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statusClass: '',//教研课状态颜色类
      rootpath: ''//网站根路径
    };
    this.getbaseData = this.getbaseData.bind(this);
  };

  //获取基础数据
  getbaseData() {
    const _this = this;
    if (!G.loaded) {
      one(document, loaded, function (event) {
        _this.setState({
          rootpath: event.detail.rootpath
        })
      });
    } else {
      this.setState({
        rootpath: G.rootpath
      })
    }
  }

  //去评论，写笔记操作是否有效判断
  handleHref(flag, item) {
    var timestamp = Date.parse(new Date());
    let startTime = item.actureStartTime;
    var date = new Date(startTime);
    var Y = date.getFullYear() + '年';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '月';
    var D = date.getDate() + '日 ';
    var h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':';
    var s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
    var lessonStartTime = Y + M + D + h + m + s;
    if (startTime > timestamp) {
      message.info(`该课程尚未开始，请于${lessonStartTime}之后${flag ? '去点评' : '写笔记'}！`, 2);
    } else {
      let router = '';
      if (this.props.flag) {
        router = JSON.stringify({ curriculumallId: item.curriculumallId, researchTeachId: item.researchTeachId }) + '/' + (this.props.data.status === 4 ? 1 : 3)
      } else {
        router = JSON.stringify({ curriculumallId: item.CurClaId, researchTeachId: item.researListenId }) + '/' + (this.props.data.status === 4 ? 2 : 4)
      }
      // this.props.history.push('/home/tpk/video/' + router);
      // window.open(`${ this.state.rootpath } / home#/resr1/${ item.CurClaId } / ${ flag? 1: 2 }`);
      // 播放页面 type 为3 点评
      window.open(`${window.location.origin}${window.location.pathname}#/home/tpk/teaVideo/${router }`);
      // window.open(window.location.origin + `#/home/tpk/video/${JSON.stringify({ curriculumallId: item.curriculumallId, researchTeachId: item.researchTeachId })}/${this.props.data.status}`)
    }
  }

  componentDidMount() {
    this.getbaseData();
    this.setState({
      statusClass: this.props.selectedColor(this.props.data.status)
    });
  };
  render() {
    const item = this.props.data;
    let status = this.props.data.status

    // status = typeof status === 'number' ? String(status) : status

    const color = this.props.selectedColor(status);
    
    if (item.lessonOrder || item.lessonOrder === 0) {
      item.lessonOrder = item.lessonOrder
    } else if (item.lessonOrderSort || item.lessonOrderSort === 0) {
      item.lessonOrder = item.lessonOrderSort
    } else if (item.lessonOrderNum || item.lessonOrderNum === 0) {
      item.lessonOrder = item.lessonOrderNum
    }

    let lessonOrder = item.lessonOrder === 0 ? item.lessonLable : `第${item.lessonOrder}节`
    
    return (
      <div className={this.props.statusType[this.props.data.status - 1] ? "pf-r-searchcontentweekcourse" : 'pf-r-searchcontentweekcourse zq-r-weekcoursegray'}>
        <div className="pf-r-searchcourseline">
          <div className="pf-r-searchcourseweekinfo">{`星期${item.weekday === 7 ? '日' : toChinese(item.weekday)}`}</div>
          <div className={this.props.statusType[status - 1] ? color : 'zq-r-gray'}></div>
        </div>
        <div className="pf-r-searchcoursecard">
          <div className="pf-r-searchcourseinfo">
            <ul className=' mj-clearfix'>
              <li>{item.researchPlanName || ""}</li>
              <li>{lessonOrder}</li>
              <li>{item.teacherName || item.TeacherName || "-"}</li>
              <li>{item.courseName || item.SubjectName || "-"}</li>
              <li>{item.className || item.CurClassName || "-"}</li>
            </ul>
          </div>
          <div className="pf-r-searchcoursehandle">
            {
              this.props.statusType[this.props.data.status - 1] ? '' : <div className='zq-r-cover'></div>
            }
            {(() => {
              if (this.props.flag) {
                return item.commentFlag !== 0 ?
                  (
                    item.commentFlag === 1 ?
                      <a onClick={this.handleHref.bind(this, true, item)} href='javascript:void(0)'>未点评</a> :
                      <Link to={`/home/tpk/wdjyk/tpkTeachResearchComment/${item.teacherId}/${item.curriculumallId}/${item.researchTeachId}`}>查看点评</Link>
                  ) : '';
              } else {
                return item.commentFlag !== 0 ?
                  (
                    item.commentFlag === 1 ?
                      <a onClick={this.handleHref.bind(this, false, item)} href='javascript:void(0)'>写笔记</a> :
                      <Link to={`/home/tpk/wdsst/tpkTeachListenComment/${item.TeacherId}/${item.CurClassID}/${item.researListenId}`}>查看笔记</Link>
                  ) : '';
              }
            })()
            }

          </div>
        </div>
      </div >
    );
  }
}

export default SearchContentWeekCourse;