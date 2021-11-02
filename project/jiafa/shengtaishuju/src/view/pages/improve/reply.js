/*
 * @Author: lxx 
 * @Date: 2021-01-14 10:15:28 
 * @Last Modified by: tj
 * @Last Modified time: 2021-03-25 17:02:56
 * 教学改进-异常情况回复 
 */

import React, { Component } from 'react';
import TopShow from './../../components/improve/allotComponent/topShow';
import AllotTable from './../../components/improve/allotComponent/allotTable';
import ImpHeader from '../../components/improve/imp_header';
import './../../../style/ll_allot.scss';
import { connect } from "react-redux";
import { clearImpTime } from './../../../redux/tj-impHeader.reducer'
import { ll_queryAllotListOfSch, ll_queryAllotListOfCol,  ll_getAllotInfo, ll_replystatus, kyl_submitReason, updateList, ll_changeInput  } from './../../../redux/kyl-reply.reducer';
import G from './../../../config/g';
import moment from 'moment';
import { ws_saveGlobalData } from './../../../redux/ws-global.reducer';
import SchTopShow from '../../components/improve/allotComponent/schTopShow';

@connect(state => state, { ll_queryAllotListOfSch, ll_queryAllotListOfCol, clearImpTime, ll_changeInput, ll_getAllotInfo, ws_saveGlobalData, ll_replystatus, kyl_submitReason, updateList })
class Allot extends Component {

    constructor(props) {
        super(props);
        let roleType = G.ISCED_curRoleInfo.roleType
        this.state = {
            checkList: (roleType === "1" || roleType === '2') ? [
                { name: '全部', value: '' }, { name: '校级未回复', value: '0' }, { name: '校级已回复', value: '1' }
            ] : [
                { name: '全部', value: '' }, { name: '开课单位未回复', value: '0' }, { name: '开课单位已回复', value: '1' },{ value: '2', name: '开课单位过期未回复' }
            ],
            selectedRowKeys: [],
            checkKey:''
        }
        this.changeCheckKey = this.changeCheckKey.bind(this);//切换回复状态
        this.jumpPage = this.jumpPage.bind(this);//点击分页
        this.clickRow = this.clickRow.bind(this);//选中一行
        this.getHeaderParams = this.getHeaderParams.bind(this);//时间选择
        this.searchTeacher = this.searchTeacher.bind(this) //搜索教师
    }



    componentWillUnmount() {
        sessionStorage.setItem('isHistoryTime', false)
        this.props.clearImpTime();
    }
    /**
     * 切换下发回复列表状态 全部-未回复-已回复
     * @param {*} key 
     */
    changeCheckKey(key) {
        // let { inputData } = this.props.ll_allot_reducer
        let { inputData } = this.props.kyl_reply_reducer
        let data = JSON.parse(JSON.stringify(inputData));
        data.distributionType = key;
        data.replyType = key;
        data.pageNum = 1;
        let roleType = G.ISCED_curRoleInfo.roleType;
        if (roleType === "1" || roleType === '2') {
            this.props.ll_queryAllotListOfSch(data);
        } else {
            this.props.ll_queryAllotListOfCol(data);
        }
        this.node.scrollIntoView()
        // this.setState({
        //     // inputData: data,
        //     checkKey: key,
        // })
        this.setState({
            checkKey:key
        })
        
        sessionStorage.setItem('replyType', key)
        this.props.ll_changeInput({
          ...inputData,
          distributionType:key,
          replyType:key,
          pageNum:1
        })
    }

    /**
     * 分页
     * @param {*} pageNum 
     */
    jumpPage(pageNum) {
      console.log('分页');
        // let { inputData } = this.props.ll_allot_reducer
        let { inputData } = this.props.kyl_reply_reducer
        let data = JSON.parse(JSON.stringify(inputData));
        data.pageNum = pageNum;
        data.distributionType = this.state.checkKey;
        data.replyType=this.state.checkKey
        let roleType = G.ISCED_curRoleInfo.roleType;
        if (roleType === "1" || roleType === '2') {
            this.props.ll_queryAllotListOfSch(data);
        } else {
            this.props.ll_queryAllotListOfCol(data);
        }
        this.node.scrollIntoView();
        this.props.ll_changeInput({
          ...inputData,
          distributionType:this.state.checkKey,
          replyType:this.state.checkKey,
          pageNum
        })
    }

