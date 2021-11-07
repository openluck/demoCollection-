/*
 * @Author: lilu 
 * @Date: 2020-07-24 13:15:08 
 * @Last Modified by: tj
 * @Last Modified time: 2020-11-04 14:42:28
 * 问题处理
 */

import React, { Component } from 'react';
import TopShow from './../../components/improve/allotComponent/topShow';
import AllotTable from './../../components/improve/allotComponent/allotTable';
import ImpHeader from '../../components/improve/imp_header';
import './../../../style/ll_allot.scss';
import { connect } from "react-redux";
import { clearImpTime } from './../../../redux/tj-impHeader.reducer'
import { ll_getHandleList, ll_changeInput, ll_getHandleInfo,ll_handlestatus } from './../../../redux/ll-handle.reducer';
import HandleModal from './../../components/improve/follow/handleModal';
import {ws_saveGlobalData} from './../../../redux/ws-global.reducer';

@connect(state => state, { ll_getHandleList, clearImpTime, ll_changeInput, ll_getHandleInfo,ws_saveGlobalData,ll_handlestatus })
class Handle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checkList: [{ name: '全部', value: '' }, { name: '未处理', value: '0' }, { name: '已处理', value: '1' }],
            visible: false,
            id: '',
            type: '',
        }
        this.changeCheckKey = this.changeCheckKey.bind(this);//切换下发状态
        this.jumpPage = this.jumpPage.bind(this);//点击分页
        this.allotApareSingle = this.allotApareSingle.bind(this);//单个下发
        this.clickRow = this.clickRow.bind(this);//选中一行
        this.getHeaderParams = this.getHeaderParams.bind(this);//时间选择
        this.onOk = this.onOk.bind(this)//处理成功回调
    }

    componentWillUnmount() {
        // let url = this.props.history.location.pathname;
        // let urlArr = url.split('/');
        // if (urlArr.length === 5) {
        // } else {
        //     let { inputData } = this.props.ll_handle_reducer;
        //     inputData.pageNum = 1;
        //     inputData.distributionType = '';
        //     this.props.ll_changeInput(inputData)
        // }
        sessionStorage.setItem('isHistoryTime', false)
        this.props.clearImpTime();
    }

    /**
     * 成功回调
     */
    onOk(){
        console.log('回调成功')
        let { inputData } = this.props.ll_handle_reducer;
        inputData.pageNum=1;
        this.setState({
            visible:false
        })
        this.props.ll_getHandleInfo(inputData);
        this.props.ll_getHandleList(inputData)
    }
    /**
     * 切换下发状态
     * @param {*} key 
     */
    changeCheckKey(key) {
        let { inputData } = this.props.ll_handle_reducer
        let data = JSON.parse(JSON.stringify(inputData));
        data.distributionType = key;
        data.pageNum = 1;
        this.props.ll_getHandleList(data)
        this.node.scrollIntoView()
        // this.setState({
        //     // inputData: data,
        //     checkKey: key,
        // })
    }

    /**
     * 分页
     * @param {*} pageNum 
     */
    jumpPage(pageNum) {
        let { inputData } = this.props.ll_handle_reducer
        let data = JSON.parse(JSON.stringify(inputData));
        data.pageNum = pageNum;
        this.props.ll_getHandleList(data)
        this.node.scrollIntoView()
    }

    /**
     * 处理下发
     * @param {*} id 
     */
    allotApareSingle(e, id, type) {
        e.stopPropagation();
        this.setState({
            visible: true,
            id: id,
            type: type,
        })
    }

    /**
     * 选中一行跳转
     * @param {*} id 
     */
    clickRow(id) {
        let content = [
            { name: '问题处理', url: '/home/imp/handle' },
            { name: '课堂明细', url: '' }
        ]
        // sessionStorage.setItem('content', JSON.stringify(content))
        this.props.ws_saveGlobalData(content,'ISCED_content')
        this.props.history.push(`/home/imp/handle/${id}`)
    }

    /**
     * 时间筛选
     * @param {*} info 
     */
    getHeaderParams(info) {
        let { inputData,handlestatus } = this.props.ll_handle_reducer;
        if(!handlestatus){
            inputData.pageNum = 1;
            inputData.distributionType = '';
        }
        inputData.semesterId = info.semesterId;
        inputData.timeType = info.timeType;
        inputData.selTime = info.selTime;
        this.props.ll_getHandleList(inputData);
        this.props.ll_getHandleInfo(inputData);
        this.props.ll_handlestatus(false)
    }
    render() {
        let { checkList,id,type,visible } = this.state;
        let { handleList, handleInfo, allLoading, total, inputData } = this.props.ll_handle_reducer;
        return (
            <div className='ll-allot'>
                <div className='ll-timeWdge' ref={(node) => this.node = node}>
                    <ImpHeader getHeaderParams={this.getHeaderParams} isSave={true} />
                </div>
                <div className='ll-allotBox'>
                    <TopShow data={handleInfo} type={'1'}/>
                    <AllotTable
                        checkList={checkList}
                        changeCheckKey={this.changeCheckKey}
                        jumpPage={this.jumpPage}
                        allotList={handleList}
                        inputData={inputData}
                        allLoading={allLoading}
                        allotApareSingle={this.allotApareSingle}
                        clickRow={this.clickRow}
                        total={total}
                        type={'2'}
                        title={'问题课堂列表'}
                    />
                </div>
                {
                    visible ?
                        <HandleModal
                            visible={visible}
                            title='处理意见'
                            onCancel={() => { this.setState({ visible: false }) }}
                            onOk={this.onOk}
                            id={id}
                            type={type}
                        />
                        : null
                }

            </div>
        )
    }
}
export default Handle;