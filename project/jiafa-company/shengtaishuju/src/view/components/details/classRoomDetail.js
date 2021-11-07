/*
 * @Author:zxq
 * @Date: 2020-02-17 14:41:43 
 * @Last Modified by: tj
 * @Last Modified time: 2021-03-26 14:06:01
 * 明细查询-教学质量-课堂互动明细 v1.21暂未发现使用
 */
import React, { Component } from 'react';
import Header from '../../components/details/header';
import { request } from '../../../util/request';
import { Table, message } from 'antd';
import Fy from '../../public/fy';
import moment from 'moment';
import ErrModal from './errModal';
import SVG from './../../public/svg';
import G from './../../../config/g';
import { ll_changeInput, ll_quacourstatus } from './../../../redux/ll-quacour.reducer';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {ws_saveGlobalData} from './../../../redux/ws-global.reducer';
import CollageNoData from './../image/college_image/collegeNoData'

@connect(state => state, { ll_changeInput, ll_quacourstatus,ws_saveGlobalData })
class ClassRoomDetail extends Component {
    constructor(props) {
        super(props);
        const { roleType, belongOrgId } = G.ISCED_curRoleInfo;
        this.state = {
            total: 100,
            semester: G.ISCED_semesterList || [],
            isLoading: false,
            inputData: {
                semesterId: JSON.stringify(G.ISCED_cutSemesterData) !== '{}' ? G.ISCED_cutSemesterData.semesterId : '',//学期id
                courseId: "",//课程id
                teacherId: '',//教师id
                // collegeId: '',//开课院系id
                courseNum:'',
                collegeId: (roleType==="1" || roleType === '2') ? '' : belongOrgId,//开课院系id

                couTypeId: G.ISCED_courseTypeList && G.ISCED_courseTypeList.length ? G.ISCED_courseTypeList[0].couTypeId : '',//课程类别id
                sectionId: '',//节次id
                startTime: moment(new Date()).format('YYYY-MM-DD'),
                // startTime:"2020-02-24",
                endTime: moment(new Date()).format('YYYY-MM-DD'),
                pageNum: 1,
                pageSize: 20
            },
            content:[
                {name:'课堂互动',url:'/home/det/quacour'},
                {name:'课堂明细',url:''},
            ],
            visible: false
        };

        this.search = this.search.bind(this);
        this.download = this.download.bind(this)
    }

