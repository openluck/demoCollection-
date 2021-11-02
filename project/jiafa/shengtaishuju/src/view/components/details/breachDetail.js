/*
 * @Author: lxx 
 * @Date: 2020-01-23 10:17:46 
 * @Last Modified by: tj
 * @Last Modified time: 2021-03-25 15:51:07
 * 明细查询-教学秩序-课堂违纪明细组件
 */
import React, { Component } from 'react';
import Header from './header';
import PerfectScrollbar from "react-perfect-scrollbar";
import './../../../style/ll-header.scss';
import './../../../style/teaDetail.scss';
import { Table } from 'antd';
import Fy from '../../public/fy';
import moment from 'moment';
import { ll_getClassDiscipli, ll_downDiscipli, ll_getInfor, ll_breachstatus } from './../../../redux/ll-breachDetail.reducer';
import { connect } from "react-redux";
import SVG from './../../public/svg'
import ErrModal from './errModal'
import G from './../../../config/g'
import { withRouter } from 'react-router-dom';
import CollageNoData from './../image/college_image/collegeNoData'
import { ws_saveGlobalData } from './../../../redux/ws-global.reducer';

@connect(state => state, { ll_getClassDiscipli, ll_downDiscipli, ll_getInfor, ll_breachstatus, ws_saveGlobalData })
class BreachDetail extends Component {
    constructor(props) {
        super(props);
        // const {sectionId}=this.props.match.params
        // const { roleType,belongOrgId} = G.ISCED_curRoleInfo;

        this.state = {
            semester: G.ISCED_semesterList || [],
            content: [
                { name: '课堂违纪', url: '/home/det/ordbre' },
                { name: '课堂明细', url: '' },
            ],
            // inputData: {
            //     semesterId: JSON.stringify(G.ISCED_cutSemesterData)!=='{}'? G.ISCED_cutSemesterData.semesterId:'',//学期id
            //     courseId: "",//课程id
            //     teacherId: '',//教师id
            //     // collegeId: '',//开课院系id
            //     collegeId: (roleType==="1" || roleType === '2')?'':belongOrgId,//开课院系id

            //     couTypeId: G.ISCED_courseTypeList && G.ISCED_courseTypeList.length?G.ISCED_courseTypeList[0].couTypeId :'',//课程类别id
            //     sectionId: sectionId?sectionId:'',//节次id
            //     startTime: moment(new Date()).format('YYYY-MM-DD'),
            //     endTime: moment(new Date()).format('YYYY-MM-DD'),
            //     inspectorId: '',
            //     eventId: '',
            //     pageNum: 1,
            //     pageSize: 20
            // },
            visible: false,
            eventList: [],
            inspectorList: []
        };
        this.download = this.download.bind(this);
        this.search = this.search.bind(this)
    }
    componentDidMount() {
        let { inputData, breachstatus } = this.props.ll_breachDetail_reducer;

        let { inspectorList, eventList } = this.state;
        if (!breachstatus) {
            const { sectionId, start, end, colId, teaId, courId, type, semId, couTypeId } = this.props.match.params
            console.log(this.props.match.params)
            const { roleType, belongOrgId } = G.ISCED_curRoleInfo;
            inputData.semesterId = semId !== 'null' && semId ? semId : JSON.stringify(G.ISCED_cutSemesterData) !== '{}' ? G.ISCED_cutSemesterData.semesterId : '',//学期id
                inputData.courseId = courId !== 'null' && courId ? courId : "",//课程id
                inputData.teacherId = teaId !== 'null' && teaId ? teaId : '',//教师id
                // collegeId: '',//开课院系id
                inputData.courseNum = '',
                inputData.collegeId = colId !== 'null' && colId ? colId : (roleType === "1" || roleType === '2') ? '' : belongOrgId,//开课院系id
                inputData.couTypeId = couTypeId !== 'null' && couTypeId ? couTypeId :G.ISCED_courseTypeList && G.ISCED_courseTypeList.length ? G.ISCED_courseTypeList[0].couTypeId : '',//课程类别id
                inputData.sectionId = sectionId && sectionId !== 'null' ? sectionId : '',//节次id
                inputData.startTime = start !== 'null' && start ? Number(start) > new Date().getTime() ? moment(new Date()).format('YYYY-MM-DD') : moment(Number(start)).format('YYYY-MM-DD') : moment(new Date()).format('YYYY-MM-DD'),
                inputData.endTime = end !== 'null' && end ? Number(end) > new Date().getTime() ? moment(new Date()).format('YYYY-MM-DD') : moment(Number(end)).format('YYYY-MM-DD') : moment(new Date()).format('YYYY-MM-DD'),
                inputData.inspectorId = '',
                inputData.eventId = type !== 'null' && type ? type : '',
                inputData.pageNum = 1,
                inputData.pageSize = 20
                //1.21 不在当前学期日期范围内，将默认开始时间定为学期开始时间
                if (G.ISCED_cutSemesterData.isCutSemester === '0') {
                  inputData.startTime = G.ISCED_cutSemesterData.startTime
                }
        } else {
            if (G.ISCED_detailCondition && G.ISCED_detailCondition.semesterId) {
                let { courseNum, semesterId, courseId, teacherId, collegeId, inspectorId, eventId, couTypeId, sectionId, startTime, endTime, pageNum, pageSize } = G.ISCED_detailCondition
                inputData.semesterId = semesterId;//学期id
                inputData.courseId = courseId;//课程id
                inputData.teacherId = teacherId;//教师id
                inputData.collegeId = collegeId;//开课院系id
                inputData.inspectorId = inspectorId;
                inputData.eventId = eventId;
                inputData.courseNum = courseNum;
                inputData.couTypeId = couTypeId;//课程类别id
                inputData.sectionId = sectionId;//节次id
                inputData.startTime = startTime;
                inputData.endTime = endTime;
                inputData.pageNum = pageNum;
                inputData.pageSize = pageSize;
                console.log(inputData)
            }
        }
        //1.21当前角色身份为教师时 roleType：5 教师
        if (G.ISCED_curRoleInfo.roleType === '5') { 
          inputData.teacherId = G.ISCED_roleData.accountId
        }
        // this.node.scrollIntoView()
        //获取违纪事件和违纪人员数据接口
        this.props.ll_getInfor().then((res) => {
            if (res && res.length === 2) {
                let { eventAll, inspectorAll } = this.props.ll_breachDetail_reducer;
                eventAll.map((val) => {
                    if (inputData.semesterId === val.semesterId) {
                        eventList = val.eventList
                    }
                    inspectorAll.map((val) => {
                        if (inputData.semesterId === val.semesterId) {
                            inspectorList = val.inspectorList
                        }
                    })
                })
                this.setState({
                    eventList,
                    inspectorList
                })
                this.props.ll_getClassDiscipli(inputData)
            }

        })
        this.props.ll_breachstatus(false)
        // this.setState({
        //     inputData,
        // })
    }

