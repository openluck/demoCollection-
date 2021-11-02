/*
 * @Author: lilu 
 * @Date: 2020-02-09 16:22:25 
 * @Last Modified by: tj
 * @Last Modified time: 2021-03-25 18:18:08
 * 明细查询-教学秩序-教师考勤明细组件
 */

import React, { Component } from 'react';
import { Table, } from 'antd';
import './../../../style/teaDetail.scss';
import moment from 'moment';
import Fy from '../../public/fy';
import { connect } from "react-redux";
import Header from './header';
import { ll_getTeaAttendance, ll_downTea, ll_teaStatus } from './../../../redux/ll-teaDetail.reducer';
import SVG from './../../public/svg';
import ErrModal from './errModal'
import { withRouter } from 'react-router-dom';
import G from './../../../config/g'
import CollageNoData from './../image/college_image/collegeNoData'
import { ws_saveGlobalData } from './../../../redux/ws-global.reducer';


@connect(state => state, { ll_getTeaAttendance, ll_downTea, ll_teaStatus, ws_saveGlobalData })
class TeaDetail extends Component {
    constructor(props) {
        super(props);
        // const { sectionId } = this.props.match.params
        // const { roleType, belongOrgId } = G.ISCED_curRoleInfo;
        this.state = {
            semester: G.ISCED_semesterList || [],
            content: [
                { name: '教师考勤', url: this.props.location.pathname },
                { name: '课堂明细', url: '' }
            ],
            visible: false
        };
        this.download = this.download.bind(this);
        this.search = this.search.bind(this)
    }

    componentDidMount() {
        let { inputData, teaStatus } = this.props.ll_teaDetail_reducer;
        
        if (!teaStatus) {
          //status  当播放页返回上一级时，置为true，用于保存搜索的条件 
            const { roleType, belongOrgId } = G.ISCED_curRoleInfo;
            const { sectionId, start, end, colId, teaId, courId, type, semId, couTypeId } = this.props.match.params
            inputData.semesterId = semId !== 'null' && semId ? semId : JSON.stringify(G.ISCED_cutSemesterData) !== '{}' ? G.ISCED_cutSemesterData.semesterId : '',//学期id
                inputData.courseId = courId && courId !== 'null' ? courId : "",//课程id
                inputData.teacherId = teaId && teaId !== 'null' ? teaId : "",//教师id
                inputData.courseNum = '',
                inputData.collegeId = colId && colId !== 'null' ? colId : (roleType === "1" || roleType === '2') ? '' : belongOrgId,//开课院系id
                inputData.status = type && type === '0' ? type : '',//考勤状态（0 异常 1正常 ' '全部）
                inputData.checkType = type && type !== '0' ? type : '',//状态类型
                inputData.couTypeId = couTypeId !== 'null' && couTypeId ? couTypeId :G.ISCED_courseTypeList && G.ISCED_courseTypeList.length ? G.ISCED_courseTypeList[0].couTypeId : '',//课程类别id
                inputData.sectionId = sectionId && sectionId !== 'null' ? sectionId : '',//节次id
                inputData.startTime = start !== 'null' && start ? Number(start) > new Date().getTime() ? moment(new Date()).format('YYYY-MM-DD') : moment(Number(start)).format('YYYY-MM-DD') : moment(new Date()).format('YYYY-MM-DD'),
                inputData.endTime = end !== 'null' && end ? Number(end) > new Date().getTime() ? moment(new Date()).format('YYYY-MM-DD') : moment(Number(end)).format('YYYY-MM-DD') : moment(new Date()).format('YYYY-MM-DD'),
                inputData.pageNum = 1,
                inputData.pageSize = 20
                //1.21 不在当前学期日期范围内，将默认开始时间定为学期开始时间
                if (G.ISCED_cutSemesterData.isCutSemester === '0') {
                  inputData.startTime = G.ISCED_cutSemesterData.startTime
                }
        } else {
            if (G.ISCED_detailCondition && G.ISCED_detailCondition.semesterId) {
                let { courseNum, semesterId, courseId, teacherId, collegeId, status, checkType, couTypeId, sectionId, startTime, endTime, pageNum, pageSize } = G.ISCED_detailCondition
                inputData.semesterId = semesterId;//学期id
                inputData.courseId = courseId;//课程id
                inputData.teacherId = teacherId;//教师id
                inputData.collegeId = collegeId;//开课院系id
                inputData.status = status;//考勤状态（0 异常 1正常 ' '全部）
                inputData.checkType = checkType;//状态类型
                inputData.couTypeId = couTypeId;//课程类别id
                inputData.sectionId = sectionId;//节次id
                inputData.startTime = startTime;
                inputData.courseNum = courseNum;
                inputData.endTime = endTime;
                inputData.pageNum = pageNum;
                inputData.pageSize = pageSize;
                console.log(inputData)
            }
        };
        //1.21当前角色身份为教师时 roleType：5 教师
        if (G.ISCED_curRoleInfo.roleType === '5') { 
          inputData.teacherId = G.ISCED_roleData.accountId
        }
        this.props.ll_teaStatus(false)
        this.props.ll_getTeaAttendance(inputData)
    }

