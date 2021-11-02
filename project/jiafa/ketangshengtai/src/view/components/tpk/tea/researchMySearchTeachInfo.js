/*
 * @Author: 蒲飞 
 * @Date: 2017-09-12 14:01:23 
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-11-17 09:53:38
 * 我的教研课--教研课详情+查询
 */
import React, { Component } from 'react';
import { G } from './../../../../config/g';
import { request} from './../../../../util/request_2.12';
// import util from './../../../../js/_x/index.js';
// const Request = util.util.request.request;
import ResearchMySearchTitle from './researchMySearchTitle';
import ResearchMySearchContent from './researchMySearchContent';
import './../../../../style/tpk/mj_researchMySearchTeachInfo.css';

class ResearchMySearchTeachInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      weeks: [],//所有周次
      allCourse: [],//所以教研课
      plans: [],//计划
      classes: [],//班级
      result: false,//有无相关数据（默认false无）
      isloading: true,//是否加载（默认true加载）
      clickIndex: 0//周次点击的索引号      
    };
    // this.teacherId = "100003";
    this.teacherId = JSON.parse(sessionStorage.getItem('baseinfo')) && JSON.parse(sessionStorage.getItem('baseinfo')).userId || '';
    this.isScroll = true;//是否允许滚动事件执行
    this.getData = this.getData.bind(this);
    this.getconditionData = this.getconditionData.bind(this);
    this.getParams = this.getParams.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }

  /**
   * 筛选列表数据查询
   * @param {*} path 
   * @param {*} flag 
   */
  //获取筛选条件数据
  getconditionData(path, flag) {
    request(path, { teacherId: this.teacherId }, function (ret) {
      if (ret.result) {
        if (flag) {
          if (this._isMounted) {
            let arr = [];
            arr = [{ id: '', researchPlanName: '全部' }, ...ret.data.researchPlan]
            this.setState({
              plans: arr
            });
          }
        } else {
          // let ret1 = {
          //   data: { myTechLinkClass: [{ CurClassID: "586AF7E24E1F06828871B2805B660248", CurClassName: "教学班马克思201" }] }
          // }
          // ret.data.myTechLinkClass.unshift({ classID: '', className: '全部' });
          if (ret.data) {
            const data = ret.data.myTechLinkClass;
            let classes = [{ CurClassID: '', CurClassName: '全部' }];
            for (let i in data) {
              classes.push({ CurClassID: data[i].classID, CurClassName: data[i].className })
            }
            if (this._isMounted) {
              this.setState({ classes });
            }
          } else {
            this.setState({ classes: [] });
          }
        }
      }
    }.bind(this));
  };
  //根据条件查询
  getParams(val) {
    this.setState({
      isloading: true,
      clickIndex: 0
    });
    this.getData(val);
    document.getElementById('content').scrollTop = 0;
  };

  //周次的点击事件
  handleClick(index) {
    this.setState({
      clickIndex: index
    });
    this.isScroll = false;
  }

  //详情的滚动事件
  handleScroll() {
    if (this.isScroll) {
      var arr = [];
      var containertop = document.getElementById('content').scrollTop;
      var weekstop = document.getElementById('weeks').scrollTop;
      this.state.weeks.map((week, i) => {
        var itemtop = document.getElementById(`week${week}`).offsetTop - 100;
        if (itemtop <= containertop) {
          arr.push(itemtop);
        }
      });
      if (this.state.clickIndex !== arr.length - 1) {
        var itemtop = document.getElementById(`weekindex${arr.length - 1}`).offsetTop;
        if (itemtop <= weekstop) {
          document.getElementById(`weekindex${arr.length - 1}`).scrollIntoView();
        }
        if (itemtop - 520 >= weekstop) {
          document.getElementById(`weekindex${arr.length - 1}`).scrollIntoView();
        }

        this.setState({
          clickIndex: arr.length - 1
        });
      }
    } else {
      this.isScroll = true;
    }
  }

  /**
   * 列表数据查询
   * @param {*} params 
   */
  //获取所有教研课数据
  getData(params) {
    request('api/web/teacher_listen_job/searchTeachInfo', params, function (ret) {
      // let ret = {
      //   result: true,
      //   data: {
      //     teachCourse: [
      //       {
      //         actureStartTime: 1551663900000,
      //         classID: "586AF7E24E1F06828871B2805B660248",
      //         className: "教学班马克思201",
      //         commentFlag: 0,
      //         courseId: "59b7de56fdf56e25f82cdd6523de61c9",
      //         courseName: "马克思思想政治与社会主主义现代化建设概论",
      //         curriculumallId: "ca03ecf65786e3528fda9dd7a077f950",
      //         lessonOrder: 3,
      //         researchPlanId: "6ce72d27-f5a6-4d46-869b-c2eb777e9656",
      //         researchPlanName: "BBB",
      //         status: 4,
      //         teacherId: "2018015",
      //         teacherName: "王四",
      //         weekday: 1,
      //         weeks: 3
      //       }
      //     ]
      //   }
      // }
      if (ret.result) {
        //处理数据得到周次
        if (ret.data) {
          var weeksData = [], data = ret.data.teachCourse;
          for (var i = 0; i < data.length; i++) {
            if (i == 0) {
              weeksData.push(data[i].weeks)
            } else {
              if (data[i].weeks != data[i - 1].weeks) {
                weeksData.push(data[i].weeks)
              }
            }
          }
          if (this._isMounted) {
            this.setState({
              weeks: weeksData,
              allCourse: data,
              result: data.length ? true : false,
              isloading: false
            });
          }
        } else {
          this.setState({
            weeks: [],
            allCourse: [],
            result: false,
            isloading: false
          });
        }
      } else {
      }
    }.bind(this));
  }

  componentDidMount() {
    //初始化获取全部教研课
    var params = {
      researchPlan: '', //计划Id
      classID: '',  //班级Id
      courseName: '', //科目
      teacherId: this.teacherId
    }
    this.getData(params);
    this.getconditionData('api/web/teacher_listen_job/researchPlan', true);
    this.getconditionData('api/web/teacher_listen_job/selectMyTechLinkClass', false);
  }

  componentWillMount() {
    this._isMounted = true;
  };
  componentWillUnmount() {
    this._isMounted = false
  };

  render() {
    return (
      <div>
        <div className="pf-r-search">
          {/* flag标识--true为我的教研课，false为随堂听 */}
          <ResearchMySearchTitle
            plans={this.state.plans}
            classes={this.state.classes}
            getParams={this.getParams}
            flag={true}>
          </ResearchMySearchTitle>
          <ResearchMySearchContent
            weeks={this.state.weeks}
            allCourse={this.state.allCourse}
            result={this.state.result}
            isloading={this.state.isloading}
            handleClicks={this.handleClick}
            handleScroll={this.handleScroll}
            clickIndex={this.state.clickIndex}>
          </ResearchMySearchContent>
        </div>
      </div>
    );
  }
}

export default ResearchMySearchTeachInfo;