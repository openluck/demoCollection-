/*
 * @Author: zoe ღ 
 * @Date: 2020-02-12 14:33:12 
 * @Last Modified by: tj
 * @Last Modified time: 2021-01-20 16:26:52
 * 教学秩序-课程统计-课堂统计页面
 */

import React, { Component } from 'react';
import SVG from "../../../public/svg";
import { Select, DatePicker, Table } from "antd";
import ZoeOrderStatis from "../zoe-components/zoe-orderStatis";
import ZoeDownLoad from "../zoe-components/zoe-download";
import ZoeOrderClaTable from "../zoe-components/zoe-orderClaTable";
import G from "../../../../config/g";
import { connect } from 'react-redux';
import Fy from "../../../public/fy"
import { request } from "../../../../util/request";
import SelInput from "./../../../public/searSel/element";
import CollageNoData from '../../image/college_image/collegeNoData';
import { ws_saveGlobalData } from "./../../../../redux/ws-global.reducer";
@connect(state => state.zoe_orderData, {
  // zoe_getClaColSta
  ws_saveGlobalData
})
class ZoeOrderClaRoom extends Component {
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

  //点击行 操作
  clickRow = (record) => {
    const { roleType } = G.ISCED_curRoleInfo;
    const { curSign } = this.props
    console.log(curSign);
    let curSignArray = G.ISCED_tabArray || [];
    let curSign_;
    // if(curSignArray.length>1){
    //   curSign_=curSignArray.length
    // }else{
    curSign_ = curSign
    // }
    if (curSign_ == 1) {
      this.props.getCurSign(2, record)
    }
    if (curSign_ == 2) {
      this.props.getCurSign(3, record)
    }
    if (curSign_ == 3) {
      this.props.getCurSign(4, record)
    }
    if (curSign_ == 4) {
      // 底层页跳转播放页
      this.props.history.push(`/home/data/ordcour/${record.claRoomId}`)
      let curSignArray = G.ISCED_tabArray || []
      let tabSign = []
      curSignArray.forEach((item, index) => {
        if (roleType==="1" || roleType === '2') {
          tabSign.push({
            name: index == 0 ? '课程统计' : index == 1 ? '课程' : index == 2 ? '教学班' : '课堂',
            url: '/home/data/ordcour'
          })
        } else {
          tabSign.push({
            name: index == 0 ? '课程' : index == 1 ? '教学班' : '课堂',
            url: '/home/data/ordcour'
          })
        }

      });
      tabSign.push({
        name: '课堂明细',
        url: ''
      })
      this.props.ws_saveGlobalData(tabSign, 'ISCED_content')
    }
  }

