/*
 * @Author: lxx 
 * @Date: 2020-01-23 10:17:46 
 * @Last Modified by: tj
 * @Last Modified time: 2021-03-26 14:06:50
 * 明细查询-教学质量-学生听讲反馈明细
 */
import React, { Component } from 'react';
import Header from './header';
import PerfectScrollbar from "react-perfect-scrollbar";
import './../../../style/ll-header.scss';
import './../../../style/teaDetail.scss';
import { Table } from 'antd';
import Fy from '../../public/fy';
import moment from 'moment';
import { ll_getListenFeedback, ll_downFeedback,ll_backstatus } from './../../../redux/ll-backDetail.reducer';
import { connect } from "react-redux";
import SVG from './../../public/svg'
import ErrModal from './errModal'
import G from './../../../config/g'
import CollageNoData from './../image/college_image/collegeNoData'
import { withRouter } from 'react-router-dom';
import {ws_saveGlobalData} from './../../../redux/ws-global.reducer';

@connect(state => state, { ll_getListenFeedback, ll_downFeedback,ll_backstatus,ws_saveGlobalData })
class BackDetail extends Component {
    constructor(props) {
        super(props);
        // const { roleType,belongOrgId} = G.ISCED_curRoleInfo;

        this.state = {
            semester:G.ISCED_semesterList||[],
            content:[
                {name:'学生听讲反馈',url:'/home/det/quaback'},
                {name:'课堂明细',url:''},
            ],
            // inputData: {
            //     semesterId: JSON.stringify(G.ISCED_cutSemesterData)!=='{}'? G.ISCED_cutSemesterData.semesterId:'',//学期id
            //     courseId: "",//课程id
            //     teacherId: '',//教师id
            //     // collegeId: '',//开课院系id
            //     collegeId: (roleType==="1" || roleType === '2')?'':belongOrgId,//开课院系id
            //     couTypeId: G.ISCED_courseTypeList && G.ISCED_courseTypeList.length?G.ISCED_courseTypeList[0].couTypeId :'',//课程类别id
            //     sectionId: '',//节次id
            //     startTime: moment(new Date()).format('YYYY-MM-DD'),
            //     endTime: moment(new Date()).format('YYYY-MM-DD'),
            //     pageNum: 1,
            //     pageSize: 20
            // },
            visible: false
        };
        this.download = this.download.bind(this);
        this.search = this.search.bind(this)
    }
    componentDidMount() {
        let { inputData ,backstatus} = this.props.ll_backDetail_reducer;
        if(!backstatus){
            const { roleType,belongOrgId} = G.ISCED_curRoleInfo;
                inputData.semesterId= JSON.stringify(G.ISCED_cutSemesterData)!=='{}'? G.ISCED_cutSemesterData.semesterId:'',//学期id
                inputData.courseId= "",//课程id
                inputData.teacherId='',//教师id
                inputData.collegeId= (roleType==="1" || roleType === '2')?'':belongOrgId,//开课院系id
                inputData.couTypeId=G.ISCED_courseTypeList && G.ISCED_courseTypeList.length?G.ISCED_courseTypeList[0].couTypeId :'',//课程类别id
                inputData.sectionId= '',//节次id
                inputData.courseNum='',
                inputData.startTime= moment(new Date()).format('YYYY-MM-DD'),
                inputData.endTime=moment(new Date()).format('YYYY-MM-DD'),
                inputData.pageNum= 1,
                inputData.pageSize= 20
                //1.21 不在当前学期日期范围内，将默认开始时间定为学期开始时间
                if (G.ISCED_cutSemesterData.isCutSemester === '0') {
                  inputData.startTime = G.ISCED_cutSemesterData.startTime
                }
        }else{
            if (G.ISCED_detailCondition && G.ISCED_detailCondition.semesterId) {
                let { courseNum,semesterId, courseId, teacherId, collegeId, couTypeId, sectionId, startTime, endTime, pageNum, pageSize } = G.ISCED_detailCondition
                inputData.semesterId = semesterId;//学期id
                inputData.courseId = courseId;//课程id
                inputData.teacherId = teacherId;//教师id
                inputData.collegeId = collegeId;//开课院系id           
                inputData.couTypeId = couTypeId;//课程类别id
                inputData.sectionId = sectionId;//节次id
                inputData.startTime = startTime;
                inputData.courseNum=courseNum;
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
        this.props.ll_getListenFeedback(inputData)
        this.props.ll_backstatus(false)
    }

     /**
     *下钻播放页
     * @param {string} id 
     */
    goPlay(id) {
        let { content } = this.state;
        let { inputData } = this.props.ll_backDetail_reducer;
        let $inputData = JSON.parse(JSON.stringify(inputData))
        this.props.ws_saveGlobalData($inputData, 'ISCED_detailCondition')
        this.props.ws_saveGlobalData(content, 'ISCED_content')
        this.props.history.push(`/home/det/quaback/play/${id}`)
    }

    download() {
        let { inputData } = this.props.ll_backDetail_reducer;
        this.props.ll_downFeedback(inputData)
        console.log('下载')
    }

    /**
     *分页跳转
     *
     * @param {Number} pageNum 页码
     * @memberof ClassRateDetail
     */
    jumpPage(pageNum) {
        let { inputData } = this.props.ll_backDetail_reducer;
        inputData.pageNum = pageNum
        // this.setState({
        //     inputData
        // })
        this.node.scrollIntoView()
        this.props.ll_getListenFeedback(inputData)
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
        // this.setState({
        //     inputData: data,
        // })
        
        this.props.ll_getListenFeedback(data)
    }

    render() {
        let {  content } = this.state;
        let { backData, total,loading,inputData } = this.props.ll_backDetail_reducer
        let {isClassOrder} = G.ISCED_setInfo
        let columnsData = [
            {
                // title: '开课单位',
                title: ()=>{
                    return <div title='开课单位'>开课单位</div>
                },
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
                title: '学生行为',
                dataIndex: 'stuBehavior',
                render: (text, record) => {
                    return <div className='ll-td' >
                        <div className='ll-stuDiv'><span style={{ textIndent: '14px' }}
                        //  title={`阅读【${text.read ||text.read ===0?text.read : '--'}次】`}
                         >
                         阅读【{text.read ||text.read ===0?text.read : '--'}次】</span></div>
                        <div className='ll-stuDiv'>
                        <span style={{ textIndent: '14px' }} 
                        // title={`书写【${text.write ||text.write ===0?text.write : '--'}次】`}
                        >书写【{text.write ||text.write ===0?text.write : '--'}次】</span></div>
                        <div className='ll-stuDiv'><span style={{ textIndent: '14px' }} 
                        // title={`听讲【${text.listen ||text.listen ===0?text.listen : '--'}次】`}
                        >
                        听讲【{text.listen ||text.listen ===0?text.listen : '--'}次】</span></div>
                        <div className='ll-stuDiv'>
                        <span style={{ textIndent: '14px' }}
                        //  title={`举手【${text.handUp ||text.handUp ===0?text.handUp : '--'}次】`}
                        >举手【{text.handUp ||text.handUp ===0?text.handUp : '--'}次】</span></div>
                        <div className='ll-stuDiv'>
                        <span style={{ textIndent: '14px' }} title={`起立【${text.standUp ||text.standUp ===0?text.standUp : '--'}次】`}>起立【{text.standUp ||text.standUp ===0?text.standUp : '--'}次】</span></div>
                        <div className='ll-stuDiv'>
                        <span 
                        // title={`玩手机【${text.playPhone ||text.playPhone ===0?text.playPhone : '--'}次】`}
                        >玩手机【{text.playPhone ||text.playPhone ===0?text.playPhone : '--'}次】</span></div>
                        <div className='ll-stuDiv'>
                        <span
                        //  title={`趴桌子【${text.onTable ||text.onTable ===0?text.onTable : '--'}次】`}
                         >趴桌子【{text.onTable ||text.onTable ===0?text.onTable : '--'}次】</span></div>
                    </div>
                },
            },
            {
                title: '学生表情',
                dataIndex: 'face',
                render: (text, record) => {
                    return <div className='ll-td' >
                        <div className=' ll-stuDiv'><span >高兴【{text.happy ||text.happy ===0?text.happy : '--'}次】</span></div>
                        <div className=' ll-stuDiv'><span>害怕【{text.scare ||text.scare ===0?text.scare : '--'}次】</span></div>
                        <div className=' ll-stuDiv'><span >中性【{text.neuter ||text.neuter ===0?text.neuter : '--'}次】</span></div>
                        <div className=' ll-stuDiv'><span >惊讶【{text.amzed ||text.amzed ===0?text.amzed : '--'}次】</span></div>
                        <div className=' ll-stuDiv'><span>愤怒【{text.anger ||text.anger ===0?text.anger : '--'}次】</span></div>
                        <div className=' ll-stuDiv'><span >难过【{text.sad ||text.sad ===0?text.sad : '--'}次】</span></div>
                        <div className=' ll-stuDiv'><span >厌恶【{text.detest ||text.detest ===0?text.detest : '--'}次】</span></div>
                    </div>
                },
            },
            {
                title: '参与度',
                dataIndex: 'participation',
                render: (text, record) => {
                    return <div className='ll-td'>{text||text===0 ? `${text}%` : '--'}</div>
                },
            },
            {
                title: '专注度',
                dataIndex: 'concentration',
                render: (text, record) => {
                    return <div className='ll-td'>{text||text===0 ? `${text}%` : '--'}</div>
                },
            },
            {
                title: '活跃度',
                dataIndex: 'activity',
                render: (text, record) => {
                    return <div className='ll-td' >{text||text===0 ? `${text}%` : '--'}</div>
                },
            },
            {
                title: '疑惑度',
                dataIndex: 'doubting',
                render: (text, record) => {
                    return <div className='ll-td' >{text||text===0 ? `${text}%` : '--'}</div>
                },
            },{
                title: '操作',
                render: (text, record) => {
                    return <div className='ll-td'><span style={{cursor:'pointer'}} onClick={()=>this.goPlay(record.id)} title='查看视频'><SVG type='cksp'/> 查看视频</span></div>
                }
            }

        ]
        let columnsCourse = [
            {
                title: ()=>{
                    return <div title='开课单位'>开课单位</div>
                },
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
                title: '学生行为',
                dataIndex: 'stuBehavior',
                render: (text, record) => {
                    return <div className='ll-td' >
                        <div className='ll-stuDiv'><span style={{ textIndent: '14px' }}
                        //  title={`阅读【${text.read ||text.read ===0?text.read : '--'}次】`}
                         >
                         阅读【{text.read ||text.read ===0?text.read : '--'}次】</span></div>
                        <div className='ll-stuDiv'>
                        <span style={{ textIndent: '14px' }} 
                        // title={`书写【${text.write ||text.write ===0?text.write : '--'}次】`}
                        >书写【{text.write ||text.write ===0?text.write : '--'}次】</span></div>
                        <div className='ll-stuDiv'><span style={{ textIndent: '14px' }} 
                        // title={`听讲【${text.listen ||text.listen ===0?text.listen : '--'}次】`}
                        >
                        听讲【{text.listen ||text.listen ===0?text.listen : '--'}次】</span></div>
                        <div className='ll-stuDiv'>
                        <span style={{ textIndent: '14px' }}
                        //  title={`举手【${text.handUp ||text.handUp ===0?text.handUp : '--'}次】`}
                        >举手【{text.handUp ||text.handUp ===0?text.handUp : '--'}次】</span></div>
                        <div className='ll-stuDiv'>
                        <span style={{ textIndent: '14px' }} title={`起立【${text.standUp ||text.standUp ===0?text.standUp : '--'}次】`}>起立【{text.standUp ||text.standUp ===0?text.standUp : '--'}次】</span></div>
                        <div className='ll-stuDiv'>
                        <span 
                        // title={`玩手机【${text.playPhone ||text.playPhone ===0?text.playPhone : '--'}次】`}
                        >玩手机【{text.playPhone ||text.playPhone ===0?text.playPhone : '--'}次】</span></div>
                        <div className='ll-stuDiv'>
                        <span
                        //  title={`趴桌子【${text.onTable ||text.onTable ===0?text.onTable : '--'}次】`}
                         >趴桌子【{text.onTable ||text.onTable ===0?text.onTable : '--'}次】</span></div>
                    </div>
                },
            },
            {
                title: '学生表情',
                dataIndex: 'face',
                render: (text, record) => {
                    return <div className='ll-td' >
                        <div className=' ll-stuDiv'><span >高兴【{text.happy ||text.happy ===0?text.happy : '--'}次】</span></div>
                        <div className=' ll-stuDiv'><span>害怕【{text.scare ||text.scare ===0?text.scare : '--'}次】</span></div>
                        <div className=' ll-stuDiv'><span >中性【{text.neuter ||text.neuter ===0?text.neuter : '--'}次】</span></div>
                        <div className=' ll-stuDiv'><span >惊讶【{text.amzed ||text.amzed ===0?text.amzed : '--'}次】</span></div>
                        <div className=' ll-stuDiv'><span>愤怒【{text.anger ||text.anger ===0?text.anger : '--'}次】</span></div>
                        <div className=' ll-stuDiv'><span >难过【{text.sad ||text.sad ===0?text.sad : '--'}次】</span></div>
                        <div className=' ll-stuDiv'><span >厌恶【{text.detest ||text.detest ===0?text.detest : '--'}次】</span></div>
                    </div>
                },
            },
            {
                title: '参与度',
                dataIndex: 'participation',
                render: (text, record) => {
                    return <div className='ll-td'>{text||text===0 ? `${text}%` : '--'}</div>
                },
            },
            {
                title: '专注度',
                dataIndex: 'concentration',
                render: (text, record) => {
                    return <div className='ll-td'>{text||text===0 ? `${text}%` : '--'}</div>
                },
            },
            {
                title: '活跃度',
                dataIndex: 'activity',
                render: (text, record) => {
                    return <div className='ll-td' >{text||text===0 ? `${text}%` : '--'}</div>
                },
            },
            {
                title: '疑惑度',
                dataIndex: 'doubting',
                render: (text, record) => {
                    return <div className='ll-td' >{text||text===0 ? `${text}%` : '--'}</div>
                },
            },{
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
            <div className='ll-back ll-teaDetail' ref={(node)=>{this.node=node}}>
                <Header
                    type={6}
                    search={this.search}
                    inputData={JSON.parse(JSON.stringify(inputData))}
                />
                <div className='ll-teaD-bot'>
                    <div className='ll-down'>
                        <div className='ll-down-content' onClick={this.download} style={backData.length?{}:{pointerEvents:'none'}}>
                        <span title='下载'><SVG type='de_download' title='下载'/></span>
                            <div>
                                下载
                            </div>
                        </div>
                    </div>
                    <div className={isClassOrder=='1'?'ll-kqTable ll-backTable isCourseNum':'ll-kqTable ll-backTable'}>
                        <Table
                            dataSource={backData}
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

export default withRouter(BackDetail);