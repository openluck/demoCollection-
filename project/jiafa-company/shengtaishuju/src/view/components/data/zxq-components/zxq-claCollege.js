
/*
 * @Author:zxq
 * @Date: 2020-02-10 13:51:43 
 * @Last Modified by: tj
 * @Last Modified time: 2021-01-20 17:27:50
 * 资源情况-教师统计-教学楼数据
 */

import React, { Component } from 'react';
import { Table, Select, message } from 'antd';
import SVG from "../../../public/svg";
import zxqRuest from '../../../../request/zxq_request'
import ErrModal from '../../../components/details/errModal';
import CollageNoData from '../../image/college_image/collegeNoData';
import { ws_saveGlobalData } from "../../../../redux/ws-global.reducer";
import G from '../../../../config/g';
import { connect } from 'react-redux';

const {
    BuildList,
} = zxqRuest;
const { Option } = Select;
@connect(state => state,
    {
        ws_saveGlobalData,
    })
class CollegeTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            teachingBuildId: "", //教学楼id
            //   teachingBuildName:"", 
            visible: false,
            roleType: G.ISCED_curRoleInfo.roleType || "", //(1/2:校级 3/4:院级)
            teaBuildList: [],
            semesterId:'',
            selTime:''
        };
    }
    componentWillReceiveProps(props) {
        console.log(props)
        let {semesterId,selTime} = this.state
        if(props.param.semesterId!==semesterId||props.param.selTime!==selTime){
            this.getBuildList()
            this.setState({
                semesterId:props.param.semesterId,
                selTime:props.param.selTime
            })
        }
        // let { selDatetype, tabletype, semesterId } = props;
        // this.setState({
        //     tabletype,
        //     timeType: selDatetype,
        //     semesterId
        // })

    }

    componentDidMount() {
        // 请求教学楼列表
        // this.getBuildList();

    }

    /**
    * 获取教学楼下拉数据
    */
    getBuildList() {
        let { param } = this.props;
        let params = {
            selTime: param.selTime,
            timeType: param.timeType,
            semesterId: param.semesterId
        }
        //接口
        BuildList(params).then((res) => {
            if (res.data.result && res.data.data) {
                let teaBuildList = res.data.data;
                this.setState({
                    teaBuildList,
                })
            } else {
                message.error(res.data.message)
            }
        })
    }


    /**
    * 点击表格行
    */
    clickRow = (record) => {
        this.props.setCurSgin(2, record)
        this.setState({
            teaBuildList: []
        })

    }

    /*** 下拉选择数据*/

    selChange = (id) => {
        this.setState({
            teachingBuildId: id || "",
        }, () => {
            // 更新参数
            let obj = this.props.param
            obj.teachingBuildId = id||""
            this.props.changeParam(1, obj)
        })

    }
    /*** 搜索教室*/
    searchData = (value) => {
        console.log("value", value)
        //调接口
        this.getBuildList(value)
    }

    /**
     * 下载数据
     */
    download = () => {
        let { teachingBuildId } = this.state;
        //下载教学楼表格 --调接口
        let url = "/api/data/resources/downteachingBu";
        this.props.downLoad(teachingBuildId, url, 1)

    }
    render() {
        let { tabletype, teaBuildList, teachingBuildId, classRoomId, classRoomList, tableData, pageNum, pageSize, visible } = this.state;
        let { data, isLoading } = this.props
        const list = [{
            title: '教学楼',
            key: 'teachingBuildName'
        }, {
            title: '教室开课率',
            key: 'classRoomCouRate'
        }, {
            title: '教室有效利用率',
            key: 'classRoomUseRatio'
        }, {
            title: '教室闲时使用率',
            key: 'classRoomUsageRate'
        }]
        let columns = []
        list.map(dt => {
            columns.push({
                title: dt.title,
                dataIndex: dt.key,
                key: dt.key,
                render: (text, record) => {
                    return <div title={text || '--'}>{text || "--"}</div>
                }
            })
        })
        columns.push(
            {
                title: '操作',
                render: (text, record) => {
                  return <div><span onClick={() => this.clickRow(record)} style={{ cursor: 'pointer' }}><SVG type='de_show' /> 查看教室</span></div>
                }
              }
        )
        // const columns = [
        //     {
        //         title: type == 1 ? '教学楼' : "教室",
        //         dataIndex: type == 1 ? 'teachingBuildName' : "classRoom",
        //         key: type == 1 ? 'teachingBuildName' : "classRoom",
        //         render: (text, record) => {
        //             return <div title={text || '--'} style={tabletype == 2 ? { color: "#333333" } : {}}>{text}</div>
        //         }

        //     },
        //     {
        //         title: '教室开课率',
        //         dataIndex: 'classRoomCouRate',
        //         key: 'classRoomCouRate',
        //         render: (text, record) => {
        //             return <div title={text || '--'} style={tabletype == 2 ? { color: "#333333" } : {}}>{text}</div>
        //         }
        //     },
        //     {
        //         title: '教室有效利用率',
        //         dataIndex: 'classRoomUseRatio',
        //         key: 'classRoomUseRatio',
        //         render: (text, record) => {
        //             return <div title={text || '--'} style={tabletype == 2 ? { color: "#333333" } : {}}>{text}</div>
        //         }
        //     },
        //     {
        //         title: '教室闲时使用率',
        //         key: 'classRoomUsageRate',
        //         dataIndex: 'classRoomUsageRate',
        //         render: (text, record) => {
        //             return <div title={text || '--'} style={tabletype == 2 ? { color: "#333333" } : {}}>{text}</div>
        //         }
        //     },

        // ];
        return (
            <>
                <div className="zxq-table" ref={(node) => { this.node = node }}>
                    <div className="zxq-search">
                        <div>
                            <span> 教学楼： </span>
                            <Select
                                allowClear
                                value={teachingBuildId ? teachingBuildId : []}
                                onChange={this.selChange}
                                onSearch={this.searchData}
                                placeholder="请选择"
                                className="zxq-schBuild"
                                getPopupContainer={triggerNode => triggerNode.parentNode}
                            >
                                {
                                    teaBuildList ? teaBuildList.map((item, index) => (
                                        <Option key={index} value={item.teachingBuildId} >{item.teachingBuildName}</Option>
                                    )) : null
                                }
                            </Select>
                        </div>
                        {
                            data && data.length ?
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
                                rowKey={(record, index) => index}
                                pagination={false}
                            />

                        </div>
                        {/* {tabletype == 1 ?
              <div className="zxq-tableTips">
                <p>  备注：  </p>
                <p>  教室开课率反应了教室的使用情况，计算方式为实际开课的课时数/教室可排课的课时数；教室有效利用率反应了上课期间，教室的利用情况，计算方式为到课的学生人数/座位数；教室闲时使用率反应了非上课时间段，学生使用教室的情况 </p>
              </div> : ""} */}
                        <div className="zxq-tableTips">
                            <p>【 备注 】 教室开课率反应了教室的使用情况，计算方式为实际开课的课时数/教室可排课的课时数；教室有效利用率反应了上课期间，教室的利用情况，计算方式为到课的学生人数/座位数；教室闲时使用率反应了非上课时间段，学生使用教室的情况 </p>
                        </div>
                    </div>
                </div>
                {
                    <ErrModal
                        onCancel={() => {
                            this.setState({
                                visible: false
                            })
                        }}
                        visible={visible}
                    />
                }

            </>
        );
    }
}

export default CollegeTable;