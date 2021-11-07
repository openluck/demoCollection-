/*
 * @Author: lxx 
 * @Date: 2020-01-23 10:17:46 
 * @Last Modified by: tj
 * @Last Modified time: 2021-03-22 17:15:00
 * 明细查询-教学质量-教学分析
 */
import React, { Component } from 'react';
import Header from './header';
import PerfectScrollbar from "react-perfect-scrollbar";
import './../../../style/ll-header.scss';
import './../../../style/teaDetail.scss';
import { Table } from 'antd';
import Fy from '../../public/fy';
import moment from 'moment';
import { ll_getTeaAnalysis, ll_downTeaAnalysis,ll_analystatus } from './../../../redux/ll-analyDetail.reducer';
import { connect } from "react-redux";
import SVG from './../../public/svg'
import ErrModal from './errModal'
import G from './../../../config/g'
import CollageNoData from './../image/college_image/collegeNoData'
import { withRouter } from 'react-router-dom';
import {ws_saveGlobalData} from './../../../redux/ws-global.reducer';

@connect(state => state, { ll_getTeaAnalysis, ll_downTeaAnalysis,ll_analystatus,ws_saveGlobalData })
class AnalyDetail extends Component {
    constructor(props) {
        super(props);
        // const {clsType,sectionId}=this.props.match.params
        // const { roleType,belongOrgId} = G.ISCED_curRoleInfo;

        this.state = {
            semester:G.ISCED_semesterList||[],
            content:[
                {name:'教学分析',url:'/home/det/quaanaly'},
                {name:'课堂明细',url:''},
            ],
            // inputData: {
            //     semesterId:JSON.stringify(G.ISCED_cutSemesterData)!=='{}'? G.ISCED_cutSemesterData.semesterId:'',//学期id
            //     courseId: "",//课程id
            //     teacherId: '',//教师id
            //     // collegeId: '',//开课院系id
            //     collegeId: (roleType==="1" || roleType === '2')?'':belongOrgId,//开课院系id

            //     collegeId: '',//开课院系id
            //     couTypeId: G.ISCED_courseTypeList && G.ISCED_courseTypeList.length?G.ISCED_courseTypeList[0].couTypeId :'',//课程类别id
            //     sectionId:sectionId?sectionId:'',//节次id
            //     startTime: moment(new Date()).format('YYYY-MM-DD'),
            //     endTime: moment(new Date()).format('YYYY-MM-DD'),
            //     pageNum: 1,
            //     pageSize: 20,
            //     classRoomType:clsType?clsType==="1"?"practice":clsType==="2"?"talk":clsType==="3"?"mixture":clsType==="4"?"teach":"":""

            // },
            visible:false
        };
        this.download = this.download.bind(this);
        this.search = this.search.bind(this)
    }
    componentDidMount() {
        let { inputData ,analystatus} = this.props.ll_AnalyDetail_reducer;
        if(!analystatus){
            const {clsType,sectionId}=this.props.match.params
            const { roleType,belongOrgId} = G.ISCED_curRoleInfo;
                inputData.semesterId=JSON.stringify(G.ISCED_cutSemesterData)!=='{}'? G.ISCED_cutSemesterData.semesterId:'',//学期id
                inputData.courseId= "",//课程id
                inputData.teacherId= '',//教师id
                inputData.collegeId= (roleType==="1" || roleType === '2')?'':belongOrgId,//开课院系id
                // inputData.collegeId= '',//开课院系id  1.21 未发现此行代码作用 暂注释
                inputData.courseNum='',
                inputData.couTypeId= G.ISCED_courseTypeList && G.ISCED_courseTypeList.length?G.ISCED_courseTypeList[0].couTypeId :'',//课程类别id
                inputData.sectionId=sectionId&&sectionId!=='null' ? sectionId : '',//节次id
                inputData.startTime= moment(new Date()).format('YYYY-MM-DD'),
                inputData.endTime= moment(new Date()).format('YYYY-MM-DD'),
                inputData.pageNum= 1,
                inputData.pageSize= 20,
                inputData.classRoomType=clsType?clsType==="1"?"practice":clsType==="2"?"talk":clsType==="3"?"mixture":clsType==="4"?"teach":"":""
                //1.21 不在当前学期日期范围内，将默认开始时间定为学期开始时间
                if (G.ISCED_cutSemesterData.isCutSemester === '0') {
                  inputData.startTime = G.ISCED_cutSemesterData.startTime
                }
        }else{
            if (G.ISCED_detailCondition && G.ISCED_detailCondition.semesterId) {
                let { courseNum,semesterId, courseId, teacherId, collegeId, classRoomType, couTypeId, sectionId, startTime, endTime, pageNum, pageSize } = G.ISCED_detailCondition
                inputData.semesterId = semesterId;//学期id
                inputData.courseId = courseId;//课程id
                inputData.teacherId = teacherId;//教师id
                inputData.collegeId = collegeId;//开课院系id     
                inputData.courseNum=courseNum;      
                inputData.classRoomType = classRoomType;
                inputData.couTypeId = couTypeId;//课程类别id
                inputData.sectionId = sectionId;//节次id
                inputData.startTime = startTime;
                inputData.endTime = endTime;
                inputData.pageNum = pageNum;
                inputData.pageSize = pageSize;
                console.log('inputData-Details', inputData)
            }
        }
        //1.21当前角色身份为教师时 roleType：5 教师
        if (G.ISCED_curRoleInfo.roleType === '5') { 
          inputData.teacherId = G.ISCED_roleData.accountId
        }
        this.props.ll_analystatus(false)
        this.props.ll_getTeaAnalysis(inputData)
    }

