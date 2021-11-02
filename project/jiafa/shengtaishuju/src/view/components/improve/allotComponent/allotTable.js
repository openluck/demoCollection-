/*
 * @Author: lilu 
 * @Date: 2020-07-23 09:33:48 
 * @Last Modified by: tj
 * @Last Modified time: 2021-03-26 17:49:23
 * 异常回复/异常下发共用组件
 */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './../../../../style/ll-allotTable.scss';
import CollageNoData from './../../image/college_image/collegeNoData';
import Fy from './../../../public/fy';
import { Table, Button, Modal, Input } from 'antd';
import _, { split } from 'lodash';
import SVG from './../../../public/svg';
import Line from './../follow/line';
import G from './../../../../config/g';
import HandleModal from '../reply/handleModal';
import { getAttCodeName } from '../../../../config/actionConfig';
const { TextArea } = Input;
const { Search} = Input
export default function AllotTable(props) {
    const [visible, setVisible] = useState(false);
    const [record, setRecord] = useState({});
    const [reason, setReason] = useState('');
    const [handleVis, setHandleVis] = useState(false);
    let roleType = G.ISCED_curRoleInfo.roleType;
  
    //1.21
    const { inputData } = useSelector(state => {
      return {
        inputData: state.kyl_reply_reducer.inputData
      }
    })
    let columns = [
        {
            title: '开课单位',
            dataIndex: 'collegeName',
            align: 'left',
            width: '10%',
            render: (text, record) => {
                return <div className='ll-td' title={text || '--'}>{text || '--'}</div>
            }
        },
        {
            title: '课程名',
            dataIndex: 'courseName',
            width: '12%',
            align: 'left',
            render: (text, record) => {
                return <div className='ll-td' title={text || '--'}>{text || '--'}</div>
            }
        },
        {
            title: '教师名',
            dataIndex: 'teacherName',
            align: 'left',
            width: '8%',
            render: (text, record) => {
                // let str = '';
                // (text || []).map((item, idx) => {
                //     str += item + idx === text.length - 1 ? '' : '，'
                // })
                return <div className='ll-td' title={text || '--'}>{text || '--'}</div>
            }
        },
        {
            title: '时间',
            dataIndex: 'courseTime',
            align: 'left',
            width: '12%',
            render: (text, record) => {
                return <div className='ll-td' title={text || '--'}>{text || '--'}</div>
            }
        },
        {
            title: '异常情况',
            dataIndex: 'checkName',
            align: 'left',
            // width: 220,
            render: (text, record) => {
                return props.inputData.attType === '1' ?
                    <div className={record.checkNameType == '1' ? 'll-td isError' : 'll-td'}>
                        教师考勤：<span className='kyl-err-box'>
                            {getAttCodeName(text)}
                        </span>
                    </div> :
                    <div className={record.checkNameType == '1' ? 'll-td isError' : 'll-td'}>
                        <div>
                            {record.stuOnAttRate ?
                                <span>学生到课率：<span className='kyl-stuErr-box'>{record.stuOnAttRate}%</span></span> : null}
                        </div>
                        <div>
                            {record.frontSeatRate ?
                                <span>前排就坐率：<span className='kyl-stuErr-box'>{record.frontSeatRate}%</span></span> : null}
                        </div>
                        <div>
                            {record.sleepRate ?
                                <span>低头率：<span className='kyl-stuErr-box'>{record.sleepRate}%</span></span> : null}
                        </div>
                    </div>
            }
        },
        props.type === '1' ?
            {
                title: '',
                dataIndex: 'collReplyStatus',
                width: 0
            } :
            {
                // title: '开课单位回复状态',
                title: () => {
                    return <div title='开课单位回复状态'>开课单位回复状态</div>
                },
                dataIndex: 'collReplyStatus',
                align: 'left',
                // width: 120,
                render: (text, record) => {
                    let cont = text === '0' ? '未回复' : text === '1' ? '已回复' : text === '2' ? '过期未回复' : '--';
                    let color = text === '0' ? '#ff9933' : text === '1' ? '#666666' : text === '2' ? '#ff4d4f' : '#666666'
                    return <div title={cont} style={{ color }}>
                        {cont}
                    </div>
                }
            },
        props.type === '1' ?
            {
                title: '',
                dataIndex: 'hf',
                width: 0
            } :
            {
                title: '开课单位回复',
                dataIndex: 'hf',
                align: 'left',
                // width: 90,
                render: (text, record) => {
                    let html = undefined;
                    if (record.collReplyStatus === '0') {
                        html = <span onClick={() => {
                            setRecord(record);
                            setHandleVis(true);
                        }}><SVG type='quchuli' color='#3498db'></SVG>&nbsp;&nbsp;回复</span>
                        if (roleType === "1" || roleType === '2') {
                            html = '';
                        }
                    } else if (record.collReplyStatus === '1') {
                        html = <span onClick={() => {
                            setRecord(record);
                            setHandleVis(true);
                        }}><SVG type='de_show'></SVG>&nbsp;&nbsp;查看</span>
                    } else {
                        html = '';
                    }
                    return <div>
                        {html}
                    </div>
                }
            },
        (roleType === "1" || roleType === '2') && props.type === '2' ?
            {
                title: '校级回复',
                dataIndex: 'schReplyStatus',
                align: 'left',
                width: 180,
                render: (text, record) => {
                    let cont = text === '0' ? '' : text === '1' ? '已同意' : text === '2' ? '不同意' : '--';
                    let color = text === '0' ? '#ff9933' : text === '1' ? '#00b845' : text === '2' ? '#ff4d4f' : '#666666';
                    let background = text === '1' ? '#ebf9f0' : text === '2' ? '#fff1f1' : '';
                    return (
                        text === '0' ?
                            (record.overdue === '1' || record.collReplyStatus === '0') ? null :
                                <div>
                                    <Button className='kyl-at-btn allow' onClick={() => {
                                        operate('1', record)
                                    }}>同意</Button>
                                    <Button className='kyl-at-btn' style={{ marginLeft: 10 }}
                                        onClick={() => {
                                            setRecord(record);
                                            setVisible(true);
                                        }}
                                    >不同意</Button>
                                </div> :
                            <div>
                                <div title={cont} style={{ color, background, padding: '2px 6px', display: 'inline-block' }}>
                                    {cont}
                                </div>
                                {
                                    text === '2' ?
                                        <span onClick={() => {
                                            setReason(record.reason);
                                            setVisible(true);
                                        }} style={{ marginLeft: 10 }}><SVG type='de_show' />  详情</span> : null
                                }
                            </div>
                    )
                }
            } : {
                title: '',
                dataIndex: 'schReplyStatus',
                width: 0
            },
        props.type === '1' ?
            {
                title: '状态',
                dataIndex: 'distributionType',
                align: 'left',
                // width: 65,
                render: (text, record) => {
                    if (props.type === '1') {
                        return <div
                            className='ll-td'
                            style={text === '0' ? { color: '#ff4d4f' } : {}}
                            title={text === '1' ? '已下发' : text === '0' ? '未下发' : ''} >
                            {text === '1' ? '已下发' : text === '0' ? '未下发' : '--'}
                        </div>
                    } else {
                        return <div
                            className='ll-td'
                            style={text === '0' ? { color: '#ff4d4f' } : {}}
                            title={text === '1' ? '已处理' : text === '0' ? '未处理' : ''}>
                            {text === '1' ? '已处理' : text === '0' ? '未处理' : '--'}
                        </div>
                    }
                }
            } : {
                title: '',
                dataIndex: 'distributionType',
                align: 'left',
                width: 0,
            },
        props.type === '1' ?
            {
                title: '异常下发',
                dataIndex: 'errAllot',
                align: 'left',
                // width: 90,
                render: (text, record) => {
                    return record.distributionType === '1' ? null : <div className='ll-aT-xf' onClick={() => {
                        props.type === '1' && props.inputData.distributionType === '1' ? null : props.allotApare('1', record.claRoomId)

                    }} >
                        <SVG type='xiafa' color='#3498db' />
                        &nbsp;&nbsp;下发
                        </div>
                }
            } : {
                title: '',
                dataIndex: 'errAllot',
                align: 'left',
                width: 0,
            },
        {
            title: '操作',
            dataIndex: 'opare',
            align: 'left',
            width: 110,
            render: (text, record) => {
                return <div onClick={() => {
                    props.clickRow(record.claRoomId)
                }}>
                    <SVG type='cksp' color='#3498db' />
                    &nbsp;&nbsp;查看视频
                    </div>
            }
        }
    ];
    //按学院查看课堂列表 v1.21
    let list = [{
      title: '开课单位',
      key: 'collegeName',
    }, {
      title: '异常课程数',
      key: 'errorNum',
    }, {
      title: '下发课程数',
      key: 'pushNum'
    }]
    let collegeColumns = []
    list.map(item => {
      collegeColumns.push({
        title: item.title,
        dataIndex: item.key,
        render: (text, record) => {
          return <div className='ll-td' title={text || '--'}>{text || '--'}</div>
        }
      })
    })
    collegeColumns.push(
      {
        title: '操作',
        align: 'left',
        width: '10%',
        render: (text, record) => {
          return <div><span onClick={() => {
            props.goTocollege(record.collegeId)}} style={{cursor: 'pointer'}}><SVG type='de_show'/> 查看详情</span></div>
        }
      }
    )

    const rowSelection = {
        selectedRowKeys: props.type === '1' ? props.selectedRowKeys : [],
        onChange: (selectedRowKeys) => {
            props.type === '1' ? props.checkData(selectedRowKeys) : null

        },
        getCheckboxProps: record => ({
            disabled: props.type === '1' ? record.distributionType === '1' : null, // Column configuration not to be checked
        }),

    };

    const operate = (schReplyResult, r) => {
        if (schReplyResult == '1' || schReplyResult == '2') {
            props.kyl_submitReason({
                claRoomId: r.claRoomId || record.claRoomId,
                reason: reason,
                schReplyResult,
                accountName: G.ISCED_roleData.userName,
                accountId: G.ISCED_roleData.accountId,
                attType: props.inputData.attType
            })
        }
        setVisible(false);
        setRecord({});
        setReason('')
    }

    useEffect(() => {
      
    }, [])

    function changeSearch(event) {
      let searchParam = event.target.value
      console.log('changeSearch', inputData);
      props.changeInput({
        ...inputData,
        searchParam
      })
      
    }

    return (
        <div className='ll-allotTable'>
            <div className='ll-aT-top'>
                <div className='kyl-aT-top'>
                  <div className='kyl-aT-title'>
                    {props.type === '1' ? '预警课堂列表' :
                    G.ISCED_curRoleInfo.roleType === '1' || G.ISCED_curRoleInfo.roleType === '2' ? '校级回复列表' : '开课单位回复列表'}
                  </div>
                  {
                    ( G.ISCED_curRoleInfo.roleType==="1" || G.ISCED_curRoleInfo.roleType === '2') ?
                    props.type === '1' ?
                    props.isDetails ?
                    null
                    : <div className='kyl-aT-topBor'>
                        <div className={props.allotType === '1' ? 'allot-type-item active' : 'allot-type-item'} onClick={() => props.changeAllotType('1')}><span>按课堂</span></div>
                        <div className={props.allotType === '2' ? 'allot-type-item active' : 'allot-type-item'} onClick={() => props.changeAllotType('2')}><span>按开课单位</span></div>
                      </div>
                    : <Search
                    className='lrf-aT-input'
                    placeholder="教师姓名"
                    value={inputData.searchParam}
                    onChange={changeSearch}
                    onSearch={(value, event) =>props.searchTeacher(value, event)}
                    />
                    : null
                  }
                </div>

                {
                  props.allotType === '2' && props.type === '1'?
                  null
                  :
                  <div className='ll-aT-topBor'>
                    <div className='ll-at-check'>
                        {
                            props.checkList.map((Item, key) => {
                                return <div className='ll-at-select' style={{
                                    // width: props.type === '1' ? 66 : 90,
                                    textAlign: 'left'
                                }} key={key}
                                    onClick={() => { props.changeCheckKey(Item.value) }}
                                >
                                    <span style={
                                        (props.type === '1' ? props.inputData.distributionType : props.inputData.replyType) === Item.value ? {
                                            color: '#3498db',
                                            borderBottom: '1px solid #3498db',
                                            fontSize: 16, fontWeight: 'bold', display: 'inline-block', lineHeight: '30px'
                                        } : {}}>
                                        {Item.name}
                                    </span>
                                </div>
                            })
                        }
                    </div>
                  </div>
                }
                {
                    props.allotType === '1' ?
                    props.type === '1' ?
                        <div className='ll-aT-xf'
                            onClick={() => { props.type === '1' && props.inputData.distributionType === '1' ? null : props.allotApare('2') }}
                            style={props.inputData.distributionType === '1' ? { cursor: 'not-allowed' } : {}}
                        >
                            <SVG type='xiafa' />
                            下发
                        </div>
                        : null
                    : null   
                }
              
            </div>
            <div className='ll-aT-bottom kyl-errReply-table'>
                <Table
                    dataSource={props.allotList || []}
                    columns={props.type === '1' ? props.allotType === "1" ? columns : collegeColumns : columns}
                    rowKey={record => record.claRoomId || record.collegeId}
                    pagination={false}
                    locale={{ emptyText: <CollageNoData /> }}
                    rowSelection={props.type === '1' ? props.allotType === '2' ? null : rowSelection : null}
                    loading={props.allLoading}
                    className={'ll-aT-table'}
                />
                <Fy
                    pageSize={props.inputData.pageSize}
                    pageIndex={props.inputData.pageNum}
                    total={props.total}
                    jumpPage={props.jumpPage}
                />
                {props.type === '2' ?
                    <span style={{ color: '#b7babf' }}> {(roleType === "1" || roleType === '2') ?
                        '温馨提示：请在异常情况发生后7天内进行校级回复，若未回复，则默认为同意开课单位申请'
                        : '温馨提示：请在异常情况发生后7天内进行回复，若未回复，则默认为此课异常'}</span> : null}
            </div>
            <Modal
                title='不同意原因'
                visible={visible}
                width={613}
                className='kyl-reaModal'
                onCancel={() => { operate('3') }}
                footer={[
                    <Button key='qd' onClick={() => {
                        operate(JSON.stringify(record) !== '{}' ? '2' : '3', record)
                    }}><SVG type='queding'></SVG>&nbsp;&nbsp; 确定</Button>,
                    <Button key='qx' onClick={() => {
                        operate('3')
                    }}><SVG type='quxiao'></SVG>&nbsp;&nbsp; 取消</Button>,
                ]}
            >
                {
                    JSON.stringify(record) === '{}' ?
                        <div className='kyl-modal-cont'>
                            {reason}
                        </div> :
                        <TextArea placeholder='请输入（非强制，可写可不写；输入框可没有内容）'
                            rows={6} value={reason}
                            maxLength={300}
                            onChange={(e) => { setReason(e.target.value) }} />
                }
            </Modal>
            {
                handleVis ?
                    <HandleModal
                        visible={handleVis}
                        title='回复'
                        onCancel={() => { setHandleVis(false); setRecord({}); }}
                        onOk={() => { props.updateList(); setRecord({}); }}
                        id={record.claRoomId}
                        type={record.collReplyStatus}
                        rpType={props.inputData.attType}
                        onlyShow={
                            (roleType === "1" || roleType === '2') ? true : (
                                record.collReplyStatus === '2' ? true // 开课单位过期未回复
                                    : record.overdue === '1' ? true // 超过7天只读
                                        : (record.sclReplyStatus === '1' && record.collReplyStatus) ? true // 开课单位学校已回复
                                            : false)}
                    /> : null
            }
        </div>
    )
}
