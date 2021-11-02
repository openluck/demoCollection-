/*
 * @Author: lilu 
 * @Date: 2020-07-23 09:33:48 
 * @Last Modified by: tj
 * @Last Modified time: 2021-04-02 14:27:41
 */
import React, { Component } from 'react';
import TopShow from './../allotComponent/topShow';
// import './../../../../style/ll_allot.scss';
import './../../../../style/tj-follow.scss';
import { connect } from "react-redux";
import SVG from './../../../public/svg';
import { ll_fDInfo, ll_getTrackHandleList, ll_downHandleDetail } from './../../../../redux/ll-followDetails.reducer'
import { getDetailData, getStaticData } from './../../../../redux/tj-follow.reducer'
import CollageNoData from './../../image/college_image/collegeNoData';
import { Table, Tooltip } from 'antd';
import Fy from './../../../public/fy';
import { clearImpTime } from './../../../../redux/tj-impHeader.reducer'
import ReplyDetail from './replyDetail';
import FollowTable from './followTable'
import BackPub from './../../../public/backPub';
import { ws_saveGlobalData } from './../../../../redux/ws-global.reducer';
import G from './../../../../config/g';
import moment from "moment";
import { getAttCodeName } from './../../../../config/actionConfig'
@connect(state => state, { getDetailData, getStaticData, ll_fDInfo, ll_getTrackHandleList, clearImpTime, ws_saveGlobalData, ll_downHandleDetail })
class FollowDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checkList: [{ name: '全部', value: '' }, { name: '开课单位未回复', value: '0' }, { name: '开课单位已回复', value: '1' },{ value: '2', name: '开课单位过期未回复' }],
            checkKey: '',
            visible: false,
            id: '',
            type: '',
            pageNum: 1,
            pageSize: 20,
            // total: 3,
            content: []

        }
        // this.clickBack = this.clickBack.bind(this);
        this.jumpPage = this.jumpPage.bind(this);
    }

    componentDidMount() {
        let { content } = this.state;
        let conditions = JSON.parse(sessionStorage.getItem('conditions'));
        console.log(conditions)
        content = [
            { name: '异常情况跟踪', url: '/home/imp/follow' },
            { name: '异常情况跟踪详情', url: this.props.match.url },
        ]
        this.setState({
            content
        })
        this.getData()
    }

    componentWillUnmount() {

    }
    /**
     * 获得详情数据
     */
    getDetailData() {
        let { roleType } = G.ISCED_curRoleInfo;
        let { attType, selTime, semesterId, timeType, } = G.ISCED_headerParams
        let { checkKey, pageNum, pageSize } = this.state;
        let param = {
            attType,
            selTime,
            semesterId,
            timeType,
            // dataType: (roleType==="1" || roleType === '2') ? '2' : '1', //1院级 2校级
            dataType: '1', //1院级 2校级
            replyStatus: checkKey,
            orgId: this.props.match.params.id,
            pageNum,
            pageSize
        }
        this.props.getDetailData(param)
    }

    /**
     * 获得详情全部数据
     */
    getData() {
        this.getDetailData()
        this.getStaticData()
    }

    /**
     * 分页
     * @param {*} pageNum 
     */
    jumpPage(pageNum) {
        this.setState({
            pageNum
        },()=>{
            this.getDetailData()
        })
        // let { inputData } = this.props.ll_followDetails_reducer;
        // let { attType, selTime, semesterId, timeType} = G.ISCED_headerParams
        // inputData.pageNum = pageNum;
        // inputData.collegeId = this.props.match.params.id
        // inputData.selTime = selTime
        // inputData.semesterId = semesterId
        // inputData.timeType = timeType
        // this.props.ll_getTrackHandleList(inputData)
        this.node.scrollIntoView();
    }

    /** 1.21未发现使用
     * 返回
     */
    // clickBack() {
    //     sessionStorage.setItem('isHistoryTime', true)
    //     this.props.history.goBack()
    // }

    /** 1.21未发现使用
     * 下钻视频
     * @param {*} record 
     */
    // onRow(record) {
    //     let id = this.props.match.params.id;

    //     let data = JSON.parse(JSON.stringify(content))
    //     data.push({
    //         name: '课堂明细', url: ""
    //     })
    //     // sessionStorage.setItem('content',JSON.stringify(data))
    //     this.props.ws_saveGlobalData(data, 'ISCED_content')
    //     this.props.history.push(`/home/imp/follow/${id}/${record.claRoomId}`)
    // }

    /**
     * 选择回复状态
     * @param {*} checkKey 
     */
    changeCheckKey(checkKey) {
        this.setState({
            checkKey,
            pageNum:1
        }, () => {
            this.getData()
        })
    }

    /**
     * 获得统计数据
     */
    getStaticData() {
        let { roleType } = G.ISCED_curRoleInfo;
        let { attType, selTime, semesterId, timeType } = G.ISCED_headerParams
        let {params} = this.props.match
        let isCollage=false
        if(params&&params.id){
            isCollage=true
        }
        let param = {
            attType,
            selTime,
            semesterId,
            timeType,
            dataType: isCollage?'1':(roleType === "1" || roleType === '2') ? '2' : '1', //1院级 2校级
            orgId: this.props.match.params.id,
        }
        this.props.getStaticData(param)
    }

    getFomatter(value) {
        if (value) {
            let data = Number(value)
            let str;
            if (data > 10000) {
                str = (data / 10000) + '万'
            } else {
                str = value
            }
            return str
        } else {
            return value
        }

    }

    //跳转到播放页 
    goVideo(record) {
        let id = this.props.match.params.id;
        let { content } = this.state;
        let data = JSON.parse(JSON.stringify(content))
        data.push({
            name: '课堂明细', url: ""
        })
        // sessionStorage.setItem('content',JSON.stringify(data))
        this.props.ws_saveGlobalData(data, 'ISCED_content')
        this.props.history.push(`/home/imp/follow/${id}/${record.claRoomId}`)
    }

    render() {
        let { visible, id, type, content, pageNum, pageSize } = this.state;
        let { total, detailList, errorStateNum, replyNum, expireReplyNum, applyNorNum, realCourseNum } = this.props.TJ_follow_reducer;
        let { selTime, timeType } = G.ISCED_headerParams
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
        let dataColumns = [
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
                    let { attType } = G.ISCED_headerParams;
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
                width:140,
                dataIndex: 'replyStatus',
                render: (text, record) => {
                    return <div className='tj-td'>
                        <span className={text == '0' ? 'tj-colReply-status no' : text == '1' ? 'tj-colReply-status' : 'tj-colReply-status ex'}>{getCodeValue(text, 2)}</span>
                    </div>
                }
            },
            {
                title: '最终结果',
                render: (text, record) => {
                    let { attType } = G.ISCED_headerParams;
                    let { checkNameEnd, stuOnAttRateEnd, frontSeatRateEnd, sleepRateEnd } = record;
                    if (attType == '1') {
                        return record.replyStatus == '0' || checkNameEnd == null ? null : <div className='tj-td'
                            title={'教师考勤：' + getAttCodeName(checkNameEnd)}
                        >
                            教师考勤：<span className={text == '1' ? 'tj-td-status' : 'tj-td-status isError'}>{getAttCodeName(checkNameEnd)}</span>
                        </div>
                    } else {
                        return record.replyStatus == '0' || stuOnAttRateEnd == null && frontSeatRateEnd == null && sleepRateEnd == null ? null : <div className='tj-td'>
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
                    let { attType } = G.ISCED_headerParams;
                    let { checkNameEnd, stuOnAttRateEnd, frontSeatRateEnd, sleepRateEnd } = record;
                    if (attType == '1') {
                        return record.replyStatus == '0' || checkNameEnd == null ? null : <div className='tj-td'><span className={text == '0' ? 'tj-td-result error' : text == '1' ? 'tj-td-result' : ''}>{text == '1' ? '正常' : text == '0' ? '异常' : '--'}</span></div>
                    } else {
                        return record.replyStatus == '0' || stuOnAttRateEnd == null && frontSeatRateEnd == null && sleepRateEnd == null ? null : <div className='tj-td'><span className={text == '0' ? 'tj-td-result error' : text == '1' ? 'tj-td-result' : ''}>{text == '1' ? '正常' : text == '0' ? '异常' : '--'}</span></div>
                    }
                }
            },
            {
                title: '操作',
                width: 200,
                render: (text, record) => {
                    return <div className='tj-td' style={{ cursor: 'pointer' }}>
                        {
                            record.replyStatus == '1' ? <span onClick={() => this.setState({ visible: true, id: record.claRoomId })} style={{ marginRight: 12 }}> <SVG type='de_show' />查看回复</span> : null
                        }
                        <span onClick={() => this.goVideo(record)}> <SVG type='cksp' />查看视频</span>
                    </div>
                }
            },
        ];
        return (
            <div className='tj-followD' >
                <div ref={node => this.node = node}>
                    <BackPub content={content} />
                    <div className='tj-timeShow'>统计时间：
                    <span>{timeType == '2' ? '第' + selTime + '周' : timeType == '4' ? '本学期' : selTime.replace(/\-/g, '\.')}</span>
                    </div>
                </div>
                <div className='tj-followNew'>
                    <div className='tj-followNew-top detail'>
                        <div className='tj-followNew-block'>
                            <div className='tj-followNew-cnt'>
                                <div className='tj-followNew-col-item'>
                                    <SVG type='yckc' />
                                    <div className='tj-followNew-total'>
                                        <div>{errorStateNum || '--'}</div>
                                        <div>异常情况</div>
                                    </div>
                                </div>
                                <div className='tj-followNew-col-item'>
                                    <SVG type='zongshu' />
                                    <div className='tj-followNew-total'>
                                        <div>{replyNum || '--'}</div>
                                        <div>已回复</div>
                                    </div>
                                </div>
                                <div className='tj-followNew-col-item'>
                                    <SVG type='whf' />
                                    <div className='tj-followNew-total'>
                                        <div>{expireReplyNum || '--'}</div>
                                        <div>过期未回复</div>
                                    </div>
                                </div>
                                <div className='tj-followNew-col-item'>
                                    <SVG type='sqwzc' />
                                    <div className='tj-followNew-total'>
                                        <div>{applyNorNum || '--'}</div>
                                        <div>申请为正常</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='tj-followNew-block'>
                            <div className='info'>
                                <div className='info-cnt'>
                                    <div className='info-realCourse'>
                                        <span>{this.getFomatter(realCourseNum) || '--'}</span>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'center', marginTop: 18 }}>实际问题课程数</div>
                            </div>
                        </div>
                    </div>

                    <div className='tj-follow-bottom'>
                        <div className='tj-allotTable'>
                            <div className='tj-table-top'>
                                <div className='tj-followNew-topBor'>
                                    <div className='tj-followNew-name'>异常情况列表</div>


                                    <div className='tj-followNew-check'>
                                        {
                                            this.state.checkList.map((Item, key) => {
                                                return <div key={key}
                                                    className={
                                                        this.state.checkKey === Item.value ? 'tj-followNew-select active' : 'tj-followNew-select'}
                                                    onClick={() => { this.changeCheckKey(Item.value) }}
                                                >
                                                    {Item.name}
                                                </div>
                                            })
                                        }
                                    </div>



                                </div>

                            </div>
                            <div className='tj-followNew-bottom'>
                                <Table
                                    dataSource={detailList}
                                    columns={dataColumns}
                                    rowKey={record => record.claRoomId}
                                    pagination={false}
                                    locale={{ emptyText: <CollageNoData /> }}
                                    loading={false}
                                    className={G.ISCED_headerParams.attType == '1' ? 'tj-followNew-table tea' : 'tj-followNew-table stu'}
                                />

                                <Fy
                                    pageSize={pageSize}
                                    pageIndex={pageNum}
                                    total={total}
                                    jumpPage={this.jumpPage}
                                />


                            </div>
                        </div>

                    </div>

                </div>

                {
                    visible ?
                        <ReplyDetail
                            visible={visible}
                            title='回复'
                            onCancel={() => { this.setState({ visible: false }) }}
                            id={id}
                            type={'1'}
                            rpType={G.ISCED_headerParams.attType}
                        />
                        : null
                }
            </div>
        )
    }
}
export default FollowDetails;