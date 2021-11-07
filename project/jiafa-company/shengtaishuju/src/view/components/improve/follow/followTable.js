/*
 * @Author: lilu 
 * @Date: 2020-07-23 09:33:48 
 * @Last Modified by: tj
 * @Last Modified time: 2021-03-26 15:51:34
 */
import React, { useState, useEffect } from 'react';
import './../../../../style/tj-followTable.scss';
import CollageNoData from '../../image/college_image/collegeNoData';
import Fy from '../../../public/fy';
import { Table } from 'antd';
import ReplyDetail from './replyDetail';
import _, { split } from 'lodash';
import SVG from '../../../public/svg';
import Line from './line';
import G from '../../../../config/g';
import {getAttCodeName} from './../../../../config/actionConfig'
export default function FollowTable(props) {
    //type 1是考勤 2是回复状态
    let getCodeValue = (code, type) => {
        let str = ''
        if (type == '1') {
            switch (code) {
                case '1': str = '正常'; break;
                case '2': str = '迟到'; break;
                case '3': str = '早退'; break;
                case '4': str = '缺勤'; break;
                case '5': str = '调换课'; break;
                case '6': str = '请假'; break;
                case '7': str = '迟到并且早退'; break;
                default:
                    str = '--'; break;
            }
        } else if (type == '2') {
            switch (code) {
                case '0': str = '未回复'; break;
                case '1': str = '已回复'; break;
                case '2': str = '过期未回复'; break;
                default:
                    str = '--'; break;
            }
        }

        return str;
    }
    let columns = [
        {
            title: '开课单位',
            dataIndex: 'collegeName',
            render: (text, record) => {
                return <div className='tj-td' title={text || '--'}>{text || '--'}</div>
            }
        },
        {
            title: '课程名',
            dataIndex: 'courseName',
            render: (text, record) => {
                return <div className='tj-td' title={text || '--'}>{text || '--'}</div>
            }
        },
        {
            title: '教师名',
            dataIndex: 'teacherName',
            width: 80,
            render: (text, record) => {
                return <div className='tj-td' title={text || '--'}>{text || '--'}</div>
            }
        },
        {
            title: '时间',
            dataIndex: 'courseTime',
            render: (text, record) => {
                return <div className='tj-td' title={text || '--'}>{text || '--'}</div>
            }
        },
        {
            title: '异常情况',
            render: (text, record) => {
                let { attType } = props.headParams;
                let { checkName, stuOnAttRate, frontSeatRate, sleepRate } = record;
                if (attType == '1') {
                    return <div className='tj-td'
                        title={'教师考勤：' + getAttCodeName(checkName)}
                    >
                        教师考勤：<span className={checkName == '1' ? 'tj-td-status' : 'tj-td-status isError'}>{getAttCodeName(checkName)}</span>
                    </div>
                } else {
                    return <div className='tj-td'>
                        {
                            stuOnAttRate ? <div title={'到课率：' + (stuOnAttRate || '--') + '%'}>到课率：<span className='tj-stu-status'>{stuOnAttRate || '--'}%</span></div> : null
                        }
                        {
                            frontSeatRate ? <div title={'前排就坐率：' + (frontSeatRate || '--') + '%'}>前排就坐率：<span className='tj-stu-status'>{frontSeatRate || '--'}%</span></div> : null
                        }
                        {
                            sleepRate ? <div title={'低头率：' + (sleepRate || '--') + '%'}>低头率：<span className='tj-stu-status'>{sleepRate || '--'}%</span></div> : null
                        }

                    </div>
                }

            }
        },
        {
            title: '开课单位回复状态',
            dataIndex: 'replyStatus',
            width:140,
            render: (text, record) => {
                return <div className='tj-td'>
                    <span className={text == '0' ? 'tj-colReply-status no' : text == '1' ? 'tj-colReply-status' : 'tj-colReply-status ex'}>{getCodeValue(text, 2)}</span>
                </div>
            }
        },
        {
            title: '最终结果',
            render: (text, record) => {
                let { attType } = props.headParams;
                let { checkNameEnd, stuOnAttRateEnd, frontSeatRateEnd, sleepRateEnd } = record;
                if (attType == '1') {
                    return record.replyStatus=='0'||checkNameEnd==null?null:<div className='tj-td'
                        title={'教师考勤：' + getAttCodeName(checkNameEnd)}
                    >
                        教师考勤：<span className={text == '1' ? 'tj-td-status' : 'tj-td-status isError'}>{getAttCodeName(checkNameEnd)}</span>
                    </div>


                } else {
                    return record.replyStatus == '0' ||stuOnAttRateEnd==null&&frontSeatRateEnd==null&&sleepRateEnd==null? null : <div className='tj-td'>
                        {
                            stuOnAttRateEnd ? <div title={'到课率：' + (stuOnAttRateEnd || '--') + '%'}>到课率：<span className='tj-stu-status'>{stuOnAttRateEnd || '--'}%</span></div> : null
                        }
                        {
                            frontSeatRateEnd ? <div title={'前排就坐率：' + (frontSeatRateEnd || '--') + '%'}>前排就坐率：<span className='tj-stu-status'>{frontSeatRateEnd || '--'}%</span></div> : null
                        }
                        {
                            sleepRateEnd ? <div title={'低头率：' + (sleepRateEnd || '--') + '%'}>低头率：<span className='tj-stu-status'>{sleepRateEnd || '--'}%</span></div> : null
                        }

                    </div>


                }
            }
        },
        {
            title: '最终结论',
            dataIndex: 'finishResult',
            render: (text, record) => {
                let { attType } = props.headParams;
                let { checkNameEnd, stuOnAttRateEnd, frontSeatRateEnd, sleepRateEnd } = record;
                if(attType=='1'){
                    return record.replyStatus == '0'||checkNameEnd==null ? null : <div className='tj-td'><span className={text == '0' ? 'tj-td-result error' :text=='1'? 'tj-td-result':''}>{text == '1' ? '正常' :text == '0'? '异常':'--'}</span></div>
                }else{
                    return record.replyStatus == '0'||stuOnAttRateEnd==null&&frontSeatRateEnd==null&&sleepRateEnd==null ? null : <div className='tj-td'><span className={text == '0' ? 'tj-td-result error' :text=='1'? 'tj-td-result':''}>{text == '1' ? '正常' :text == '0'? '异常':'--'}</span></div>
                }
               
            }
        },
        {
            title: '操作',
            width: 200,
            render: (text, record) => {
                return <div className='tj-td' style={{ cursor: 'pointer' }}>
                    {
                        record.replyStatus == '1' ? <span onClick={() => props.handleReply(record.claRoomId)} style={{ marginRight: 12 }}> <SVG type='de_show' />查看回复</span> : null
                    }

                    <span onClick={() => props.goVideo(record.claRoomId)}> <SVG type='cksp' />查看视频</span>
                </div>
            }
        },
    ];

    const columnsJD = [
        {
            title: '开课单位',
            dataIndex: 'collegeName',
            render: (text, record) => {
                return <div className='tj-td' title={text || '--'}>{text || '--'}</div>
            }
        },
        {
            title: '异常课程数',
            dataIndex: 'errorNum',
            render: (text, record) => {
                return <div className='tj-td'>{text || '--'}</div>
            }
        },
        {
            title: '已回复课程数',
            dataIndex: 'replyNum',
            render: (text, record) => {
                return <div className='tj-td' >{text || '--'}</div>
            }
        },
        {
            title: '回复进度',
            dataIndex: 'replyProp',
            render: (text, record) => {
                return <div className='tj-td'>
                    <Line
                        color={'#14cc8f'}
                        data={[text ? text : 0]}
                        right={'70'}
                        showValue={true}
                    />
                </div>
            }
        },
        {
            title: '过期未回复课程数',
            dataIndex: 'expReplyNum',
            render: (text, record) => {
                return <div className='tj-td' >{text || '--'}</div>
            }
        },
        {
            title: '申请为正常课程数',
            dataIndex: 'applyNorNum',
            render: (text, record) => {
                return <div className='tj-td' >{text || '--'}</div>
            }
        },
        {
            title: '实际问题课程数',
            dataIndex: 'realNum',
            render: (text, record) => {
                return <div className='tj-td' >{text || '--'}</div>
            }
        },
        {
            title: '操作',
            dataIndex: '',
            render: (text, record) => {
                return <div className='tj-td' > <span style={{ cursor: 'pointer' }} onClick={() => props.goDetail(record.collegeId)}><SVG type='de_show' /> 查看详情</span></div>
            }
        },
    ]

    let dataColumns = []
    if (props.replyType === '2') {
        dataColumns = columnsJD
    } else {
        dataColumns = columns
    }
    let { roleType } = G.ISCED_curRoleInfo;
    console.log(props)
    return (
        <div className='tj-allotTable'>
            <div className='tj-table-top'>
                <div className='tj-followNew-topBor'>
                    <div className='tj-followNew-name'>{props.title || ''}</div>
                    {
                        (roleType==="1" || roleType === '2') ?
                            <div className='tj-followNew-type'>
                                <div className={props.replyType == '1' ? 'reply-type-item active' : 'reply-type-item'} onClick={() => props.changeReplyType('1')}><span>按课堂</span></div>
                                <div className={props.replyType == '2' ? 'reply-type-item active' : 'reply-type-item'} onClick={() => props.changeReplyType('2')}><span>按开课单位</span></div>
                            </div>
                            : null

                    }

                    {
                        props.replyType === '2' ? null :
                            <div className='tj-followNew-check'>
                                {
                                    props.checkList.map((Item, key) => {
                                        return <div className={props.replyStatus === Item.value ? 'tj-followNew-select active' : 'tj-followNew-select'} key={key}

                                            onClick={() => { props.changeCheckKey(Item.value) }}
                                        >
                                            {Item.name}
                                        </div>
                                    })
                                }
                            </div>

                    }

                </div>

            </div>
            <div className='tj-followNew-bottom'>
                <Table
                    dataSource={props.replyList || []}
                    columns={dataColumns}
                    rowKey={record => props.replyType === '2' ? record.collegeId : record.claRoomId}
                    pagination={false}
                    locale={{ emptyText: <CollageNoData /> }}
                    loading={props.loading}
                    className={props.headParams.attType == '1' ? 'tj-followNew-table tea' : props.replyType === '2' ? 'tj-followNew-table stu-col' : 'tj-followNew-table stu'}
                // onRow={(record) => {
                //     return {
                //         onClick: () => {
                //             if (props.replyType === '2') {
                //                 props.clickRow(record.collegeId, record.collegeName)
                //             } else {
                //                 props.clickRow(record.claRoomId)

                //             }
                //         }
                //     }
                // }}

                />

                <Fy
                    pageSize={props.pageSize}
                    pageIndex={props.pageNum}
                    total={props.total}
                    jumpPage={props.jumpPage}
                />
                {
                    props.visible ?
                        <ReplyDetail
                            visible={props.visible}
                            title='回复'
                            onCancel={props.onCancel}
                            id={props.id}
                            type={'1'}
                            rpType={props.headParams.attType}
                        />
                        : null
                }


            </div>
        </div>
    )
}