    /**
     * 选中一行跳转
     * @param {*} id 
     */
    clickRow(id) {
        let content = [
            { name: '异常情况回复', url: '/home/imp/reply' },
            { name: '课堂明细', url: '' }
        ]
        this.props.ws_saveGlobalData(content, 'ISCED_content')
        this.props.history.push(`/home/imp/reply/${id}`)
    }

    /**
     * 时间选择函数回调
     * @param {*} info 
     */
    getHeaderParams(info) {
        let { inputData } = this.props.kyl_reply_reducer
        let isHistory = JSON.parse(sessionStorage.getItem('isHistoryTime'))  
        
        if (isHistory) { //1.21使用历史数据
          inputData.replyType = JSON.parse(sessionStorage.getItem('replyType'))
          console.log('使用历史', isHistory, inputData);
        } else { //1.21未使用历史数据
          inputData.searchParam = ''
          inputData.pageNum = 1;
          inputData.distributionType = ''; //历史遗留 
          // inputData.replyType = ''
          console.log('没使用历史', isHistory, inputData);
        }
        inputData.semesterId = info.semesterId;
        inputData.timeType = info.timeType;
        inputData.selTime = info.selTime;
        inputData.attType = info.attType;
        // inputData.collegeId = G.ISCED_curRoleInfo.belongOrgId;
        let roleType = G.ISCED_curRoleInfo.roleType;
        if (roleType === "1" || roleType === '2') {
            this.props.ll_queryAllotListOfSch(inputData);
        } else {
            this.props.ll_queryAllotListOfCol(inputData);
        }
        this.props.ll_changeInput(inputData)
        this.props.ll_getAllotInfo(inputData);
        // this.props.ll_allotstatus(false)
    }

    /**1.21
     * 校级搜索教师
     * @param {*} inputData
     */
    async searchTeacher(value, event) {
      event.persist();
      let {inputData} = this.props.kyl_reply_reducer
      inputData.searchParam = value
      await this.props.ll_queryAllotListOfSch(inputData)
    }

    render() {
        let { checkList, } = this.state;
        // let { allotList, allotInfo, allLoading, selectedRowKeys, total, inputData} = this.props.ll_allot_reducer;
        let { allotList, allotInfo, allLoading, selectedRowKeys, total, inputData } = this.props.kyl_reply_reducer
        let roleType = G.ISCED_curRoleInfo.roleType;
        return (
            <div className='ll-allot'>
                <div className='ll-timeWdge' ref={(node) => this.node = node}>
                    <ImpHeader getHeaderParams={this.getHeaderParams} isSave={true}  />
                </div>
                <div className='ll-allotBox'>
                    {
                        (roleType === "1" || roleType === '2') ?
                            <SchTopShow data={allotInfo} type={'2'} />
                            :
                            <TopShow data={allotInfo} type={'2'} />
                    }
                    <AllotTable
                        // checkKey={checkKey}
                        checkList={checkList}
                        changeCheckKey={this.changeCheckKey}
                        jumpPage={this.jumpPage}
                        selectedRowKeys={selectedRowKeys}
                        allotList={allotList}
                        inputData={inputData}
                        allLoading={allLoading}
                        clickRow={this.clickRow}
                        searchTeacher={this.searchTeacher}
                        total={total}
                        type={'2'}
                        changeInput={this.props.ll_changeInput}
                        title={G.ISCED_curRoleInfo.belongOrgName}
                        kyl_submitReason={this.props.kyl_submitReason}
                        updateList={this.props.updateList}
                    />
                </div>
            </div>
        )
    }
}
export default Allot;