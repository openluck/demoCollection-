/*
 * @Author: xq
 * @Date: 2020-02-16 17:51:35
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-02-20 17:23:12
 * 课程画像-课堂违纪
 */

import React from "react";
import { Select, Spin } from 'antd';
import img_noData from '../../../../media/picture/img_noData.png'
import _ from 'lodash'
import SVG from "../../../public/svg"
import XqLine from '../public/xqLine';
import ColorsPieEcharts from '../public/ColorsPieEcharts'
import Tea_btm_cont from "./../public/tea_btm_cont";
import { request } from "../../../../util/request";
import ContLine from './contLine'
import NoDataAndLoading from './../public/noDataAndLoading';
import U from './../../../../util/_util'
import { withRouter } from 'react-router-dom';
import G from './../../../../config/g'

const { Option } = Select;
const getMonthDate = U.getMonthDate
@withRouter
export default class JXZLJskq extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            baseData: {},        // 公共入参获取的基础数据
            attenPie: {},        // 到课率分布（格式化后） 
            teaPie: {},          // 教师分布 （格式化后）
            teaLine: null,          // 考勤趋势
            teaComparBar: [],     // 到课率对比分析-柱图
            teaComparSort: '0',  // 教学班对比分析-柱图-排序  "0" 降序 1"升序"
            // checkClassId1:'0',     // 下拉教学班班级id
            // checkClassId2:'0',     // 下拉教学班班级id
            oldParam: {},
            isLoadBase: true,
            isLoadBar: true,
            isLoadLine: true,
            classesList: [],     // 教学班列表
        };
        this.teaComparChange = this.teaComparChange.bind(this);
        this.getBaseData = this.getBaseData.bind(this);
        this.pieFormat = this.pieFormat.bind(this);
        this.getTeaBar = this.getTeaBar.bind(this);
        this.getTeaAtten = this.getTeaAtten.bind(this);
        this.classChange = this.classChange.bind(this);
        this.formatLineData = this.formatLineData.bind(this);
    }

    componentDidMount() {
        // 获取教学班列表
        let _list = this.props.list;
        this.setState({
            classesList: _list
        })
    }

    componentDidUpdate(prevProps, prevState) {
        let _newP = this.props.faParam;
        if (_newP && _newP !== this.state.oldParam) {
            let _list = this.props.list;
            this.getBaseData(_newP);
            this.getTeaBar(_newP);
            this.getTeaAtten(_newP);
            this.setState({
                oldParam: _newP,
                // lineParam: ['', ''],
                teaComparSort: '0',  // 教学班对比分析-柱图-排序  "0" 降序 1"升序"
                // checkClassId1: '',
                // checkClassId2: '',
                classesList: _list
            })
        }
    }

    /**
     * @desc 折线图数据格式化
     * @param {*} cid 
     */
    formatLineData(data) {
        let xData = [], yData = [], _list = [];;
        let _item = data.lineList;
        for (let i = 0; i < _item.length; i++) {
            xData.push(_item[i].name);
            _list.push(_item[i].prop);
        }
        yData = {
            name: data.name,
            id: data.id,
            list: _list
        };
        return { xData, yData }
    }

    /**
     * @desc 教学班切换
     * @param {string} 选中班级的id
     * @param {string} name 'checkClassId1' 表示第一个下拉框，'checkClassId2'表示第二个下拉框
     */
    classChange(id) {
        // let { oldParam } = this.state;
        let param = Object.assign(this.state.oldParam, { checkClassId: id })
        this.getTeaAtten(param)
    }

    /**
     * @desc 获取教学班对比分析数据 teaComparBar
     */
    getTeaBar(param, chaObj) {
        if (!this.state.isLoadBar) {
            this.setState({ isLoadBar: true })
        }
        let _param = _.cloneDeep(param);
        _param.sortType = chaObj && chaObj.teaComparSort ? chaObj.teaComparSort : '0';
        request('/api/image/getCourceClassDisAna', _param, res => {
            let obj;
            if (res.result && res.data) {
                let resData = res.data;
                let xData = [], yData = [];
                for (let i = 0; i < resData.length; i++) {
                    xData.push(resData[i].name);
                    yData.push(resData[i].prop);
                }
                obj = { xData, yData };

            }
            this.setState({
                teaComparBar: obj,
                isLoadBar: false
            })
        })

    }


    /**
     * @desc 获取课堂违纪趋势-折线图
     * @param {*} cid 班级id  string-选择某个班级的id， object-公共入参对象
     */
    getTeaAtten(param) {
        if (!this.state.isLoadLine) {
            this.setState({ isLoadLine: true })
        }
        let _param = _.cloneDeep(param)
        _param = _param.checkClassId ? _param : Object.assign(_param, { checkClassId: '' });
        request('/api/image/getCourceClassDisTrend', _param, res => {
            if (res.result) {
                let resData = res.data;
                resData.id = _param.checkClassId;
                this.setState({ teaLine: resData, isLoadLine: false });
            } else {
                this.setState({
                    teaLine: null,
                    isLoadLine: false
                });
            }
        })
    }

    /**
     * @desc 饼图数据格式化
     * @param {string} name 模块名称
     * @param {*}      data 模块的接口出参
     */
    pieFormat(name, data) {
        let ressultData = {
            color: [],
            scaleData: []
        };
        if (name === 'attenPie') {
            if (data && data.length) {
                ressultData.color = ['#646fe2', '#36cbcb', '#68d388', '#eed46d', '#f47a8f', '#975fe5'];
                // ressultData.scaleData=data;
                data.map(dt => {
                    ressultData.scaleData.push({
                        id: dt.id,
                        name: dt.name,
                        prop: dt.prop || '0'
                    })
                })
                this.setState({ attenPie: ressultData })
            } else {
                this.setState({ attenPie: null })
            }

        } else if (name === 'teaPie') {
            if (data && data.length) {
                let _list = [];
                ressultData.color = ['#e7ad66', '#ebcd54', '#56bbee', '#7bd9e3'];
                for (let i = 0; i < data.length; i++) {
                    _list.push({
                        name: data[i].name,
                        prop: Number(data[i].hour)
                    })
                }
                ressultData.scaleData = _list;
                this.setState({ teaPie: ressultData })
            } else {
                this.setState({ teaPie: null })
            }

        }
    }

    /**
     * 课堂违纪跳转明细
     * @param {Number} ind 下标
     */
     goRouter = (ind) => {
        let { attenPie } = this.state
        let { faParam } = this.props
        let info = attenPie.scaleData[ind] // 选中模块数据
        console.log('faParam', faParam, info)
        let start, end
        if (faParam.timeType === '1') {
            // 具体日期
            start = new Date(faParam.selTime).getTime();
            end = new Date(faParam.selTime).getTime()
        } else if (faParam.timeType === '2') {
            // 具体周次
            let t = _.find(G.ISCED_cutSemesterData.weekList, o => o.weekId === faParam.selTime)
            if(t) {
                start = t.startTime
                end = t.endTime
            }
        } else if (faParam.timeType === '3') {
            // 具体月份
            let arr = getMonthDate(faParam.selTime)
            if (arr.length) {
                start = new Date(arr[0]).getTime()
                end = new Date(arr[1]).getTime()
            }
        }
        this.props.history.push(`/home/det/ordbre/null/${start}/${end}/${faParam.collegeId}/null/${faParam.courseId}/${info.id}/${faParam.semesterId}/${faParam.couTypeId}`)
    }

    /**
     * @desc 获取到课率基本信息和到课课堂分析 /api/image/getCourceToClass
     * @param {*} name 
     * @param {*} val 
     */
    getBaseData(param) {
        if (!this.state.isLoadBase) {
            this.setState({ isLoadBase: true })
        }
        let _param = _.cloneDeep(param);
        request('/api/image/getCourceClassDis', _param, res => {
            if (res.result) {
                let resData = res.data;
                // 考勤分布数据格式化
                this.pieFormat('attenPie', resData.attenPie);
                // 教师分布数据格式化
                this.pieFormat('teaPie', resData.teacherPie)

                this.setState({
                    baseData: resData,
                    isLoadBase: false
                })
            } else {
                this.setState({
                    baseData: null,
                    isLoadBase: false
                })
            }
        })
    }


    /**
     * @desc 教学班对比分析-(排序/状态切换)
     * @param {string} val  选中的值
     */
    teaComparChange(val) {
        if (val === this.state.teaComparSort) return false;
        this.setState({ teaComparSort: val });

        let param = { teaComparSort: val };
        this.getTeaBar(this.state.oldParam, param);
    }

    render() {
        let {
            teaComparSort,
            baseData,
            attenPie,
            teaPie,
            teaComparBar,
            teaLine,
            isLoadBase,
            isLoadBar,
            isLoadLine,
            classesList,
            // checkClassId1,
            // checkClassId2
        } = this.state;
        let checkProp = baseData && baseData.checkProp ? baseData.checkProp : null;
        return (
            <div className='xq-kchx-ul'>
                <div className='xq-kchx-ul-t'>课堂违纪</div>
                <div className='xq-kchx-ul-con'>
                    <div className='xq-kchx-li' style={{ height: '320px' }}>
                        {
                            !isLoadBase && baseData
                                ? <React.Fragment>
                                    <div className='xq-kchx-li-datas'>
                                        <div className='xq-kchx-datas-all'>
                                            <div style={{ color: '#f7b747' }}>
                                                {baseData.normalProp || baseData.normalProp === 0?baseData.normalProp: '--'}%
                                    </div>
                                            <div>违纪率</div>
                                        </div>
                                        <div className='xq-kchx-datas-ul'>
                                            <div className='xq-kchx-datas-li'>
                                                <span>{checkProp ? checkProp.name : ''}</span>
                                                {
                                                    checkProp && checkProp.sortType !== '0'
                                                        ? <SVG type={checkProp.sortType === '2' ? 'imgDown' : 'imgUp'} />
                                                        : null
                                                }
                                                <span>{checkProp && checkProp.changeProp ? checkProp.changeProp : '-- '}</span>
                                                %
                                    </div>
                                        </div>
                                    </div>
                                    <div className='xq-kchx-li-pie'>
                                        <div className='xq-li-pie-t'>违纪事件分布</div>
                                        {
                                            attenPie
                                                ?
                                                <ColorsPieEcharts
                                                    title="次"//title="人次" title="%"
                                                    // other={8} //将第五位以后的合并为其他
                                                    color={attenPie.color}//每一个，对应scaleData对应下标的颜色
                                                    radius={[60, 75]}
                                                    // type={3} //  1 2 不传type 3种样式
                                                    scaleData={attenPie.scaleData}
                                                    goRouter={this.goRouter}
                                                />
                                                : <img src={img_noData} className="lxx-noData" />
                                        }
                                    </div>
                                </React.Fragment>
                                : <NoDataAndLoading loading={isLoadBase} />

                        }
                    </div>
                    <div className='xq-kchx-li-head'>
                        <div className='xq-kchx-li-t'>
                            <span>教学班对比分析</span>
                            <div className='xq-kchx-li-sort'>
                                <span
                                    onClick={() => this.teaComparChange('1')}
                                    className={teaComparSort === '1' ? 'curr' : ''}
                                >
                                    <SVG type='de_sort3' />
                                </span>
                                <span
                                    onClick={() => this.teaComparChange('0')}
                                    className={teaComparSort === '0' ? 'curr' : ''}
                                >
                                    <SVG type='de_sort2' />
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className='xq-kchx-li' style={{ height: 320, padding: '0 20px' }}>
                        {
                            !isLoadBar && teaComparBar && teaComparBar.xData.length
                                ?
                                <Tea_btm_cont barData={teaComparBar} />
                                : <NoDataAndLoading loading={isLoadBar} />
                        }
                    </div>
                    <ContLine
                        title="违纪率趋势"
                        list={classesList}
                        onChange={this.classChange}
                        liData={teaLine}
                        load={isLoadLine}
                        color={['#1890ff', '#4ecb73', '#fbd437']}
                        timeType={this.props.faParam.timeType}
                    />
                    <div className='xq-kchx-li-head'>
                        <div className='xq-kchx-li-t'>
                            <span>违纪课堂分析</span>
                        </div>
                    </div>
                    <div className='xq-kchx-li' style={{ height: '250px' }}>
                        {
                            !isLoadBase && baseData
                                ? <React.Fragment>
                                    <div className='xq-kchx-li-kqyc'>
                                        <div className='xq-kchx-kqyc-top'>
                                            <span>
                                                {baseData.abnormalHour || baseData.abnormalHour === 0?baseData.abnormalHour : '--'}
                                            </span>
                                            课程
                                    </div>
                                        <div className="lxx-top-name">违纪课堂共计</div>
                                    </div>
                                    <div className='xq-kchx-li-pie'>
                                        <div className='xq-li-pie-t' style={{ top: '0' }}>教学班分布</div>
                                        {
                                            teaPie && teaPie.color
                                                ? <ColorsPieEcharts
                                                    title="课程"//title="人次" title="%"
                                                    // other={8} //将第五位以后的合并为其他
                                                    color={teaPie.color}//每一个，对应scaleData对应下标的颜色
                                                    radius={[45, 60]}
                                                    type={1} //  1 2 不传type 3种样式
                                                    scaleData={teaPie.scaleData}
                                                />
                                                : <img src={img_noData} className='lxx-noData' />
                                        }
                                    </div>
                                </React.Fragment>
                                : <NoDataAndLoading loading={isLoadBase} />

                        }
                    </div>

                </div>
            </div>
        )
    }
}