    componentDidMount() {

        //获取表格数据
        let { quacourstatus,inputData } = this.props.ll_quacour_reducer;
        if(!quacourstatus){
            this.getTableData(this.state.inputData)
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
                this.setState({
                    inputData
                },()=>{
                    this.getTableData(inputData);
                })
            }
            
           
        }
        this.props.ll_quacourstatus(false)
    }


     /**
     *下钻播放页
     * @param {string} id 
     */
    goPlay(id) {
        let { content } = this.state;
        let { inputData } = this.props.ll_quacour_reducer;
        let $inputData = JSON.parse(JSON.stringify(inputData))
        this.props.ws_saveGlobalData($inputData, 'ISCED_detailCondition')
        this.props.ws_saveGlobalData(content, 'ISCED_content')
        this.props.history.push(`/home/det/quacour/play/${id}`)
    }

    /**
   *获取数据
   * @param {object} value
   */
    getTableData(Data) {
        let inputData = this.state.inputData;
        let data = Data ? Data : inputData;
        this.setState({
            isLoading: true,
        })
        this.props.ll_changeInput(data)
        request('/api/details/teaQuality/getClassInteraction', data, res => {
            if (res.result && res.data) {
                let data = res.data;
                let total = res.total;
                this.setState({
                    data,
                    total
                })
                // resolve(true);
            } else {
                // reject(false);
            }

        });
    }
    /**
   *查询回调
   * @param {object} value
   */
    search(value) {
        let data = JSON.parse(JSON.stringify(value));
        data.pageNum = 1;
        console.log(data, 'data')
        this.setState({
            inputData: data,
        }, () => {
            //调接口
            this.getTableData(data);
        })

    }
    /**
    *下载报表
    */
    download() {
        let inputData = this.state.inputData;
        let time = inputData.startTime + "-" + inputData.endTime;
        this.setState({
            isLoading: true,
        })
        request('/api/details/teaQuality/downInteraction', inputData, res => {
            let blob = new Blob([res], { type: 'application/x-xls' });
            saveAs(blob, `课堂互动明细  ${time}.xlsx`)
        }, (res) => {
            message.warning('下载失败，请刷新页面或者联系管理员', 2)
        }, true)
        setTimeout(_ => {
            this.setState({
                isLoading: false,
            })
        }, 2000);

    }
    /**
    *分页跳转
    *
    * @param {Number} pageNum 页码
    */
    jumpPage(pageNum) {
        let { inputData } = this.state;
        inputData.pageNum = pageNum
        this.setState({
            inputData
        }, () => {
            //调接口
            this.getTableData();
        })
    }
    render() {
        let { inputData, visible, total, data,content } = this.state;
        let {isClassOrder} = G.ISCED_setInfo
        let columnsData = [
            {
                title: '开课单位',
                dataIndex: 'collegeName',
                render: (text, record) => {
                    return <div className='zxq-td' title={text || '--'}>{text || '--'}</div>
                }
            },
            {
                title: '地点',
                dataIndex: 'addr',
                render: (text, record) => {
                    return <div className='zxq-td' title={text || '--'}>{text || '--'}</div>
                }
            },
            {
                title: '课程类别',
                dataIndex: 'couTypeName',
                render: (text, record) => {
                    return <div className='zxq-td' title={text || '--'}>{text || '--'}</div>
                }
            },
            {
                title: '课程名',
                dataIndex: 'courseName',
                render: (text, record) => {
                    return <div className='zxq-td' title={text || '--'}>{text || '--'}</div>
                }
            },
            {
                title: '教师名',
                dataIndex: 'teacherName',
                render: (text, record) => {
                    return <div className='zxq-td' title={text || '--'}>{text || '--'}</div>
                }
            },
            {
                title: '时间',
                dataIndex: 'Time',
                render: (text, record) => {
                    return <div className='zxq-td' title={`${record.time || '--'} ${record.sectionName || '--'}`}>
                        {`${record.time || '--'} ${record.sectionName || '--'}`}
                    </div>
                }
            },
            {
                // title: '学生起立（次/课时）',
                title:()=>{
                    return <div title='学生起立（次/课时）'>学生起立（次/课时）</div> 
                },
                dataIndex: 'stuStand',
                render: (text, record) => {
                    return <div className='zxq-td stuStand' title={text || '--'}>{text || '--'}</div>
                }
            },
            {
                // title: '教师上下讲台（次/课时）',
                title:()=>{
                    return <div title='教师上下讲台（次/课时）'>教师上下讲台（次/课时）</div> 
                },
                dataIndex: 'teacherDown',
                render: (text, record) => {
                    return <div className='zxq-td' title={text || '--'}>{text || '--'}</div>
                }
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
                    return <div className='zxq-td' title={text || '--'}>{text || '--'}</div>
                }
            },
            {
                title: '地点',
                dataIndex: 'addr',
                render: (text, record) => {
                    return <div className='zxq-td' title={text || '--'}>{text || '--'}</div>
                }
            },
            {
                title: '课程类别',
                dataIndex: 'couTypeName',
                render: (text, record) => {
                    return <div className='zxq-td' title={text || '--'}>{text || '--'}</div>
                }
            },
            {
                title: '课程名',
                dataIndex: 'courseName',
                render: (text, record) => {
                    return <div className='zxq-td' title={text || '--'}>{text || '--'}</div>
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
                    return <div className='zxq-td' title={text || '--'}>{text || '--'}</div>
                }
            },
            {
                title: '时间',
                dataIndex: 'Time',
                render: (text, record) => {
                    return <div className='zxq-td' title={`${record.time || '--'} ${record.sectionName || '--'}`}>
                        {`${record.time || '--'} ${record.sectionName || '--'}`}
                    </div>
                }
            },
            {
                title:()=>{
                    return <div title='学生起立（次/课时）'>学生起立（次/课时）</div> 
                },
                dataIndex: 'stuStand',
                render: (text, record) => {
                    return <div className='zxq-td stuStand' title={text || '--'}>{text || '--'}</div>
                }
            },
            {
                title:()=>{
                    return <div title='教师上下讲台（次/课时）'>教师上下讲台（次/课时）</div> 
                },
                dataIndex: 'teacherDown',
                render: (text, record) => {
                    return <div className='zxq-td' title={text || '--'}>{text || '--'}</div>
                }
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
        console.log(inputData)
        return (
            <div className="zxq-deatilContent">
                <Header
                    type={6}
                    search={this.search}
                    inputData={JSON.parse(JSON.stringify(inputData))} />
                <div className='zxq-teaD-bot'>
                    <div className='zxq-down'>
                        <div className='zxq-down-content' onClick={this.download}>
                            <SVG type='de_download' />
                            <div>
                                下载报表
                            </div>
                        </div>
                    </div>
                    <div className={isClassOrder=='1'?'zxq-kqTable isCourseNum':'zxq-kqTable'}>
                        <Table
                            dataSource={data}
                            columns={columns}
                            rowKey={record => record.id}
                            pagination={false}
                            locale={{ emptyText: <CollageNoData /> }}

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

export default withRouter(ClassRoomDetail);