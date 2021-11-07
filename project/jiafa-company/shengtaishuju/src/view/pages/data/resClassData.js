/*
 * @Author: lxx  
 * @Date: 2020-01-23 09:43:09 
 * @Last Modified by: tj
 * @Last Modified time: yyyy-11-Tu 10:13:14
 * 资源情况-教室统计
 */
import React, { Component } from 'react';
import '../../../style/zxqstatic.scss';
import moment from 'moment';
import Menu from '../../components/data/zxq-components/zxq-menu';
import Dataheader from '../../components/data/zxq-components/zxq-header';
import BuildTable from "../../components/data/zxq-components/zxq-claBuild";
import CollegeTable from "../../components/data/zxq-components/zxq-claCollege";
import Statis from "../../components/data/zxq-components/zxq-datastatis";
import G from "../../../config/g";
import zxqRuest from '../../../request/zxq_request'
import { connect } from 'react-redux';
import { ws_saveGlobalData } from '../../../redux/ws-global.reducer';
import { message } from 'antd'
import { request } from '../../../util/request'
const {
    buildData,
    staticData,
    classData,
    classStaticData,
    BuildList,
    clRoomList
} = zxqRuest;
@connect(state => state,
    {
        ws_saveGlobalData,
    })
class ResClassData extends Component {
    constructor(props) {
        super(props);
        let tabArray = G.ISCED_tabArray || [];
        let roleType = G.ISCED_curRoleInfo.roleType
        this.state = {
            classRoomshow: true,
            statisData: {}, //统计数据
            orgName: tabArray.length && tabArray[tabArray.length - 1].orgName || "",
            tableType: tabArray.length ? (roleType==="1" || roleType === '2') ? tabArray.length : tabArray.length + 1 : 1,   //1教学楼2教室3开课单位4教师
            page: "",
            isLoading: true,
            dataList: [],
            transData: {    //传输的数据
                dataList: [], //表格数据
                selDatetype: 1, //时间类型（1日2周3月）
                currentTime: moment(new Date()).format('YYYY-MM-DD'),//默认为今天的日期
                semesterId: G.ISCED_semesterList ? G.ISCED_semesterList[0].semesterId : "",   //学年学期id 
                type: "" //返回上一级状态
            },
            param: {
                semesterId: G.ISCED_cutSemesterData.semesterId, //学年学期id
                selTime: moment(new Date()).format('YYYY-MM-DD'),//默认为今天的日期
                timeType: tabArray.length && tabArray[tabArray.length - 1].timeType || 1, // 时间类型（1日2周3月）
                teachingBuildId: tabArray.length ? tabArray[tabArray.length - 1].teachingBuildId : "", // 教学楼id
                pageNum: 1,
                pageSize: 20,
                classRoomId: tabArray.length ? tabArray[tabArray.length - 1].classRoomId : "" // 教室id
            }

        };
    }

    /**
     * 改变表格类型 1教学楼2教室
     */
    changetable = (state, type) => {
        const { roleType } = G.ISCED_curRoleInfo;
        let transData = this.state.transData;
        transData.type = type;
        this.setState({
            tableType: state,
            transData
        }, () => {
            //置顶
            this.node.scrollIntoView();
            let array = G.ISCED_tabArray || []
            let array1 = (roleType==="1" || roleType === '2') ? array.slice(0, state) : array.slice(0, state - 1)
            this.props.ws_saveGlobalData(array1, 'ISCED_tabArray')
            if (array1.length == 1) {
                this.setState({
                    orgName: array1[0].orgName
                })
            }
        })
    }
    /**
    * 返回上一级
    */
    changeback = (page) => {
        this.setState({
            page
        })
    }
    /**
     * 设置头部统计数据
     */
    setStaticData = (statisData) => {
        this.setState({
            statisData
        })
    }
    /**
     * 选择时间类型
     */
    selDatetype = (selDatetype) => {
        let { transData } = this.state;
        transData.selDatetype = selDatetype;
        this.setState({
            transData
        })
    }
    /**
   * 当前统计时间
   */
    currentTime = (currentTime) => {
        let { transData } = this.state;
        transData.currentTime = currentTime;
        this.setState({
            transData
        })
    }
    /**
       * 当前选择的学期
       */
    semesterId = (semesterId) => {
        let { transData } = this.state;
        transData.semesterId = semesterId;
        this.setState({
            transData
        })
    }
    /**
    *更新机构名
    */
    setOrgName = (orgName) => {
        this.setState({
            orgName
        })
    }

