/*
 * @Author: 蒲飞 
 * @Date: 2017-09-25 16:13:39 
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-11-27 14:53:14
 */
import React, { Component } from 'react';
import { Modal, Table } from 'antd';
import _ from 'lodash';
// import SVG from './../../public/public-component-svg';
import { request } from './../../../util/request_2.12';
// import util from './../../js/_x/index.js';
// const Request = util.util.request.request;
// const Number = util.util.number
import _util from './../../../util/_util'
const { toChinese } = _util
import env from './../../js/_x/index.js';
const { one, loaded } = env.env.env;
import { G } from './../../js/g.js';
// import ReAddScoreOption from './../component/admin/tpk/reAddScoreOption';
import ImgBig from './imgBig.jsx';
import './../../../style/tpk/mj_diary.css';
// import './../../css/admin/mj_diary.css';
// import Background from './../../icon/uhead.png';

class DiaryNote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isBigImg: false,      //图片放大
      img: '',
      className: '', //班级名称
      classID: '',//班级ID
      researchJobTeacherId: '', //查询评分详情用的id
      curriculumallId: '',  //课程id
      teacherId: '',//授课老师id
      teacherName: '',//授课老师名字
      weeks: '', //周次
      researchJobType: 12,//代表无评分  14//代表有评分
      classTotalScore: 50,  //打分总分
      comment: '', //评论详情
      evaluateFileId: '',//文件id
      filePath: '',//文件路径 
      scrollHeight: '',
      visible: false,
      tableData: [],
      rootpath: ''//网站根路径
    };
    this.handleCheckScore = this.handleCheckScore.bind(this);
    this.getbaseData = this.getbaseData.bind(this);
    this.imgClocse = this.imgClocse.bind(this);
    this.columns = [{
      title: '评价大项',
      dataIndex: 'commentAmount',
      key: 'commentAmount',
      width: '16%',
      render: this.renderContent
    }, {
      title: '评价子项',
      dataIndex: 'commentChild',
      key: 'commentChild',
      width: '18%'
    }, {
      title: '评价标准',
      dataIndex: 'commentStandard',
      key: 'commentStandard',
      width: '50%'
    }, {
      title: '分值',
      dataIndex: 'childScore',
      key: 'childScore',
      width: '8%'
    }, {
      title: '得分',
      dataIndex: 'score',
      key: 'score',
      width: '8%'
    }];
  }


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


  //查看评分标准
  handleCheckScore(value) {
    this.setState({
      visible: true,
    });
    request('api/web/teacher_listen_job/scoreDetail', { researchJobTeacherId: value }, function (ret) {
      // let ret = {
      //   result: true,
      //   data: {
      //     scoreDetail: []
      //   }
      // }
      if (ret.result) {
        var comment = ret.data;
        var newTableData = [];
        comment.scoreDetail.map((item1) => {
          item1.childInfo.map((item2, index) => {
            newTableData.push({
              key: item2.childId,
              prtKey: item1.parentId,
              commentAmount: `${item1.parentName}(合计${item1.parentScore}分)`,
              amount: (index % item1.childInfo.length) === 0 ? item1.childInfo.length : 0,
              commentChild: item2.childName,
              commentStandard: item2.evaluateDescription,
              childScore: item2.childScore,
              score: item2.score,
            })
          })
        });
        this.setState({
          tableData: newTableData
        });
      }
    }.bind(this));
  }

  renderContent = (value, row) => {
    const obj = {
      children: value,
      props: {},
    };
    let mergeLine = 0;
    let mergeIndex = 0;
    obj.props.rowSpan = row.amount;
    return obj;
  };

  // 图片放大关闭
  imgClocse() {
    this.setState({ isBigImg: false })
  }

  render() {
    let curriculumall = this.props.curriculumall;
    if (this.props.curriculumall.length == 1) {
      curriculumall.push({
        className: '', //班级名称
        classID: '',//班级ID
        researchJobTeacherId: '', //查询评分详情用的id
        curriculumallId: '',  //课程id
        teacherId: '',//授课老师id
        teacherName: '',//授课老师名字
        weeks: '', //周次
        researchJobType: 12,//代表无评分  14//代表有评分
        classTotalScore: 0,  //打分总分
        comment: '', //评论详情
        evaluateFile: [],//文件id  
      })
    } else if (this.props.curriculumall.length == 0) {
      for (let i = 0; i < 2; i++) {
        curriculumall.push({
          className: '', //班级名称
          classID: '',//班级ID
          researchJobTeacherId: '', //查询评分详情用的id
          curriculumallId: '',  //课程id
          teacherId: '',//授课老师id
          teacherName: '',//授课老师名字
          weeks: '', //周次
          researchJobType: 12,//代表无评分  14//代表有评分
          classTotalScore: 0,  //打分总分
          comment: '', //评论详情
          evaluateFile: [],//文件id 
        })
      }
    }

    let noteType = '';
    let noteTitle = '';
    let notDataPrompt = '';
    if (this.props.type == 'listen') {
      noteType = '随堂听笔记';
      noteTitle = '笔记内容:';
      notDataPrompt = "暂无笔记记录！";
    } else {
      noteType = '教研点评';
      noteTitle = '教学过程点评:';
      notDataPrompt = "暂无点评记录！";
    }

    let globalPath = G.rootpath;
    let path = globalPath.substring(0, globalPath.indexOf('/cloud'));
    return (
      <div>
        <ul className="pf-dia-notecard">
          {
            curriculumall.map((mall, index) => {
              return <li key={index}>
                <div className="pf-dia-leftnote">
                  <div className="pf-dia-notetitle">{noteType}</div>
                  <div className="pf-dia-noteinfo">
                    <div><b>授课者：</b><span>{mall.teacherName || mall.TeacherName || ''}</span></div>
                    <div><b>授课时间：</b><span>{mall.weeks ? `第${toChinese(mall.weeks)}周` : ``}</span></div>
                    <div><b>授课班级：</b><span>{mall.className || mall.curClassName || mall.CurClassName || ''}</span> </div>
                  </div>
                  <div className="pf-dia-notecontent">
                    <div className="pf-dia-notedetails">
                      <b>{noteTitle}</b>
                      <div className="pf-dia-notecomment" style={{ height: mall.evaluateFile.length == 0 ? '395px' : '315px' }}>
                        <div className="pf-dia-notescroll" style={{ height: mall.evaluateFile.length == 0 ? '395px' : '315px' }}><span>{mall.comment || notDataPrompt}</span></div>
                      </div>
                    </div>
                    <div className="pf-dia-notephoto" style={{ display: mall.evaluateFile.length == 0 ? 'none' : 'block' }}>
                      <ul>
                        {
                          mall.evaluateFile.length == 0 ?
                            <li></li> :
                            mall.evaluateFile.map((files, index) => <li
                              key={index}
                              style={{ backgroundImage: `url(${files.filePath || ''})` }}
                              onClick={() => this.setState({ isBigImg: true, img: files.filePath })}>
                            </li>
                            )
                        }
                      </ul>
                    </div>
                  </div>
                  <div className="pf-dia-notescore" style={{ display: this.props.type == 'research' ? mall.researchJobType == 14 ? 'block' : 'none' : 'none' }}>
                    <div><b>教学评分：</b><span style={{ color: "#FF584F" }}>{mall.classTotalScore || '0'}</span><b>分</b>
                      <a onClick={this.handleCheckScore.bind(this, mall.researchJobTeacherId)}>查看评分详情</a>
                    </div>
                  </div>
                </div>
              </li>
            })
          }
        </ul>
        {this.state.isBigImg ? <ImgBig imgClocse={this.imgClocse} img={this.state.img}></ImgBig> : ''}
        {
          this.state.visible ?
            <Modal
              className="pf-rcm-modal"
              title="评价详情"
              width='1000px'
              footer={null}
              // maskStyle={{opacity: 1}}
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}>
              <div className='cjy-trcm-table'>
                <Table columns={this.columns} dataSource={this.state.tableData} pagination={false} bordered />
              </div>
            </Modal>
            : null
        }
      </div>
    );
  }

  handleCancel = () => {
    this.setState({
      visible: false,
      isDestroy: true,
      itemData: {
        "evaluateModelId": "",//评价大项唯一标识，修改后保存不为空
        "evaluateModelName": "",//评价大项名称
        "evaluateModelDescription": "",//评价大项描述
        "childModelList": [{
          "evaluateModelName": "",//评价小项名称
          "evaluateModelDescription": "",//评价小项描述
          "score": 0//评价分数
        }]
      }
    });
  };
}

export default DiaryNote;