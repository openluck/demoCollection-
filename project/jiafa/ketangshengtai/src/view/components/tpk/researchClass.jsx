/*
 * @Author: JudyC 
 * @Date: 2017-09-12 15:25:40 
 * @Last Modified by: xm
 * @Last Modified time: 2021-02-01 13:50:05
 */
import React, { Component } from 'react';
import { Table, Spin } from 'antd';
import _ from 'lodash';
import { request } from './../../../util/request';
// import util from './../../../../js/_x/index.js';
// import { SVG } from './../../../../base';
// import PerfectScrollbar from "react-perfect-scrollbar"
// const Request = util.util.request.request;
// const toChinese = util.util.number.toChinese;
import './../../../style/tpk/mj_researchClass.css';
// import './../../../../css/admin/mj_researchClass.css';

class ResearchClass extends Component {
  constructor() {
    super();
    this.state = {
      teaData: [],//教师数据
      dataSource: [],//表格数据
      loading: true   //加载中
    };
    this.keyData = '';
    this.getTeaData = this.getTeaData.bind(this);
    this.getClassData = this.getClassData.bind(this);

    this.columns = [
      {
        title: '任课教师',
        dataIndex: 'teacherName',
        key: 'teacherName',
        render:(text)=>{
          return <div title={text}
              style={{
              width:80,
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden"
          }}>
            {text}
          </div>
        }
      },
      {
        title: '课程',
        dataIndex: 'courseName',
        key: 'courseName',
        render:(text)=>{
          return <div title={text}
              style={{
              width:170,
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden"
          }}>
            {text}
          </div>
        }
      }, 
      {
        title: '上课日期',
        dataIndex: 'courseTime',
        key: 'courseTime',
        render:(text)=>{
          return <div title={text}
              style={{
              width:160,
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden"
          }}>
            {text}
          </div>
        }
      },{
        title: '地点',
        dataIndex: 'coursePlace',
        key: 'coursePlace',
        render:(text)=>{
          return <div title={text}
              style={{
              width:80,
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden"
          }}>
            {text}
          </div>
        }
      },{
        title: '班级',
        dataIndex: 'courseClass',
        key: 'courseClass',
        render:(text)=>{
          return <div title={text}
              style={{
              width:170,
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden"
          }}>
            {text}
          </div>
        }
      },{
        title: '听课教师',
        dataIndex: 'listenTeachersNames',
        key: 'listenTeachersNames',
        render:(text)=>{
          return <div title={text}
              style={{
              width:300,
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden"
          }}>
            {text}
          </div>
        }
      }
    ];
  };

  /**
   * 通过课程的id来获取本课程的详细数据
   * @param {Array} curriculumId 
   */
  getClassData(curriculumId) {
    var req = [];
    for (let i in curriculumId) {
      req.push(curriculumId[i]);
    }
    request('api/web/research_lesson/setting/get_curriculum_info', req, function (ret) {
      if (ret.result) {
        var newDataSource = [];
        ret.data.map((item, index) => {
          newDataSource.push({
            key: index,
            time: `第${toChinese(item.weeks)}周 星期${item.weekday === 7 ? '日' : toChinese(item.weekday)} 第${toChinese(item.lessonOrdernum)}节`,
            name: item.TeacherName,
            subject: item.subjectName,
            // gradeClass:item.className,
            gradeClass: item.placeName,
          });
        });
   
        this.setState({
          dataSource: newDataSource,
          loading: false
        });
      }
    }.bind(this));
  }

  /**
   * 获取某个教研计划下的详细数据
   */
  getTeaData=()=> {
    var req = {
      id: this.keyData
    };
    request('api/web/teaching_research_plan/get_plan_detail', req, (res)=> {
        if(res.result&&res.data){
          let dataSource=[]
          res.data.details.map(item=>{
            dataSource.push({
              key:item.rcursId,
              ...item,
            })
          })
          console.log(dataSource)
          this.setState({
            dataSource,
            loading:false
          })
        }
    })
  }

  componentWillMount() {
    this.keyData = this.props.choseKey;
  }
  componentDidMount() {
    this.getTeaData();
  };

  render() {
    return (
      <div className="cjy-rc-reClass">
        <Spin spinning={this.state.loading} delay={200}>
            <div className="cjy-rc-table">
            {/* <PerfectScrollbar> */}
              <Table
              className="zoe-table1"
              pagination={false} columns={this.columns} dataSource={this.state.dataSource} />
            </div>
            {/* </PerfectScrollbar> */}
        </Spin>
      </div>
    );
  }
}

export default ResearchClass;