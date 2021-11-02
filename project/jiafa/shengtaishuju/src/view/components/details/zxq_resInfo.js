/*
 * @Author:zxq
 * @Date: 2020-02-17 14:41:43 
 * @Last Modified by: tj
 * @Last Modified time: 2021-01-19 16:33:25
 * 明细查询-资源情况-多媒体使用
 */
import React, { Component } from 'react';
import Header from '../../components/details/header';
import { request } from '../../../util/request';
import { Table } from 'antd';
import Fy from '../../public/fy';
import moment from 'moment';
import ErrModal from './errModal';
import SVG from './../../public/svg';
import G from './../../../config/g';
import CollageNoData from './../image/college_image/collegeNoData'
import { ll_changeInput, ll_resInfostatus } from './../../../redux/ll-resInfo.reducer';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ws_saveGlobalData } from './../../../redux/ws-global.reducer';

@connect(state => state, { ll_changeInput, ll_resInfostatus, ws_saveGlobalData })
class ClassRoomDetail extends Component {
    constructor(props) {
        super(props);
        const { roleType, belongOrgId } = G.ISCED_curRoleInfo;

        this.state = {
            total: 0,
            semester: G.ISCED_semesterList || [],
            visible: false,
            isLoading: false,
            inputData: {
                semesterId: JSON.stringify(G.ISCED_cutSemesterData) !== '{}' ? G.ISCED_cutSemesterData.semesterId : '',//学期id
                courseId: "",//课程id
                teacherId: '',//教师id
                // collegeId: '',//开课院系id
                collegeId: (roleType==="1" || roleType === '2') ? '' : belongOrgId,//开课院系id
                multiUse: "",//多媒体使用
                courseNum: '',
                // couTypeId:"",//课程类别id
                couTypeId: G.ISCED_courseTypeList && G.ISCED_courseTypeList.length ? G.ISCED_courseTypeList[0].couTypeId : '',//课程类别id
                sectionId: '',//节次id
                // startTime: moment(new Date()).format('YYYY-MM-DD'), //1.20
                startTime: G.ISCED_cutSemesterData.isCutSemester === '0' ? G.ISCED_cutSemesterData.startTime : moment(new Date()).format('YYYY-MM-DD'), //v1.21修改
                endTime: moment(new Date()).format('YYYY-MM-DD'),
                pageNum: 1,
                pageSize: 20
            },
            content: [
                { name: '多媒体使用', url: '/home/det/info' },
                { name: '课堂明细', url: '' }
            ]

        };

        this.search = this.search.bind(this);
        this.download = this.download.bind(this)
    }

    componentDidMount() {

        let { resInfostatus, inputData } = this.props.ll_quacour_reducer;
        if (!resInfostatus) {
          //status  当播放页返回上一级时，置为true，用于保存搜索的条件 
            this.getTableData(inputData)
          // v1.21 此处的inputData未发现使用， 当不使用历史数据时，直接使用的时state里的默认数据
        } else {
            if (G.ISCED_detailCondition && G.ISCED_detailCondition.semesterId) {
                let { courseNum, semesterId, courseId, teacherId, collegeId, multiUse, couTypeId, sectionId, startTime, endTime, pageNum, pageSize } = G.ISCED_detailCondition
                inputData.semesterId = semesterId;//学期id
                inputData.courseId = courseId;//课程id
                inputData.teacherId = teacherId;//教师id
                inputData.collegeId = collegeId;//开课院系id           
                inputData.couTypeId = couTypeId;//课程类别id
                inputData.sectionId = sectionId;//节次id
                inputData.startTime = startTime;
                inputData.multiUse = multiUse;
                inputData.courseNum = courseNum;
                inputData.endTime = endTime;
                inputData.pageNum = pageNum;
                inputData.pageSize = pageSize;
                console.log(inputData)
                this.setState({
                    inputData
                }, () => {
                    this.getTableData(inputData);
                })
            }
        }
        this.props.ll_resInfostatus(false)
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
        this.props.history.push(`/home/det/info/play/${id}`)
    }

    /**
   *获取数据
   * @param {object} value
   */
    getTableData(data) {
        let inputData = this.state.inputData;
        this.setState({
            isLoading: true,
        })
        this.props.ll_changeInput(inputData)
        // /api/details/teaQuality/getClassInteraction
        request('/api/details/teaQuality/getMediaUse', inputData, res => {
            if (res.result && res.data) {
                let data = res.data;
                let total = res.total;
                this.setState({
                    data,
                    total,
                    isLoading:false
                })
                resolve(true);
            } else {
                reject(false);
            }

        });
    }
    /**
   *查询回调
   * @param {object} value
   */
    search(value) {
        let data = JSON.parse(JSON.stringify(value))
        data.pageNum = 1
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
        ///api/details/teaQuality/downInteraction
        request('/api/details/teaQuality/downMediaUse', inputData, res => {
            let blob = new Blob([res], { type: 'application/x-xls' });
            saveAs(blob, `多媒体使用明细  ${time}.xlsx`)
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
        inputData.pageNum = pageNum;
        this.node.scrollIntoView();
        this.setState({
            inputData
        }, () => {
            //调接口
            this.getTableData();
        })
    }
    render() {
        let { inputData, data, visible, total, content,isLoading } = this.state;
        let { isClassOrder } = G.ISCED_setInfo
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
                title: '多媒体使用',
                dataIndex: 'multiUse',
                render: (text, record) => {
                    return <div className='zxq-td' title={text ? text == "0" ? "否" : "是" : '--'}>{text ? text == "0" ? "否" : "是" : '--'}</div>
                }
            },
            {
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
                title: '多媒体使用',
                dataIndex: 'multiUse',
                render: (text, record) => {
                    return <div className='zxq-td' title={text ? text == "0" ? "否" : "是" : '--'}>{text ? text == "0" ? "否" : "是" : '--'}</div>
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
        return (
            <div className="zxq-deatilContent" ref={(node) => { this.node = node }}>
                <Header
                    type={7}
                    pageType={'media'}
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
                    <div className={isClassOrder=='1'?'zxq-resTable isCourseNum':'zxq-resTable'}>
                        <Table
                            dataSource={data}
                            columns={columns}
                            rowKey={record => record.id}
                            pagination={false}
                            loading={isLoading}
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