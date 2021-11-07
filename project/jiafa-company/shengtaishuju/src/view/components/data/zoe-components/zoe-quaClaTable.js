/*
 * @Author: zoe ღ 
 * @Date: 2020-02-10 16:37:16 
 * @Last Modified by: zoe ღ
 * @Last Modified time: 2020-03-17 10:54:20
 * 暂未使用 2021/07/20 
 */

import React, { Component } from 'react';
import { Table } from "antd"
// import { zoe_getClaColSta } from "../../../../redux/zoe-dataOrder.reducer"
import { connect } from 'react-redux';
import Fy from "../../../public/fy"
import CollageNoData from '../../image/college_image/collegeNoData';
@connect(state => state.zoe_quaData, {
    // zoe_getClaColSta
})
class ZoeQuaClaTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    componentDidMount() {
    }

    //点击行 操作
    clickRow = (record) => {
        const { curSign } = this.props
        if (curSign === 1) {
            this.props.getCurSign(2,record)
        }
        if (curSign === 2) {
            this.props.getCurSign(3,record)
        }
        if (curSign === 3) {
            this.props.getCurSign(4,record)
        }
    }
    // 分页跳转
    jumpPage = (pageIndex) => {
        this.props.getPageNum(pageIndex)

    }
    render() {
        const { QuaClaColSta, QuaClaCourSta, QuaClaAdmSta, QuaClaRoomSta, curSign,isLoading,pageNum ,pageSize } = this.props
        const orderTh = [
            {
                title: "开课单位",
                dataIndex: "collegeName",
                className: curSign !== 1 ? 'zoe-none' : '',
                render: (text) => {
                    return <div className="zoe-ellipsis" style={{maxWidth:200}} title={text}>{text}</div>
                }
            },
            {
                title: "课程",
                dataIndex: "courseName",
                className: curSign !== 2 ? 'zoe-none' : '',
                render: (text) => {
                    return <div className="zoe-ellipsis" style={{maxWidth:200}} title={text}>{text}</div>
                }
            },
            {
                title: "教学班",
                dataIndex: "teaClaName",
                className: curSign !== 3 ? 'zoe-none' : '',
                render: (text) => {
                    return <div className="zoe-ellipsis" style={{maxWidth:150}} title={text}>{text}</div>
                }
            },
            {
                title: "教师",
                dataIndex: "teacherName",
                className: curSign !== 3 ? 'zoe-none' : '',
                render: (text) => {
                    return <div className="zoe-ellipsis" style={{maxWidth:120}} title={text}>{text}</div>
                }
            },
            {
                title: "地点",
                dataIndex: "claAddress",
                className: curSign !== 4 ? 'zoe-none' : '',
                render: (text) => {
                    return <div className="zoe-ellipsis" style={{maxWidth:150}} title={text}>{text}</div>
                }

            },
            {
                title: "时间",
                dataIndex: "claTime",
                className: curSign !== 4 ? 'zoe-none' : '',
                render: (text) => {
                    return <div className="zoe-ellipsis" style={{maxWidth:120}} title={text}>{text}</div>
                }
            },
            {
                title: "教学分析",
                className: 'zoe-teach-analy',
                children: [
                    {
                        title: '教学行为',
                        dataIndex: 'teacherBehavior',
                        className: 'zoe-teach-analy-item',
                        render: (text, record) => {
                            return <div>
                                <p>
                                    <span>板书</span>
                                    <span>【{text.boardWrite}%】</span>
                                </p>
                                <p>
                                    <span>巡视</span>
                                    <span>【{text.patrol}%】</span>
                                </p>
                                <p>
                                    <span>多媒体</span>
                                    <span>【{text.media}%】</span>
                                </p>
                            </div>
                        }
                    },
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
                        render:(text)=>{
                            return text+'%'
                        },
                    },
                    {
                        title: '专注度',
                        dataIndex: 'concentration',
                        render:(text)=>{
                            return text+'%'
                        },
                    },
                    {
                        title: '活跃度',
                        dataIndex: 'activation',
                        render:(text)=>{
                            return text+'%'
                        },
                    },
                    {
                        title: '疑惑度',
                        dataIndex: 'distrust',
                        render:(text)=>{
                            return text+'%'
                        },
                    },
                ],
            },
            {
                title: "课堂互动",
                className: 'zoe-cla-room',
                children: [
                    {
                        title: <div><p>学生起立</p><p>(次/课时)</p></div>,
                        dataIndex: 'stuStand',
                        className: 'zoe-cla-room-item',
                    },
                    {
                        title: <div><p>教师上下讲台</p><p>(次/课时)</p></div>,
                        dataIndex: 'teacherDown',
                        className: 'zoe-cla-room-item',
                    },
                ]
            },
        ]
        return (
            <div
                style={{
                    height: "calc(100% - 160px)",
                    background: "#fff",
                }}
            >
                <Table
                    onRow={record => {
                        return {
                            onClick: e => this.clickRow(record), // 点击行
                        };
                    }}
                    locale={{emptyText:<CollageNoData/>}}
                    loading={isLoading}
                    className={curSign!==4?"zoe-qua-table zoe-order-table-click":"zoe-qua-table zoe-order-table-noclick"}
                    columns={orderTh}
                    dataSource={curSign === 1 ? QuaClaColSta.list : curSign === 2 ? QuaClaCourSta.list :
                        curSign === 3 ? QuaClaAdmSta.list : curSign === 4 ? QuaClaRoomSta.list :
                            []}
                    pagination={false}
                    rowKey={record => curSign === 1 ? record.collegeId :
                        curSign === 2 ? record.courseId :
                            curSign === 3 ? record.teaClaId : curSign === 4 ? record.claRoomId : Math.random()}
                />
                {
                    curSign !== 1 ?
                        <Fy
                            total={curSign===2?QuaClaCourSta.total:curSign===3?QuaClaAdmSta.total:curSign===4?QuaClaRoomSta.total:0}
                            pageIndex={pageNum}
                            pageSize={pageSize}
                            jumpPage={this.jumpPage}
                        />
                        : null
                }

            </div>
        );
    }
}

export default ZoeQuaClaTable;