  // 分页跳转
  jumpPage = (pageIndex) => {
    this.props.getPageNum(pageIndex)
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
  //获取开课院系列表接口函数
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
          oldCourseList: res.data
        });
      } else {
        this.setState({
          courseList: [],
          oldCourseList: []
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
          oldTeacherList: res.data
        });
      } else {
        this.setState({
          teacherList: [],
          oldTeacherList: []
        });
      }
    });
  };
  render() {
    const { collegeId, ClaRoomSta, courseId, pinkInfo, sortArr, pageNum, pageSize, curSign, isLoading } = this.props;
    const { roleType } = G.ISCED_curRoleInfo;
    const orderTh = [
      {
        title: "开课单位",
        dataIndex: "collegeName",
        className: 'zoe-none'
      },
      {
        title: "课程",
        dataIndex: "courseName",
        className: 'zoe-none'
      },
      {
        title: "教学班",
        dataIndex: "teaClaName",
        className: 'zoe-none'
      },
      {
        title: "教师",
        dataIndex: "teacherName",
        className: 'zoe-none'
      },
      {
        title: "地点",
        dataIndex: "claAddress",
        render: (text) => {
          return <div className="zoe-ellipsis" style={{ maxWidth: 150 }} title={text}>{text}</div>
        }
      },
      {
        title: "时间",
        dataIndex: "claTime",
        render: (text) => {
          return <div className="zoe-ellipsis" style={{ maxWidth: 150 }} title={text}>{text}</div>
        }
      },
      G.ISCED_setInfo.isTeacherCheck === '0' ? //1.21 教师考勤关闭 此处不显示
      {
        title: "",
      }: {
        title: '教师考勤',
        dataIndex: "teaAtNormalRate",
        render: (text) => {
          return (text ? text : '-')
        },
        filterDropdown: curSign !== 4 ? true : false,
        filterIcon: () => {
          return (
            <div>
              <div className="zoe-sort-span">
                <p
                  style={{ width: "100%", height: 10 }}
                  onClick={() => this.props.setSort("tea", 2)}
                >
                  {
                    sortArr[0].sortType === 2 ?
                      <SVG type="de_sort1" className="zoe-svg-shang1 " />
                      :
                      <SVG type="de_sort" className="zoe-svg-shang" />
                  }

                </p>
                <p
                  style={{ width: "100%", height: 10 }}
                  onClick={() => this.props.setSort("tea", 1)}
                >
                  {
                    sortArr[0].sortType === 1 ?
                      <SVG type="de_sort1" className="zoe-svg-xia1" />
                      :
                      <SVG type="de_sort" className="zoe-svg-xia " />

                  }
                </p>
              </div>
            </div>
          );
        }
      },
      {
        title: "学生到课率",
        dataIndex: "stuOnAttRate",
        filterDropdown: true,
        render: (text) => {
          return text + '%'
        },
        filterIcon: () => {
          return (
            <div>
              <div className="zoe-sort-span">
                <p
                  style={{ width: "100%", height: 10 }}
                  onClick={() => this.props.setSort("stu", 2)}
                >
                  {
                    sortArr[1].sortType === 2 ?
                      <SVG type="de_sort1" className="zoe-svg-shang1 " />
                      :
                      <SVG type="de_sort" className="zoe-svg-shang" />
                  }

                </p>
                <p
                  style={{ width: "100%", height: 10 }}
                  onClick={() => this.props.setSort("stu", 1)}
                >
                  {
                    sortArr[1].sortType === 1 ?
                      <SVG type="de_sort1" className="zoe-svg-xia1" />
                      :
                      <SVG type="de_sort" className="zoe-svg-xia " />
                  }
                </p>
              </div>
            </div>
          );
        }
      },
      G.ISCED_setInfo.isFrontRate === '0' ? //1.21前排就坐率关闭，此处不显示
      {
        title: ''
      }: {
        title: "前排就座率",
        dataIndex: "frontSeatRate",
        render: (text) => {
          return text + '%'
        },
        filterDropdown: true,
        filterIcon: () => {
          return (
            <div>
              <div className="zoe-sort-span">
                <p
                  style={{ width: "100%", height: 10 }}
                  onClick={() => this.props.setSort("seat", 2)}
                >
                  {
                    sortArr[2].sortType === 2 ?
                      <SVG type="de_sort1" className="zoe-svg-shang1 " />
                      :
                      <SVG type="de_sort" className="zoe-svg-shang" />
                  }

                </p>
                <p
                  style={{ width: "100%", height: 10 }}
                  onClick={() => this.props.setSort("seat", 1)}
                >
                  {
                    sortArr[2].sortType === 1 ?
                      <SVG type="de_sort1" className="zoe-svg-xia1" />
                      :
                      <SVG type="de_sort" className="zoe-svg-xia " />

                  }
                </p>
              </div>
            </div>
          );
        }
      },
      G.ISCED_setInfo.isHeadLow === '0' ? //1.21低头率关闭，此处不显示
      {
        title: ''
      }: {
        title: "低头率",
        dataIndex: "sleepRate",
        filterDropdown: true,
        render: (text) => {
          return text + '%'
        },
        filterIcon: () => {
          return (
            <div>
              <div className="zoe-sort-span">
                <p
                  style={{ width: "100%", height: 10 }}
                  onClick={() => this.props.setSort("sleep", 2)}
                >
                  {
                    sortArr[3].sortType === 2 ?
                      <SVG type="de_sort1" className="zoe-svg-shang1 " />
                      :
                      <SVG type="de_sort" className="zoe-svg-shang" />
                  }

                </p>
                <p
                  style={{ width: "100%", height: 10 }}
                  onClick={() => this.props.setSort("sleep", 1)}
                >
                  {
                    sortArr[3].sortType === 1 ?
                      <SVG type="de_sort1" className="zoe-svg-xia1" />
                      :
                      <SVG type="de_sort" className="zoe-svg-xia " />

                  }
                </p>
              </div>
            </div>
          );
        }
      },
      {
        title: '违纪事件数',
        dataIndex: "disClaRate",
        className: G.ISCED_setInfo.ifClassroomDiscipline === '1' ? '' : 'zoe-none',
        filterDropdown: false,
        render: (text) => {
          return (text ? text : 0)
        },
        filterIcon: () => {
          return (
            <div>
              <div className="zoe-sort-span">
                <p
                  style={{ width: "100%", height: 10 }}
                  onClick={() => this.props.setSort("disCla", 2)}
                >
                  {
                    sortArr[4].sortType === 2 ?
                      <SVG type="de_sort1" className="zoe-svg-shang1 " />
                      :
                      <SVG type="de_sort" className="zoe-svg-shang" />
                  }

                </p>
                <p
                  style={{ width: "100%", height: 10 }}
                  onClick={() => this.props.setSort("disCla", 1)}
                >
                  {
                    sortArr[4].sortType === 1 ?
                      <SVG type="de_sort1" className="zoe-svg-xia1" />
                      :
                      <SVG type="de_sort" className="zoe-svg-xia " />
                  }
                </p>
              </div>
            </div>
          );
        }
      },
      {
        title:'操作',
        render:(text,record)=>{
          return <div><span onClick={()=>this.clickRow(record)} style={{cursor:'pointer'}}><SVG type='de_show'/> 查看视频</span></div>
        }
      }
    ]

    return (
      <div style={{ height: "calc(100% - 45px)" }}>
        <ZoeOrderStatis subPageType={1} curSign={4} />
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
            // onRow={record => {
            //   return {
            //     onClick: e => this.clickRow(record), // 点击行
            //   };
            // }}
            locale={{ emptyText: <CollageNoData /> }}
            loading={isLoading}
            className='zoe-order-table zoe-order-cla-table1'
            className={curSign !== 4 ? 'zoe-order-table zoe-order-cla-table1 zoe-order-table-click' : 'zoe-order-table zoe-order-cla-table1 zoe-order-table-noclick'}

            // curSign === 2 ? "zoe-order-table zoe-order-cla-table2" :
            //     curSign === 3 ? "zoe-order-table zoe-order-cla-table3" :
            //         curSign === 4 ? "zoe-order-table zoe-order-cla-table4" : "zoe-order-table"

            columns={orderTh}
            dataSource={ClaRoomSta.list}
            pagination={false}
            rowKey={record => record.claRoomId}
          />
          {
            (roleType==="1" || roleType === '2') &&
              curSign !== 1 ?
              <Fy
                total={ClaRoomSta.total}
                pageIndex={pageNum}
                pageSize={pageSize}
                jumpPage={this.jumpPage}
              />
              : (roleType==="3" || roleType === '4') ?
                <Fy
                  total={ClaRoomSta.total}
                  pageIndex={pageNum}
                  pageSize={pageSize}
                  jumpPage={this.jumpPage}
                /> : null
          }

        </div>
      </div>
    );
  }
}

export default ZoeOrderClaRoom;