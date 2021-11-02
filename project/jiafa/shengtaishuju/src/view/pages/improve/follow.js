/*
 * @Author: tj 
 * @Date: 2021-01-15 13:16:51 
 * @Last Modified by: tj
 * @Last Modified time: 2021-03-25 14:28:40
 * 教学改进-异常情况跟踪
 */

import React, { useState, useEffect, Component } from 'react'
import './../../../style/tj-follow.scss';
import { Spin } from 'antd'
import FollowTable from '../../components/improve/follow/followTable';
import ImpHeader from '../../components/improve/imp_header';
import NoDataAndLoading from '../../components/image/public/noDataAndLoading';
import { clearImpTime, } from '../../../redux/tj-impHeader.reducer'
import SVG from '../../public/svg';
import { connect } from "react-redux";
import { ws_saveGlobalData } from '../../../redux/ws-global.reducer';
import HandleModal from './../../components/improve/follow/handleModal';
import ImpPie from '../../components/improve/impPie';
import G from '../../../config/g';
import { getClassData, getColData, getStaticData, saveParams } from './../../../redux/tj-follow.reducer'
import moment from 'moment';
@connect(state => state, { ws_saveGlobalData, clearImpTime, getClassData, getColData, getStaticData, saveParams })
class Follow extends Component {
    constructor(props) {
        super(props)
        this.state = {
            replyStatus: '',  //回复状态 ''全部 1未回复 2已回复
            tabType: '1',//1按课堂 2按开课单位
            dataList: [],
            pageNum: 1,
            pageSize: 20,
            collegeId: '',
            headParams: {},
            visible: false,
            id: '',
            type: '',
            claRoomId: '' //课程id
        }
        this.handleReplyStatus = this.handleReplyStatus.bind(this)
        this.handleTab = this.handleTab.bind(this)
        this.jumpPage = this.jumpPage.bind(this)
        this.onGoVideo = this.onGoVideo.bind(this)
        this.goDetail = this.goDetail.bind(this)
        this.getHeaderParams = this.getHeaderParams.bind(this)
    }

    componentWillMount() {
        let isHistory = sessionStorage.getItem('isHistoryTime')
        let tabType = sessionStorage.getItem('tabType')
        if (isHistory == 'true' && tabType) {
            this.setState({
                tabType,
                replyStatus: ''
            })
        }
    }

    componentWillUnmount() {
        this.props.clearImpTime();
        sessionStorage.setItem('isHistoryTime', false)
    }

    /**
     * 切换回复状态
     * @param {*} replyStatus 
     */
    handleReplyStatus(replyStatus) {
        this.setState({
            replyStatus,
            pageNum:1
        }, () => {
            this.getData()
        })
    }

    /**
     * 切换按课堂按开课单位 tabType 1按课堂 2按开课单位
     * @param {*} tabType 
     */
    handleTab(tabType) {
        sessionStorage.setItem('tabType', tabType)
        this.setState({
            tabType,
            replyStatus: '',
            pageNum:1
        }, () => {
            this.getData()
        })
    }

    /**
     * 翻页
     * @param {*} pageNum 页码
     */
    jumpPage(pageNum) {
        this.setState({
            pageNum
        }, () => {
            this.getData()
        })
    }

    /**
     * 头部公共组件回调
     * @param {*} info 
     */
    getHeaderParams(info) {
        this.props.saveParams(info)
        this.props.ws_saveGlobalData(info, 'ISCED_headerParams')
        this.setState({
            headParams: info
        }, () => {
            this.getData()
            this.getStaticData()
        })

    }

    /**
     * 获得统计数据
     */
    getStaticData() {
        let { roleType, belongOrgId } = G.ISCED_curRoleInfo;
        let { headParams } = this.state;
        let param = {
            ...headParams,
            dataType: (roleType === "1" || roleType === '2') ? '2' : '1', //1院级 2校级
            orgId: (roleType === "1" || roleType === '2') ? G.ISCED_orgcode : belongOrgId,
        }

        this.props.getStaticData(param)
    }

    /**
     * 获得全部数据
     */
    getData() {
        let { tabType } = this.state;
        if (tabType == '1') {
            this.getClassData()
        } else {
            this.getColData()
        }

    }

    //按课堂请求数据
    getClassData() {
        let { roleType, belongOrgId } = G.ISCED_curRoleInfo;
        let { pageNum, pageSize, replyStatus, collegeId, headParams } = this.state;
        let param = {
            ...headParams,
            dataType: (roleType === "1" || roleType === '2') ? '2' : '1', //1院级 2校级
            replyStatus,
            // orgId: (roleType==="1" || roleType === '2') ? belongOrgId : collegeId,
            orgId: (roleType === "3" || roleType === '4') ? belongOrgId : '',
            pageNum,
            pageSize
        }
        this.props.getClassData(param)
    }

    //按开课单位请求数据
    getColData() {
        let { roleType, belongOrgId } = G.ISCED_curRoleInfo;
        let { pageNum, pageSize, headParams } = this.state;
        let param = {
            ...headParams,
            pageNum,
            pageSize,
            dataType: (roleType === "1" || roleType === '2') ? '2' : '1', //1院级 2校级
        }

        this.props.getColData(param)
    }

