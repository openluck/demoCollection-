/*
 * @Author: lxx 
 * @Date: 2020-08-07 09:57:53 
 * @Last Modified by: tj
 * @Last Modified time: 2021-02-04 12:50:13
 * 资源情况-教师统计-校级 
 */
import React, { Component } from 'react';
import { Table, Select } from 'antd';
import { request } from '../../../../util/request'
import SVG from "../../../public/svg";
import SelInput from '../../../public/searSel/element';
import CollageNoData from '../../image/college_image/collegeNoData';
import { ws_saveGlobalData } from "../../../../redux/ws-global.reducer";
import moment from 'moment';
import { connect } from 'react-redux';
import G from '../../../../config/g';
import _ from 'lodash'

const { Option } = Select;
@connect(state => state,
    {
        ws_saveGlobalData,
    })
class CollegeTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,  //下载错误模态框
            collegeId: '',    //开课单位id
            collegeList: [],   //开课单位
            roleType: G.ISCED_curRoleInfo.roleType || "", //(1/2:校级 3/4:院级)
            semesterId:G.ISCED_cutSemesterData.semesterId||''
        };

    }
    componentWillReceiveProps(nextProps) {
        let { semesterId } = nextProps.param;
        if(this.state.semesterId!==semesterId){
            this.setState({
                semesterId
            },()=>{
                this.getShoolList('')
            })
        }
    }

    componentDidMount() {
        //获取开课单位数据

        // let List = G.ISCED_collegeList || [];
        // let collegeList = [];
        // List.map((value) => {
        //     collegeList.push({
        //         id: value.collegeId,
        //         name: value.collegeName
        //     })
        // })
        // this.setState({
        //     collegeList,
        // })
        this.getShoolList('')
        
    }

    

    /**
    * 点击表格行
    */
    clickRow = (record) => {
        let id = record.collegeId;
        this.props.setCurSgin(2, record)
        this.setState({
            // collegeId: id,
            collegeList: []
            // classRoomId:"",
        })
    }

    /*** 选择开课单位*/
    selSchool = (collegeId) => {
        console.log(collegeId)
        this.setState({
            collegeId: collegeId.id
        }, () => {
            // 更新参数
            let obj = this.props.param
            obj.collegeId = collegeId.id
            this.props.changeParam(1, obj)
        })
    }

    /**
     * 获取开课单位下拉列表
     * @param {String} value 学院id
     */
    getShoolList(value) {
        let { semesterId } = this.state;
        let data = {
            searchValue: value,
            semesterId,
            courseId: "",
            teacherId: "",
            couTypeId: ""
        }
        request("/api/public/getDepartmentList", data, res => {
            if (res.result && res.data) {
                let collegeList = [];
                let List = res.data;
                List.map((value) => {
                    collegeList.push({
                        id: value.collegeId,
                        name: value.collegeName
                    })
                })
                this.setState({
                    collegeList
                })

            }
            else {
                this.setState({
                    collegeList: []
                })

            }
        })
    }

    /**
     * 搜索开课单位
     * @param {String} value 
     */
    searchData = (value) => {
        console.log("开始搜索", value)
        //获取开课单位数据
        this.getShoolList(value);
    }

    /**
     * 下载文件
     */
    download = () => {
        let { collegeId } = this.state;
        //下载学院
        let url = "/api/data/resources/downbegCollege";
        this.props.downLoad(collegeId, url, 1)
    }

    render() {
        let { collegeList, collegeId } = this.state;
        let { data, isLoading } = this.props
        // 配置多媒体开关
        let multimediaUse = G.ISCED_setInfo.multimediaUse;

        const list = [{
            title: '开课单位',
            key: 'collegeName'
        }, {
            title: '教师人均工作量',
            key: 'teacherWorkLoad'
        }, {
            title: '多媒体使用率',
            key: 'multiUseRatio'
        }]
        let column = multimediaUse !== '0' ? list : _.filter(list, o => {return o.key !== 'multiUseRatio'});
        let columns = []
        column.map(dt => {
            columns.push({
                title: dt.title,
                dataIndex: dt.key,
                key: dt.key,
                render: (text, record) => {
                    return <div title={text || '--'} style={{ color: "#3498db" }}>{text || "--"}</div>
                }
            })
        })
        columns.push(
            {
                title: '操作',
                render: (text, record) => {
                  return <div><span onClick={() => this.clickRow(record)} style={{ cursor: 'pointer' }}><SVG type='de_show' /> 查看教师</span></div>
                }
              }
        )
        return (
            <>
                <div className="zxq-table" ref={(node) => { this.node = node }}>
                    <div className="zxq-search">
                        <div className="zxq-colleSel">
                            <span> 开课单位： </span>
                            <SelInput
                                width={200}
                                onChange={this.selSchool}
                                onSearch={this.searchData}
                                value={collegeId}  //选中项id
                                list={collegeList} //下拉数据
                            />
                        </div>
                        {
                            data && data.length ?
                                <div className="zxq-tabDownload" onClick={this.download}>
                                    <SVG type="de_download" className="zxq-download " />
                                    下载
                                </div>
                                : ""
                        }
                    </div>

                    <div className="zxq-tableContent">
                        <div className="zxq-antTable">
                            <Table
                                columns={columns}
                                dataSource={data}
                                loading={isLoading}
                                locale={{ emptyText: <CollageNoData /> }}
                                rowKey={(record, index) => record.collegeId}
                                pagination={false}
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

export default CollegeTable;