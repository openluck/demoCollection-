/*
 * @Author: 蒲飞 
 * @Date: 2017-09-21 10:21:27 
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-11-17 10:20:17
 */
import React, { Component } from 'react';
import { message } from 'antd';
import _ from 'lodash';
import { withRouter } from 'react-router-dom'
import { G } from './../../../../config/g';
import moment from 'moment'
// import dateFunction from '../../../../js/_x/util/date'
import './../../../../style/tpk/mj_tasksMySchContentItem.css';
import env from './../../../../util/env';
const { one, loaded } = env;
//多与一条数据不同类型课匹配颜色方法
function whichColor(color, colorinfos) {
  switch (color) {
    case 1:
      return colorinfos[0];
      break;
    case 2:
      return colorinfos[1];
      break;
    case 3:
      return colorinfos[2];
      break;
    case 4:
      return colorinfos[3];
      break;
  }
}
//多余一条数据跳转链接处理方法
function whichHref(actureStartTime, type, curriculumallId, researchTeachId, rootpath) {
  var timestamp = Date.parse(new Date());
  let startTime = actureStartTime;
  if (startTime > timestamp) {
    return ''
  } else {
    // switch (type) {
    //   case 1:
    //     return `${rootpath}/home#reflection/toMyTaskVideo3?curriculumallId=${curriculumallId}`;
    //     break;
    //   case 2:
    //     return `${rootpath}/home#reflection/toMyTaskVideo3?curriculumallId=${curriculumallId}`;
    //     break;
    //   case 3:
    //     return `${rootpath}/home#resr1/${curriculumallId}/1`;
    //     break;
    //   case 4:
    //     return `${rootpath}/home#resr1/${curriculumallId}/2`;
    //     break;
    // };
    return '/home/tpk/teaVideo/' + JSON.stringify({ curriculumallId, researchTeachId }) + '/' + type
  }
}
//多余一条数据时间处理方法
function whichStartTime(actureStartTime) {
  var date = new Date(actureStartTime);
  var Y = date.getFullYear() + '年';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '月';
  var D = date.getDate() + '日 ';
  var h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
  var m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':';
  var s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
  return Y + M + D + h + m + s;
}
@withRouter
class TasksMySchContentItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      className: '',
      rootpath: '',//网站根路径,
      visible: false//弹出框显示与否
    }
    this.getbaseData = this.getbaseData.bind(this);
    this.handleHref = this.handleHref.bind(this);
  }

  componentWillMount() {
    this.getbaseData();
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

  handleHref = (href, lessonStartTime) => {
    if (href) {
      window.open(`${window.location.origin}${window.location.pathname}#${href}`);
      // this.props.history.push(href);
    } else {
      message.info(`该课程尚未开始，请于${lessonStartTime}查看！`, 3);
    }
  }
  menuMore() {
    this.setState({
      visible: true
    })
  }
  mouseLeave() {
    this.setState({
      visible: false
    })
  }

  render() {
    let classInfo = this.props.classInfo;
    let href = '';
    var timestamp = Date.parse(new Date());
    let startTime = this.props.actureStartTime;
    //时间处理
    var date = new Date(startTime);
    var Y = date.getFullYear() + '年';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '月';
    var D = date.getDate() + '日 ';
    var h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':';
    var s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
    var lessonStartTime = Y + M + D + h + m + s;
    //跳转链接处理
    if (startTime > timestamp) {
      href = "";
    } else {
      // switch (this.props.type) {
      //   case 1:
      //     href = `${this.state.rootpath}/home#reflection/toMyTaskVideo3?curriculumallId=${this.props.curriculumallId}`;
      //     break;
      //   case 2:
      //     href = `${this.state.rootpath}/home#reflection/toMyTaskVideo3?curriculumallId=${this.props.curriculumallId}`;
      //     break;
      //   case 3:
      //     href = `${this.state.rootpath}/home#resr1/${this.props.curriculumallId}/1`;
      //     break;
      //   case 4:
      //     href = `${this.state.rootpath}/home#resr1/${this.props.curriculumallId}/2`;
      //     break;
      // };
      href = '/home/tpk/teaVideo/' + JSON.stringify({ curriculumallId: this.props.curriculumallId, researchTeachId: this.props.researchTeachId }) + '/' + this.props.type
    }
    let colorinfos = this.props.colors;
    let bgcolor = '';
    //不同类型颜色处理
    switch (this.props.color) {
      case 1:
        bgcolor = colorinfos[0];
        break;
      case 2:
        bgcolor = colorinfos[1];
        break;
      case 3:
        bgcolor = colorinfos[2];
        break;
      case 4:
        bgcolor = colorinfos[3];
        break;
    }
    return (
      <div>
        {
          this.props.color === 'grey'
            ? <div className="cjy-ci-item cjy-ci-grey" style={{}}>{this.props.text}</div>
            : this.props.color === 'dsbd'
              ? <div className="cjy-ci-item mj-ci-tableTxt cjy-ci-dsbd">{this.props.text}</div>
              :
              this.props.classInfo.length == 1 ? (this.props.status === 0 ?
                <a onClick={this.handleHref.bind(this, href, lessonStartTime)}>
                  <div className="cjy-ci-item mj-ci-tableTxt" style={{ backgroundColor: bgcolor }}>
                    <ul>
                      <li><span className='pf-t-myschcoursebig' title={this.props.classname}>{this.props.classname}</span></li>
                      <li><span title={this.props.coursename}>{this.props.coursename}</span></li>
                    </ul>
                  </div>
                </a>
                : <a onClick={this.handleHref.bind(this, href, lessonStartTime)}>
                  <div className="cjy-ci-item mj-ci-tableTxt pf-t-myschtable" style={{ backgroundColor: bgcolor }}>
                    <ul>
                      <li><span className='pf-t-myschcoursebig' title={this.props.classname}>{this.props.classname}</span></li>
                      <li><span title={this.props.coursename}>{this.props.coursename}</span></li>
                    </ul>
                    <div className="pf-t-mySchFinish"><span>已完成</span></div>
                  </div>
                </a>) : (this.props.status === 0 ?
                  <div className="cjy-ci-item mj-ci-tableTxt" style={{ backgroundColor: bgcolor }} onMouseEnter={this.menuMore.bind(this)} onMouseLeave={this.mouseLeave.bind(this)}>
                    <ul>
                      <li><span className='pf-t-myschcoursebig' title={this.props.classname}>{this.props.classname}</span></li>
                      <li><span title={this.props.coursename}>{this.props.coursename}</span></li>
                    </ul>
                    {
                      this.state.visible ?
                        <div className="pf-t-alltip">
                          {
                            this.props.classInfo.map((item, i) => {
                              return <div key={i} onClick={this.handleHref.bind(this, whichHref(item.actureStartTime, item.type, item.curriculumallId, item.researchTeachId, this.state.rootpath), whichStartTime(item.actureStartTime))}
                                style={{ backgroundColor: whichColor(item.type, this.props.colors) }}>{item.className}---{item.courseName}&nbsp;&nbsp;
                        <div className="pf-t-mySchFinishMore"><span>{item.status == 0 ? '' : '已完成'}</span></div>
                              </div>
                            })
                          }
                        </div> :
                        null
                    }
                  </div> :
                  <div className="cjy-ci-item mj-ci-tableTxt" style={{ backgroundColor: bgcolor }} onMouseEnter={this.menuMore.bind(this)} onMouseLeave={this.mouseLeave.bind(this)}>
                    <div className="pf-t-mySchFinishSmall"><span>已完成</span></div>
                    <ul style={{ padding: 0 }}>
                      <li><span className='pf-t-myschcoursebig' title={this.props.classname}>{this.props.classname}</span></li>
                      <li><span title={this.props.coursename}>{this.props.coursename}</span></li>
                    </ul>
                    {
                      this.state.visible ?
                        <div className="pf-t-alltip">
                          {
                            this.props.classInfo.map((item, i) => {
                              return <div key={i} onClick={this.handleHref.bind(this, whichHref(item.actureStartTime, item.type, item.curriculumallId, item.researchTeachId, this.state.rootpath), whichStartTime(item.actureStartTime))}
                                style={{ backgroundColor: whichColor(item.type, this.props.colors) }}>{item.className}---{item.courseName}&nbsp;&nbsp;
                        <div className="pf-t-mySchFinishMore"><span>{item.status == 0 ? '' : '已完成'}</span></div>
                              </div>
                            })
                          }
                        </div> :
                        null
                    }
                  </div>)
        }
      </div>
    );
  }
}

export default TasksMySchContentItem;