    /**
     * 下钻去视频页
     * @param {*} id 课程id
     */
    onGoVideo(id) {
        let { tabType } = this.state;
        sessionStorage.setItem('tabType', tabType)
        let content = [
            { name: '异常情况跟踪', url: '/home/imp/follow' },
            { name: '课堂明细', url: '' }
        ]

        this.props.ws_saveGlobalData(content, 'ISCED_content')
        // sessionStorage.setItem('content',JSON.stringify(content))
        this.props.history.push(`/home/imp/follow/null/${id}`)
    }

    /**
     * 下钻详情
     * @param {*} collegeId  开课单位id
     */
    goDetail(collegeId) {
        let { tabType } = this.state;
        sessionStorage.setItem('tabType', tabType)
        this.props.history.push(`/home/imp/follow/${collegeId}`)
    }

    getFomatter(value) {
        if (value) {
            let data = Number(value)
            let str;
            if (data > 10000) {
                str = (data / 10000) + '万'
            } else {
                str = value
            }
            return str
        } else {
            return value
        }

    }

    handleReply() {
        this.setState({
            visible: true
        })
    }

    render() {
        let { tabType, replyStatus, headParams, pageNum, visible, id, type, claRoomId } = this.state;
        let { loading, dataColList, dataClaList, total, errorStateNum, replyNum, expireReplyNum, applyNorNum, noApplyNum, allowApplyNum, realCourseNum } = this.props.TJ_follow_reducer;
        let dataList = [];
        if (tabType == '1') {
            dataList = dataClaList
        } else {
            dataList = dataColList
        }
        return (
            <div className='tj-followNew'>
                <div className='tj-timeWdge' ref={(node) => this.node = node}>
                    <ImpHeader getHeaderParams={this.getHeaderParams} isSave={true} />
                </div>
                <div className='tj-followNew-top'>
                    <div className='tj-followNew-block'>
                        <div className='tj-followNew-tit'>开课单位回复<span>（课程数）</span></div>
                        <div className='tj-followNew-cnt'>
                            <div className='tj-followNew-col-item'>
                                <SVG type='yckc' />
                                <div className='tj-followNew-total'>
                                    <div>{errorStateNum || '--'}</div>
                                    <div>异常情况</div>
                                </div>
                            </div>
                            <div className='tj-followNew-col-item'>
                                <SVG type='zongshu' />
                                <div className='tj-followNew-total'>
                                    <div>{replyNum || '--'}</div>
                                    <div>已回复</div>
                                </div>
                            </div>
                            <div className='tj-followNew-col-item'>
                                <SVG type='whf' />
                                <div className='tj-followNew-total'>
                                    <div>{expireReplyNum || '--'}</div>
                                    <div>过期未回复</div>
                                </div>
                            </div>
                            <div className='tj-followNew-col-item'>
                                <SVG type='sqwzc' />
                                <div className='tj-followNew-total'>
                                    <div>{applyNorNum || '--'}</div>
                                    <div>申请为正常</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='tj-followNew-block'>
                        <div className='tj-followNew-tit' style={{ marginBottom: 22 }}>校级回复<span>（课程数）</span></div>
                        <div className='tj-followNew-cnt' style={{ height: 'calc(100% - 50px)' }}>
                            {
                                !noApplyNum && !allowApplyNum ? <NoDataAndLoading loading={false} /> :
                                    <React.Fragment>
                                        <div className='pie-cnt'>
                                            <ImpPie data={{ noApplyNum, allowApplyNum }} />
                                        </div>
                                        <div className='pie-legend'>
                                            <div className='pie-legend-item'>
                                                <span style={{ background: '#59b1ee' }}></span><span>同意申请</span><span>{allowApplyNum || '--'}</span>
                                            </div>
                                            <div className='pie-legend-item'>
                                                <span style={{ background: '#ff4c4c' }}></span><span>不同意申请</span><span>{noApplyNum || '--'}</span>
                                            </div>
                                        </div>
                                    </React.Fragment>
                            }

                        </div>
                    </div>
                    <div className='tj-followNew-block'>
                        <div className='tj-followNew-tit' style={{ marginBottom: 0 }}>最终结论</div>
                        <div className='info'>
                            <div className='info-cnt'>
                                <div className='info-realCourse'>
                                    <span>{this.getFomatter(realCourseNum) || '--'}</span>
                                </div>
                                <div>实际问题课程数</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='tj-replyBox' style={{ minHeight: 'calc(100% - 254px)' }}>
                    <FollowTable
                        checkList={[{ value: '', name: '全部' }, { value: '0', name: '开课单位未回复' }, { value: '1', name: '开课单位已回复' },{ value: '2', name: '开课单位过期未回复' }]}
                        changeCheckKey={this.handleReplyStatus}
                        jumpPage={this.jumpPage}
                        changeReplyType={this.handleTab}
                        replyList={dataList}
                        replyStatus={replyStatus}
                        replyType={tabType}
                        headParams={headParams}
                        allLoading={false}
                        goVideo={this.onGoVideo}
                        handleReply={(claRoomId) => this.setState({ visible: true, claRoomId })}
                        onCancel={() => this.setState({ visible: false })}
                        visible={visible}
                        pageNum={pageNum}
                        pageSize={20}
                        loading={loading}
                        total={total}
                        id={claRoomId}
                        goDetail={this.goDetail}
                        title={'异常情况列表'}
                    />
                </div>

            </div >
        )
    }

}


export default Follow