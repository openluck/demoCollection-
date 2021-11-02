
/*
 * @Author:zxq
 * @Date: 2020-02-10 13:51:43 
 * @Last Modified by: tj
 * @Last Modified time: 2020-08-18 15:37:54
 * 资源情况-教室统计-教学楼下所有教室统计数据
 */

import React, { Component } from 'react';
import { Table, Select, message } from 'antd';
import { request } from '../../../../util/request'
import Fy from '../../../public/fy';
import SVG from "../../../public/svg";
import zxqRuest from '../../../../request/zxq_request'
import ErrModal from '../../../components/details/errModal';
import SelInput from '../../../public/searSel/element';
import CollageNoData from '../../image/college_image/collegeNoData';
import { ws_saveGlobalData } from "../../../../redux/ws-global.reducer";
import { saveAs } from 'file-saver';
import moment from 'moment';
import G from '../../../../config/g';
import { connect } from 'react-redux';

const {
    buildData,
    staticData,
    classData,
    classStaticData,
    BuildList,
    clRoomList
} = zxqRuest;
const { Option } = Select;
@connect(state => state,
    {
        ws_saveGlobalData,
    })
class BuildTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageNum: 1,  //当前页码()
            pageSize: 20,  //条数
            semesterId: G.ISCED_cutSemesterData.semesterId, //学年学期id
            // visible: false,  //下载错误模态框
            teachingBuildId: '',    //教学楼id
            classRoomId: '', // 教室id
            classRoomList: [],
            roleType: G.ISCED_curRoleInfo.roleType || "", //(1/2:校级 3/4:院级)
            //   pageNum: 1,  //当前页码
            //   pageSize: 20,  //每页条数20
            //   total: 0,
            //   loading: false,
            //   tabletype: 1,     //1教学楼2教室   
            //   teachingBuildId:"", //教学楼id
            //   teachingBuildName:"", 
            //   classRoomId: "", 
            //   timeType : 1 , //时间类型（123日周月）
            //   transData:{},
            //   selTime: moment(new Date()).format('YYYY-MM-DD'),//默认为今天的日期
            //   semesterId:G.ISCED_cutSemesterData.semesterId, //学年学期id
            //   visible:false,  //下载错误模态框
            //   statisdata: {},
            //   teaBuildList: [],   
            //   classRoomList: [],
            //   tableData: [],  //教学楼数据
            //   claTableData:[],  //教室数据
            //   page:"",//返回标志 
            //   info:this.props.ws_global_reducer.ISCED_saveInfo 
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
        //获取教室下拉
        let { param } = this.props
        this.setState({
            collegeId: param.collegeId,
            pageNum: param.pageNum
        }, () => {
            this.getclassRoomList();
        })

    }

    /**
      * 获取教室下拉数据
      */
    getclassRoomList = (value) =>  {
        console.log(value)
        let { param } = this.props;
        let params = {
            searchValue: value ? value : "",
            teachingBuildId: param.teachingBuildId,
            selTime: param.selTime,
            timeType: param.timeType,
            semesterId: param.semesterId
        }
        //接口
        clRoomList(params).then((res) => {
            if (res.data.result && res.data.data) {
                let classRoom = res.data.data;
                let classRoomList = [];
                classRoom.map((value) => {
                    classRoomList.push({
                        id: value.classRoomId,
                        name: value.classRoom
                    })
                })
                this.setState({
                    classRoomList
                })
            } else {
                message.error(res.data.message)
            }
        })

    }
    /**
    * 点击表格行
    */
    // clickRow = (record) => {
    //     let id = record.teachingBuildId;
    //     let teachingBuildName = record.teachingBuildName;
    //     let { tabletype } = this.state;
    //     // document.getElementsByClassName("ps")[0].addEventListener("scroll",this.hideAllMenu);

    // }

    /*** 下拉选择数据*/
    selChange = (obj) => {
        this.setState({
            classRoomId: obj.id,
            pageNum: 1
        }, () => {
            // 更新参数
            let objParams = this.props.param
            objParams.classRoomId = obj.id
            this.props.changeParam(2, objParams)
        })
    }

    /*** 搜索教室*/
    searchData = (value) => {
        console.log("value", value)
        //调接口
        this.getclassRoomList(value)
    }

    /**
     * 下载数据
     */
    download = () => {
        let { classRoomId } = this.state;
        //下载教室表格
        let url = "/api/data/resources/downClaRoom";
        this.props.downLoad(classRoomId, url, 2)

    }

    /**
    *分页
    *
    * @param {*} pageNum (页码)
    */
    jumpPage =(pageNum) => {
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
        let { classRoomId, classRoomList, pageNum, pageSize, visible } = this.state;
        let { isLoading, total, data } = this.props
        const list = [{
            title: '教室',
            key: 'classRoom'
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
                    return <div title={text || '--'} style={{ color: "#333333" }}>{text || "--"}</div>
                }
            })
        })
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
                        <div className="zxq-colleSel">
                            <span> 教室： </span>
                            <SelInput
                                width={200}
                                onChange={this.selChange}
                                onSearch={this.searchData}
                                placeholder="请选择/搜索"
                                list={classRoomList.length ? classRoomList : []} //下拉数据
                                value={classRoomId} //选中项id
                                allowClear
                            />
                        </div>
                        {
                            data && data.length
                                ? <div className="zxq-tabDownload" onClick={this.download}>
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
                                rowKey={(record, index) => index}
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
                { //下载错误模态框
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

export default BuildTable;