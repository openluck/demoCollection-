/*
 * @Author: zxq 
 * @Date: 2020-01-23 09:43:56 
 * @Last Modified by: lxx
 * @Last Modified time: 2020-08-13 10:56:13
 * 资源情况-教师统计
 */
import React, { Component } from 'react';
import '../../../style/zxqstatic.scss';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import Menu from '../../components/data/zxq-components/zxq-menu';
import Dataheader from '../../components/data/zxq-components/zxq-header';
import DataTable from "../../components/data/zxq-components/zxq-teacherTable";
import CollegeTable from "../../components/data/zxq-components/zxq-teaCollege";
import TeacherTable from "../../components/data/zxq-components/zxq-teaTeacher";
import Statis from "../../components/data/zxq-components/zxq-datastatis";
import zxqRuest from '../../../request/zxq_request'
import G from "../../../config/g";
import { ws_saveGlobalData } from '../../../redux/ws-global.reducer';
import { message } from 'antd'
import { request } from '../../../util/request'
const {
    shoolData,
    teaStaticData,
    teacherData,
    teacherStaData
} = zxqRuest;
@withRouter
@connect(state => ({ ...state.ws_global_reducer }), {
    //菜单点击 将当前页置为首页 curSign置为1 或 2
    ws_saveGlobalData
})
class ResTeaData extends Component {
    constructor(props) {
        super(props);
        // let tabletype = 1;
        // if (G.ISCED_curRoleInfo && G.ISCED_curRoleInfo.roleId && G.ISCED_curRoleInfo.roleId === "1") {
        //     tabletype = 2
        // }
        // console.log(tabletype, "tabletypetabletype初始化")
        let tabArray = G.ISCED_tabArray || [];
        let roleType = G.ISCED_curRoleInfo.roleType
        console.log(tabArray)
        let curTime_ = tabArray.length && tabArray[tabArray.length - 1].timeType == '2' ? '第' +
            tabArray.length && tabArray[tabArray.length - 1].selTime + '周' :
            tabArray.length && tabArray[tabArray.length - 1].selTime || G.ISCED_cutSemesterData.isCutSemester === "1"
                ? moment(new Date()).format("YYYY.MM.DD")
                : G.ISCED_cutSemesterData.startTime
        this.state = {
            classRoomshow: true,
            tableType: tabArray.length ? (roleType==="1" || roleType === '2') ? tabArray.length : tabArray.length + 1 : (roleType==="3" || roleType === '4') ? 2 : 1,   //1开课单位2教师
            statisData: {}, //统计数据
            dataList: [], //表格数据
            // timeType: 1, //时间类型（1日2周3月）
            orgName: tabArray.length && tabArray[tabArray.length - 1].orgName || G.ISCED_curRoleInfo.belongOrgName,
            collegeId: tabArray.length && tabArray[tabArray.length - 1].collegeId || tabArray.length && tabArray[tabArray.length - 1].collegeId || G.ISCED_curRoleInfo.belongOrgId, // 机构id
            // page: "", // 页码
            // selTime: moment(new Date()).format('YYYY-MM-DD'),//默认为今天的日期
            // currentTime:"2020-02-24",
            semesterId: G.ISCED_cutSemesterData.semesterId, //学年学期id
            isLoading: true, // 加载中
            total: 0, // 表格总数
            param: {
                collegeId: tabArray.length > 1 ? tabArray[tabArray.length - 1].collegeId : (roleType==="3" || roleType === '4') ? G.ISCED_curRoleInfo.belongOrgId : "", // 机构id
                semesterId: G.ISCED_cutSemesterData.semesterId, //学年学期id
                selTime: moment(new Date()).format('YYYY-MM-DD'),//默认为今天的日期
                pageNum: 1,
                pageSize: 20,
                timeType: tabArray.length && tabArray[tabArray.length - 1].timeType || 1, // 时间类型（1日2周3月）
                teacherId: tabArray.length && tabArray[tabArray.length - 1].teacherId || "" // 教师id
            } // 参数
        };
    }

    componentWillReceiveProps(props) {
        // 补全回退参数更新，及请求数据
    }

    componentDidMount() {
        const { selTime } = this.state.param;
        let params = this.state.param;
        let tabArray = G.ISCED_tabArray || []
        let selTime_ = tabArray.length && tabArray[tabArray.length - 1].selTime || selTime
        let curTime_ = tabArray.length ? tabArray[tabArray.length - 1].timeType == '2' ? '第' +
            (tabArray[tabArray.length - 1].selTime) + '周' : tabArray[tabArray.length - 1].selTime :
            tabArray.length && tabArray[tabArray.length - 1].selTime || G.ISCED_cutSemesterData.isCutSemester === "1"
                ? moment(new Date()).format("YYYY.MM.DD")
                : G.ISCED_cutSemesterData.startTime;
        params.selTime = selTime_;
        console.log(params)
        if (tabArray.length) {
            params.selTime = selTime_;
            this.setState({
                param: params
            })
        } else {
            this.setState({
                param: params
            })
        }
    }

    /**
    * 返回上一级
    */
    // changeback = (page) => {
    //     this.setState({
    //         page
    //     })
    // }