    /**
     * 层级判断
     * @param {Number} id tableType 1校级教学楼 2教学楼教室
     */
    getDom = (id) => {
        let { dataList, param, total, isLoading } = this.state;
        switch (id) {
            case 1:
                return <CollegeTable
                    isLoading={isLoading}
                    data={dataList}
                    param={param}
                    changeParam={this.changeParState}
                    setCurSgin={this.getCurSign}
                    downLoad={this.downLoadFile}

                />
            case 2:
                return <BuildTable
                    isLoading={isLoading}
                    data={dataList}
                    total={total}
                    param={param}
                    setCurSgin={this.getCurSign}
                    changeParam={this.changeParState}
                    downLoad={this.downLoadFile}
                />
        }
    }

    /**
     * 获取参数变更值
     * @param {Number} type tableType 1教学楼 2教室层级
     * @param {Object} obj 参数
     */
    changeParState = (type, obj) => {
        let { param } = this.state
        if (param.selTime !== obj.selTime) { //选择的时间变更
            // 顶部筛选变更，分页重置
            param.pageNum = 1
        }
        if (type === 2 && (param.classRoomId !== obj.classRoomId)) {
            // 教师层级
            param.classRoomId = obj.classRoomId
        }
        if (obj.pageNum === 1) {
            // 请求顶部统计
            this.getStaticData(type, param)
        }
        if(type === 2&&(param.teachingBuildId!==obj.teachingBuildId)){
            param.teachingBuildId = obj.teachingBuildId
        }
        console.log('param', param)
        this.setState({
            param
        })
        this.getTableData(type, param)
    }

    /**
     * 获取各层级静态数据
     * @param {Number} curSign 层级 1教学楼 2教室
     */
    getStaticData = (curSign, obj) => {
        let params = {
            semesterId: obj.semesterId,
            selTime: obj.selTime,
            timeType: obj.timeType,
            teachingBuildId: obj.teachingBuildId
        }
        if (curSign === 1) {
            // 教学楼
            staticData(params).then((res) => {
                if (res.data.result && res.data.data) {
                    let statisData = res.data.data;
                    this.setState({
                        statisData
                    })
                } else {
                    message.error(res.data.message)
                }
            })
        } else if (curSign === 2) {
            // 教室
            classStaticData(params).then((res) => {
                if (res.data.result) {
                    let statisData = res.data.data;
                    this.setState({
                        statisData
                    })
                }
            })
        }
    }

    /**
     * 获取表格数据
     * @param {Number} curSign  层级 1教学楼 2教室
     * @param {Object} obj 表格请求参数
     */
    getTableData = (curSign, obj) => {
        // let { param } = this.state
        let params = JSON.parse(JSON.stringify(obj))
        console.log('params', params,curSign)
        //接口
        this.setState({
            isLoading: true,
        })
        if (curSign === 1) {
            delete params.classRoomId
            // 教学楼
            buildData(params).then((res) => {
                if (res.data.result && res.data.data) {
                    var tableData = res.data.data;
                    tableData.map((item) => {
                        item.classRoomCouRate = item.classRoomCouRate + "%";
                        item.classRoomUseRatio = item.classRoomUseRatio + "%";
                        item.classRoomUsageRate = item.classRoomUsageRate + "%";
                    })
                    this.setState({
                        dataList: tableData
                    })
                } else {
                    message.error(res.data.message)
                }
                this.setState({
                    isLoading: false,
                })

            })
        } else if (curSign === 2) {
            // 教室
            classData(params).then((res) => {
                if (res.data.result && res.data.data) {
                    let tableData = res.data.data;
                    let total = res.data.total;
                    tableData.map((item) => {
                        item.classRoomCouRate = item.classRoomCouRate + "%";
                        item.classRoomUseRatio = item.classRoomUseRatio + "%";
                        item.classRoomUsageRate = item.classRoomUsageRate + "%";
                    })
                    this.setState({
                        dataList: tableData,
                        total
                    })
                } else {
                    message.error(res.data.message)
                }
                this.setState({
                    isLoading: false,
                })
            })
        }
    }

