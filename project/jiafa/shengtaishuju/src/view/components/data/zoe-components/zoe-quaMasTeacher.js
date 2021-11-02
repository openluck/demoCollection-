/*
 * @Author: zoe ღ
 * @Date: 2020-02-12 14:33:12
 * @Last Modified by: tj
 * @Last Modified time: 2021-01-20 17:10:50
 * 教学质量-教师统计-学院下所有教师数据
 * subPageType 2教师统计 curSign 2院级
 */
import React, { Component } from "react";
import { Table } from "antd"
import { connect } from 'react-redux';
import Fy from "../../../public/fy"
import CollageNoData from '../../image/college_image/collegeNoData';
import ZoeQuaStatis from "../zoe-components/zoe-quaStatis";
import ZoeDownLoad from "../zoe-components/zoe-download";
import ZoeQuaTeaTable from "../zoe-components/zoe-quaTeaTable";
import SelInput from "./../../../public/searSel/element";
import SVG from "../../../public/svg";
import G from "../../../../config/g";
import { request } from "../../../../util/request";

@connect(state => state.zoe_quaData, {
})
class ZoeQuaMasTeacher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collegeId: '', //开课单位id
      teacherList: [], //教师列表
      semesterId: "",//当前选择的学期id
      couTypeId: "",//当前选择的课程类别
    };
  }

  componentDidMount() {
    const { pinkInfo, collegeId } = this.props
    const { roleType } = G.ISCED_curRoleInfo
    //调教师列表接口
    // if (roleType==="1" || roleType === '2') {
    //   //校级账号登陆
    //   this.getTeacher({
    //     searchValue: '',
    //     semesterId: pinkInfo.semesterId,
    //     collegeId: collegeId
    //   });
    // }
  }
  componentWillReceiveProps(prop) {
    // console.log('pinkInfo',prop.pinkInfo)
    const { semesterId } = this.state
    const { roleType, belongOrgId } = G.ISCED_curRoleInfo
    if (roleType==="3" || roleType === '4') {
      //院级账号进入，调教师列表接口
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
    }else{
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
    const { collegeId, teacherId, pinkInfo, pageNum, pageSize, QuaMasTeaSta } = this.props;
    const { teacherList } = this.state;
    var teacher = teacherList.map(item => {
      return { id: item.teacherId, name: item.teacherName };
    });
    const orderTh = [
      {
        title: "开课单位",
        dataIndex: "collegeName",
        className:'zoe-none',
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
        className: 'zoe-none',
      },
      {
        title: "地点",
        dataIndex: "claAddress",
        className: 'zoe-none',
      },
      {
        title: "时间",
        dataIndex: "claTime",
        className: 'zoe-none',
      },
      {
        title: "教学分析",
        className: 'zoe-teach-analy',
        children: [
          // { //1.21删除
          //   title: '教学行为',
          //   dataIndex: 'teacherBehavior',
          //   className: 'zoe-teach-analy-item1',
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
            className: 'zoe-teach-analy-item1',
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
            className: 'zoe-teach-analy-item1',
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
            className: 'zoe-stu-behav-item1',
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
            className: 'zoe-stu-behav-item1',
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
      // { //1.21删除
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
        title: '操作',
        render: (text, record) => {
          return <div><span onClick={() => this.clickRow(record)} style={{ cursor: 'pointer' }}><SVG type='de_show' /> 查看教学班</span></div>
        }
      }
    ]

    return (
      <div style={{ height: "calc(100% - 45px)" }}>
        <ZoeQuaStatis subPageType={2} curSign={2} />
        <div className="zoe-data-download">
          <div style={{ display: "flex", alignItems: "center" }}>
            <div>教师：</div>
            <SelInput
              onChange={value => this.selectChange(value)}
              onSearch={value => this.onSearch(value)}
              value={teacherId}
              list={teacher}
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
            className={"zoe-qua-tea-table zoe-order-table-click"}
            columns={orderTh}
            dataSource={QuaMasTeaSta.list || []}
            pagination={false}
            rowKey={record => record.teacherId}
          />
          <Fy
            total={QuaMasTeaSta.total|| 0}
            pageIndex={pageNum}
            pageSize={pageSize}
            jumpPage={this.jumpPage}
          />

        </div>
        {/* <ZoeDownLoad
          subPageType={2}
          curSign={2}
          pinkInfo={pinkInfo}
          collegeId={collegeId}
          teacherId={teacherId}
          getTeacherId={this.props.getTeacherId}
          getCollegeId={this.props.getCollegeId}
          downLoad={this.props.downLoad}
        /> */}
        {/* <ZoeQuaTeaTable
          curSign={2}
          pageNum={pageNum}
          pageSize={pageSize}
          getPageNum={this.props.getPageNum}
          getCurSign={this.props.getCurSign}
        /> */}
      </div>
    );
  }
}
export default ZoeQuaMasTeacher;