     /**
     *下钻播放页
     * @param {string} id 
     */
    goPlay(id) {
        let { content } = this.state;
        let { inputData } = this.props.ll_AnalyDetail_reducer;
        let $inputData = JSON.parse(JSON.stringify(inputData))
        this.props.ws_saveGlobalData($inputData, 'ISCED_detailCondition')
        this.props.ws_saveGlobalData(content, 'ISCED_content')
        this.props.history.push(`/home/det/ordclass/play/${id}`)
    }

    download() {
        let { inputData} = this.props.ll_AnalyDetail_reducer;
        this.props.ll_downTeaAnalysis(inputData)
        console.log('下载')
    }

    /**
     *分页跳转
     *
     * @param {Number} pageNum 页码
     * @memberof ClassRateDetail
     */
    jumpPage(pageNum) {
        let { inputData} = this.props.ll_AnalyDetail_reducer;
        inputData.pageNum = pageNum
        this.node.scrollIntoView()
        this.props.ll_getTeaAnalysis(inputData)
        console.log(inputData)
    }


    /**
     *查询回调
     *
     * @param {object} value
     * @memberof ClassRateDetail
     */
    search(value) {
        let data = JSON.parse(JSON.stringify(value))
        data.pageNum = 1
        this.props.ll_getTeaAnalysis(data)
        
    }

