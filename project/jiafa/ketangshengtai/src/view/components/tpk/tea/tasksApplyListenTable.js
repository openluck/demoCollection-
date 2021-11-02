/*
 * @Author: 蒲飞 
 * @Date: 2017-09-12 14:02:09 
 * @Last Modified by: xm
 * @Last Modified time: 2021-02-01 16:52:25
 * 已选教研课随堂听申请列表
 */
import React, { Component } from 'react';
import { Select, Button, message } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import _ from 'lodash';
import { G } from './../../../../config/g';
import ResearchTree from './../../../components/tpk/researchTree.jsx';
import ResearchSelect from './../../../components/tpk/researchSelect.jsx';
import ResearchClassTable from './../../../components/tpk/researchClassTable.jsx';
import ClassHaveChosed from './../../../components/tpk/classHaveChosed.jsx';
import './../../../../style/tpk/mj_reChoseLesson.css';
import './../../../../style/tpk/mj_tasksApplyListenTable.css';
import { request } from './../../../../util/request_2.12';
import _util from './../../../../util/_util';
import { v1 } from "node-uuid";
// const Request = util.util.request.request;
const { toChinese } = _util;

@withRouter
class ReChoseLesson extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // selectedKeys:'0-0-0-0',
      //gradeClass:'初一1班',
      //system:1,
      //week:7,
      system: '',         //学期下拉框当前value
      week: '',           //周次下拉框当前value
      weekData: [],      //周次下拉框
      //teaData:[],
      haveChosedData: [],
      classInfo: [],
      treeData: [],      //Tree组件
      semester: [],     //学期下拉列表
      systemData: [],
      classID: '', //班级id
      // weeks:'',//周次id
      // semesterId:'',//学期id,默认为本学期  
    };
    this.teacherId = JSON.parse(sessionStorage.getItem('baseinfo')) && JSON.parse(sessionStorage.getItem('baseinfo')).userId || '';
    this.systemStatus = '';
    this.weekStatus = '';
    this.handleClassChange = this.handleClassChange.bind(this);
    this.getClassInfo = this.getClassInfo.bind(this);
    this.getSystem = this.getSystem.bind(this);
    this.handleSelectWeek = this.handleSelectWeek.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getLessonTable = this.getLessonTable.bind(this);
    this.handleSelectSystem = this.handleSelectSystem.bind(this);
    this.dataMap = this.dataMap.bind(this)
  }
  componentDidMount() {
    this.getClassInfo();
    this.getSystem();
    //this.getData();
  };

  /**
   * 获取课表信息
   */
  getLessonTable = (classId, curWeek, CurSstm) => {
    if (classId.indexOf('/') > -1) classId = classId.split('/')[0]
    var req = {
      teacherId: this.teacherId,
      classID: classId, //班级id
      weeks: curWeek,//周次id
      semesterId: CurSstm,//学期id,默认为本学期     
    };
    request('api/web/teacher_listen_job/myChooseListen', req, function (ret) {
      // let ret = {
      //   result: true,
      //   data: {
      //     curriculumall: [
      //       {
      //         className: "教学班ERP101", courseName: "ERP沙盘实践", courseShortName: "ERP", curriculumallId: "97914d86048fd851e462f9e78a9a266d",
      //         flag: false, lessonOrder: 1, placeName: "101", semesterId: "2018_2019_2", teacherId: "2018012",
      //         teacherName: "王一", weekday: 1, weeks: 4
      //       }
      //     ]
      //   }
      // }
      if (ret.message === "参数错误") {
        message.info('请选择要查看的教师', 3);
      } else {
        if (ret.result) {
          if (ret.data.curriculumall.length == 0) {
            // info('提示框','请选择查看时间',3000);
            this.setState({
              classInfo: [],
              // haveChosedData: []
            });
          } else {
            let resData = ret.data;
            var newClassInfo = [];
            resData.curriculumall.map((item) => {
              var classStatus = '';
              var idx = _.findIndex(this.state.haveChosedData, { key: item.curriculumallId });
              if (idx === -1) {
                if (item.flag) {
                  classStatus = 'normal';
                } else {
                  classStatus = 'dsbd';
                }
              } else {
                classStatus = 'blue';
              }
              if (item.teacherId == this.teacherId) {
                classStatus = 'dsbd';
              }
              newClassInfo.push({
                id: item.curriculumallId,
                teacherId: item.teacherID,
                semesterId: item.semesterId,
                lessonOrderSort: item.lessonOrderSort,
                weeksId: item.weeks,
                dayOfWeek: item.weekday,
                teacherName: item.teacherName,
                subjectName: item.courseName,
                subjectShortName: item.courseShortName,
                canClick: item.flag,
                status: classStatus,
                placeName: item.placeName
              });
            });
            this.setState({
              // system:this.props.system,         //学期下拉框当前value
              // week:this.props.week,           //周次下拉框当前value
              // weekData:this.props.weekData,      //周次下拉框
              // systemData:this.props.systemData,    //学期下拉框
              //teaData:this.state.teaData,       //教师数据
              //haveChosedData:this.state.haveChosedData,                 //请求课表时清空下方已选课堂
              classInfo: newClassInfo,
              // treeData:this.props.treeData,      //Tree组件
              // semester:this.props.semester,     //学期详细信息
              classID: req.classID, //班级id
              // weeks:req.weeks,//周次id
              // semesterId:req.semesterId, //学期id,默认为本学期  
              // treeClass:req.classID,
              system: req.semesterId,         //学期下拉框当前value
              week: req.weeks,
            });
          }

        } else {
          message.info('请选择要查看班级', 3);
        }
      }
    }.bind(this));
  };

  /**
  * cjy获取所有的上课班级信息
  */
  dataMap = (data, that) => {
    return data.map(item => {

      if (item.children && item.children[0]) {
        item.children = that.dataMap(item.children, that)
      } else {
        item.id = item.id + '/' + v1()
      }
      return item
    })
  }
  getClassInfo = () => {
    request('api/web/research_lesson/setting/get_class_info', {}, function (ret) {
      // let ret = {
      //   result: true,
      //   data: [{
      //     id: "",
      //     name: "全部机构",
      //     children: []
      //   }]
      // }
      if (ret.result) {
        let treeData = ret.data
        if (treeData[0]) {
          treeData = this.dataMap(treeData, this)
        }
        this.setState({
          treeData
        });
      };
    }.bind(this));
  }

  /**
   * cjy获取学期信息
   */
  getSystem = () => {
    let that = this
    request('api/web/research_lesson/setting/semester', {}, (ret) => {
      // let ret = {
      //   result: true,
      //   data: [{ id: "2018_2019_1", name: "第一学期", semesterEndDate: 1545580800000, semesterStartDate: 1545580800000, weeks: [] }]
      // }
     
      if (ret.result) {
        const curSemester = JSON.parse(sessionStorage.G).semester;
        var newSystemData = [];
        ret.data.map((item) => {
          newSystemData.push({
            value: item.id,
            text: item.name
          });
        });
        var newWeekData = [];
        let week = 1
        let se = sessionStorage.getItem('semester')
        let seId = ''
        if (se) {
          se = JSON.parse(se)
          if (se.isNow) {
            let weeks = se.weeks
            seId = se.id
            let now = new Date().getTime()
            weeks && weeks[0] && weeks.some(item => {
              let start = new Date(item.startTime)
              let end = new Date(item.endTime)
              if (now >= start && now <= end) {
                week = item.id
                return true
              }
            })
          }
        }
        if (seId) {
          let liObj = ret.data.find(item => item.id === seId)
          if (liObj) {
            liObj.weeks.map(ele => {
              newWeekData.push({
                value: ele.id,
                text: `第${ele.name}周`
              });
            })
          } else {
            ret.data[0].weeks.map((item) => {
              newWeekData.push({
                value: item.id,
                text: `第${item.name}周`
              });
            });
          }
        } else {
          ret.data[0].weeks.map((item) => {
            newWeekData.push({
              value: item.id,
              text: `第${item.name}周`
            });
          });
        }
        that.setState({
          systemData: newSystemData,
          weekData: newWeekData,
          semester: ret.data,
          // system: curSemester.id,
          system: newSystemData.length ? newSystemData[0].value : '',//学期下拉框设置当前默认选中第一条
          week: newWeekData.length ? newWeekData[week - 1].value : ''       //周次下拉框设置当前默认选中第一条
        });
      }
    });
  };

  // 通过课程的id来获取本课程的详细数据
  componentWillMount() {
  }

  /**
   * 提交申请
   */
  handleSubmit() {
    const { classId } = this.state;
    var chosedDatas = this.state.haveChosedData;
    let chosedData = [];
    chosedDatas.map((item, i) => {
      let obj = {};
      let key = item.key;
      let teachID = item.teacherId;
      obj[key] = teachID;
      chosedData.push(obj)
    })
    if (chosedData.length !== 0) {
      let req = {
        // teacherId: classId,
        teacherId: this.teacherId,
        curriculumall: chosedData
      }
      request('api/web/teacher_listen_job/myApply', req, function (ret) {
        // let ret = {
        //   data: { flag: true },
        //   message: null,
        //   result: true
        // }
        if (ret.result) {
          if (ret.data.flag) {
            // message.info('申请听课成功！', function (resolve) {
            //   window.location.reload();
            //   // resolve(); //执行此方法弹出框才会关闭，用于需要等待的异步操作
            // });
            message.success("申请成功！", 3);
            this.props.history.push("/home/tpk/wdrw");
          } else {
            message.error('申请听课失败，请重试！', 3);
          }
        } else {
          message.error('操作失败', 3);
        }
      }.bind(this));
    } else {
      message.warning('您尚未选择随堂听课，请选择随堂听课后进行确认申请操作！', 3);
    }
  }

  handleCancel() {
    var newInfo = this.state.classInfo;
    var chosedData = this.state.haveChosedData;
    chosedData.map((data) => {
      var index = _.findIndex(newInfo, { id: data.key });
      if (index === -1) {
        return;
      } else {
        newInfo[index].status = 'normal';
        this.setState({
          classInfo: newInfo
        });
      }
    })
    this.setState({
      haveChosedData: []
    });
  }

  handleClassChange(oprt, classInfo) {
    var newInfo = this.state.classInfo;
    var chosedData = this.state.haveChosedData;
    if (oprt === 'add') {
      chosedData.push({
        key: classInfo.id,
        time: `第${toChinese(Number(this.state.week))}周 星期${toChinese(Number(classInfo.dayOfWeek)) === '七' ? '日' : toChinese(Number(classInfo.dayOfWeek))} 第${toChinese(Number(classInfo.lessonOrderSort))}节`,
        name: classInfo.teacherName,
        subject: classInfo.subjectName,
        // gradeClass:this.state.gradeClass,
        gradeClass: classInfo.placeName,
        teacherId: classInfo.teacherId
      });
      this.setState({
        haveChosedData: chosedData
      });

      var index = _.findIndex(newInfo, { id: classInfo.id });
      // console.log('index', index)
      // console.log('newInfo', newInfo)
      if (index === -1) {
        return;
      } else {
        newInfo[index].status = 'blue';
        this.setState({
          classInfo: newInfo
        }, () => {
          // console.log('classInfo', this.state.classInfo)
        });
      }
    } else if (oprt === 'del') {
      var index = _.findIndex(chosedData, { key: classInfo.id });
      if (index === -1) {
        return;
      } else {
        _.pullAt(chosedData, index);
        this.setState({
          haveChosedData: chosedData
        });
      }

      index = _.findIndex(newInfo, { id: classInfo.id });
      if (index === -1) {
        return;
      } else {
        newInfo[index].status = 'normal';
        this.setState({
          classInfo: newInfo
        });
      }
    }
  };

  handleDelHaveChose(key) {
    var newInfo = this.state.classInfo;
    var index = _.findIndex(newInfo, { id: key });
    if (index !== -1) {
      newInfo[index].status = 'normal';
      this.setState({
        classInfo: newInfo
      });
    }

    var chosedData = this.state.haveChosedData;
    index = _.findIndex(chosedData, { key: key });
    if (index === -1) {
      return;
    } else {
      _.pullAt(chosedData, index);
      this.setState({
        haveChosedData: chosedData
      });
    }
  };

  /**
   * 树组件改变
   * @param {String} selectedKeys 树组件当前选中key
   * @param {String} info 当前选中key对应信息
   */
  handleChangeGrade(selectedKeys, info, level) {
    console.log(selectedKeys)
    // var items = selectedKeys[0].split('_');
    // if(items.length>3){
    //   this.getLessonTable(selectedKeys[0],this.state.week,this.state.system);
    //   this.setState({
    //     classId:selectedKeys[0],
    //     gradeClass:info

    //   });
    // };

    if (selectedKeys.length) {
      if (level === '3') {
        this.getLessonTable(selectedKeys[0], this.state.week, this.state.system);
        this.setState({
          classId: selectedKeys[0],
          gradeClass: info
        });
      }
    }

  };

  /**
 * 学期下拉框选择事件
 */
  handleSelectSystem(value) {
    var index = _.findIndex(this.state.semester, { id: value });
    if (index === -1) {
      return;
    } else {
      var newWeekData = [];
      this.state.semester[index].weeks.map((item) => {
        newWeekData.push({
          value: item.id,
          text: `第${item.name}周`
        });
      });
    };
    this.setState({
      system: value,
      weekData: newWeekData,
      //week:newWeekData.length?newWeekData[0].value:'',
      week: newWeekData.length ? newWeekData[0].value : ''       //周次下拉框设置当前默认选中第一条
    });
    if (newWeekData.length) {
      this.getLessonTable(this.state.classId, newWeekData[0].value, value);
    } else {
      message.info('本学期暂无周次信息，请重新选择学期！', 3);
      this.setState({
        classInfo: [],
      });
    }
  };

  /**
   * 周次下拉框选择事件
   */
  handleSelectWeek(value) {
    this.systemStatus = value;
    this.setState({
      week: value
    });
    this.systemStatus = value;
    var classId = this.state.classId;
    this.getLessonTable(this.state.classId, value, this.state.system);
  };
  render() {
    const { treeData, systemData, weekData, system, week, classInfo, haveChosedData } = this.state

    return (
      <div className="pf-tap-applylisten">
        <div className="cjy-rcl-choseLsBox">
          <div className="cjy-rcl-treeAndTable">
            <ResearchTree treeData={treeData} handleChangeGrade={this.handleChangeGrade.bind(this)} />
            <div className="cjy-rcl-rightBox">
              <div className="cjy-rcl-slctBox">
                <ResearchSelect defaultValue={system} selectData={systemData} width={'160px'} handleSelect={this.handleSelectSystem.bind(this)} />
                <div className="cjy-rcl-slct2">
                  <ResearchSelect defaultValue={week} selectData={weekData} width={"160px"} handleSelect={this.handleSelectWeek.bind(this)} />
                </div>
              </div>
              <div className="cjy-rcl-tableBox">
                <ResearchClassTable classInfo={classInfo} handleClassChange={this.handleClassChange.bind(this)} />
              </div>
            </div>
          </div>
          <ClassHaveChosed type={'listen'} dataSource={haveChosedData} handleDelHaveChose={this.handleDelHaveChose.bind(this)} />
          <div className="pf-rap-confirm">
            <Button type="primary" onClick={this.handleSubmit}>确认申请</Button>&nbsp;&nbsp;&nbsp;&nbsp;
            <Link to='/home/tpk/wdrw'>
              <Button onClick={this.handleCancel}>取消</Button>
            </Link>
            {/*} <Button onClick={this.handleCancel}>取消</Button>*/}
          </div>
        </div>
      </div>
    );
  }

}

export default ReChoseLesson;