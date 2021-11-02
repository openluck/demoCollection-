/*
 * @Description: 异常情况下发-按学院查看详情
 * @version: v1.21
 * @Author: lrf
 * @Date: 2021-07-22 16:11:32
 * @LastEditors: lrf
 * @LastEditTime: 2021-07-29 14:19:45
 */
import React, { Component } from 'react';
import '../../../../style/lrf-allotDetails.scss'
import Fy from './../../../public/fy';
import { Table, Button, Modal, Input } from 'antd';
import _, { split } from 'lodash';
import SVG from './../../../public/svg';
import Line from './../follow/line';
import G from './../../../../config/g';
import HandleModal from '../reply/handleModal';
import { getAttCodeName } from '../../../../config/actionConfig';
import BackPub from '../../../public/backPub'
import TopShow from '../allotComponent/topShow'
import AllotTable from '../allotComponent/allotTable'
import { connect } from "react-redux";
import {ll_getAllotInfo, ll_queryAllotList, ll_selectedRowKeys, ll_changeInput, ll_changeType, lrf_changeIsDetails, ll_allotHandle} from '../../../../redux/ll-allot.reducer'
import { ws_saveGlobalData } from '../../../../redux/ws-global.reducer';

@connect(state => state, { ll_getAllotInfo, ll_queryAllotList, ll_selectedRowKeys, ll_changeInput, ll_changeType, lrf_changeIsDetails, ll_allotHandle, ws_saveGlobalData })
class AllotDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      checkList:  [{ name: '全部', value: '' }, { name: '未下发', value: '0' }, { name: '已下发', value: '1' }],
      content: []
    }
    this.changeCheckKey = this.changeCheckKey.bind(this);//切换下发状态
    this.jumpPage = this.jumpPage.bind(this);//点击分页
    this.checkData = this.checkData.bind(this);//批量选择
    this.allotApare = this.allotApare.bind(this);//下发
    this.allotApareSingle = this.allotApareSingle.bind(this);//单个下发
    this.clickRow = this.clickRow.bind(this);//选中一行
    this.getAllotInfo = this.getAllotInfo.bind(this) //获取头部静态数据
    this.getAllotList = this.getAllotList.bind(this) //获取表格数据
  }

  componentDidMount() {
    let content = JSON.parse(sessionStorage.getItem('content'))
    this.setState({
      content
    })
    this.props.lrf_changeIsDetails(true) //进入详情页 置为true
    this.props.ll_changeType('1') //进入详情页时，必定是按课堂查看

    
    this.getAllotInfo()
    this.getAllotList()
  }

  componentWillUnmount() {
    let { inputData, allotstatus } = this.props.ll_allot_reducer
    let data = JSON.parse(JSON.stringify(inputData));
    data.collegeId = ''
    this.props.ll_changeInput(data)
    this.props.lrf_changeIsDetails(false) //离开详情页 置为false
  }

  /**
   * 获取头部静态数据
   * @param {*} key 
   */
   getAllotInfo() {
    // let { inputData } = this.props.ll_allot_reducer
    // let data = JSON.parse(JSON.stringify(inputData));
    // data.collegeId = collegeId
    let { attType, selTime, timeType, semesterId } = G.ISCED_headerParams
    let collegeId = this.props.match.params.collegeId
    let param = {
      attType, 
      selTime, 
      timeType, 
      semesterId,
      collegeId
    }
    this.props.ll_getAllotInfo(param)
   }

   /**
    * 获取表格数据
    * @param {*} key 
    */
   getAllotList() {
    let { inputData } = this.props.ll_allot_reducer
    let { attType, selTime, timeType, semesterId } = G.ISCED_headerParams
    let data = JSON.parse(JSON.stringify(inputData));
    let collegeId = this.props.match.params.collegeId
    data.collegeId = collegeId;
    data.attType = attType;
    data.selTime = selTime;
    data.timeType = timeType;
    data.semesterId = semesterId;
    this.props.ll_queryAllotList(data)
   }

  /**
   * 切换下发状态 全部-未下发-已下发
   * @param {*} key 
   */
  changeCheckKey(key) {
    let { inputData } = this.props.ll_allot_reducer
    let data = JSON.parse(JSON.stringify(inputData));
    data.distributionType = key;
    data.pageNum = 1;
    this.props.ll_queryAllotList(data);
    this.props.ll_selectedRowKeys([])
    this.node.scrollIntoView()
  }
  /**
   * 分页
   * @param {*} pageNum 
   */
  jumpPage(pageNum) {
    let { inputData } = this.props.ll_allot_reducer
    let data = JSON.parse(JSON.stringify(inputData));
    data.pageNum = pageNum;
    this.props.ll_queryAllotList(data);
    this.props.ll_selectedRowKeys([])
    this.node.scrollIntoView();
  } 

  /**
    * 批量选择
    * @param {Array} selectedRowKeys 
    */
  checkData(selectedRowKeys) {
    this.props.ll_selectedRowKeys(selectedRowKeys)
  }

  /**
   * 批量下发
   * @param {String} type 1下发 2回复
   */
  allotApare(type, clsId) {
    let { selectedRowKeys, inputData, } = this.props.ll_allot_reducer;
    if (!selectedRowKeys.length && type === '2') {
        message.warn('请选择下发数据');
        return
    }
    this.props.ll_allotHandle({ claRoomId: type === '1' ? [clsId] : selectedRowKeys, attType: inputData.attType }).then(() => {
        inputData.pageNum = 1;
        this.props.ll_queryAllotList(inputData)
        this.props.ll_getAllotInfo(inputData);
        this.node.scrollIntoView()
    })
  }
  
  /**
   * 单个下发
   * @param {*} id 暂未发现使用 2021/07/21
   */
  allotApareSingle(e, id, type) {
    e.stopPropagation();
    if (type === '1') {
        return
    }
    let { inputData } = this.props.ll_allot_reducer
    this.props.ll_allotHandle([id]).then(() => {
        inputData.pageNum = 1
        this.props.ll_queryAllotList(inputData)
        this.props.ll_getAllotInfo(inputData);
        this.node.scrollIntoView()
    })
  }

  /**
    * 选中一行跳转  按课堂-查看视频
    * @param {*} id 
    */
   clickRow(id) {
    let collegeId = this.props.match.params.collegeId;
    let data = sessionStorage.getItem('content')
    data = JSON.parse(data)
    data.push({
      name: '课堂明细', url: ""
    })
    this.props.ws_saveGlobalData(data, 'ISCED_content')
    // sessionStorage.setItem('content',JSON.stringify(content))
    this.props.history.push(`/home/imp/allot/${collegeId}/${id}`)
  }
  
  
  render() {
    let { content, checkList } = this.state
    let { allotType, allotList, allotInfo, allLoading, selectedRowKeys, total, inputData, isDetails } = this.props.ll_allot_reducer;
    let { selTime, timeType } = G.ISCED_headerParams
    return (
      <div className='lrf-allotD'>
        <div ref={node => this.node = node}>
          <BackPub content={content}/>
          <div className='tj-timeShow'>统计时间：
            <span>{timeType == '2' ? '第' + selTime + '周' : timeType == '4' ? '本学期' : selTime.replace(/\-/g, '\.')}</span>
          </div>
        </div>
        <div className='lrf-allotBox'>
        <TopShow data={allotInfo} type={'1'}/>
        <AllotTable
          checkList={checkList}
          changeCheckKey={this.changeCheckKey}
          changeAllotType={this.handleTab} //1.21
          jumpPage={this.jumpPage}
          selectedRowKeys={selectedRowKeys}
          checkData={this.checkData}
          allotList={allotList}
          allotType={allotType} //1.21
          isDetails={isDetails} //1.21
          inputData={inputData}
          allLoading={allLoading}
          allotApare={this.allotApare}
          allotApareSingle={this.allotApareSingle}
          clickRow={this.clickRow}
          goTocollege={this.goTocollege}
          total={total}
          type={'1'}
          title={G.ISCED_curRoleInfo.belongOrgName}
        />
        </div>
      </div>
    )
  }
}

export default AllotDetails