    render() {
        let {content} = this.state;
        let { analyData, total,loading ,inputData} = this.props.ll_AnalyDetail_reducer
        let {isClassOrder} = G.ISCED_setInfo
        let columnsData = [
            {
                title: '开课单位',
                dataIndex: 'collegeName',
                render: (text, record) => {
                    return <div className='ll-td' title={text||'--'}>{text||'--'}</div>
                }
            },
            {
                title: '地点',
                dataIndex: 'addr',
                render: (text, record) => {
                    return <div className='ll-td' title={text||'--'}>{text||'--'}</div>
                }
            },
            {
                title: '课程类别',
                dataIndex: 'couTypeName',
                render: (text, record) => {
                    return <div className='ll-td' title={text||'--'}>{text||'--'}</div>
                }
            },
            {
                title: '课程名',
                dataIndex: 'courseName',
                render: (text, record) => {
                    return <div className='ll-td' title={text||'--'}>{text||'--'}</div>
                }
            },
            {
                title: '教师名',
                dataIndex: 'teacherName',
                render: (text, record) => {
                    return <div className='ll-td' title={text||'--'}>{text||'--'}</div>
                }
            },
            {
                title: '时间',
                dataIndex: 'Time',
                render: (text, record) => {
                    return <div className='ll-td' >
                        <div className='ll-timeDiv'>
                            <span title={record.time|| '--'}>
                                {record.time|| '--'}
                            </span>
                            <span title={record.sectionName || '--'}>
                                {record.sectionName || '--'}
                            </span>
                        </div>
                    </div>
                }
            },
            {
                title: '教学设计',
                dataIndex: 'teachDesign',
                render: (text, record) => {
                    return <div className='ll-td' >
                        <div className='ll-sjDiv'><span title={`学生自习【${text.stuLearn||text.stuLearn===0?text.stuLearn:'--'}分钟】`}>学生自习【{text.stuLearn||text.stuLearn===0?text.stuLearn:'--'}分钟】</span></div>
                        <div className='ll-sjDiv'><span title={`生生互动【${text.stuInteract||text.stuInteract===0?text.stuInteract:'--'}分钟】`}>生生互动【{text.stuInteract||text.stuInteract===0?text.stuInteract:'--'}分钟】</span></div>
                        <div className='ll-sjDiv'><span title={`师生互动【${text.tsInteract||text.tsInteract===0?text.tsInteract:'--'}分钟】`}>师生互动【{text.tsInteract||text.tsInteract===0?text.tsInteract:'--'}分钟】</span></div>
                        <div className='ll-sjDiv'><span title={`教师讲授【${text.teaching||text.teaching===0?text.teaching:'--'}分钟】`}>教师讲授【{text.teaching||text.teaching===0?text.teaching:'--'}分钟】</span></div>
                        <div className='ll-sjDiv'><span title={`学生展示【${text.stuShow||text.stuShow===0?text.stuShow:'--'}分钟】`}>学生展示【{text.stuShow||text.stuShow===0?text.stuShow:'--'}分钟】</span></div>
                    </div>
                },
            },
            // {   v1.21删除
            //     title: '教师行为',
            //     dataIndex: 'teacherBehavior',
            //     render: (text, record) => {
            //         return <div className='ll-td' >
            //             <div className='ll-xvDiv'><span style={{ textIndent: '14px' }} title={`板书【${text.boardWrite||text.boardWrite===0?text.boardWrite:'--'}分钟】`}>板书【{text.boardWrite||text.boardWrite===0?text.boardWrite:'--'}分钟】</span></div>
            //             <div className='ll-xvDiv'><span style={{ textIndent: '14px' }} title={`巡视【${text.patrol||text.patrol===0?text.patrol:'--'}分钟】`}>巡视【{text.patrol||text.patrol===0?text.patrol:'--'}分钟】</span></div>
            //             <div className='ll-xvDiv'><span title={`多媒体【${text.media||text.media===0?text.media:'--'}分钟】`}>多媒体【{text.media||text.media===0?text.media:'--'}分钟】</span></div>
            //         </div>
            //     },
            // },
            {
                title: '课堂类型',
                dataIndex: 'classroomType',
                render: (text, record) => {
                    return <div className='ll-td' title={text||'--'}>{text||'--'}</div>
                },
            },
            {
                title: '操作',
                render: (text, record) => {
                    return <div className='ll-td'><span style={{cursor:'pointer'}} onClick={()=>this.goPlay(record.id)} title='查看视频'><SVG type='cksp'/> 查看视频</span></div>
                }
            }

        ]
        let columnsCourse = [
            {
                title: '开课单位',
                dataIndex: 'collegeName',
                render: (text, record) => {
                    return <div className='ll-td' title={text||'--'}>{text||'--'}</div>
                }
            },
            {
                title: '地点',
                dataIndex: 'addr',
                render: (text, record) => {
                    return <div className='ll-td' title={text||'--'}>{text||'--'}</div>
                }
            },
            {
                title: '课程类别',
                dataIndex: 'couTypeName',
                render: (text, record) => {
                    return <div className='ll-td' title={text||'--'}>{text||'--'}</div>
                }
            },
            {
                title: '课程名',
                dataIndex: 'courseName',
                render: (text, record) => {
                    return <div className='ll-td' title={text||'--'}>{text||'--'}</div>
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
                    return <div className='ll-td' title={text||'--'}>{text||'--'}</div>
                }
            },
            {
                title: '时间',
                dataIndex: 'Time',
                render: (text, record) => {
                    return <div className='ll-td' >
                        <div className='ll-timeDiv'>
                            <span title={record.time|| '--'}>
                                {record.time|| '--'}
                            </span>
                            <span title={record.sectionName || '--'}>
                                {record.sectionName || '--'}
                            </span>
                        </div>
                    </div>
                }
            },
            {
                title: '教学设计',
                dataIndex: 'teachDesign',
                render: (text, record) => {
                    return <div className='ll-td' >
                        <div className='ll-sjDiv'><span title={`学生自习【${text.stuLearn||text.stuLearn===0?text.stuLearn:'--'}分钟】`}>学生自习【{text.stuLearn||text.stuLearn===0?text.stuLearn:'--'}分钟】</span></div>
                        <div className='ll-sjDiv'><span title={`生生互动【${text.stuInteract||text.stuInteract===0?text.stuInteract:'--'}分钟】`}>生生互动【{text.stuInteract||text.stuInteract===0?text.stuInteract:'--'}分钟】</span></div>
                        <div className='ll-sjDiv'><span title={`师生互动【${text.tsInteract||text.tsInteract===0?text.tsInteract:'--'}分钟】`}>师生互动【{text.tsInteract||text.tsInteract===0?text.tsInteract:'--'}分钟】</span></div>
                        <div className='ll-sjDiv'><span title={`教师讲授【${text.teaching||text.teaching===0?text.teaching:'--'}分钟】`}>教师讲授【{text.teaching||text.teaching===0?text.teaching:'--'}分钟】</span></div>
                        <div className='ll-sjDiv'><span title={`学生展示【${text.stuShow||text.stuShow===0?text.stuShow:'--'}分钟】`}>学生展示【{text.stuShow||text.stuShow===0?text.stuShow:'--'}分钟】</span></div>
                    </div>
                },
            },
            // {   
            //     title: '教师行为',
            //     dataIndex: 'teacherBehavior',
            //     render: (text, record) => {
            //         return <div className='ll-td' >
            //             <div className='ll-xvDiv'><span style={{ textIndent: '14px' }} title={`板书【${text.boardWrite||text.boardWrite===0?text.boardWrite:'--'}分钟】`}>板书【{text.boardWrite||text.boardWrite===0?text.boardWrite:'--'}分钟】</span></div>
            //             <div className='ll-xvDiv'><span style={{ textIndent: '14px' }} title={`巡视【${text.patrol||text.patrol===0?text.patrol:'--'}分钟】`}>巡视【{text.patrol||text.patrol===0?text.patrol:'--'}分钟】</span></div>
            //             <div className='ll-xvDiv'><span title={`多媒体【${text.media||text.media===0?text.media:'--'}分钟】`}>多媒体【{text.media||text.media===0?text.media:'--'}分钟】</span></div>
            //         </div>
            //     },
            // },
            {
                title: '课堂类型',
                dataIndex: 'classroomType',
                render: (text, record) => {
                    return <div className='ll-td' title={text||'--'}>{text||'--'}</div>
                },
            },
            {
                title: '操作',
                render: (text, record) => {
                    return <div className='ll-td'><span style={{cursor:'pointer'}} onClick={()=>this.goPlay(record.id)} title='查看视频'><SVG type='cksp'/> 查看视频</span></div>
                }
            }

        ]
        
        let columns=[]
        if(isClassOrder=='1'){
            columns=columnsCourse
        }else{
            columns=columnsData
        }
        return (
            <div className='ll-analy ll-teaDetail' ref={(node)=>{this.node=node}}>
                <Header
                    type={7}
                    pageType={'analy'}
                    search={this.search}
                    inputData={JSON.parse(JSON.stringify(inputData))}
                />
                <div className='ll-teaD-bot'>
                    <div className='ll-down'>
                        <div className='ll-down-content' onClick={this.download} style={analyData.length?{}:{pointerEvents:'none'}}>
                        <span title='下载'><SVG type='de_download' title='下载'/></span>
                            <div>
                                下载
                            </div>
                        </div>
                    </div>
                    <div className={isClassOrder=='1'?'ll-kqTable ll-analyTable isCourseNum':'ll-kqTable ll-analyTable'}>
                        <Table
                            dataSource={analyData} //analyData
                            columns={columns}
                            rowKey={record => record.id}
                            pagination={false}
                            locale={{emptyText:<CollageNoData />}}
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
                        onCancel={()=>{
                            this.setState({
                                visible:false
                            })
                        }}
                        visible={this.state.visible}
                    />
                }
            </div>
        );
    }
}

export default withRouter(AnalyDetail);