    /**
    *下钻播放页
    * @param {string} id 
    */
    goPlay(id) {
        let { content } = this.state;
        let { inputData } = this.props.ll_breachDetail_reducer;
        let $inputData = JSON.parse(JSON.stringify(inputData))
        this.props.ws_saveGlobalData($inputData, 'ISCED_detailCondition')
        this.props.ws_saveGlobalData(content, 'ISCED_content')
        this.props.history.push(`/home/det/ordbre/play/${id}`)
    }

    download() {
        let { inputData } = this.props.ll_breachDetail_reducer;
        this.props.ll_downDiscipli(inputData)
    }

    /**
     *分页跳转
     *
     * @param {Number} pageNum 页码
     * @memberof ClassRateDetail
     */
    jumpPage(pageNum) {
        let { inputData } = this.props.ll_breachDetail_reducer;
        inputData.pageNum = pageNum
        // this.setState({
        //     inputData
        // })
        this.node.scrollIntoView()
        this.props.ll_getClassDiscipli(inputData)
    }

    /**
     *查询回调
     *
     * @param {object} value
     * @memberof ClassRateDetail
     */
    search(value, inspectorList, eventList) {
        let data = JSON.parse(JSON.stringify(value))
        data.pageNum = 1;
        console.log(data, 'data')

        this.setState({
            // inputData: data,
            inspectorList,
            eventList
        })
        this.props.ll_getClassDiscipli(data)
    }

