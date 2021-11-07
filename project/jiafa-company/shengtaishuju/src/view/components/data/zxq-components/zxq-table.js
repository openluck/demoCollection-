
/*
 * @Author:zxq
 * @Date: 2020-02-10 13:51:43 
 * @Last Modified by: yrj
 * @Last Modified time: 2020-07-20 14:01:23
 */

import React, { Component } from 'react';
import { Table, Select,message } from 'antd';
import { request } from '../../../../util/request'
import Fy from '../../../public/fy';
import SVG from "../../../public/svg";
import zxqRuest from '../../../../request/zxq_request'
import ErrModal from '../../../components/details/errModal';
import SelInput from '../../../public/searSel/element';
import CollageNoData from '../../image/college_image/collegeNoData';
import { lxx_saveInfo } from "../../../../redux/ws-global.reducer";
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
    lxx_saveInfo,
  })
class DataTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNum: 1,  //当前页码
      pageSize: 20,  //每页条数20
      total: 0,
      loading: false,
      tabletype: 1,     //1教学楼2教室   
      teachingBuildId:"", //教学楼id
      teachingBuildName:"", 
      classRoomId: "", 
      timeType : 1 , //时间类型（123日周月）
      transData:{},
      selTime: moment(new Date()).format('YYYY-MM-DD'),//默认为今天的日期
      semesterId:G.ISCED_cutSemesterData.semesterId, //学年学期id
      visible:false,  //下载错误模态框
      statisdata: {},
      teaBuildList: [],   
      classRoomList: [],
      tableData: [],  //教学楼数据
      claTableData:[],  //教室数据
      page:"",//返回标志 
      info:this.props.ws_global_reducer.ISCED_saveInfo 
    };
  }
  componentWillReceiveProps(props) {
    let { transData,tabletype,page }= props;
    let { selTime } = this.state;
    this.setState({
        timeType:transData.selDatetype,
        semesterId:transData.semesterId,
        tabletype             
      })
    if(transData.currentTime !=  selTime )
    {
      this.setState({
        selTime:JSON.parse(JSON.stringify(transData.currentTime)),
             
      },()=>{
    //根据筛选条件，请求教学楼表格,教学楼列表和头部统计数据
      this.getBuildList();
      this.getBuildData();
      this.getStaticData();
  
      })
    }
    if(props.page != this.state. page && tabletype != this.state.tabletype){
      this.setState({
        page,
        teachingBuildId:"",
        classRoomId:""
      },()=>{
      //根据筛选条件，请求教学楼表格,教学楼列表和头部统计数据
      this.getBuildData();
      this.getStaticData();
      this.getBuildList();
      })
    }

  }
  componentDidUpdate() {
    // let info = this.props.ws_global_reducer.ISCED_saveInfo;
    // console.log("info",info)
    // if(info!=this.state.info){
    //   if(info == "1"){
    //       this.props.changetable(1);
    //       this.getBuildList();
    //       this.getBuildData();
    //       this.getStaticData();
    //   }
    // }
  }
  componentDidMount() {
  
   // 请求教学楼表格,教学楼列表和头部统计数据
    this.getBuildList();
    this.getBuildData();
    this.getStaticData();
 
  }

    /**
    * 获取教学楼下拉数据
    */
  getBuildList() {
    let { selTime,timeType,semesterId} = this.state;
    let params = {
      selTime,
      timeType,
      semesterId
    }
       //接口
       BuildList(params).then((res) => {
        if (res.data.result && res.data.data) { 
          let  teaBuildList = res.data.data;
          let teachingBuildId = teaBuildList[0] ? teaBuildList[0].teachingBuildId :"";
          this.setState({
              teaBuildList,
              // teachingBuildId
           })   
        }
        else{
          message.error(res.data.message)

        }
      })
  }

  /**
    * 获取教学楼头部统计数据
    */
  getStaticData() {
    let { selTime,timeType,semesterId} = this.state;
    let param = {
        selTime,
        timeType,
        semesterId
      }
       //接口
      staticData(param).then((res) => {
        if (res.data.result && res.data.data) { 
          let  statisdata = res.data.data;
          this.props.setStaticData(statisdata)

        }
        else{
          message.error(res.data.message)

        }
      })
  }
  /**
  * 获取教学楼表格数据
  */
  getBuildData(id) {  
    let { selTime,timeType,semesterId,teachingBuildId,pageNum,pageSize} = this.state;
    console.log("pageNum",pageNum)
    let params = {
        teachingBuildId,
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
      buildData(params).then((res) => {  
        if (res.data.result && res.data.data) { 
          var tableData =  res.data.data;
          tableData.map((item)=>{
            item.classRoomCouRate = item.classRoomCouRate+"%";
            item.classRoomUseRatio = item.classRoomUseRatio+"%";
            item.classRoomUsageRate = item.classRoomUsageRate+"%";
          })
        
        }
        else{
          message.error(res.data.message)

        }
        this.setState({
          isLoading: false,
          tableData,
         
        })
      })

  }
  /**
    * 获取教室下拉数据
    */
  getclassRoomList(value){
  console.log(value)
  let { selTime,timeType,semesterId,teachingBuildId} = this.state;
  let params = {
    searchValue:value?value:"",
    teachingBuildId,
    selTime,
    timeType,
    semesterId

  }
   //接口
   clRoomList(params).then((res) => {
      if (res.data.result && res.data.data) { 
        let classRoom =  res.data.data;
        let classRoomId = classRoom[0] ? classRoom[0].classRoomId:"";
        let classRoomList =  this.state.classRoomList;
        classRoomList=[];
        classRoom.map((value) => {
          classRoomList.push({
                id: value.classRoomId,
                name: value.classRoom
            })
      })
        this.setState({
          classRoomList,
          // classRoomId
        })
      }
      else{
        message.error(res.data.message)

      }
    })
 
}

  /**
    * 获取教室表格数据
    */
  getClassData(id) {
    let { selTime,timeType,teachingBuildId,semesterId,classRoomId, pageNum,pageSize,} = this.state;
    console.log("pageNum",pageNum)
    let params = {
      teachingBuildId,
      selTime,
      timeType,
      classRoomId: id ? id: classRoomId,
      pageNum,
      pageSize,
      semesterId

    }
    this.setState({
      isLoading: true,
    })
     //接口
     classData(params).then((res) => {
      if (res.data.result && res.data.data) { 
        let tableData =  res.data.data;
        let total = res.data.total;
        tableData.map((item)=>{
            item.classRoomCouRate = item.classRoomCouRate+"%";
            item.classRoomUseRatio = item.classRoomUseRatio+"%";
            item.classRoomUsageRate = item.classRoomUsageRate+"%";
          })
          this.setState({
            isLoading: false,
            tableData,
            total
          })
      }
      else{
        message.error(res.data.message)

      }
    })
   
  }
  /**
   * 获取头部教室统计数据
   *  @param {*} teachingBuildId(教学楼id)
   */
  getclassStaticData(Id) {
    let { selTime,timeType,semesterId,teachingBuildId,classRoomId} = this.state;
    let params = {
      semesterId,
      selTime,
      timeType,
      teachingBuildId: Id ? Id:teachingBuildId
    }
   
     //接口
      classStaticData(params).then((res) => {
        if (res.data.result) { 
          let  statisdata = res.data.data;
          this.props.setStaticData(statisdata); 
      
        }
      }) 
  }

  /**
  * 点击表格行
  */
  clickRow = (record) => {
    let id = record.teachingBuildId;
    let teachingBuildName = record.teachingBuildName;
    let {tabletype} = this.state;
    // document.getElementsByClassName("ps")[0].addEventListener("scroll",this.hideAllMenu);
    if(tabletype == 1){
        this.props.changetable(2);
        this.props.setOrgName(teachingBuildName);
        this.props.lxx_saveInfo('2');
        this.setState({
          teachingBuildName,
          teacherId:"",
          classRoomId:"",
          teachingBuildId:id,
          page:""
        },()=>{
        //请求教室头部,列表,表格数据（id教学楼）
        this.getClassData();
        this.getclassStaticData(id);
        this.getclassRoomList();
        this.node.scrollIntoView();
        })
    }  
       
  }

  /*** 下拉选择数据*/

  selChange = (type,id) => {
    switch (type){
      case "teaBuild":
          this.setState({
            teachingBuildId:id||"",
            pageNum:1
          },()=>{
            this.getBuildData(id);    
          })
          break;
      case "classRoom":
          this.setState({
            classRoomId:id.id,
            pageNum:1
          },()=>{
            this.getClassData(id.id)
          })
          break;
      default:
          break;

    }
      
    
  }
   /*** 搜索教室*/
  searchData = (type,value) =>{
    console.log("value",value)
    //调接口
    if( value == ""){
      switch (type){
        case "teaBuild":
           this.getBuildList()
            break;
        case "classRoom":
           this.getClassData();
           this.getclassRoomList(value)
            break;
        default:
            break;
      }  
    }
    else{
        switch (type){
        case "classRoom":
           this.getclassRoomList(value)
            break;
        default:
            break;
      }  

    }  
  }

  /**
   * 下载数据
   */
  download = () => {
    let tabletype = this.props.tabletype;
    let { teachingBuildId, classRoomId } = this.state;
    if (tabletype == 1) {
      //下载教学楼表格 --调接口
      let url = "/api/data/resources/downteachingBu";
      this.dowLoadTable(teachingBuildId, url, tabletype)

    }
    else {
      //下载教室表格
      let url = "/api/data/resources/downClaRoom";
      this.dowLoadTable(classRoomId, url, tabletype)
    }

  }

  /*** 下载表格 */
  dowLoadTable = (Id, url, tabletype) => {
    let { selTime,timeType,semesterId,teachingBuildName,teachingBuildId} = this.state;
    let Params = {
        selTime,
        timeType,
        teachingBuildId,
        semesterId,
    }
    if (tabletype == 1) {
      Params["teachingBuildId"] = Id;

    }
    else {
      Params["classRoomId"] = Id;
      Params["teachingBuildName"] = teachingBuildName;
    }

    this.setState({
      isLoading: true,
    }) 
    request(url, Params, (res,name) => {
      let blob = new Blob([res], { type: 'application/x-xls' });    
      if( tabletype == 1){
         saveAs(blob,`资源情况-教室统计-${selTime}.xlsx`)
      }
      else{
         saveAs(blob,`资源情况-教室统计（${teachingBuildName}）-${selTime}.xlsx`)
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
     * @param {*} pageNum(页码)
     */   
  jumpPage(pageNum) {
      let { tableData } = this.state;
      tableData.pageNum = pageNum;
      this.node.scrollIntoView();
      this.setState({
        pageNum
      },()=>{
        //教室
        this.getClassData();
      })
    
  }
  render() {
    let { tabletype,total, teaBuildList, teachingBuildId,classRoomId,classRoomList,tableData,pageNum,pageSize,visible,isLoading } = this.state;
    let type = this.props.tabletype;
   const columns = [
      {
        title: type == 1 ? '教学楼' : "教室",
        dataIndex: type  == 1 ? 'teachingBuildName' : "classRoom",
        key: type  == 1 ? 'teachingBuildName' : "classRoom",
        render: (text, record) => {
          return <div title={text || '--'} style={ tabletype == 2 ? {color:"#333333"} :{}}>{text}</div>
        }

      },
      {
        title: '教室开课率',
        dataIndex: 'classRoomCouRate',
        key: 'classRoomCouRate',
        render: (text, record) => {
          return <div title={text || '--'} style={ tabletype == 2 ? {color:"#333333"} :{}}>{text}</div>
        }
      },
      {
        title: '教室有效利用率',
        dataIndex: 'classRoomUseRatio',
        key: 'classRoomUseRatio',
        render: (text, record) => {
          return <div title={text || '--'} style={ tabletype == 2 ? {color:"#333333"} :{}}>{text}</div>
        }
      },
      {
        title: '教室闲时使用率',
        key: 'classRoomUsageRate',
        dataIndex: 'classRoomUsageRate',
        render: (text, record) => {
          return <div title={text || '--'} style={ tabletype == 2 ? {color:"#333333"} :{}}>{text}</div>
        }
      },

    ];
    return (
      <>
        <div className="zxq-table"  ref={(node) => { this.node = node }}>
          <div className="zxq-search">
            {tabletype == 1 ? 
              <div>
                <span> 教学楼： </span>       
                <Select 
                  allowClear 
                  value={teachingBuildId?teachingBuildId:[]} 
                  onChange={this.selChange.bind(this,"teaBuild")}
                  onSearch={this.searchData.bind(this,"teaBuild")}  
                  placeholder="请选择"  
                  className="zxq-schBuild"
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                  >
                  {teaBuildList ?  teaBuildList.map((item, index) => (
                      <Option key={index} value={item.teachingBuildId} >{item.teachingBuildName}</Option>
                    )) : null
                  
                  }
                </Select>
              </div>
              : <>
                   <div className="zxq-colleSel"> 
                        <span> 教室： </span>
                        <SelInput
                          width={200}
                          onChange={this.selChange.bind(this,"classRoom")}
                          onSearch={this.searchData.bind(this,"classRoom")}
                          placeholder="请选择/搜索"
                          list={classRoomList.length ?classRoomList:[] } //下拉数据
                          value={classRoomId} //选中项id
                          allowClear
                        />
                      </div>    
                     
                </>
            }
                    {tableData ? 
                        <div className="zxq-tabDownload" onClick={this.download.bind(this)}>
                            <SVG type="de_download" className="zxq-download " />
                            下载
                        </div>
                        :""}
             
          </div>
         
          <div className="zxq-tableContent">
            <div className="zxq-antTable">
              <Table
                columns={columns}
                dataSource={tableData}
                loading={isLoading}
                locale={{emptyText:<CollageNoData/>}}
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
                        onCancel={()=>{
                            this.setState({
                                visible:false
                            })
                        }}
                        visible={visible}
                    />
                }
 
      </>
    );
  }
}

export default DataTable;