    /**
     * 改变表格类型 1开课单位2教师
     */
    changetable = (state) => {
        const { roleType } = G.ISCED_curRoleInfo;
        this.setState({
            tableType: state,
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
        this.setState({
            timeType: selDatetype
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
  * 当前统计时间
  */
    currentTime = (currentTime) => {
        this.setState({
            selTime: currentTime
        })
    }
    /**
       * 当前选择的学期
       */
    semesterId = (semesterId) => {
        this.setState({
            semesterId
        })
    }

    /**
     * 层级判断
     * @param {Number} id tableType 1校级 2院级
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
                return <TeacherTable
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
     * @param {Number} type tableType
     * @param {Object} obj 参数
     */
    changeParState = (type, obj) => {
        let param = { ...this.state.param }
        if (param.selTime !== obj.selTime) {
            // 顶部筛选变更，分页重置
            param.pageNum = 1
        }
        if (type === 2 && (param.teacherId !== obj.teacherId)) {
            // 教师层级
            param.teacherId = obj.teacherId
        }
        if (obj.pageNum === 1) {
            // 请求顶部统计
            this.getStaticData(type, param)
        }
        console.log('param', param)
        this.setState({
            param
        })
        this.getTableData(type, param)
    }

    /**
     * 获取各层级静态数据
     * @param {Number} curSign 层级 1校级 2院级
     */
    getStaticData = (curSign, obj) => {
        let params = {
            semesterId: obj.semesterId,
            selTime: obj.selTime,
            timeType: obj.timeType,
            collegeId: obj.collegeId
        }
        if (curSign === 1) {
            // 校级
            teaStaticData(params).then((res) => {
                if (res.data.result && res.data.data) {
                    let statisdata = res.data.data;
                    this.setState({
                        statisData: statisdata
                    })
                } else {
                    message.error(res.data.message)
                }
            })
        } else if (curSign === 2) {
            // 院级
            teacherStaData(params).then((res) => {
                if (res.data.result) {
                    let statisdata = res.data.data;
                    this.setState({
                        statisData: statisdata
                    })
                }
            })
        }
    }

    /**
     * 获取表格数据
     * @param {Number} curSign  层级 1校级 2院级
     * @param {Object} obj 表格请求参数
     */
    getTableData = (curSign, obj) => {
        // let { param } = this.state
        let params = JSON.parse(JSON.stringify(obj))
        console.log('params', params)
        //接口
        this.setState({
            isLoading: true,
        })
        if (curSign === 1) {
            delete params.teacherId
            // 校级
            shoolData(params).then((res) => {
                if (res.data.result && res.data.data) {
                    var tableData = res.data.data;
                    tableData.map((item) => {
                        item.multiUseRatio = item.multiUseRatio !== null ? `${item.multiUseRatio}%` : '--';
                    })
                    this.setState({
                        dataList: tableData,
                    })
                } else {
                    message.error(res.data.message)
                }
                this.setState({
                    isLoading: false
                })
            })
        } else if (curSign === 2) {
            // 院级
            teacherData(params).then((res) => {
                if (res.data.result && res.data.data) {
                    let teaTabData = res.data.data;
                    let total = res.data.total;
                    teaTabData.map((item) => {
                        item.multiUseRatio = item.multiUseRatio !== null ? `${item.multiUseRatio}%` : '--';
                    })
                    this.setState({
                        dataList: teaTabData,
                        total
                    })
                } else {
                    message.error(res.data.message)
                }
                this.setState({
                    isLoading: false
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
            collegeId: param.collegeId
        }
        if (curSign == 1) {
            params["collegeId"] = id;
        } else if(curSign === 2) {
            params["teacherId"] = id;
            params["collegeName"] = orgName;

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
        this.setState({
            tableType: curSign,
            orgName: record.collegeName
        })
        let array;
        let pinkInfo = this.state.param
        if (roleType==="1" || roleType === '2') {
            array = [{
                curSign: 1,
                ...pinkInfo,
                orgName: belongOrgName
            }]
        } else {
            array = [{
                curSign: 2,
                ...pinkInfo,
                orgName: belongOrgName
            }]
        }
        // if (G.ISCED_tabArray.length) {
        //     array = G.ISCED_tabArray
        // }
        if (curSign === 2) {
            let obj = this.state.param
            obj.collegeId = record.collegeId
            console.log('obj', obj)
            // 下钻到院级，请求对应数据
            this.getTableData(2, obj)
            this.getStaticData(2, obj)
            let secObj = {
                curSign: 2,
                ...obj,
                orgName: record.collegeName
            }
            if (roleType==="1" || roleType === '2') {
                array.push(secObj)
            }
        }
        //置顶
        this.node.scrollIntoView();

        this.props.ws_saveGlobalData(array, 'ISCED_tabArray')

    }

    /**
     * 页面切换
     * @param {Number} page 页码
     */
    changePage = (page) => {
        this.setState({
            pageNum: page
        })
        this.node.scrollIntoView();
    }

    render() {
        let { tableType, statisData, classRoomshow, orgName, param } = this.state;
        return (
            <div className="zxq-dataContent" ref={(node) => { this.node = node }}>
                <Menu
                    type="teacher"
                    tabletype={tableType}
                    param={param}
                    changetable={this.changetable}
                    // changeback={this.changeback}
                    changeParam={this.changeParState}
                    setStaticData={this.setStaticData}
                />
                <div className="zxq-maincotent">
                    <Dataheader
                        // selDatetype={this.selDatetype}
                        // currentTime={this.currentTime}
                        // semesterId={this.semesterId}
                        tabletype={tableType}
                        param={param}
                        changeParam={this.changeParState}
                    />
                    <div className="zxq-mainCont">
                        <div className="zxq-orgName">{orgName}</div>
                        <Statis
                            statisData={statisData}
                            changeList={classRoomshow}
                            type="teacher" />
                        {
                            this.getDom(tableType)
                        }
                        {/* <DataTable
                            changetable={this.changetable.bind(this)}
                            setStaticData={this.setStaticData.bind(this)}
                            setOrgName={this.setOrgName.bind(this)}
                            dataList={dataList}
                            tabletype={tabletype}
                            selDatetype={selDatetype} page={page}
                            semesterId={semesterId}
                            currentTime={currentTime}

                        /> */}
                    </div>

                </div>
            </div>
        );
    }
}

export default ResTeaData;