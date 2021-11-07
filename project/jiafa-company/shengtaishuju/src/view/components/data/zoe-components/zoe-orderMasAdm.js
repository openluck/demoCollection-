/*
 * @Author: zoe ღ 
 * @Date: 2020-02-12 14:33:12 
 * @Last Modified by: tj
 * @Last Modified time: 2021-01-20 16:43:49
 * 教学秩序-教师统计-教学班
 * subPageType 2教师统计； curSign 3教学班
 */

import React, { Component } from 'react';
import { Table } from "antd"
import { connect } from 'react-redux';
import ZoeOrderStatis from "../zoe-components/zoe-orderStatis";
import ZoeDownLoad from "../zoe-components/zoe-download";
import ZoeOrderTeaTable from "../zoe-components/zoe-orderTeaTable";
import SVG from "../../../public/svg"
import G from "../../../../config/g";
import CollageNoData from '../../image/college_image/collegeNoData';
import Fy from "../../../public/fy"

@connect(state => state.zoe_orderData, {
  // zoe_getClaColSta
})
class ZoeOrderMasAdm extends Component {
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
    this.props.getCurSign(4, record)
  }
  // 分页跳转
  jumpPage = (pageIndex) => {
    this.props.getPageNum(pageIndex)
  }

  render() {
    const { sortArr, pageNum, pageSize, MasAdmSta } = this.props
    const orderTh = [
      {
        title: "开课单位",
        dataIndex: "collegeName",
        className: 'zoe-none'
      },
      {
        title: "教师",
        dataIndex: "teacherName",
        className: 'zoe-none'
      },
      {
        title: "教学班",
        dataIndex: "teaClaName",
        className: '',
        render: (text) => {
          return <div className="zoe-ellipsis" style={{ maxWidth: 200 }} title={text}>{text}</div>
        }
      },
      {
        title: "地点",
        dataIndex: "claAddress",
        className: 'zoe-none'
      },
      {
        title: "时间",
        dataIndex: "claTime",
        className: 'zoe-none'
      },
      G.ISCED_setInfo.isTeacherCheck === '0' ? //1.21 教师考勤关闭 此处不显示
      {
        title: "",
      }: {
        title: "教师考勤正常率",
        dataIndex: "teaAtNormalRate",
        render: (text) => {
          return text ? text + '%' : '0%'
        },
        filterDropdown: true,
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
        title: "巡课违纪率",
        dataIndex: "disClaRate",
        className: G.ISCED_setInfo.ifClassroomDiscipline === '1' ? '' : 'zoe-none',
        render: (text) => {
          return text ? text + '%' : '0%'
        },
        filterDropdown: true,
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
          return <div><span onClick={()=>this.clickRow(record)} style={{cursor:'pointer'}}><SVG type='de_show'/> 查看课堂</span></div>
        }
      }
    ]
    return (
      <div style={{ height: "calc(100% - 45px)" }}>
        <ZoeOrderStatis subPageType={2} curSign={3} />
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
            // loading={isLoading}
            className={"zoe-order-table zoe-order-cla-table2 zoe-order-table-click"}
            columns={orderTh}
            dataSource={MasAdmSta.list || []}
            pagination={false}
            rowKey={record => record.teaClaId}
          />
          <Fy
            total={MasAdmSta.total || 0}
            pageIndex={pageNum}
            pageSize={pageSize}
            jumpPage={this.jumpPage}
          />
        </div>
        {/* <ZoeDownLoad
          subPageType={2}
          curSign={3}
          pinkInfo={pinkInfo}
          downLoad={this.props.downLoad}
          collegeId={collegeId}
          teacherId={teacherId}
          getTeacherId={this.props.getTeacherId}
          getCollegeId={this.props.getCollegeId}
        /> */}
        {/* <ZoeOrderTeaTable
          curSign={3}
          sortArr={sortArr}
          setSort={this.props.setSort}
          getCurSign={this.props.getCurSign}
          pageNum={pageNum}
          pageSize={pageSize}
          getPageNum={this.props.getPageNum}
        /> */}
      </div>
    );
  }
}

export default ZoeOrderMasAdm;