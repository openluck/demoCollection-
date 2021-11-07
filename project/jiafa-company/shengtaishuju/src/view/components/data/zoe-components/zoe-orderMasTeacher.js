/*
 * @Author: zoe ღ 
 * @Date: 2020-02-12 14:33:12 
 * @Last Modified by: tj
 * @Last Modified time: 2021-01-20 16:48:14
 * 教学秩序-课程统计-教师
 * subPageType 2教师统计； curSign 2院级教师
 */

import React, { Component } from 'react';
import { Table } from "antd"
import { connect } from 'react-redux';
import ZoeOrderStatis from "../zoe-components/zoe-orderStatis";
// import ZoeDownLoad from "../zoe-components/zoe-download";
// import ZoeOrderTeaTable from "../zoe-components/zoe-orderTeaTable";
import SelInput from "./../../../public/searSel/element";
import SVG from "../../../public/svg"
import G from "../../../../config/g";
import { request } from "../../../../util/request";
import CollageNoData from '../../image/college_image/collegeNoData';
import Fy from "../../../public/fy"

@connect(state => state.zoe_orderData, {
  // zoe_getClaColSta
})

class ZoeOrderMasTeacher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collegeId: '', //开课单位id
      teacherId: "", //教师id
      courseList: [], //课程列表
      teacherList: [], //教师列表
    };
  }

  componentDidMount() {
    const { pinkInfo, collegeId } = this.props
    const { roleType, belongOrgId } = G.ISCED_curRoleInfo
    //调教师列表接口
    if ((roleType==="1" || roleType === '2') && (pinkInfo && pinkInfo.semesterId)) {
      //校级账号登陆
      this.getTeacher({
        searchValue: '',
        semesterId: pinkInfo.semesterId,
        collegeId: collegeId
      });
    } else if((roleType==="3" || roleType === '4') && (pinkInfo && pinkInfo.semesterId)) {
      // 院级账号
      // console.log('pinkInfo', pinkInfo)
      // this.props.getTeacherId();
      this.getTeacher({
        searchValue: '',
        semesterId: pinkInfo.semesterId,
        collegeId: belongOrgId
      });
    }
  }

  componentWillReceiveProps(prop) {
    // console.log('pinkInfo',prop.pinkInfo)
    // console.log('collegeId',prop.collegeId)
    // console.log('curSign',prop.curSign)
    const { semesterId, couTypeId } = this.state
    const { roleType, belongOrgId } = G.ISCED_curRoleInfo
    if (roleType==="3" || roleType === '4') { //院级
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
    }else{ //校级
       //调教师列表接口
       if (prop.pinkInfo.semesterId !== semesterId) {
        this.getTeacher({
          searchValue: '',
          semesterId: prop.pinkInfo.semesterId,
          collegeId: prop.collegeId
        });
        this.setState({
          semesterId: prop.pinkInfo.semesterId,
        })
      }
    }
  }

  // 下拉的选择事件
  selectChange = (value) => {
    // console.log('value',value)
    const { pinkInfo, collegeId } = this.props;
    this.props.getTeacherId(value.id);
    if (!value.id) {
      this.getTeacher({
        searchValue: '',
        semesterId: pinkInfo.semesterId,
        collegeId
      });
    }
  };
  //搜索事件 搜索的数据用来查询全局公共的下拉列表 学院列表 课程列表 教师列表
  onSearch = (searchValue) => {
    // console.log('searchValue',searchValue)
    const { pinkInfo, collegeId } = this.props;
    //课程院系列表接口函数
    this.getTeacher({
      searchValue,
      semesterId: pinkInfo.semesterId,
      collegeId
    });
  };

  //获取教师列表接口函数
  getTeacher = params => {
    request("/api/public/getTeacherList", params, res => {
      if (res.result) {
        this.setState({
          teacherList: res.data
        });
      } else {
        this.setState({
          teacherList: []
        });
      }
    });
  };

  //点击行 操作
  clickRow = (record) => {
    this.props.getCurSign(3, record)
  }
  // 分页跳转
  jumpPage = (pageIndex) => {
    this.props.getPageNum(pageIndex)
  }


  render() {
    const { teacherId, pageNum, pageSize, MasTeaSta, sortArr } = this.props
    const { teacherList } = this.state;
    var teacher = teacherList.map(item => {
      return { id: item.teacherId, name: item.teacherName };
    });

    const orderTh = [
      {
        title: "开课单位",
        dataIndex: "collegeName",
        className: 'zoe-none'
      },
      {
        title: "教师",
        dataIndex: "teacherName",
        className: '',
        render: (text) => {
          return <div className="zoe-ellipsis" style={{ maxWidth: 200 }} title={text}>{text}</div>
        }
      },
      {
        title: "教学班",
        dataIndex: "teaClaName",
        className: 'zoe-none'
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
          return <div><span onClick={()=>this.clickRow(record)} style={{cursor:'pointer'}}><SVG type='de_show'/> 查看教学班</span></div>
        }
      }
    ]
    return (
      <div style={{ height: "calc(100% - 45px)" }}>
        <ZoeOrderStatis subPageType={2} curSign={2} />
        {/* subPageType 1课程统计 2教师统计； curSign 1校级 2 院级教师 */}
        <div className="zoe-data-download">
          <div style={{ display: "flex", alignItems: "center" }}>
            <div>教师：</div>
            <SelInput
              onChange={value => this.selectChange(value)}
              onSearch={value => this.onSearch(value)}
              value={teacherId}
              list={teacher || []}
            />
          </div>
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
            dataSource={MasTeaSta.list || []}
            pagination={false}
            rowKey={record => record.teacherId}
          />
          <Fy
            total={MasTeaSta.total || 0}
            pageIndex={pageNum}
            pageSize={pageSize}
            jumpPage={this.jumpPage}
          />

        </div>
        {/* <ZoeDownLoad
          subPageType={2}
          curSign={2}
          pinkInfo={pinkInfo}
          downLoad={this.props.downLoad}
          collegeId={collegeId}
          teacherId={teacherId}
          getTeacherId={this.props.getTeacherId}
          getCollegeId={this.props.getCollegeId}
        /> */}
        {/* <ZoeOrderTeaTable
          curSign={2}
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

export default ZoeOrderMasTeacher;