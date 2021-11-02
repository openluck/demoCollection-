/*
 * @Author: zhengqi 
 * @Date: 2017-09-28 12:42:01 
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-11-19 19:32:58
 * 我的随堂听---随堂听查询-----查询的内容
 */
import React, { Component } from 'react';
import { Button, Anchor, Spin, Timeline, Table, Icon } from 'antd';
// import PerfectScrollbar from 'react-perfect-scrollbar';
// import { SVG } from './../../../../base';
import ResearchContentWeek from './researchContentWeek.js';
import './../../../../style/tpk/mj_researchMySearchContent.css';
// import { request} from './../../../../util/request_2.12';
import _util from './../../../../util/_util';
const { toChinese } = _util;
import noneData from './../../../../media/picture/nodata1.png'
// const Request = util.util.request.request;

class ListenSearchListenContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      applicationcourse: true,//1申请的课  
      passcourse: true,//2已通过的课
      accomplishcourse: true,//3已完成的课
      mycourse: true,//4我的课
      statusType: [true, true, true, true],//教研课状态类型
    };
    this.t = '';
    this.selectedColor = this.selectedColor.bind(this);
  }

  onhandlechangecolor(val, e) {
    switch (val) {
      case 1:
        this.setState({
          applicationcourse: !this.state.applicationcourse
        });
        break;
      case 2:
        this.setState({
          passcourse: !this.state.passcourse
        });
        break;
      case 3:
        this.setState({
          accomplishcourse: !this.state.accomplishcourse
        });
        break;
      case 4:
        this.setState({
          mycourse: !this.state.mycourse
        });
        break;
    };
    var switchStatus = [
      val == 1 ? !this.state.applicationcourse : this.state.applicationcourse,
      val == 2 ? !this.state.passcourse : this.state.passcourse,
      val == 3 ? !this.state.accomplishcourse : this.state.accomplishcourse,
      val == 4 ? !this.state.mycourse : this.state.mycourse
    ];
    this.setState({
      statusType: switchStatus
    });
  }
  //周次的点击事件
  handleClick(index, week) {
    this.props.handleClicks(index);
    document.getElementById(`week${week}`).scrollIntoView();
  }


  //匹配状态颜色
  selectedColor(status) {
    var className = '';
    switch (status) {
      case 1:
        return className = 'zq-r-application';
      case 2:
        return className = 'zq-r-pass';
      case 3:
        return className = 'zq-r-accomplish';
      case 4:
        return className = 'zq-r-my';
    };
  }

  componentDidMount() {
    // 请求判断开关状态
    // request('api/web/teacherJob/search_listen_info', {}, function (ret) {
    //   if (ret.result) {
    //     this.setState({
    //       switch: ret.data.authSwitch ? true : false
    //     });
    //   }
    // }.bind(this));
  }

  render() {
    return (
      <div>
        <div className="pf-r-searchcontent">
          <div className="pf-t-schtypes pf-r-searchtypes">
            <ul className="pf-t-schtitltleft">
              <li onClick={this.onhandlechangecolor.bind(this, 1)}>
                <span className={this.state.applicationcourse ? 'pf-t-schtitletype zq-r-applicationcourse' : 'pf-t-schtitletype zq-r-grayselected'} ></span>
                <span className="pf-t-schtype">申请的课</span>
              </li>
              <li onClick={this.onhandlechangecolor.bind(this, 2)}>
                <span className={this.state.passcourse ? 'pf-t-schtitletype zq-r-passcourse' : 'pf-t-schtitletype zq-r-grayselected'}></span>
                <span className="pf-t-schtype">已通过的课</span>
              </li>
              <li onClick={this.onhandlechangecolor.bind(this, 3)}>
                <span className={this.state.accomplishcourse ? 'pf-t-schtitletype zq-r-accomplishcourse' : 'pf-t-schtitletype zq-r-grayselected'}></span>
                <span className="pf-t-schtype">已完成的课</span>
              </li>
              <li onClick={this.onhandlechangecolor.bind(this, 4)}>
                <span className={this.state.mycourse ? 'pf-t-schtitletype zq-r-mycourse' : 'pf-t-schtitletype zq-r-grayselected'}></span>
                <span className="pf-t-schtype">我的课堂</span>
              </li>
            </ul>
          </div>
          {/* 没有数据提示 */
            this.props.result ? '' :
              <div className='zq-r-noresult'>
                {/* <SVG type='wushuju' title='无数据' /> */}
                <img src={noneData} alt='' style={{ width: 200, height: 200 }} />
                <p style={{ marginTop: 20 }} >暂无数据</p>
              </div>
            // <div style={{ width: '100%', height: '300px', textAlign: 'center' }}>
            //   <img src={require('./../../../../icon/nodata1.png')} alt='' />
            //   <div style={{ marginTop: '15px' }}>暂无数据</div>
            // </div>
          }{/*加载提示*/
            this.props.isloading ? <div className='zq-r-loading'><Spin /></div> : ''
          }
          <div className="pf-r-searchinfo">
            <div className='zq-r-line'></div>
            <div className='pf-r-searchleft'>
              <ul id='weeks'>
                {
                  this.props.weeks.map((week, i) => <li
                    key={i}
                    className='zq-weekbox'
                    id={"weekindex" + i}
                    onClick={this.handleClick.bind(this, i, week)}>
                    <span className={this.props.clickIndex == i ? 'clicked' : ''}>第{toChinese(week)}周</span>
                  </li>)
                }
              </ul>
            </div>
            {/* <PerfectScrollbar> */}
            <div className='pf-r-searchright' id='content' onScroll={this.props.handleScroll}>
              {/* flag标识--true为我的教研课，false为随堂听 */
                this.props.weeks.map((week, i) => <ResearchContentWeek
                  key={i}
                  data={week}
                  allCourse={this.props.allCourse}
                  statusType={this.state.statusType}
                  selectedColor={this.selectedColor}
                  flag={false}>
                </ResearchContentWeek>)
              }
            </div>
            {/* </PerfectScrollbar> */}
          </div>
        </div>
      </div>

    );
  }
}

export default ListenSearchListenContent;