/*
 * @Author: zoe ღ
 * @Date: 2020-02-12 14:33:12
 * @Last Modified by: tj
 * @Last Modified time: 2021-01-20 17:09:58
 * 教学质量-教师统计-教师下所有教学班数据
 */
import React, { Component } from "react";
import { Table } from "antd"
import { connect } from 'react-redux';
import Fy from "../../../public/fy"
import CollageNoData from '../../image/college_image/collegeNoData';
import ZoeQuaStatis from "../zoe-components/zoe-quaStatis";
import ZoeDownLoad from "../zoe-components/zoe-download";
import ZoeQuaTeaTable from "../zoe-components/zoe-quaTeaTable";
import SVG from "../../../public/svg";

@connect(state => state.zoe_quaData, {
})
class ZoeQuaMasAdm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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
    const { pageNum, pageSize, QuaMasAdmSta } = this.props;
    const orderTh = [
      {
        title: "开课单位",
        dataIndex: "collegeName",
        className: 'zoe-none',
      },
      {
        title: "教师",
        dataIndex: "teacherName",
        className: 'zoe-none',
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
          // {
          //  // 1.21删除
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
      // {1.21删除
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
          return <div><span onClick={() => this.clickRow(record)} style={{ cursor: 'pointer' }}><SVG type='de_show' /> 查看课堂</span></div>
        }
      }
    ]
    return (
      <div style={{ height: "calc(100% - 45px)" }}>
        <ZoeQuaStatis subPageType={2} curSign={3} />
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
            className={"zoe-qua-tea-table zoe-order-table-click"}
            columns={orderTh}
            dataSource={QuaMasAdmSta.list || []}
            pagination={false}
            rowKey={record => record.teaClaId}
          />
          <Fy
            total={ QuaMasAdmSta.total|| 0}
            pageIndex={pageNum}
            pageSize={pageSize}
            jumpPage={this.jumpPage}
          />

        </div>
        {/* <ZoeDownLoad
          subPageType={2}
          curSign={3}
          pinkInfo={pinkInfo}
          collegeId={collegeId}
          teacherId={teacherId}
          getTeacherId={this.props.getTeacherId}
          getCollegeId={this.props.getCollegeId}
          downLoad={this.props.downLoad}
        /> */}
        {/* <ZoeQuaTeaTable
          curSign={3}
          pageNum={pageNum}
          pageSize={pageSize}
          getPageNum={this.props.getPageNum}
          getCurSign={this.props.getCurSign}
        /> */}
      </div>
    );
  }
}
export default ZoeQuaMasAdm;
