/*
 * @Author: lxx 
 * @Date: 2020-01-23 10:17:46 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-03-26 17:41:34
 * 明细查询-教学秩序-到课率明细组件
 */
import React, { Component } from 'react';
import Header from './header';
import PerfectScrollbar from "react-perfect-scrollbar";
import './../../../style/ll-header.scss';
import './../../../style/teaDetail.scss';
import { Table } from 'antd';
import Fy from '../../public/fy';
import moment from 'moment';
import { ll_getStuAttendance, ll_downStu, ll_aortOrder, ll_ordstatus } from './../../../redux/ll-detailData.reducer';
import { connect } from "react-redux";
import SVG from './../../public/svg'
import ErrModal from './errModal';
import { withRouter } from 'react-router-dom';
import G from './../../../config/g'
import CollageNoData from './../image/college_image/collegeNoData'
import { ws_saveGlobalData } from './../../../redux/ws-global.reducer';

@connect(state => state, { ll_getStuAttendance, ll_downStu, ll_aortOrder, ll_ordstatus, ws_saveGlobalData })
class ClassRateDetail extends Component {
    constructor(props) {
        super(props);
        // const { min, max, sectionId } = this.props.match.params
        // const { roleType, belongOrgId } = G.ISCED_curRoleInfo;
        this.state = {
            semester: G.ISCED_semesterList || [],
            content: [
                { name: '到课率', url: '/home/det/ordclass' },
                { name: '课堂明细', url: '/home/det/ordclass/play' }
            ],
            // inputData: {
            //     semesterId:JSON.stringify(G.ISCED_cutSemesterData)!=='{}'? G.ISCED_cutSemesterData.semesterId:'',//学期id
            //     courseId: "",//课程id
            //     teacherId: '',//教师id
            //     // collegeId: '',//开课院系id
            //     collegeId: (roleType==="1" || roleType === '2')?'':belongOrgId,//开课院系id
            //     min:min?min==='null'?'':Number(min):'',
            //     max:max?max==='null'?'':Number(max):'',
            //     couTypeId: G.ISCED_courseTypeList && G.ISCED_courseTypeList.length?G.ISCED_courseTypeList[0].couTypeId :'',//课程类别id
            //     sectionId: sectionId&&sectionId!=='null'?sectionId:'',//节次id
            //     startTime: moment(new Date()).format('YYYY-MM-DD'),
            //     endTime: moment(new Date()).format('YYYY-MM-DD'),
            //     sortType: 1,
            //     pageNum: 1,
            //     pageSize: 20
            // },
            // aortOrder: 'descend',
            visible: false
        };
        this.sortChange = this.sortChange.bind(this);
        this.download = this.download.bind(this);
        this.search = this.search.bind(this)
    }
    componentDidMount() {
        let { inputData, ordstatus } = this.props.ll_DetailData_reducer;
        if (!ordstatus) {
            const { sectionId, max, min, start, end, colId, teaId, courId, semId, couTypeId } = this.props.match.params
            const { roleType, belongOrgId } = G.ISCED_curRoleInfo;
            inputData.semesterId = semId !== 'null' && semId ? semId : JSON.stringify(G.ISCED_cutSemesterData) !== '{}' ? G.ISCED_cutSemesterData.semesterId : '';//学期id
                inputData.courseId = courId !== 'null' && courId ? courId : "";//课程id
                inputData.teacherId = teaId !== 'null' && teaId ? teaId : '';//教师id
                // collegeId: '',//开课院系id
                inputData.courseNum = '';
                inputData.collegeId = colId !== 'null' && colId ? colId : (roleType === "1" || roleType === '2') ? '' : belongOrgId;//开课院系id
                inputData.min = min ? min === 'null' ? '' : Number(min) : '';
                inputData.max = max ? max === 'null' ? '' : Number(max) : '';
                inputData.couTypeId = couTypeId !== 'null' && couTypeId ? couTypeId : G.ISCED_courseTypeList && G.ISCED_courseTypeList.length ? G.ISCED_courseTypeList[0].couTypeId : '';//课程类别id
                inputData.sectionId = sectionId && sectionId !== 'null' ? sectionId : '';//节次id
                inputData.startTime = start !== 'null' && start ? Number(start) > new Date().getTime() ? moment(new Date()).format('YYYY-MM-DD') : moment(Number(start)).format('YYYY-MM-DD') : moment(new Date()).format('YYYY-MM-DD');
                inputData.endTime = end !== 'null' && end ? Number(end) > new Date().getTime() ? moment(new Date()).format('YYYY-MM-DD') : moment(Number(end)).format('YYYY-MM-DD') : moment(new Date()).format('YYYY-MM-DD');
                inputData.sortType = 0;
                inputData.pageNum = 1;
                inputData.pageSize = 20
                //1.21 不在当前学期日期范围内，将默认开始时间定为学期开始时间
                if (G.ISCED_cutSemesterData.isCutSemester === '0') {
                  inputData.startTime = G.ISCED_cutSemesterData.startTime
                }
        } else {
            if (G.ISCED_detailCondition && G.ISCED_detailCondition.semesterId) {
                let { courseNum, semesterId, courseId, teacherId, collegeId, min, max, sortType, couTypeId, sectionId, startTime, endTime, pageNum, pageSize } = G.ISCED_detailCondition
                inputData.semesterId = semesterId;//学期id
                inputData.courseId = courseId;//课程id
                inputData.teacherId = teacherId;//教师id
                inputData.collegeId = collegeId;//开课院系id
                inputData.min = min;
                inputData.max = max;
                inputData.courseNum = courseNum;
                inputData.couTypeId = couTypeId;//课程类别id
                inputData.sectionId = sectionId;//节次id
                inputData.startTime = startTime;
                inputData.sortType = sortType;
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

        this.props.ll_ordstatus(false);
        // 重置筛选
        this.props.ll_aortOrder(inputData.sortType)
        // this.node.scrollIntoView()
        this.props.ll_getStuAttendance(inputData)
    }

    /**
     *下钻播放页
     * @param {string} id 
     */
    goPlay(id) {
        let { content } = this.state;
        let { inputData } = this.props.ll_DetailData_reducer;
        let $inputData = JSON.parse(JSON.stringify(inputData))
        this.props.ws_saveGlobalData($inputData, 'ISCED_detailCondition')
        this.props.ws_saveGlobalData(content, 'ISCED_content')
        this.props.history.push(`/home/det/ordclass/play/${id}`)
    }

    download() {
        let { inputData } = this.props.ll_DetailData_reducer
        this.props.ll_downStu(inputData)
    }

    /**
     *分页跳转
     *
     * @param {Number} pageNum 页码
     * @memberof ClassRateDetail
     */
    jumpPage(pageNum) {
        let { inputData } = this.props.ll_DetailData_reducer;
        inputData.pageNum = pageNum
        this.node.scrollIntoView()
        this.props.ll_getStuAttendance(inputData)
    }

    /**
     *升降序
     *
     * @param {*} pagination
     * @param {*} filters
     * @param {*} sorter
     * @param {*} extra
     * @memberof ClassRateDetail
     */
    sortChange(pagination, filters, sorter, extra) {
        let { inputData } = this.props.ll_DetailData_reducer;
        console.log('paixu', sorter.order)
        if (sorter.order === 'descend') {
            //降序
            inputData.sortType = 1;
        }
        if (sorter.order === 'ascend') {
            //升序
            inputData.sortType = 2;
        }
        if (!sorter.order) {
            //乱序
            inputData.sortType = 0;
        }
        inputData.pageNum = 1;
        let aortOrder = sorter.order ? sorter.order : ''
        this.props.ll_aortOrder(aortOrder)
        // this.setState({
        //     inputData,
        //     aortOrder: sorter.order ? sorter.order : ''
        // })
        this.props.ll_getStuAttendance(inputData)
    }

    /**
     *查询回调
     *
     * @param {object} value
     * @memberof ClassRateDetail
     */
    search(value) {
        let data = JSON.parse(JSON.stringify(value))
        let { inputData } = this.props.ll_sleepRateDetail_reducer;
        data.pageNum = 1;
        data.sortType = inputData.sortType;
        this.props.ll_aortOrder(inputData.sortType)
        // this.setState({
        //     inputData: data,
        //     aortOrder: 'descend'
        // })
        this.props.ll_getStuAttendance(data)
    }

    render() {
        let { content } = this.state;
        let { rateData, total, loading, inputData, aortOrder, } = this.props.ll_DetailData_reducer
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
                    return <div className='ll-td' title={text || '--'}>{text || '--'}</div>
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
            {
                title: '到课率',
                dataIndex: 'classRate',
                render: (text, record) => {
                    return <div className={record.type == '1' ? 'll-td isError' : 'll-td'} title={text ? `${text}%` : '--'}>{text ? `${text}%` : '--'}</div>
                },
                sortOrder: aortOrder,//ascend
                onFilter: (value, record) => record.classRate.indexOf(value) === 0,
                // sorter: (a, b) => a.classRate.length - b.classRate.length,
                sorter: (a, b) => { },
                sortDirections: ['descend', 'ascend'],
                // sorter: (a, b) => console.log("111",a),
            },
            {
                title: '应到人数',
                dataIndex: 'reachedNum',
                render: (text, record) => {
                    return <div className='ll-td' title={text ? text : text === 0 ? 0 : '--'}>{text ? text : text === 0 ? 0 : '--'}</div>
                }
            },
            {
                title: '实到人数',
                dataIndex: 'actualNum',
                render: (text, record) => {
                    let isError = {
                        color: '#ff4d4f'
                    }
                    let normal = {
                        color: '#000'
                    }
                    return <div className={record.type == '1' ? 'll-td isError' : 'll-td'} title={text ? text : text === 0 ? 0 : '--'}>{text ? text : text === 0 ? 0 : '--'}</div>
                }
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
                    return <div className='ll-td' title={text || '--'}>{text || '--'}</div>
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
            {
                title: '到课率',
                dataIndex: 'classRate',
                render: (text, record) => {
                    return <div className={record.type == '1' ? 'll-td isError' : 'll-td'} title={text ? `${text}%` : '--'}>{text ? `${text}%` : '--'}</div>
                },
                sortOrder: aortOrder,//ascend
                onFilter: (value, record) => record.classRate.indexOf(value) === 0,
                // sorter: (a, b) => a.classRate.length - b.classRate.length,
                sorter: (a, b) => { },
                sortDirections: ['descend', 'ascend'],
                // sorter: (a, b) => console.log("111",a),
            },
            {
                title: '应到人数',
                dataIndex: 'reachedNum',
                render: (text, record) => {
                    return <div className='ll-td' title={text ? text : text === 0 ? 0 : '--'}>{text ? text : text === 0 ? 0 : '--'}</div>
                }
            },
            {
                title: '实到人数',
                dataIndex: 'actualNum',
                render: (text, record) => {
                    let isError = {
                        color: '#ff4d4f'
                    }
                    let normal = {
                        color: '#000'
                    }
                    return <div className={record.type == '1' ? 'll-td isError' : 'll-td'} title={text ? text : text === 0 ? 0 : '--'}>{text ? text : text === 0 ? 0 : '--'}</div>
                }
            }, {
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
        return (
            <div className='ll-rate ll-teaDetail' ref={(node) => { this.node = node }}>
                <Header type={2} search={this.search} inputData={JSON.parse(JSON.stringify(inputData))} />
                <div className='ll-teaD-bot'>
                    <div className='ll-down'>
                        <div className='tj-remark'>备注：“--”代表由网络、设备等因素导致的数据异常</div>
                        <div className='ll-down-content' onClick={this.download} style={rateData.length ? {} : { pointerEvents: 'none' }}>
                            <span title='下载'><SVG type='de_download' title='下载' /></span>
                            <div>
                                下载
                            </div>
                        </div>
                    </div>
                    <div className={isClassOrder == '1' ? 'll-kqTable ll-rateTable isCourseNum' : 'll-kqTable ll-rateTable'}>
                        <Table
                            dataSource={rateData}
                            columns={columns}
                            rowKey={record => record.id}
                            pagination={false}
                            onChange={this.sortChange}
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

export default withRouter(ClassRateDetail);