    componentWillReceiveProps(nextProps) {
        // console.log(nextProps)
    }

    /**
     *下钻播放页
     * @param {string} id 
     */
    goPlay(id) {
        let { content } = this.state;
        let { inputData } = this.props.ll_teaDetail_reducer;
        let $inputData = JSON.parse(JSON.stringify(inputData))
        this.props.ws_saveGlobalData($inputData, 'ISCED_detailCondition')
        this.props.ws_saveGlobalData(content, 'ISCED_content')
        this.props.history.push(`/home/det/ordtea/play/${id}`)
    }

    /**
     *下载
     *
     * @memberof TeaDetail
     */
    download() {
        let { inputData } = this.props.ll_teaDetail_reducer
        this.props.ll_downTea(inputData)
    }

    /**
     *分页
     *
     * @param {*} pageNum
     * @memberof TeaDetail
     */
    jumpPage(pageNum) {
        let { inputData } = this.props.ll_teaDetail_reducer
        inputData.pageNum = pageNum
        this.node.scrollIntoView()
        this.props.ll_getTeaAttendance(inputData)
    }
    /**
       *搜索
      *
      * @param {*} pageNum
      * @memberof TeaDetail
      */
    search(value) {
        let data = JSON.parse(JSON.stringify(value))
        data.pageNum = 1;
        this.props.ll_getTeaAttendance(data)
    }
    render() {
        let { content } = this.state;
        let { kqData, total, loading, inputData } = this.props.ll_teaDetail_reducer
        let { isClassOrder } = G.ISCED_setInfo
        let columnsCourse = [
            {
                title: '开课单位',
                dataIndex: 'collegeName',
                render: (text, record) => {
                    return <div className='ll-td' title={text || '--'}>{text || '--'}</div>
                }
            },
            {
                title: '地点',
                dataIndex: 'addr',
                render: (text, record) => {
                    return <div className='ll-td' title={text || '--'}>{text || '--'}</div>
                }
            },
            {
                title: '课程类别',
                dataIndex: 'couTypeName',
                render: (text, record) => {
                    return <div className='ll-td' title={text || '--'}>{text || '--'}</div>
                }
            },
            {
                title: '课程名',
                dataIndex: 'courseName',
                render: (text, record) => {
                    return <div className='ll-td' title={text || '--'}>{text || '--'}</div>
                }
            },
            {
                title: '课程号',
                dataIndex: 'courseNum',
                render: (text, record) => {
                    return <div className='ll-td' title={text || '--'}>{text || '--'}</div>
                }
            },
            {
                title: '课序号',
                dataIndex: 'lessonNum',
                render: (text, record) => {
                    return <div className='ll-td' title={text || '--'}>{text || '--'}</div>
                }
            },
            {
                title: '教师名',
                dataIndex: 'teacherName',
                render: (text, record) => {
                    return <div className='ll-td' title={text || '--'}>{text || '--'}</div>
                }
            },
            {
                title: '时间',
                dataIndex: 'time',
                render: (text, record) => {
                    return <div className='ll-td' title={`${record.time || '--'} ${record.sectionName || '--'}`}>
                        {`${record.time || '--'} ${record.sectionName || '--'}`}
                    </div>
                }
            },
            {
                title: '考勤状态',
                dataIndex: 'statusName',
                render: (text, record) => {
                    return <div className='ll-td' title={text || '--'}>{text || '--'}</div>
                }
            },
            {
                title: '考勤类型',
                dataIndex: 'checkName',
                render: (text, record) => {
                    return <div className={record.type == '1' ? 'll-td isError' : 'll-td'} title={text || '--'}>{text || '--'}</div>
                }
            },
            {
                title: '操作',
                render: (text, record) => {
                    return <div className='ll-td'><span style={{ cursor: 'pointer' }} onClick={() => this.goPlay(record.id)} title='查看视频'><SVG type='cksp' /> 查看视频</span></div>
                }
            }
        ]
        let columnsData = [
            {
                title: '开课单位',
                dataIndex: 'collegeName',
                render: (text, record) => {
                    return <div className='ll-td' title={text || '--'}>{text || '--'}</div>
                }
            },
            {
                title: '地点',
                dataIndex: 'addr',
                render: (text, record) => {
                    return <div className='ll-td' title={text || '--'}>{text || '--'}</div>
                }
            },
            {
                title: '课程类别',
                dataIndex: 'couTypeName',
                render: (text, record) => {
                    return <div className='ll-td' title={text || '--'}>{text || '--'}</div>
                }
            },
            {
                title: '课程名',
                dataIndex: 'courseName',
                render: (text, record) => {
                    return <div className='ll-td' title={text || '--'}>{text || '--'}</div>
                }
            },
            {
                title: '教师名',
                dataIndex: 'teacherName',
                render: (text, record) => {
                    return <div className='ll-td' title={text || '--'}>{text || '--'}</div>
                }
            },
            {
                title: '时间',
                dataIndex: 'time',
                render: (text, record) => {
                    return <div className='ll-td' title={`${record.time || '--'} ${record.sectionName || '--'}`}>
                        {`${record.time || '--'} ${record.sectionName || '--'}`}
                    </div>
                }
            },
            {
                title: '考勤状态',
                dataIndex: 'statusName',
                render: (text, record) => {
                    return <div className='ll-td' title={text || '--'}>{text || '--'}</div>
                }
            },
            {
                title: '考勤类型',
                dataIndex: 'checkName',
                render: (text, record) => {
                    return <div className={record.type == '1' ? 'll-td isError' : 'll-td'} title={text || '--'}>{text || '--'}</div>
                }
            },
            {
                title: '操作',
                render: (text, record) => {
                    return <div className='ll-td'><span style={{ cursor: 'pointer' }} onClick={() => this.goPlay(record.id)} title='查看视频'><SVG type='cksp' /> 查看视频</span></div>
                }
            }
        ]

        let columns = []
        if (isClassOrder == '1') {
            columns = columnsCourse
        } else {
            columns = columnsData
        }
        // console.log(columns)
        return (
            <div className='ll-teaDetail' ref={(node) => { this.node = node }}>
                <Header type={1} search={this.search} inputData={JSON.parse(JSON.stringify(inputData))} />
                <div className='ll-teaD-bot'>
                    <div className='ll-down'>
                        <div className='tj-remark'>备注：“--”代表由网络、设备等因素导致的数据异常</div>
                        <div className='ll-down-content' onClick={this.download} style={kqData.length ? {} : { pointerEvents: 'none' }}>
                            <span title='下载'><SVG type='de_download' title='下载' /></span>
                            <div>
                                下载
                            </div>
                        </div>
                    </div>
                    <div className={isClassOrder == '1' ? 'll-kqTable isCourseNum' : 'll-kqTable'}>
                        {/* <PerfectScrollbar> */}
                        <Table
                            dataSource={kqData}
                            columns={columns}
                            rowKey={record => record.id}
                            pagination={false}
                            loading={loading}
                            locale={{ emptyText: <CollageNoData /> }}
                            loading={loading}
                        />

                        <Fy
                            pageSize={inputData.pageSize}
                            pageIndex={inputData.pageNum}
                            total={total}
                            jumpPage={this.jumpPage.bind(this)}
                        />
                        {/* </PerfectScrollbar> */}

                    </div>
                </div>
                {
                    <ErrModal
                        onCancel={() => {
                            this.setState({
                                visible: false
                            })
                        }}
                        visible={this.state.visible}
                    />
                }
            </div >
        );
    }
}

export default withRouter(TeaDetail);