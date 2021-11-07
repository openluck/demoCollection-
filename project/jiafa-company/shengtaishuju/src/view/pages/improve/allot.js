/*
 * @Author: lilu 
 * @Date: 2020-07-23 09:33:48 
 * @Last Modified by: kyl
 * @Last Modified time: 2021-02-01 10:32:19
 * 教学改进-异常情况下发（校级）
 */
import React, { Component } from 'react';
import SVG from '../../public/svg';
import TopShow from './../../components/improve/allotComponent/topShow';
import AllotTable from './../../components/improve/allotComponent/allotTable';
import ImpHeader from '../../components/improve/imp_header';
import './../../../style/ll_allot.scss';
import { connect } from "react-redux";
import { clearImpTime } from './../../../redux/tj-impHeader.reducer'
import { ll_queryAllotList, ll_selectedRowKeys, ll_allotHandle, ll_changeInput, ll_getAllotInfo, ll_allotstatus, ll_changeType, lrf_changeIsDetails } from './../../../redux/ll-allot.reducer';
import G from './../../../config/g';
import moment from 'moment';
import { ws_saveGlobalData } from './../../../redux/ws-global.reducer';
import { message } from 'antd';

@connect(state => state, { ll_queryAllotList, ll_selectedRowKeys, ll_allotHandle, clearImpTime, ll_changeInput, ll_getAllotInfo, ws_saveGlobalData, ll_allotstatus, ll_changeType, lrf_changeIsDetails })
class Allot extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checkList: [{ name: '全部', value: '' }, { name: '未下发', value: '0' }, { name: '已下发', value: '1' }],
            selectedRowKeys: [],
        }
        this.changeCheckKey = this.changeCheckKey.bind(this);//切换下发状态
        this.jumpPage = this.jumpPage.bind(this);//点击分页
        this.checkData = this.checkData.bind(this);//批量选择
        this.allotApare = this.allotApare.bind(this);//下发
        this.allotApareSingle = this.allotApareSingle.bind(this);//单个下发
        this.clickRow = this.clickRow.bind(this);//选中一行
        this.getHeaderParams = this.getHeaderParams.bind(this);//时间选择
        this.handleTab = this.handleTab.bind(this) //切换 课堂/开课单位 查看 1.21
        this.goTocollege = this.goTocollege.bind(this) //按开课单位查看列表-点击查看详情
    }

    componentDidMount() {
      let isHistory = JSON.parse(sessionStorage.getItem('isHistoryTime'))
      console.log('isHistory', isHistory);
      if (!isHistory) { //未使用历史数据
        this.props.ll_changeType('1') //初始化按课堂维度查看列表
        console.log('未使用历史数据');
      } else {
        console.log('使用历史数据');
      }
      
    }
    componentWillUnmount() {
        // let url = this.props.history.location.pathname;
        // let urlArr = url.split('/');
        // if (urlArr.length===5) {
        // } else {
        //     let { inputData } = this.props.ll_allot_reducer;
        //     inputData.pageNum = 1;
        //     inputData.distributionType = '';
        //     this.props.ll_changeInput(inputData)
        // }

      // this.props.ll_changeType('1') //1.21离开异常情况下发页面 将按课堂/开课单位查看置为初始态
      sessionStorage.setItem('isHistoryTime', false)
      this.props.clearImpTime();
      // this.props.ll_allotstatus(false)
      let { allotstatus } = this.props.ll_allot_reducer;
      console.log('allotstatus销毁执行', allotstatus);
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
        // this.setState({
        //     // inputData: data,
        //     checkKey: key,
        // })
    }
    
    /** 1.21
     * 切换按课堂按开课单位 allotType 1按课堂 2按开课单位
     * @param {*} allotType 
     */
     handleTab(allotType) {
        // console.log("allotType", allotType);
        let { inputData } = this.props.ll_allot_reducer
        let data = JSON.parse(JSON.stringify(inputData));
        this.props.ll_changeType(allotType)
        this.setState({
            pageNum:1
        }, () => {
          this.props.ll_queryAllotList(data);
        })
        
    }
    
    /**
     * 分页
     * @param {*} pageNum 
     */
    jumpPage(pageNum) {
        let { inputData } = this.props.ll_allot_reducer
        let data = JSON.parse(JSON.stringify(inputData));
        data.pageNum = pageNum;
        // console.log("data", data);
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
        let content = [
            { name: '异常情况下发', url: '/home/imp/allot' },
            { name: '课堂明细', url: '' }
        ]
        this.props.ws_saveGlobalData(content, 'ISCED_content')
        // sessionStorage.setItem('content',JSON.stringify(content))
        this.props.history.push(`/home/imp/allot/null/${id}`)
        // console.log(id, '选中一行')
    }

    /**1.21 
     * 选中一行跳转  按学院-查看详情
     * @param {*} id 选中行 学院id
     */
     goTocollege(id) {
        let content = [
            { name: '异常情况下发', url: `/home/imp/allot` },
            { name: '开课单位异常情况下发详情', url: `/home/imp/allot/${id}`}
        ]
        this.props.ws_saveGlobalData(content, 'ISCED_content')
        sessionStorage.setItem('content',JSON.stringify(content)) //1.21保存路由信息
        
        let { inputData } = this.props.ll_allot_reducer 
        let data = JSON.parse(JSON.stringify(inputData));
        data.collegeId = id
        this.props.ll_changeInput(data)
        this.props.lrf_changeIsDetails(true)

        let { attType_, selTime_, timeType_, semesterId_ } = JSON.parse(sessionStorage.getItem('conditions'));
        let param = {
          attType: attType_, 
          selTime: selTime_, 
          timeType: timeType_, 
          semesterId: semesterId_
        }
        this.props.ws_saveGlobalData(param, 'ISCED_headerParams') //1.21请求参数放入G_ISCED中
        this.props.history.push(`/home/imp/allot/${id}`)
        
    }

    /**
     * 选择时间函数回调
     * @param {*} info 
     */
    getHeaderParams(info) {
        let { inputData, allotstatus, allotType } = this.props.ll_allot_reducer;
        // console.log('选择时间函数回调参数', info);
        if (!allotstatus) { //没有使用历史数据
            inputData.pageNum = 1;
            inputData.distributionType = '';
        }
        inputData.semesterId = info.semesterId;
        inputData.timeType = info.timeType;
        inputData.selTime = info.selTime;
        inputData.attType = info.attType;
        inputData.collegeId = '' //1.21 回到异常情况下发顶层时必定查看所有学院 所以置为空
        if (allotType === '2') {
          inputData.distributionType = ''
        }
        console.log('allotType', allotType, inputData);
        this.props.ll_queryAllotList(inputData);
        this.props.ll_getAllotInfo(inputData);
        this.props.ll_allotstatus(false) //选择时间后 不使用历史数据
    }
    render() {
        let { checkList } = this.state;
        let {allotType, allotList, allotInfo, allLoading, selectedRowKeys, total, inputData, isDetails } = this.props.ll_allot_reducer;
        return (
            <div className='ll-allot'>
                <div className={isDetails ? 'lrf-timeWdge-college' : 'll-timeWdge'} ref={(node) => this.node = node}>
                    <ImpHeader getHeaderParams={this.getHeaderParams} isSave={true}  />
                </div>
                <div className={isDetails ? 'lrf-allotBox' : 'll-allotBox'}>
                    <TopShow data={allotInfo} type={'1'} />
                    <AllotTable
                        // checkKey={checkKey}
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
export default Allot;