    render() {
        let { inspectorList, eventList, content } = this.state;
        let { breachData, total, eventAll, inspectorAll, loading, inputData, } = this.props.ll_breachDetail_reducer
        let { isClassOrder } = G.ISCED_setInfo
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
                    return <div className='ll-td' title={text || '--'}>{text}</div>
                }
            },
            {
                title: '时间',
                dataIndex: 'Time',
                render: (text, record) => {
                    return <div className='ll-td' title={`${record.time || '--'} ${record.sectionName || '--'}`}>
                        {`${record.time || '--'} ${record.sectionName || '--'}`}
                    </div>
                }
            },
            // {
            //     title: '违纪对象',
            //     dataIndex: 'disciplineName',
            //     render: (text, record) => {
            //         return <div className='ll-td' title={text || '--'}>{text || '--'}</div>
            //     },
            // },
            // {
            //     title: '违纪扣分',
            //     dataIndex: 'score',
            //     render: (text, record) => {
            //         return <div className='ll-td' title={text || '--'}>{text || '--'}</div>
            //     },
            // },
            {
                title: '违纪事件',
                dataIndex: 'event',
                render: (text, record) => {
                    return <div className='ll-td' title={text || '--'}>{text || '--'}</div>
                },
            },
            {
                title: '备注信息',
                dataIndex: 'info',
                render: (text, record) => {
                    return <div className='ll-td' title={text || '--'}>{text || '--'}</div>
                },
            },
            {
                title: '巡课时间',
                dataIndex: 'inspectorTime',
                render: (text, record) => {
                    return <div className='ll-td' title={text || '--'}>{text || '--'}</div>
                },
            },
            {
                title: '巡课员',
                dataIndex: 'inspectorName',
                render: (text, record) => {
                    return <div className='ll-td' title={text || '--'}>{text || '--'}</div>
                },
            }, {
                title: '操作',
                render: (text, record) => {
                    return <div className='ll-td'><span style={{ cursor: 'pointer' }} onClick={() => this.goPlay(record.id)} title='查看视频'><SVG type='cksp' /> 查看视频</span></div>
                }
            }
        ]
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
                    return <div className='ll-td' title={text || '--'}>{text}</div>
                }
            },
            {
                title: '时间',
                dataIndex: 'Time',
                render: (text, record) => {
                    return <div className='ll-td' title={`${record.time || '--'} ${record.sectionName || '--'}`}>
                        {`${record.time || '--'} ${record.sectionName || '--'}`}
                    </div>
                }
            },
            // {
            //     title: '违纪对象',
            //     dataIndex: 'disciplineName',
            //     render: (text, record) => {
            //         return <div className='ll-td' title={text || '--'}>{text || '--'}</div>
            //     },
            // },
            // {
            //     title: '违纪扣分',
            //     dataIndex: 'score',
            //     render: (text, record) => {
            //         return <div className='ll-td' title={text || '--'}>{text || '--'}</div>
            //     },
            // },
            {
                title: '违纪事件',
                dataIndex: 'event',
                render: (text, record) => {
                    return <div className='ll-td' title={text || '--'}>{text || '--'}</div>
                },
            },
            {
                title: '备注信息',
                dataIndex: 'info',
                render: (text, record) => {
                    return <div className='ll-td' title={text || '--'}>{text || '--'}</div>
                },
            },
            {
                title: '巡课时间',
                dataIndex: 'inspectorTime',
                render: (text, record) => {
                    return <div className='ll-td' title={text || '--'}>{text || '--'}</div>
                },
            },
            {
                title: '巡课员',
                dataIndex: 'inspectorName',
                render: (text, record) => {
                    return <div className='ll-td' title={text || '--'}>{text || '--'}</div>
                },
            }, {
                title: '操作',
                render: (text, record) => {
                    return <div className='ll-td'><span style={{ cursor: 'pointer' }} onClick={() => this.goPlay(record.claRoomId)} title='查看视频'><SVG type='cksp' /> 查看视频</span></div>
                }
            }
        ]

        let columns = []
        if (isClassOrder == '1') {
            columns = columnsCourse
        } else {
            columns = columnsData
        }
        return (
            <div className='ll-breach ll-teaDetail' ref={(node) => { this.node = node }}>
                <Header
                    type={5}
                    search={this.search}
                    inputData={JSON.parse(JSON.stringify(inputData))}
                    eventAll={eventAll}
                    inspectorAll={inspectorAll}
                    inspectorList={inspectorList}
                    eventList={eventList}
                />
                <div className='ll-teaD-bot'>
                    <div className='ll-down'>
                        <div className='ll-down-content' onClick={this.download} style={breachData && breachData.length ? {} : { pointerEvents: 'none' }}>
                            <span title='下载'><SVG type='de_download' title='下载' /></span>
                            <div>
                                下载
                            </div>
                        </div>
                    </div>
                    <div className={isClassOrder == '1' ? 'll-kqTable ll-sitTable isCourseNum' : 'll-kqTable ll-sitTable'}>
                        <Table
                            dataSource={breachData}
                            columns={columns}
                            rowKey={record => record.id}
                            pagination={false}
                            locale={{ emptyText: <CollageNoData /> }}
                            loading={loading}
                        />
                        <Fy
                            pageSize={inputData.pageSize}
                            pageIndex={inputData.pageNum}
                            total={total}
                            jumpPage={this.jumpPage.bind(this)}
                        />
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
            </div>
        );
    }
}

export default withRouter(BreachDetail);