/*
 * @Author: 蒲飞 
 * @Date: 2017-09-15 16:04:44 
 * @Last Modified by: xm
 * @Last Modified time: 2020-12-29 16:25:53
 * 我的任务-我的任务表-课表
 */
import React, { Component } from 'react';
import TasksMySchContentItem from './tasksMySchContentItem';
import './../../../../style/tpk/mj_researchClassTable.css';
import './../../../../style/tpk/mj_tasksMySchContent.css';
import _util from './../../../../util/_util'
const { toChinese } = _util;

class TasksMySchContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    let classInfo = this.props.curriculumall;
    let lessonOrderMax = this.props.lessonOrderMax;//总节次
    // let lessonOrderMax = 15;//总节次
    console.log('lessonOrderMax自定义', lessonOrderMax)
    let classDataArray = [];
    for (let i = 0; i < lessonOrderMax; i++) {
      classDataArray[i] = []
      for (var j = 0; j < 7; j++) {
        classDataArray[i][j] = []
      }
    }
    classInfo.map((item, index) => {
      if (item[0]) {
        classDataArray[item[0].lessonOrderSort - 1][item[0].weekday - 1] = item;//只获取一条数据
      }
    })
    return (
      <div className="pf-r-schedulecontent">
        <div className="cjy-rct-tableHead">
          <span className="cjy-rct-headSpan cjy-rct-headSpan1 mj-tmsc-title">
            <span className="cjy-rct-rightTop">星期</span>
            <span className="cjy-rct-leftBtm">节次</span>
          </span>
          <span className="cjy-rct-headSpan mj-tmsc-titleSpan">星期一</span>
          <span className="cjy-rct-headSpan mj-tmsc-titleSpan">星期二</span>
          <span className="cjy-rct-headSpan mj-tmsc-titleSpan">星期三</span>
          <span className="cjy-rct-headSpan mj-tmsc-titleSpan">星期四</span>
          <span className="cjy-rct-headSpan mj-tmsc-titleSpan">星期五</span>
          <span className="cjy-rct-headSpan mj-tmsc-titleSpan">星期六</span>
          <span className="cjy-rct-headSpan mj-tmsc-titleSpan">星期日</span>
        </div>
        <div className="cjy-rct-table">
          <div className="cjy-rct-classNum">
            {
              classDataArray && classDataArray[0] && classDataArray.map((item, index) => {
                let getWeek = (week) => {
                  let curInd;
                  if (week) {
                    curInd = toChinese(week);
                    if (curInd.indexOf('一') > -1 && curInd.indexOf('一') < 1 && curInd !== '一') {
                      curInd = curInd.substring(1, curInd.length);
                    }
                    return curInd;
                  }
                }
                return <TasksMySchContentItem
                  key={index}
                  text={`第${getWeek(Number(index + 1))}节`}
                  color="grey"
                />
              })
            }
          </div>
          <div className="cjy-rct-classTable">
            {
              classDataArray && classDataArray[0] && classDataArray.map((children, ind) => {
                return (
                  classDataArray[ind].map((item, index) => {
                    return (
                      item.length == 0 ?
                        (
                          <TasksMySchContentItem
                            text=""
                            key={index} color="dsbd" />
                        )
                        :
                        (
                          <TasksMySchContentItem
                            key={item[0].curriculumallId}
                            data={classDataArray}
                            classname={item[0].className}
                            curriculumallId={item[0].curriculumallId}
                            researchTeachId={item[0].researchTeachId}
                            coursename={item[0].courseName}
                            status={item[0].status}
                            color={item[0].type}
                            colors={this.props.colors}
                            classInfo={item}
                            type={item[0].type}
                            actureStartTime={item[0].actureStartTime} />
                        )
                    )
                  })
                )
              })
            }
          </div>
        </div>
      </div>
    );
  }
}


export default TasksMySchContent;
