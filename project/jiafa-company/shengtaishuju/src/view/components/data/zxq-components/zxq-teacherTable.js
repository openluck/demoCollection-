
/*
 * @Author:zxq
 * @Date: 2020-02-10 13:51:43 
 * @Last Modified by: yrj
 * @Last Modified time: 2020-07-20 15:23:55
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
import { connect } from 'react-redux';
import G from '../../../../config/g';
const {
    shoolData,
    teaStaticData,
    teacherData,
    teacherStaData
} = zxqRuest;
const { Option } = Select;
@connect(state => state,
    {
        ws_saveGlobalData,
    })
class DataTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableData: [],  //表格数据
            pageNum: 1,  //当前页码()
            pageSize: 20,  //条数
            total:0,
            isLoading: false,
            tabletype: 1,     //1开课单位2教师   
            timeType: 1, //时间类型（123日周月）
            selTime: moment(new Date()).format('YYYY-MM-DD'),//默认为今天的日期
            semesterId: G.ISCED_cutSemesterData.semesterId, //学年学期id
            visible: false,  //下载错误模态框
            collegeId: '',    //开课单位id
            collegeName: "",
            teacherId: '',
            collegeList: [],   //开课单位
            teacherList: [],
            statisdata: {},
            teaTabData: [],//教师表格数据
            roleType: G.ISCED_curRoleInfo.roleType ||"", //(0:校级 1:院级)
            page: "",//返回标志 
            info:this.props.ws_global_reducer.ISCED_saveInfo 
        };

    }
    componentWillReceiveProps(props) {
        let { selDatetype, currentTime, tabletype, semesterId, page } = props;
        let roleType = this.state.roleType;
        this.setState({
            tabletype,
            timeType: selDatetype,
            semesterId
        })
        if (currentTime != this.state.selTime) {
            this.setState({
                selTime: currentTime,
            }, () => {
                if(roleType==="1" || roleType === '2'){
                    //根据筛选条件，更新数据
                    this.getStaticData();
                    this.getShoolData();
                }
                else{
                    this.getTeacherData();
                    this.getTeacherStaData();
                }
               
            })
        }

        if (page != this.state.page && tabletype != this.state.tabletype) {
            this.setState({
                page,
                collegeId: "",
                teacherId: ""
            }, () => {
                //根据筛选条件，请求教学楼表格,教学楼列表和头部统计数据
                if(roleType==="1" || roleType === '2'){
                    this.getStaticData();
                    this.getShoolData();
                }
                else{
                    this.getTeacherData();
                    this.getTeacherStaData();
                }
            })
        }
    }
    // get teacherList(){
    //     return  (G.ISCED_teacherList || []).map((value) => {
    //          return{
    //              id: value.teacherId,
    //              name: value.teacherName
    //          }
    //      })
       
     
    // }
    componentDidUpdate() {
        // let info = this.props.ws_global_reducer.ISCED_saveInfo;
        // console.log("info",info,this.state.info)
        // if(info!=this.state.info){
        //     if(info == "1"){
        //         console.log("jinlailll")
        //         this.props.changetable(1);
        //         this.getStaticData();
        //         this.getShoolData();
        //     }
          
        // }
      
      
      }
    componentDidMount() {
       //获取开课单位数据
       let List = G.ISCED_collegeList || [];
       let collegeList = [];
       List.map((value) => {
           collegeList.push({
               id: value.collegeId,
               name: value.collegeName
           })
       })
     
        let { collegeId,roleType } = this.state;
        if (roleType==="3" || roleType === '4') {
            collegeId = G.ISCED_curRoleInfo.belongOrgId;
            this.setState({
                collegeId,
    
            },()=>{
                // this.getTeacherData();
                this.getTeacherStaData();
                this.getTeacherList();
            })
        }
        else{
            //请求开课单位和头部的数据
            this.getStaticData();
            this.getShoolData();

        }
        this.setState({
            collegeList,

        })
        let tabletype = this.props.tabletype;
        console.log(tabletype,' 我 实际收到的 tabletype')
      
        if(tabletype===2){
            let collegeName=G.ISCED_curRoleInfo.belongOrgName;
            this.setState({
                collegeName,
            })
        }else{
           
        }
    }
    /**
      * 获取统计初始数据
      */
    getStaticData() {
        let { selTime, timeType, semesterId, collegeId } = this.state;
        let param = {
            selTime,
            timeType,
            collegeId,
            semesterId

        }
        //接口
        teaStaticData(param).then((res) => {
            if (res.data.result && res.data.data) {
                let statisdata = res.data.data;
                this.props.setStaticData(statisdata)

            }
            else {
                message.error(res.data.message)

            }
        })

    }
    /**
    * 获取开课单位初始数据
    */
    getShoolData(id) {
        let { selTime, timeType, semesterId, collegeId, pageNum, pageSize } = this.state;
        let params = {
            collegeId: id ? id : collegeId,
            selTime,
            timeType,
            pageNum,
            pageSize,
            semesterId
        }
        //接口
        this.setState({
            isLoading: true,
        })
        shoolData(params).then((res) => {
            if (res.data.result && res.data.data) {
                var tableData = res.data.data;

                tableData.map((item) => {
                    item.multiUseRatio =item.multiUseRatio!==null? `${item.multiUseRatio}%`:'--';
                })
                this.setState({
                    isLoading: false,
                    tableData,

                })
            }
            else {
                message.error(res.data.message)

            }
        })
    }
    /**
      * 获取教师表格数据
      */
    // getTeacherData(id) {
    //     let { selTime, timeType, collegeId, semesterId, teacherId, pageNum, pageSize, } = this.state;
    //     let params = {
    //         teacherId: id ? id : teacherId,
    //         selTime,
    //         timeType,
    //         collegeId,
    //         pageNum,
    //         pageSize,
    //         semesterId

    //     }
    //     this.setState({
    //         isLoading: true,
    //     })
    //     //接口
    //     teacherData(params).then((res) => {
    //         if (res.data.result && res.data.data) {
    //             let teaTabData = res.data.data;
    //             let total = res.data.total;
    //             teaTabData.map((item) => {
    //                 item.multiUseRatio =item.multiUseRatio!==null? `${item.multiUseRatio}%`:'--';
    //             })
    //             this.setState({
    //                 isLoading: false,
    //                 teaTabData,
    //                 total
    //             })
    //         }
    //         else {
    //             message.error(res.data.message)

    //         }
    //     })

    // }
    /**
     * 获取教师头部统计数据
     *  @param {*} teachingBuildId
     */
    getTeacherStaData(Id) {
        let { selTime, timeType, semesterId, collegeId } = this.state;
        let params = {
            semesterId,
            selTime,
            timeType,
            collegeId: Id ? Id : collegeId
        }
        //接口
        teacherStaData(params).then((res) => {
            if (res.data.result) {
                let statisdata = res.data.data;
                this.props.setStaticData(statisdata);

            }
        })
    }

    /**
    * 获取教师下拉列表
    */
    getTeacherList(value) {
        let { collegeId,semesterId} = this.state;
        let data = {
            searchValue: value ? value:"",
            collegeId:collegeId,
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
    clickRow = (record) => {
        let id = record.collegeId;
        let shBuildName = record.collegeName;
        let { tabletype } = this.state;
        if (tabletype == 1) {
            this.props.changetable(2);
            this.props.setOrgName(shBuildName);
            this.setState({
                page: "",
                teacherId: "",
                collegeName: shBuildName,
                collegeId: id,
                collegeList:[]
                // classRoomId:"",
            }, () => {
                // this.getTeacherData();
                this.getTeacherStaData(id);
                this.node.scrollIntoView();
                //获取教师下拉数据
                this.getTeacherList()
            })
        }


    }

    /*** 选择开课单位*/
    selSchool = (collegeId) => {
        this.setState({
            collegeId: collegeId.id
        }, () => {
            this.getShoolData(collegeId.id)
        })
    }
    /*** 获取开课单位下拉列表*/
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
            else{
                this.setState({
                    collegeList:[]
                })

            }
        })
    }
    /*** 搜索开课单位和教师数据*/
    searchData = (type, value) => {
        console.log("开始搜索",value)
        switch (type) {
            case "school":
                //获取开课单位数据
                this.getShoolList(value);
                break;
            case "teacher":
                //获取教师数据
                this.getTeacherList(value);
                break;
            default:
                break;

        }
    }

    /*** 选择教师*/
    selTeacher = (teacherId) => {
        this.setState({
            teacherId: teacherId.id,
            pageNum:1
        }, () => {
            // this.getTeacherData(teacherId.id)

        })
    }

    /**
     * 下载数据
     */
    download = () => {
        let tabletype = this.props.tabletype;
        let { collegeId, teacherId } = this.state;
        console.log(teacherId,'teacherIdteacherIdteacherId')
        if (tabletype == 1) {
            //下载学院
            let url = "/api/data/resources/downbegCollege";
            this.dowLoadTable(collegeId, url, tabletype)
        }
        else {
            //下载教师表格
            let url = "/api/data/resources/downteaInfor";
            this.dowLoadTable(teacherId, url, tabletype)
        }

    }

    /*** 下载表格 */
    dowLoadTable = (Id, url, tabletype) => {
        let { selTime, timeType, semesterId, collegeName, collegeId } = this.state;
        let params = {
            selTime,
            timeType,
            semesterId,
            collegeId
        }
        if (tabletype == 1) {
            params["collegeId"] = Id;

        }
        else {
            params["teacherId"] = Id;
            params["collegeName"] = collegeName;

        }
        // if(params["collegeId"]==""){
        //     let  List = G.ISCED_collegeList || [];
        //     params["collegeId"] = List[0].collegeId;
        // }
        request(url, params, (res, name) => {
            let blob = new Blob([res], { type: 'application/x-xls' });
            if (tabletype == 1) {
                // saveAs(blob,`资源情况-教师统计-${selTime}.xlsx`)
                saveAs(blob, name)

            }
            else {
                // saveAs(blob,`资源情况-教师统计（${collegeName}）-${selTime}.xlsx`)
                saveAs(blob, name)
            }
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
    *分页
    *
    * @param {*} pageNum (页码)
    */
    jumpPage(pageNum) {
        this.setState({
            pageNum
        }, () => {
            //教师
            this.getTeacherData();
        })
        this.node.scrollIntoView();

    }

    render() {
        let { collegeList, roleType, collegeId, total, teacherList, teacherId, teaTabData,tableData, pageNum, pageSize, visible, isLoading } = this.state;
        let tabletype = this.props.tabletype;
        // 配置多媒体开关
        let multimediaUse = G.ISCED_setInfo.multimediaUse;
        const column = [
            {
                title: tabletype == 1 && (roleType==="1" || roleType === '2')  ? '开课单位' : "教师",
                dataIndex: tabletype == 1 && (roleType==="1" || roleType === '2') ? 'collegeName' : "teacherName",
                key: tabletype == 1  && (roleType==="1" || roleType === '2') ? 'collegeName' : "teacherName",
                render: (text, record) => {
                    return <div title={text || '--'} style={tabletype == 2 || (roleType==="3" || roleType === '4') ? { color: "#333333" } : { color: "#3498db"}}>{text || "--"}</div>
                }

            },
            {
                title: '工作量',
                dataIndex: 'teacherWorkLoad',
                key: 'teacherWorkLoad',
                render: (text, record) => {
                    return <div title={text || '--'} style={tabletype == 2 || (roleType==="3" || roleType === '4') ? { color: "#333333" } : { color: "#3498db"}}>{text || "--"}</div>
                }
            },
        ];
        const  muliUseColumn= [
            {
                title: tabletype == 1 && (roleType==="1" || roleType === '2')  ? '开课单位' : "教师",
                dataIndex: tabletype == 1 && (roleType==="1" || roleType === '2') ? 'collegeName' : "teacherName",
                key: tabletype == 1  && (roleType==="1" || roleType === '2') ? 'collegeName' : "teacherName",
                render: (text, record) => {
                    return <div title={text || '--'} style={tabletype == 2 || (roleType==="3" || roleType === '4') ? { color: "#333333" } : { color: "#3498db"}}>{text || "--"}</div>
                }

            },
            {
                title: tabletype == 1 && (roleType==="1" || roleType === '2')  ?'教师人均工作量':'工作量',
                dataIndex: 'teacherWorkLoad',
                key: 'teacherWorkLoad',
                render: (text, record) => {
                    return <div title={text || '--'} style={tabletype == 2 || (roleType==="3" || roleType === '4') ? { color: "#333333" } : { color: "#3498db"}}>{text || "--"}</div>
                }
            },
            {
                title:'多媒体使用率',
                dataIndex: 'multiUseRatio' ,
                key:  'multiUseRatio',
                render: (text, record) => {
                    return <div title={text || '--'} style={tabletype == 2 || (roleType==="3" || roleType === '4')  ? { color: "#333333" } : { color: "#3498db"}}>{text || "--"}</div>
                }
            },
        ];
        console.log("multimediaUse",multimediaUse)
        let columns = multimediaUse != 0 ? muliUseColumn :column;
        return (     
            <>            
            {(roleType==="3" || roleType === '4') ? 
                <div className="zxq-table" ref={(node) => { this.node = node }}>
                    <div className="zxq-search">
                            <div className="zxq-colleSel">
                                <span> 教师： </span>
                                <SelInput
                                    width={200}
                                    onChange={this.selTeacher.bind(this)}
                                    onSearch={this.searchData.bind(this, "teacher")}
                                    value={teacherId}  //选中项id
                                    list={teacherList} //下拉数据
                                   
                                />

                            </div>
                        {teaTabData ?
                            <div className="zxq-tabDownload" onClick={this.download.bind(this)}>
                                <SVG type="de_download" className="zxq-download " />
                                下载
                            </div>
                            : ""}

                    </div>

                    <div className="zxq-tableContent">
                        <div className="zxq-antTable">
                            <Table
                                columns={columns}
                                dataSource={teaTabData}
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
                                    jumpPage={this.jumpPage.bind(this)}
                                />
                        </div>
                    </div>

                </div>
                    : 
                    <div className="zxq-table" ref={(node) => { this.node = node }}>
                        <div className="zxq-search">
             
                                <div className="zxq-colleSel" style={{'display':tabletype == 1?'block':'none'}}>
                                    <span> 开课单位： </span>
                                    <SelInput
                                        width={200}
                                        onChange={this.selSchool.bind(this)}
                                        onSearch={this.searchData.bind(this, "school")}
                                        value={collegeId}  //选中项id
                                        list={collegeList} //下拉数据
                                    />
                                </div>
                                 <div className="zxq-colleSel" style={{'display':tabletype == 2?'block':'none'}}>
                                    <span> 教师： </span>
                                    <SelInput
                                        width={200}
                                        onChange={this.selTeacher.bind(this)}
                                        onSearch={this.searchData.bind(this, "teacher")}
                                        value={teacherId}  //选中项id
                                        // list={  this.teacherList} //下拉数据
                                        list={teacherList} //下拉数据
                                    />

                                </div>
                           
                            {tableData ?
                                <div className="zxq-tabDownload" onClick={this.download.bind(this)}>
                                    <SVG type="de_download" className="zxq-download " />
                                    下载
                </div>
                                : ""}

                        </div>

                        <div className="zxq-tableContent">
                            <div className="zxq-antTable">
                                <Table
                                    columns={columns}
                                    dataSource={tabletype == 1?tableData:teaTabData}
                                    loading={isLoading}
                                    locale={{ emptyText: <CollageNoData /> }}
                                    rowKey={(record, index) => index}
                                    pagination={false}
                                    onRow={record => {
                                        return {
                                            onClick: e => this.clickRow(record), // 点击行
                                        };
                                    }}
                                />
                                {tabletype == 2 ?
                                    <Fy
                                        pageSize={pageSize}
                                        pageIndex={pageNum}
                                        total={total}
                                        jumpPage={this.jumpPage.bind(this)}
                                    />
                                    : ""}

                            </div>
                        </div>

                    </div>



                }
                <ErrModal
                    onCancel={() => {
                        this.setState({
                            visible: false
                        })
                    }}
                    visible={visible}
                />

            </>
        );
    }
}

export default DataTable;