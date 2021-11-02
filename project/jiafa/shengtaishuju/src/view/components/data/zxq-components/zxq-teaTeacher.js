
/*
 * @Author:zxq
 * @Date: 2020-02-10 13:51:43 
 * @Last Modified by: lxx
 * @Last Modified time: 2020-08-13 11:54:57
 * 教师统计-教师层级
 */

import React, { Component } from 'react';
import { Table, Select, message } from 'antd';
import { request } from '../../../../util/request'
import Fy from '../../../public/fy';
import SVG from "../../../public/svg";
import ErrModal from '../../../components/details/errModal';
import SelInput from '../../../public/searSel/element';
import CollageNoData from '../../image/college_image/collegeNoData';
import { ws_saveGlobalData } from "../../../../redux/ws-global.reducer";
import moment from 'moment';
import { connect } from 'react-redux';
import G from '../../../../config/g';

const { Option } = Select;
@connect(state => state,
    {
        ws_saveGlobalData,
    })
class TeacherTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageNum: 1,  //当前页码()
            pageSize: 20,  //条数
            semesterId: G.ISCED_cutSemesterData.semesterId, //学年学期id
            // visible: false,  //下载错误模态框
            collegeId: '',    //开课单位id
            teacherId: '',
            teacherList: [],
            roleType: G.ISCED_curRoleInfo.roleType || "", //(1/2:校级 3/4:院级)
        };

    }
    componentWillReceiveProps(props) {
        let { semesterId } = this.state
        let { param } = props;
        if (param.semesterId && semesterId != param.semesterId) {
            console.log('1515')
            this.setState({
                semesterId: param.semesterId
            })
        }
    }

    componentDidMount() {
        //获取开课单位数据
        let { param } = this.props
        this.setState({
            collegeId: param.collegeId,
            pageNum: param.pageNum
        }, () => {
            this.getTeacherList();
        })
    }

    /**
    * 获取教师下拉列表
    */
    getTeacherList(value) {
        let { collegeId, semesterId } = this.state;
        let data = {
            searchValue: value ? value : "",
            collegeId: collegeId,
            semesterId: semesterId,

        }
        request("/api/public/getTeacherList", data, res => {
            if (res.result && res.data) {
                let teaList = res.data;
                let teacherList = [];
                teaList.map((value) => {
                    teacherList.push({
                        id: value.teacherId,
                        name: value.teacherName
                    })
                })
                this.setState({
                    teacherList
                })

            }
            else {
                this.setState({
                    teacherList: []
                });
            }
        })
    }
    /**
    * 点击表格行
    */
    // clickRow = (record) => {
    //     // 底层页跳转播放页
    //     this.props.history.push(`/home/data/restea/${record.claRoomId}`)
    // }

    /**
     * 搜索教师
     * @param {String} value 
     */
    searchData = (value) => {
        console.log("开始搜索", value)
        //获取教师数据
        this.getTeacherList(value);
    }

    /*** 选择教师*/
    selTeacher = (teacherId) => {
        this.setState({
            teacherId: teacherId.id,
            pageNum: 1
        }, () => {
            // 更新参数
            let obj = this.props.param
            obj.teacherId = teacherId.id
            this.props.changeParam(2, obj)
        })
    }

    /**
     * 下载数据
     */
    download = () => {
        let { teacherId } = this.state;
        //下载教师表格
        let url = "/api/data/resources/downteaInfor";
        this.props.downLoad(teacherId, url, 2)
    }

    /**
    *分页
    * @param {*} pageNum (页码)
    */
    jumpPage(pageNum) {
        this.setState({
            pageNum
        }, () => {
            // 更新参数
            let obj = this.props.param
            obj.pageNum = pageNum
            this.props.changeParam(2, obj)
        })
        //置顶
        this.node.scrollIntoView();

    }

    render() {
        let { teacherList, teacherId, pageNum, pageSize, visible } = this.state;
        let { isLoading, total, data } = this.props
        // 配置多媒体开关
        let multimediaUse = G.ISCED_setInfo.multimediaUse;
        const list = [{
            title: '教师',
            key: 'teacherName'
        }, {
            title: '工作量',
            key: 'teacherWorkLoad'
        }, {
            title: '多媒体使用率',
            key: 'multiUseRatio'
        }]
        let column = multimediaUse !== '0' ? list : _.filter(list, o => { return o.key !== 'multiUseRatio' });
        let columns = []
        column.map(dt => {
            columns.push({
                title: dt.title,
                dataIndex: dt.key,
                key: dt.key,
                render: (text, record) => {
                    return <div title={text || '--'} style={{ color: "#333333" }}>{text || "--"}</div>
                }
            })
        })

        return (
            <>
                <div className="zxq-table" ref={(node) => { this.node = node }}>
                    <div className="zxq-search">
                        <div className="zxq-colleSel">
                            <span> 教师： </span>
                            <SelInput
                                width={200}
                                onChange={this.selTeacher}
                                onSearch={this.searchData}
                                value={teacherId}  //选中项id
                                list={teacherList} //下拉数据

                            />

                        </div>
                        {data && data.length ?
                            <div className="zxq-tabDownload" onClick={this.download}>
                                <SVG type="de_download" className="zxq-download " />
                                下载
                            </div>
                            : ""}

                    </div>

                    <div className="zxq-tableContent">
                        <div className="zxq-antTable">
                            <Table
                                columns={columns}
                                dataSource={data}
                                loading={isLoading}
                                locale={{ emptyText: <CollageNoData /> }}
                                rowKey={(record, index) => record.teacherId}
                                pagination={false}
                                // onRow={record => {
                                //     return {
                                //         onClick: e => this.clickRow(record), // 点击行
                                //     };
                                // }}
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

                {/* <ErrModal
                    onCancel={() => {
                        this.setState({
                            visible: false
                        })
                    }}
                    visible={visible}
                /> */}

            </>
        );
    }
}

export default TeacherTable;