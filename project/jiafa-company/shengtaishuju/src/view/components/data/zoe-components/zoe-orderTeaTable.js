/*
 * @Author: zoe ღ 
 * @Date: 2020-02-10 16:37:16 
 * @Last Modified by: zoe ღ
 * @Last Modified time: 2020-04-23 13:38:32
 */

import React, { Component } from 'react';
import { Table } from "antd"
// import { zoe_getClaColSta } from "../../../../redux/zoe-dataOrder.reducer"
import { connect } from 'react-redux';
import SVG from "../../../public/svg"
import Fy from "../../../public/fy"
import CollageNoData from '../../image/college_image/collegeNoData';
@connect(state => state.zoe_orderData, {
    // zoe_getClaColSta
})
class ZoeOrderTeaTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checkType: '',// 排序字段
            sortType: 0,// 正序2 倒序1
            sortArr: [
                {
                    checkType: 'tea', sortType: 0,
                },
                {
                    checkType: 'stu', sortType: 0,
                },
                {
                    checkType: 'seat', sortType: 0,
                },
                {
                    checkType: 'sleep', sortType: 0,
                },
                {
                    checkType: 'disCla', sortType: 0,
                },
            ]
        };
    }
    componentDidMount() {
    }
    //点击行 操作
    clickRow=(record)=>{
        const {curSign}=this.props
        if(curSign===1){
            this.props.getCurSign(2,record)
        }
        if(curSign===2){
            this.props.getCurSign(3,record)
        }
        if(curSign===3){
            this.props.getCurSign(4,record)
        }
    }
    // 分页跳转
    jumpPage=(pageIndex)=>{
        this.props.getPageNum(pageIndex)
    }
    render() {
        const { MasColSta,MasTeaSta,MasAdmSta,MasRoomSta,curSign,isLoading ,sortArr,pageNum,pageSize} = this.props
        const orderTh = [
            {
                title: "开课单位",
                dataIndex: "collegeName",
                className:curSign!==1?'zoe-none':'',
                render: (text) => {
                    return <div className="zoe-ellipsis" style={{maxWidth:200}} title={text}>{text}</div>
                }
            },
            {
                title: "教师",
                dataIndex: "teacherName",
                className:curSign!==2?'zoe-none':'',
                render: (text) => {
                    return <div className="zoe-ellipsis" style={{maxWidth:200}} title={text}>{text}</div>
                }
            },
            {
                title: "教学班",
                dataIndex: "teaClaName",
                className:curSign!==3?'zoe-none':'',
                render: (text) => {
                    return <div className="zoe-ellipsis" style={{maxWidth:200}} title={text}>{text}</div>
                }
            },
           
            {
                title: "地点",
                dataIndex: "claAddress",
                className:curSign!==4?'zoe-none':'',
                render: (text) => {
                    return <div className="zoe-ellipsis" style={{maxWidth:150}} title={text}>{text}</div>
                }
            },
            {
                title: "时间",
                dataIndex: "claTime",
                className:curSign!==4?'zoe-none':'',
                render: (text) => {
                    return <div className="zoe-ellipsis" style={{maxWidth:150}} title={text}>{text}</div>
                }
            },
            {
                title:curSign!==4? "教师考勤正常率":'教师考勤',
                dataIndex: "teaAtNormalRate",
                render:(text)=>{
                    return curSign!==4?(text?text+'%':'0%'):(text?text:'-')
                },
                filterDropdown:  curSign!==4?true:false,
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
                                       <SVG type="de_sort1" className="zoe-svg-shang1 "/>
                                       :
                                       <SVG type="de_sort" className="zoe-svg-shang"/>
                                    }
                                   
                                </p>
                                <p
                                    style={{ width: "100%", height: 10 }}
                                onClick={() => this.props.setSort("tea", 1)}
                                >
                                    {
                                       sortArr[0].sortType === 1 ?
                                       <SVG type="de_sort1" className="zoe-svg-xia1"/>
                                       :
                                       <SVG type="de_sort" className="zoe-svg-xia "/>

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
                render:(text)=>{
                    return text+'%'
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
                                       <SVG type="de_sort1" className="zoe-svg-shang1 "/>
                                       :
                                       <SVG type="de_sort" className="zoe-svg-shang"/>
                                    }
                                   
                                </p>
                                <p
                                    style={{ width: "100%", height: 10 }}
                                onClick={() => this.props.setSort("stu", 1)}
                                >
                                    {
                                       sortArr[1].sortType === 1 ?
                                       <SVG type="de_sort1" className="zoe-svg-xia1"/>
                                       :
                                       <SVG type="de_sort" className="zoe-svg-xia "/>
                                    }
                                </p>
                            </div>
                        </div>
                    );
                }
            },
            {
                title: "前排就座率",
                dataIndex: "frontSeatRate",
                render:(text)=>{
                    return text+'%'
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
                                       <SVG type="de_sort1" className="zoe-svg-shang1 "/>
                                       :
                                       <SVG type="de_sort" className="zoe-svg-shang"/>
                                    }
                                   
                                </p>
                                <p
                                    style={{ width: "100%", height: 10 }}
                                onClick={() => this.props.setSort("seat", 1)}
                                >
                                    {
                                       sortArr[2].sortType === 1 ?
                                       <SVG type="de_sort1" className="zoe-svg-xia1"/>
                                       :
                                       <SVG type="de_sort" className="zoe-svg-xia "/>

                                    }
                                </p>
                            </div>
                        </div>
                    );
                }
            },
            {
                title: "低头率",
                dataIndex: "sleepRate",
                render:(text)=>{
                    return text+'%'
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
                                       <SVG type="de_sort1" className="zoe-svg-shang1 "/>
                                       :
                                       <SVG type="de_sort" className="zoe-svg-shang"/>
                                    }
                                   
                                </p>
                                <p
                                    style={{ width: "100%", height: 10 }}
                                onClick={() => this.props.setSort("sleep", 1)}
                                >
                                    {
                                       sortArr[3].sortType === 1 ?
                                       <SVG type="de_sort1" className="zoe-svg-xia1"/>
                                       :
                                       <SVG type="de_sort" className="zoe-svg-xia "/>

                                    }
                                </p>
                            </div>
                        </div>
                    );
                }
            },
            {
                title:curSign!==4?"课堂违纪率":'违纪扣分',
                dataIndex: "disClaRate",
                className:G.ISCED_setInfo.ifClassroomDiscipline==='1'?'':'zoe-none',
                render:(text)=>{
                    return curSign!==4?(text?text+'%':'0%'):(text?text:0)
                },
                filterDropdown: curSign!==4?true:false,
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
                                       <SVG type="de_sort1" className="zoe-svg-shang1 "/>
                                       :
                                       <SVG type="de_sort" className="zoe-svg-shang"/>
                                    }
                                   
                                </p>
                                <p
                                    style={{ width: "100%", height: 10 }}
                                onClick={() => this.props.setSort("disCla", 1)}
                                >
                                    {
                                       sortArr[4].sortType === 1 ?
                                       <SVG type="de_sort1" className="zoe-svg-xia1"/>
                                       :
                                       <SVG type="de_sort" className="zoe-svg-xia "/>
                                    }
                                </p>
                            </div>
                        </div>
                    );
                }
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
                    className={curSign!==4?"zoe-order-table zoe-order-cla-table2 zoe-order-table-click":"zoe-order-table zoe-order-cla-table2 zoe-order-table-noclick"}
                    columns={orderTh}
                    dataSource={curSign===1?MasColSta.list:curSign===2?MasTeaSta.list:
                        curSign===3?MasAdmSta.list:curSign===4?MasRoomSta.list:
                        []}
                    pagination={false}
                    rowKey={record =>curSign===1? record.collegeId:
                        curSign===2?record.teacherId:
                        curSign===3?record.teaClaId:curSign===4?record.claRoomId:Math.random()}
                />
                {
                    curSign!==1?
                    <Fy
                        total={curSign===2?MasTeaSta.total:curSign===3?MasAdmSta.total:curSign===4?MasRoomSta.total:0}
                        pageIndex={pageNum}
                        pageSize={pageSize}
                        jumpPage={this.jumpPage}
                    />
                    :null
                }
                
            </div>
        );
    }
}

export default ZoeOrderTeaTable;