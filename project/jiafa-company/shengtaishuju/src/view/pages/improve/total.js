/*
 * @Author: tj 
 * @Date: 2021-01-15 13:16:24 
 * @Last Modified by: tj
 * @Last Modified time: 2021-02-02 16:40:55
 * 教学改进-首页
 */

import React, { Component } from 'react';
import ImpHeader from '../../components/improve/imp_header';
import '../../../style/impTotal.scss';
import SVG from './../../public/svg';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ImpBar from './../../components/improve/impBar';
import ImpPie from './../../components/improve/impPie';
import { connect } from 'react-redux';
import G from './../../../config/g';
import moment from "moment";
import NoDataAndLoading from './../../components/image/public/noDataAndLoading';
import { getAllotInfo, getHandleInfo, getHandleCoInfo, getHandleCoBar } from './../../../request/tj_impTotal_request';
import { clearImpTime, saveImpTime } from './../../../redux/tj-impHeader.reducer';
@connect(state => state.TJ_impHeader_reducer, { clearImpTime, saveImpTime })
class ImproveTotal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alertCourseNum: '', //异常情况下发-预警课程数
            allotCourseNum: '', //异常情况下发-下发课程数
            allotCourseProp: '', //异常情况下发-下发课程占比
            barList: [], //异常情况追踪-开课单位top5
            realCourseNum:0, //异常情况追踪-实际问题课程数
            barLoading: true, 
            errorStateNum: '', //异常情况回复-异常情况数
            replyNum: '', //异常情况回复-已回复数
            expireReplyNum: '', //异常情况回复-过期未回复数
            applyNorNum: '', //异常情况回复-申请为正常数
            noApplyNum: '', //异常情况回复-不同意申请数
            allowApplyNum: '' //异常情况回复-同意申请数
        }
    }
    componentDidMount() {
        this.props.clearImpTime()
    }
    componentWillUnmount() {
        this.props.clearImpTime()
        // this.props.saveImpTime({
        //     semesterId: G.ISCED_cutSemesterData && G.ISCED_cutSemesterData.semesterId || '',
        //     timeType: '1',
        //     selTime:
        //         G.ISCED_cutSemesterData && G.ISCED_cutSemesterData.isCutSemester === "1"
        //             ? moment(new Date()).format("YYYY-MM-DD")
        //             : G.ISCED_cutSemesterData.startTime || '', //选择的时间参数入参
        //     selDate: '', 
        //     selWeek: '', 
        //     selMonth: ''
        // })
    }
    getHeaderParams(info) {
        console.log('info', info)
        this.getData(info)
    }

    /**
     * 校级调用接口
     * @param {Object} params 接口入参
     */
    getData(params) {
        let paramss = {
            ...params,
            // collegeId: ''
        }
        // 获取下发
        getAllotInfo(params).then(res => {
            console.log(res)
            if (res.data.result) {
                let { allotCourseNum, alertCourseNum, allotCourseProp } = res.data.data
                this.setState({
                    alertCourseNum,
                    allotCourseNum,
                    allotCourseProp
                })
            }
        })
        // 获取回复
        getHandleInfo(paramss).then(res => {
            if (res.data.result) {
                let { errorStateNum, replyNum, expireReplyNum,applyNorNum,noApplyNum,allowApplyNum } = res.data.data
                this.setState({
                    errorStateNum,
                    replyNum,
                    expireReplyNum,
                    applyNorNum,
                    noApplyNum,
                    allowApplyNum
                })
            }
        })

        // 获取top5柱状图
        getHandleCoBar(params).then(res => {
            if (res.data.result) {
                // let data = res.data.errorCourseList.reverse()
                // this.setState({
                //     barList: data,
                //     realCourseNum,
                //     barLoading: false
                // })
                let data = res.data.data.errorCourseList.reverse()
                this.setState({
                    barList: data,
                    realCourseNum:res.data.data.realCourseNum,
                    barLoading: false
                })
            } else {
                this.setState({
                    barLoading: false
                })
            }
        }, error => {
            this.setState({
                barLoading: false
            })
        })

    }

    getFomatter(value){
        let data = Number(value)
        let str;
        if(data>10000){
          str=(data/10000)+'万'
        }else{
           str=value
        }
        return str
    }

    getVaild(value){
        if(typeof value=='number'){
            return value
        }else{
            return '--'
        }
    }

    render() {
        let { timeType, barList, alertCourseNum, allotCourseNum, allotCourseProp,realCourseNum
            , barLoading, errorStateNum, replyNum, expireReplyNum, applyNorNum, noApplyNum, allowApplyNum
        } = this.state;
        // let info = G.ISCED_curRoleInfo;
        // info = _.find(JSON.parse(JSON.stringify(G.ISCED_roleData.roleData)), o => {return (o.roleId === '3' || o.roleId === '4') })
        // console.log(info)
        return (
            <div className='tj-imp-total'>
                <ImpHeader isSave={false} getHeaderParams={this.getHeaderParams.bind(this)} />
                <div className='tj-tmp-view'>
                    <PerfectScrollbar>
                        <div className='tmp-cnt allot'>
                            <span className='order'>1</span>
                            <span className='tit'>异常情况下发</span>
                            <br />
                            <div className='line'></div>
                            <div className='cnt-wrap'>
                                <div className='cnt-item'>
                                    <span className='data'>{this.getVaild(alertCourseNum)}</span>
                                    <div className='title'>
                                        <SVG type='yujing' /><span>预警课程数</span>
                                    </div>
                                </div>
                                <div className='cnt-item'>
                                    <span className='data'>{this.getVaild(allotCourseNum)}</span>
                                    <div className='title'>
                                        <SVG type='zongshu' /><span>下发课程数</span>
                                    </div>
                                </div>
                                <div className='cnt-item'>
                                    <span className='data'>{allotCourseProp || '--'}</span><span style={{ fontSize: '16px' }}>%</span>
                                    <div className='title'>
                                        <SVG type='da_jskkl' /><span>下发课程数占比</span>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className='tmp-cnt handle'>
                            <span className='order'>2</span>
                            <span className='tit'>异常情况回复</span>
                            <br />
                            <div className='line'></div>
                            <div className='handle-cnt'>
                                <div className='cnt-wrap'>
                                    <div className='label-tit'>开课单位回复<span>（课程数）</span></div>
                                    <div className='cnt-item'>
                                        <span className='data'>{this.getVaild(errorStateNum)}</span>
                                        <div className='title'>
                                            <SVG type='yckc' /><span>异常情况</span>
                                        </div>
                                    </div>
                                    <div className='cnt-item'>
                                        <span className='data'>{this.getVaild(replyNum)}</span>
                                        <div className='title'>
                                            <SVG type='zongshu' /><span>已回复</span>
                                        </div>
                                    </div>
                                    <div className='cnt-item'>
                                        <span className='data'>{this.getVaild(expireReplyNum)}</span>
                                        <div className='title'>
                                            <SVG type='whf' /><span>过期未回复</span>
                                        </div>
                                    </div>
                                    <div className='cnt-item'>
                                        <span className='data'>{this.getVaild(applyNorNum)}</span>
                                        <div className='title'>
                                            <SVG type='sqwzc' /><span>申请为正常</span>
                                        </div>
                                    </div>
                                </div>

                                <div className='cnt-wrap'>
                                    <div className='label-tit'>校级回复<span>（课程数）</span></div>
                                    <div className='pie-cnt'>
                                        <ImpPie data={{ noApplyNum, allowApplyNum }} />
                                    </div>
                                    <div className='pie-legend'>
                                        <div className='pie-legend-item'>
                                            <span style={{ background: '#59b1ee' }}></span><span>同意申请</span><span>{allowApplyNum}</span>
                                        </div>
                                        <div className='pie-legend-item'>
                                            <span style={{ background: '#ff4c4c' }}></span><span>不同意申请</span><span>{noApplyNum}</span>
                                        </div>
                                    </div>

                                </div>

                            </div>

                        </div>
                        <div className='tmp-cnt effect'>
                            <span className='order'>3</span>
                            <span className='tit'>异常情况跟踪</span>
                            <br />
                            <div className='cnt-wrap'>
                                <div className='left-info'>
                                    <div>实际问题课程数</div>
                                    <div className='info'>
                                        <div className='info-cnt'>
                                            <div className='info-realCourse'>
                                                <span>{this.getFomatter(realCourseNum)}</span>
                                            </div>
                                            <div>课程</div>
                                        </div>
                                    </div>

                                </div>
                                <div className='right-bar'>
                                    <div className='bar-tit'>开课单位TOP5<span>（实际问题课程）</span></div>
                                    <div className='bar-cnt'>
                                        {
                                            barLoading ?
                                                <NoDataAndLoading loading={true} /> :
                                                barList.length ?
                                                    <ImpBar data={barList} />
                                                    :
                                                    <NoDataAndLoading loading={false} />
                                        }
                                    </div>
                                </div>
                                <div className='split-line'></div>
                            </div>
                        </div>
                    </PerfectScrollbar>
                </div>
            </div>
        )
    }
}
export default ImproveTotal;