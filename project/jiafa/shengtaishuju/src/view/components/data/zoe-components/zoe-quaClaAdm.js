/*
 * @Author: zoe ღ 
 * @Date: 2020-02-12 14:33:12 
 * @Last Modified by: tj
 * @Last Modified time: 2021-01-20 16:55:50
 * 教学质量-课程统计-教学班页面
 */

import React, { Component } from 'react';
import SVG from "../../../public/svg";
import { Select, DatePicker,Table } from "antd";
import ZoeQuaStatis from "../zoe-components/zoe-quaStatis";
import ZoeDownLoad from "../zoe-components/zoe-download";
import ZoeQuaClaTable from "../zoe-components/zoe-quaClaTable";
import SelInput from "./../../../public/searSel/element";
import G from "../../../../config/g";
import { request } from "../../../../util/request";
import { connect } from 'react-redux';
import Fy from "../../../public/fy"
import CollageNoData from '../../image/college_image/collegeNoData';
@connect(state => state.zoe_quaData, {
    // zoe_getClaColSta
})
class ZoeQuaClaAdm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collegeId: '', //开课单位id
      courseId: "", //课程id
      teacherId: "", //教师id
      collegeList: G.ISCED_collegeList, //开课单位列表
      courseList: [], //课程列表
      teacherList: [], //教师列表
      semesterId: "",//当前选择的学期id
      couTypeId: "",//当前选择的课程类别
    };
  }
  componentDidMount() {
    const { curSign, pinkInfo, collegeId, subPageType } = this.props
    const { roleType } = G.ISCED_curRoleInfo
    if (curSign === 2) {//2级页面
      if (subPageType === 1) {
        //调课程列表接口
        if (roleType==="1" || roleType === '2') {
          //校级账号登陆
          this.getCourse({
            searchValue: '',
            couTypeId: pinkInfo.couTypeId,
            semesterId: pinkInfo.semesterId,
            collegeId
          });
        }
      } else {
        //调教师列表接口
        if (roleType==="1" || roleType === '2') {
          //校级账号登陆
          this.getTeacher({
            searchValue: '',
            semesterId: pinkInfo.semesterId,
            collegeId: collegeId
          });
        }
      }
    }
  }
  componentWillReceiveProps(prop) {
    // console.log('pinkInfo',prop.pinkInfo)
    // console.log('collegeId',prop.collegeId)
    // console.log('curSign',prop.curSign)
    const { semesterId, couTypeId } = this.state
    const { roleType, belongOrgId } = G.ISCED_curRoleInfo
    if (prop.curSign === 1) {
      //校级的情况
      if (prop.pinkInfo.semesterId !== semesterId || prop.pinkInfo.couTypeId !== couTypeId) {
        this.getCollege({
          searchValue: '',
          semesterId: prop.pinkInfo.semesterId,
          courseId: "",
          teacherId: "",
          couTypeId: prop.pinkInfo.couTypeId
        });
        this.setState({
          semesterId: prop.pinkInfo.semesterId,
          couTypeId: prop.pinkInfo.couTypeId
        })
      }
    }
    if (prop.curSign === 2) {
      if (roleType==="3" || roleType === '4') {
        //院级账号进入
        if (prop.subPageType === 1) {
          //调课程列表接口
          if (prop.pinkInfo.semesterId !== semesterId || prop.pinkInfo.couTypeId !== couTypeId) {
            this.getCourse({
              searchValue: '',
              couTypeId: prop.pinkInfo.couTypeId,
              semesterId: prop.pinkInfo.semesterId,
              collegeId: belongOrgId
            });
            this.setState({
              semesterId: prop.pinkInfo.semesterId,
              couTypeId: prop.pinkInfo.couTypeId
            })
          }
        }
        if (prop.subPageType === 2) {
          //调教师列表接口
          if (prop.pinkInfo.semesterId !== semesterId) {
            this.getTeacher({
              searchValue: '',
              semesterId: prop.pinkInfo.semesterId,
              collegeId: belongOrgId
            });
            this.setState({
              semesterId: prop.pinkInfo.semesterId,
            })
          }
        }
      }
    }
  }
  // 下拉的选择事件
  selectChange = (value, type) => {
    // console.log('value',value)
    // console.log('type',type)
    const { pinkInfo, collegeId } = this.props;
    switch (type) {
      case "college":
        this.props.getCollegeId(value.id);
        if (!value.id) {
          this.setState({
            collegeList: G.ISCED_collegeList
          })
        }
        break;
      case "course":
        this.props.getCourseId(value.id);
        if (!value.id) {
          this.getCourse({
            searchValue: '',
            couTypeId: pinkInfo.couTypeId,
            semesterId: pinkInfo.semesterId,
            collegeId
          });

        }
        break;
      case "teacher":
        this.props.getTeacherId(value.id);
        if (!value.id) {
          this.getTeacher({
            searchValue: '',
            semesterId: pinkInfo.semesterId,
            collegeId
          });
        }
        break;
      default:
        break;
    }
  };
  //搜索事件 搜索的数据用来查询全局公共的下拉列表 学院列表 课程列表 教师列表
  onSearch = (searchValue, type) => {
    // console.log('searchValue',searchValue)
    // console.log('type',type)
    const { pinkInfo, collegeId } = this.props;
    switch (type) {
      case "college":
        //开课院系列表接口函数
        this.getCollege({
          searchValue,
          semesterId: pinkInfo.semesterId,
          courseId: "",
          teacherId: "",
          couTypeId: pinkInfo.couTypeId
        });
        break;
      case "course":
        //课程院系列表接口函数
        this.getCourse({
          searchValue,
          couTypeId: pinkInfo.couTypeId,
          semesterId: pinkInfo.semesterId,
          collegeId
        });
        break;
      case "teacher":
        //课程院系列表接口函数
        this.getTeacher({
          searchValue,
          semesterId: pinkInfo.semesterId,
          collegeId
        });
        break;
    }
  };
  //获取开课院系列表
  getCollege = params => {
    request("/api/public/getDepartmentList", params, res => {
      if (res.result) {
        this.setState({
          collegeList: res.data,
        });
      } else {
        this.setState({
          collegeList: []
        });
      }
    });
  };
  //获取课程列表接口函数
  getCourse = params => {
    request("/api/public/getCourseList", params, res => {
      if (res.result) {
        this.setState({
          courseList: res.data,
          oldCourseList:res.data
        });
      } else {
        this.setState({
          courseList: [],
          oldCourseList:[]
        });
      }
    });
  };
  //获取教师列表接口函数
  getTeacher = params => {
    request("/api/public/getTeacherList", params, res => {
      if (res.result) {
        this.setState({
          teacherList: res.data,
          oldTeacherList:res.data
        });
      } else {
        this.setState({
          teacherList: [],
          oldTeacherList:[]
        });
      }
    });
  };
  //点击行 操作
  clickRow = (record) => {
    const { curSign } = this.props
    this.props.getCurSign(4, record)
  }
  // 分页跳转
  jumpPage = (pageIndex) => {
    this.props.getPageNum(pageIndex)

  }
  render() {
    const { collegeId, courseId, pinkInfo,QuaClaAdmSta,isLoading, pageNum, pageSize, curSign, subPageType } = this.props
    const orderTh = [
      {
        title: "开课单位",
        dataIndex: "collegeName",
        className: 'zoe-none',
        render: (text) => {
          return <div className="zoe-ellipsis" style={{ maxWidth: 200 }} title={text}>{text}</div>
        }
      },
      {
        title: "课程",
        dataIndex: "courseName",
        className: 'zoe-none',
        render: (text) => {
          return <div className="zoe-ellipsis" style={{ maxWidth: 200 }} title={text}>{text}</div>
        }
      },
      {
        title: "教学班",
        dataIndex: "teaClaName",
        className: '',
        render: (text) => {
          return <div className="zoe-ellipsis" style={{ maxWidth: 150 }} title={text}>{text}</div>
        }
      },
      {
        title: "教师",
        dataIndex: "teacherName",
        className: '',
        render: (text) => {
          return <div className="zoe-ellipsis" style={{ maxWidth: 120 }} title={text}>{text}</div>
        }
      },
      {
        title: "地点",
        dataIndex: "claAddress",
        className: 'zoe-none',
        render: (text) => {
          return <div className="zoe-ellipsis" style={{ maxWidth: 150 }} title={text}>{text}</div>
        }

      },
      {
        title: "时间",
        dataIndex: "claTime",
        className: 'zoe-none',
        render: (text) => {
          return <div className="zoe-ellipsis" style={{ maxWidth: 120 }} title={text}>{text}</div>
        }
      },
      {
        title: "教学分析",
        className: 'zoe-teach-analy',
        children: [
          // { 1.21删除
          //   title: '教学行为',
          //   dataIndex: 'teacherBehavior',
          //   className: 'zoe-teach-analy-item',
          //   render: (text, record) => {
          //     return <div>
          //       <p>
          //         <span>板书</span>
          //         <span>【{text.boardWrite}%】</span>
          //       </p>
          //       <p>
          //         <span>巡视</span>
          //         <span>【{text.patrol}%】</span>
          //       </p>
          //       <p>
          //         <span>多媒体</span>
          //         <span>【{text.media}%】</span>
          //       </p>
          //     </div>
          //   }
          // },
          {
            title: '教学设计',
            dataIndex: 'teachDesign',
            className: 'zoe-teach-analy-item',
            render: (text, record) => {
              return <div>
                <p>
                  <span>学生自习</span>
                  <span>【{text.stuLearn}%】</span>
                </p>
                <p>
                  <span>生生互动</span>
                  <span>【{text.stuInteract}%】</span>
                </p>
                <p>
                  <span>师生互动</span>
                  <span>【{text.tsInteract}%】</span>
                </p>
                <p>
                  <span>学生展示</span>
                  <span>【{text.stuShow}%】</span>
                </p>
                <p>
                  <span>教师讲授</span>
                  <span>【{text.teaching}%】</span>
                </p>
              </div>
            }
          },
          {
            title: '课堂类型',
            dataIndex: 'couType',
            className: 'zoe-teach-analy-item',
            render: (text, record) => {
              return <div>
                <p>
                  <span>讲授型</span>
                  <span>【{text.teachingT}%】</span>
                </p>
                <p>
                  <span>对话型</span>
                  <span>【{text.chatT}%】</span>
                </p>
                <p>
                  <span>混合型</span>
                  <span>【{text.mixT}%】</span>
                </p>
              </div>
            }
          },
        ]
      },
      {
        title: "学生听讲反馈",
        children: [
          {
            title: '学生行为',
            dataIndex: 'stuBehavior',
            className: 'zoe-stu-behav-item',
            render: (text, record) => {
              return <div>
                <p>
                  <span>阅读</span>
                  <span>【{text.read}%】</span>
                </p>
                <p>
                  <span>书写</span>
                  <span>【{text.write}%】</span>
                </p>
                <p>
                  <span>听讲</span>
                  <span>【{text.listen}%】</span>
                </p>
                <p>
                  <span>举手</span>
                  <span>【{text.handUp}%】</span>
                </p>
                <p>
                  <span>起立</span>
                  <span>【{text.standUp}%】</span>
                </p>
                <p>
                  <span>玩手机</span>
                  <span>【{text.playPhone}%】</span>
                </p>
                <p>
                  <span>趴桌子</span>
                  <span>【{text.onTable}%】</span>
                </p>
              </div>
            }
          },
          {
            title: '学生表情',
            dataIndex: 'face',
            className: 'zoe-stu-behav-item',
            render: (text, record) => {
              return <div>
                <p>
                  <span>高兴</span>
                  <span>【{text.happy}%】</span>
                </p>
                <p>
                  <span>害怕</span>
                  <span>【{text.scare}%】</span>
                </p>
                <p>
                  <span>中性</span>
                  <span>【{text.neuter}%】</span>
                </p>
                <p>
                  <span>惊讶</span>
                  <span>【{text.amzed}%】</span>
                </p>
                <p>
                  <span>愤怒</span>
                  <span>【{text.anger}%】</span>
                </p>
                <p>
                  <span>难过</span>
                  <span>【{text.sad}%】</span>
                </p>
                <p>
                  <span>厌恶</span>
                  <span>【{text.detest}%】</span>
                </p>
              </div>
            }
          },
          {
            title: '参与度',
            dataIndex: 'involvement',
            render: (text) => {
              return text + '%'
            },
          },
          {
            title: '专注度',
            dataIndex: 'concentration',
            render: (text) => {
              return text + '%'
            },
          },
          {
            title: '活跃度',
            dataIndex: 'activation',
            render: (text) => {
              return text + '%'
            },
          },
          {
            title: '疑惑度',
            dataIndex: 'distrust',
            render: (text) => {
              return text + '%'
            },
          },
        ],
      },
      // { 1.21删除
      //   title: "课堂互动",
      //   className: 'zoe-cla-room',
      //   children: [
      //     {
      //       title: <div><p>学生起立</p><p>(次/课时)</p></div>,
      //       dataIndex: 'stuStand',
      //       className: 'zoe-cla-room-item',
      //     },
      //     {
      //       title: <div><p>教师上下讲台</p><p>(次/课时)</p></div>,
      //       dataIndex: 'teacherDown',
      //       className: 'zoe-cla-room-item',
      //     },
      //   ]
      // },
      {
        title:'操作',
        render:(text,record)=>{
          return <div><span onClick={()=>this.clickRow(record)} style={{cursor:'pointer'}}><SVG type='de_show'/> 查看课堂</span></div>
        }
      }
    ]

    return (
      <div style={{ height: "calc(100% - 45px)" }}>
        <ZoeQuaStatis subPageType={1} curSign={3} />
        <div className="zoe-data-download">
          <div className="zoe-down" onClick={this.props.downLoad}>
            <SVG type="de_download"></SVG>
            <div>下载</div>
          </div>
        </div>
        <div
          style={{
            height: "calc(100% - 160px)",
            background: "#fff",
          }}
        >
          <Table
            locale={{ emptyText: <CollageNoData /> }}
            loading={isLoading}
            className={"zoe-qua-table zoe-order-table-click"}
            columns={orderTh}
            dataSource={QuaClaAdmSta.list}
            pagination={false}
            rowKey={record => record.teaClaId}
          />
          <Fy
            total={QuaClaAdmSta.total}
            pageIndex={pageNum}
            pageSize={pageSize}
            jumpPage={this.jumpPage}
          />


        </div>
      </div>
    );
  }
}

export default ZoeQuaClaAdm;