/*
 * @Author: zoe ღ 
 * @Date: 2020-02-12 14:33:12 
 * @Last Modified by: tj
 * @Last Modified time: 2021-01-20 16:40:48
 * 教学秩序-教师统计-学院层级
 * subPageType 2教师统计； curSign 1校级
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

@connect(state => state.zoe_orderData, {
  // zoe_getClaColSta
})
class ZoeOrderMasCollege extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collegeId: '', //开课单位id
      collegeList: G.ISCED_collegeList, //开课单位列表
      semesterId: "",//当前选择的学期id
      couTypeId: "",//当前选择的课程类别
    };
  }

  componentDidMount() {

  }
  componentWillReceiveProps(prop) {
    const { semesterId, couTypeId } = this.state
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

  // 下拉的选择事件
  selectChange = (value) => {
    // console.log('value',value)
    const { pinkInfo, collegeId } = this.props;
    this.props.getCollegeId(value.id);
    if (!value.id) {
      this.setState({
        collegeList: G.ISCED_collegeList
      })
    }
  };

  //搜索事件 搜索的数据用来查询全局公共的下拉列表 学院列表
  onSearch = (searchValue) => {
    // console.log('searchValue',searchValue)
    const { pinkInfo, collegeId } = this.props;
    //开课院系列表接口函数
    this.getCollege({
      searchValue,
      semesterId: pinkInfo.semesterId,
      courseId: "",
      teacherId: "",
      couTypeId: pinkInfo.couTypeId
    });
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

  //点击行 操作
  clickRow = (record) => {
    this.props.getCurSign(2, record)
  }


  render() {
    const { collegeId, MasColSta, sortArr } = this.props
    const { collegeList } = this.state;
    var college = collegeList.map(item => {
      return { id: item.collegeId, name: item.collegeName };
    });

    const orderTh = [
      {
        title: "开课单位",
        dataIndex: "collegeName",
        render: (text) => {
          return <div className="zoe-ellipsis" style={{ maxWidth: 200 }} title={text}>{text}</div>
        }
      },
      {
        title: "教师",
        dataIndex: "teacherName",
        className: 'zoe-none'
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
          return (text ? text + '%' : '0%')
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
          return (text ? text + '%' : '0%')
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
          return <div><span onClick={()=>this.clickRow(record)} style={{cursor:'pointer'}}><SVG type='de_show'/> 查看教师</span></div>
        }
      }
    ]
    return (
      <div style={{ height: "calc(100% - 45px)" }}>
        {/* subPageType 1课程统计 2教师统计； curSign 1校级 */}
        <ZoeOrderStatis subPageType={2} curSign={1} />
        <div className="zoe-data-download">
          <div style={{ display: "flex", alignItems: "center" }}>
            <div>开课单位：</div>
            <SelInput
              onChange={value => this.selectChange(value)}
              onSearch={value => this.onSearch(value)}
              value={collegeId}
              list={college}
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
            dataSource={MasColSta.list || []}
            pagination={false}
            rowKey={record => record.collegeId}
          />
        </div>
        {/* <ZoeOrderTeaTable
          curSign={1}
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

export default ZoeOrderMasCollege;