    /**
     * 下载文档
     * @param {String} id id入参
     * @param {String} url 下载地址
     * @param {Number} curSign 
     */
    downLoadFile = (id, url, curSign) => {
        let { param, orgName } = this.state;
        let params = {
            selTime: param.selTime,
            timeType: param.timeType,
            semesterId: param.semesterId,
            teachingBuildId: param.teachingBuildId
        }
        if (curSign == 1) {
            params["teachingBuildId"] = id;
        } else {
            params["classRoomId"] = id;
            params["teachingBuildName"] = orgName;

        }
        request(url, params, (res, name) => {
            let blob = new Blob([res], { type: 'application/x-xls' });
            saveAs(blob, name)
        }, (res) => {
            message.warning('下载失败，请刷新页面或者联系管理员', 2)
        }, true)
    }

    /**
     * 表格整行点击回调
     * @param {Number} curSign 层级标识
     * @param {Object} record 行信息
     */
    getCurSign = (curSign, record) => {
        const { roleType, belongOrgId, belongOrgName } = G.ISCED_curRoleInfo;
        let orgName = "";
        let array;
        let pinkInfo = this.state.param
        if (roleType==="1" || roleType === '2') {
            array = [{
                curSign: 1,
                ...pinkInfo,
                orgName: record.collegeName
            }]
        } else {
            array = [{
                curSign: 2,
                ...pinkInfo,
                orgName: record.teachingBuildName
            }]
        }
        if (curSign === 1) {
            orgName = record.collegeName
        } else if (curSign === 2) {
            orgName = record.teachingBuildName
        }
        this.setState({
            tableType: curSign,
            orgName
        })
        if (curSign === 2) {
            let obj = this.state.param
            obj.teachingBuildId = record.teachingBuildId
            console.log('obj', obj)
            // 下钻到教室，请求对应数据
            this.getTableData(2, obj)
            this.getStaticData(2, obj)
            let secObj = {
                curSign: 2,
                ...obj,
                orgName
            }
            if (roleType==="1" || roleType === '2') {
                array.push(secObj)
            }
        }
        //置顶
        this.node.scrollIntoView();
        this.props.ws_saveGlobalData(array, 'ISCED_tabArray')
    }

    render() {
        let { tableType, statisData, classRoomshow, orgName, param } = this.state;
        return (
            <div className="zxq-dataContent" ref={(node) => { this.node = node }}>
                <Menu //面包屑导航
                    tabletype={tableType}
                    param={param}
                    changetable={this.changetable}
                    changeParam={this.changeParState}
                    setStaticData={this.setStaticData}
                />
                <div className="zxq-maincotent" id="zxq-maincotent">
                    <Dataheader
                        tabletype={tableType}
                        param={param}
                        changeParam={this.changeParState}
                    />
                    <div className="zxq-mainCont">
                        <div className="zxq-orgName">{orgName}</div>
                        <Statis
                            statisData={statisData}
                            changeList={classRoomshow} />
                        {
                            this.getDom(tableType)
                        }
                        {/* <DataTable
                            changetable={this.changetable.bind(this)}
                            setStaticData={this.setStaticData.bind(this)}
                            setOrgName={this.setOrgName.bind(this)}
                            transData={transData}
                            tableType={tableType}
                            page={page}
                        // dataList={dataList} 

                        /> */}

                    </div>

                </div>
            </div>

        );
    }
}

export default ResClassData;