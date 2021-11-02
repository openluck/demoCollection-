/*
 * @Autor: xq
 * @Date: 2020-02-16 17:51:35
 * @LastEditors: xq
 * @LastEditTime: 2020-02-21 12:47:28
 * 课程画像-教师考勤
 */
import React from "react";
import SVG from "../../../public/svg"
import { Spin, message } from 'antd';
import _ from 'lodash';
import img_noData from '../../../../media/picture/img_noData.png'
import { request } from "../../../../util/request";
import XqLine from '../public/xqLine';
import ColorsPieEcharts from '../public/ColorsPieEcharts'
import Tea_btm_cont from "./../public/tea_btm_cont";
import { getConfigData } from './../../../../config/actionConfig'
import { withRouter } from 'react-router-dom';
import { getAttCode } from './../public/jumpFun'
import U from './../../../../util/_util'
import G from './../../../../config/g'

const getMonthDate = U.getMonthDate
@withRouter
export default class JXZLJskq extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            baseData: null,        // 公共入参获取的基础数据
            attenPie: null,        // 考勤分布（格式化后） 
            teaPie: null,          // 教师分布 （格式化后）
            teaLine: null,          // 考勤趋势总体数据
            checkLine: 'teaAttNormal', // 考勤趋势选中项
            teaComparBar: [],     // 教师对比柱图数据
            teaComparType: '1', // 教师对比分析-柱图-考勤类型
            teaComparSort: '0', // 教师对比分析-柱图-排序  "0" 降序 1"升序"
            teaCheckTrend: '1', // 教师考勤趋势-折线-考勤类型   1 正常 / 2迟到 /3 早退 / 4 缺勤 / 5 调换课
            oldParam: null,
            isLoadBase: true,
            isLoadBar: true,
            isLoadLine: true,
        };
        this.teaComparChange = this.teaComparChange.bind(this);
        this.getBaseData = this.getBaseData.bind(this);
        this.pieFormat = this.pieFormat.bind(this);
        this.getTeaBar = this.getTeaBar.bind(this);
        this.getTeaAtten = this.getTeaAtten.bind(this);
        this.changeAttenLine = this.changeAttenLine.bind(this);
        this.goRouter = this.goRouter.bind(this);

        this.tabs = [
            { name: '正常', key: '1' },
            { name: '迟到', key: '2' },
            { name: '早退', key: '3' },
            { name: '缺勤', key: '4' },
            { name: '调换课', key: '5' },
            { name: '请假', key: '6' },
        ];
    }


    componentDidMount() {
        let _param = JSON.parse(JSON.stringify(this.props.faParam));
        this.setState({
            oldParam: null
        })
    }

    componentDidUpdate(prevProps, prevState) {
        let _newP = this.props.faParam;
        // console.log(_newP)
        if (_newP && _newP !== this.state.oldParam) {
            // console.log('_newP', _newP)
            this.getBaseData(_newP);
            this.getTeaBar(_newP);
            this.getTeaAtten(_newP);
            this.setState({
                oldParam: _newP
            })
        }
    }

    /**
     * 获取教师对比分析数据 teaComparBar
     * @param {Object} param 请求参数
     * @param {Object} chaObj 排序及类型切换
     */
    getTeaBar(param, chaObj) {
        // console.log(param)
        if (!this.state.isLoadBar) {
            this.setState({ isLoadBar: true })
        }
        let _param = _.cloneDeep(param)
        if (chaObj) {
            // 排序或类型参数变更
            if (chaObj.xqName && chaObj.xqName === 'sort') {
                // 更新排序
                _param.sortType = chaObj.teaComparSort ? chaObj.teaComparSort : '0';
                _param.checkType = this.state.teaComparType;
            } else if (chaObj.xqName && chaObj.xqName === 'type') {
                // 更新考勤类型
                _param.checkType = chaObj.teaComparType ? chaObj.teaComparType : '1';
                _param.sortType = this.state.teaComparSort;
            }
        } else {
            // 外层参数变更
            _param.sortType = '1';
            _param.checkType = '1';
        }
        request('/api/image/getCourceAttenAna', _param, res => {
            if (res.result && res.data) {
                let xData = [], yData = [];
                let resData = res.data;
                if (resData.length) {
                    for (let i = 0; i < resData.length; i++) {
                        xData.push(resData[i].name);
                        yData.push(resData[i].prop);
                    }
                    this.setState({
                        teaComparBar: { xData, yData },
                        isLoadBar: false
                    })
                } else {
                    this.setState({
                        teaComparBar: null,
                        isLoadBar: false
                    })
                }
            } else {
                message.warning(res.message)
                this.setState({
                    teaComparBar: null,
                    isLoadBar: false
                })
            }
        })
    }

    /**
     * @desc 获取教师考勤趋势-折线图数据
     * @param {*} param 请求参数
     * @param {*} changObj 考勤类型切换
     */
    getTeaAtten(param, chaObj) {
        if (!this.state.isLoadLine) {
            this.setState({ isLoadLine: true })
        }
        let _param = _.cloneDeep(param);
        _param.checkType = chaObj && chaObj.teaCheckTrend ? chaObj.teaCheckTrend : '1'
        // console.log('获取考勤折线图 _param:',_param)

        request('/api/image/getCourceAttenTrend', _param, res => {
            if (res.result) {
                let data = res.data;
                // 处理考勤数据
                if (data.length) {
                    let conData = getConfigData(data, 7);
                    console.log(conData)
                    // 获取外层课程名称
                    let t = _.find(G.ISCED_courseList, { courseId: _param.courseId })
                    conData.parName = t.courseName;
                    this.setState({
                        teaLine: conData,
                        isLoadLine: false
                    })
                } else {
                    this.setState({
                        teaLine: null,
                        isLoadLine: false
                    })
                }
            } else {
                message.warning(res.message)
                this.setState({
                    teaLine: null,
                    isLoadLine: false
                })
            }
        })
    }

    /**
     * 修改考勤趋势类型及数据
     * @param {String} type 
     */
    changeAttenLine(type) {
        let name;
        switch (type) {
            case '1': // 正常
                name = 'teaAttNormal';
                break;
            case '2': // 迟到
                name = 'teaAttLate';
                break;
            case '3': // 早退
                name = 'teaEarly';
                break;
            case '4': // 缺勤
                name = 'teaAttAbsence';
                break;
            case '5': // 调换课
                name = 'teaAttExchange';
                break;
            case '6': // 请假
                name = 'leave';
                break;
        }
        if (name) {
            this.setState({
                checkLine: name
            })
        }
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
            if (data) {
                ressultData.color = ['#3aa1ff', '#f47a8f', '#eed46d', '#4ecb73', '#975fe5', "#f66464",];
                // console.log(data)
                ressultData.scaleData = [
                    { name: '调换课', prop: data.courseChange || 0, key: getAttCode('courseChange', 1) },
                    { name: '缺勤', prop: data.absence || 0, key: getAttCode('absence', 1) },
                    { name: '迟到', prop: data.beLate || 0, key: getAttCode('beLate', 1) },
                    { name: '正常', prop: data.normal || 0, key: getAttCode('normal', 1) },
                    { name: '早退', prop: data.leaveEarly || 0, key: getAttCode('leaveEarly', 1) },
                    { name: '请假', prop: data.leave || 0, key: getAttCode('leave', 1) },
                ];
                this.setState({ attenPie: ressultData })
            } else {
                this.setState({ attenPie: null })
            }

        } else if (name === 'teaPie') {
            let _list = [];
            if (data && data.length) {
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
     * 考勤分布跳转
     * @param {Number} ind 数组下标
     */
    goRouter(ind) {
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
            if(arr.length) {
                start = new Date(arr[0]).getTime()
                end = new Date(arr[1]).getTime()
            }
        }
        this.props.history.push(`/home/det/ordtea/${info.key}/null/${start}/${end}/${faParam.collegeId}/null/${faParam.courseId}/${faParam.semesterId}/${faParam.couTypeId}`)
    }

    /**
     * @desc 获取教师考勤基本信息和异常分析 /api/image/getCourceTeaAtten
     * @param {*} name 
     * @param {*} val 
     */
    getBaseData(param) {
        if (!this.state.isLoadBase) {
            this.setState({ isLoadBase: true })
        }
        // console.log(param)
        request('/api/image/getCourceTeaAtten', param, res => {
            if (res.result && res.data) {
                let resData = res.data;
                // console.log(res.data)
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
     * @desc 排序和考勤状态切换 公共方法
     * @param {string} name 要修改的state字段。'teaComparType' 教师对比-考勤、'teaComparSort 教师对比-排序'、'teaCheckTrend'
     * @param {string} val  选中的值
     */
    teaComparChange(name, val) {
        if (val === this.state[name]) return false;
        this.setState({ [name]: val }, () => {
            // 该入参最新值
            switch (name) {
                case 'teaComparType':
                    // 教师对比-考勤类型  
                    this.getTeaBar(this.state.oldParam, { teaComparType: val, xqName: 'type' });
                    break;
                case 'teaComparSort':
                    // 教师对比-排序
                    this.getTeaBar(this.state.oldParam, { teaComparSort: val, xqName: 'sort' });
                    break;
                case 'teaCheckTrend':
                    // 考勤趋势-考勤类型
                    // console.log('val',val)
                    console.log(this.state.oldParam)
                    this.getTeaAtten(this.state.oldParam, { teaCheckTrend: val, xqName: 'type' });
                    this.changeAttenLine(val)
                    break;
            };
        });
    }

    render() {
        let {
            teaComparType,
            teaComparSort,
            teaCheckTrend,
            baseData,
            attenPie,
            teaPie,
            teaComparBar,
            teaLine,
            isLoadBase,
            isLoadBar,
            isLoadLine,
            checkLine
        } = this.state;
        let checkProp = baseData && baseData.checkProp ? baseData.checkProp : null;
        // console.log('teaComparBar',teaLine ? teaLine[checkLine] : null)
        return (
            <div className='xq-kchx-ul'>
                {/* <div className='xq-kchx-ul-t'>教师考勤</div> */}
                <div className='xq-kchx-ul-con'>
                    {
                        isLoadBase
                            ? <div
                                className='xq-load-all'
                            ><Spin />
                            </div>
                            : (
                                baseData
                                    ? <div className='xq-kchx-li' style={{ height: '320px' }}>
                                        <div className='xq-kchx-li-datas'>
                                            <div className='xq-kchx-datas-all'>
                                                <div>
                                                    {
                                                        baseData.normalProp || baseData.normalProp === 0 ? baseData.normalProp : '--'
                                                    }
                                                    %
                                                </div>
                                                <div>正常率</div>
                                            </div>
                                            <div className='xq-kchx-datas-ul'>
                                                <div className='xq-kchx-datas-li'>
                                                    <span>{checkProp ? checkProp.name : '--'}</span>
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
                                            <div className='xq-li-pie-t'>考勤分布</div>
                                            {
                                                attenPie
                                                    ? <ColorsPieEcharts
                                                        title="人次"//title="人次" title="%"
                                                        // other={8} //将第五位以后的合并为其他
                                                        color={attenPie.color}//每一个，对应scaleData对应下标的颜色
                                                        radius={[60, 75]}
                                                        type={1} //  1 2 不传type 3种样式
                                                        scaleData={attenPie.scaleData}
                                                        goRouter={this.goRouter}
                                                    />
                                                    : <img src={img_noData} className="lxx-noData" />
                                            }
                                        </div>
                                    </div>
                                    : <img src={img_noData} className='xq-noData' />
                            )
                    }
                    <div className='xq-kchx-li-head'>
                        <div className='xq-kchx-li-t'>
                            <span>教师对比分析</span>
                            <div className='xq-kchx-li-sort'>
                                <span
                                    onClick={() => this.teaComparChange('teaComparSort', '1')}
                                    className={teaComparSort === '1' ? 'curr' : ''}
                                >
                                    <SVG type='de_sort3' />
                                </span>
                                <span
                                    onClick={() => this.teaComparChange('teaComparSort', '0')}
                                    className={teaComparSort === '0' ? 'curr' : ''}
                                >
                                    <SVG type='de_sort2' />
                                </span>
                            </div>
                        </div>
                        <div className='xq-kchx-li-tabs'>
                            {
                                this.tabs.map((item, index) => {
                                    return <div
                                        onClick={() => this.teaComparChange('teaComparType', item.key)}
                                        className={teaComparType === item.key
                                            ? 'xq-kchx-li-tab curr'
                                            : 'xq-kchx-li-tab'}
                                        key={index}
                                    >
                                        {item.name}
                                    </div>
                                })
                            }
                        </div>
                    </div>
                    {
                        isLoadBar
                            ? <div
                                className='xq-load-all'
                            ><Spin />
                            </div>
                            : (
                                teaComparBar && teaComparBar.xData
                                    ? <div className='xq-kchx-li' style={{ height: '320px', padding: '0 20px' }}>
                                        <Tea_btm_cont barData={teaComparBar} />
                                    </div>
                                    : <img src={img_noData} className='xq-noData' />
                            )
                    }
                    <div className='xq-kchx-li-head'>
                        <div className='xq-kchx-li-t'>
                            <span>教师考勤趋势</span>
                        </div>
                        <div className='xq-kchx-li-tabs'>
                            {
                                this.tabs.map((item, index) => {
                                    return <div
                                        onClick={() => this.teaComparChange('teaCheckTrend', item.key)}
                                        className={teaCheckTrend === item.key
                                            ? 'xq-kchx-li-tab curr'
                                            : 'xq-kchx-li-tab'}
                                        key={index}
                                    >
                                        {item.name}
                                    </div>
                                })
                            }
                        </div>
                    </div>
                    {
                        isLoadLine
                            ? <div
                                className='xq-load-all'
                            ><Spin />
                            </div>
                            : (
                                teaLine
                                    ? <div className='xq-kchx-li' style={{ height: '320px', display: 'block' }}>
                                        <XqLine
                                            color={['#1890ff', '#4ecb73', '#fbd437']}
                                            xData={teaLine[checkLine].date}
                                            data={[{ name: teaLine.parName, list: teaLine[checkLine].num }]}
                                            yType={'per'}
                                            yName={''}
                                            type={this.props.faParam.timeType}
                                        />
                                    </div>
                                    : <img src={img_noData} className='xq-noData' />
                            )
                    }

                    <div className='xq-kchx-li-head'>
                        <div className='xq-kchx-li-t'>
                            <span>考勤异常分析</span>
                        </div>
                    </div>
                    {
                        isLoadBase
                            ? <div
                                className='xq-load-all'
                            ><Spin />
                            </div>
                            : (
                                baseData
                                    ? <div className='xq-kchx-li' style={{ height: '250px' }}>
                                        <div className='xq-kchx-li-kqyc'>
                                            <div className='xq-kchx-kqyc-top'>
                                                <span>
                                                    {
                                                        baseData.abnormalHour || baseData.abnormalHour === 0 ? baseData.abnormalHour : '--'
                                                    }
                                                </span>
                                                课程
                                            </div>
                                            <div className="lxx-top-name">考勤异常共计</div>
                                        </div>
                                        <div className='xq-kchx-li-pie'>
                                            <div className='xq-li-pie-t' style={{ top: '0' }}>教师分布</div>
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
                                    </div>
                                    : <img src={img_noData} className="lxx-noData" />
                            )
                    }

                </div>
            </div>
        )
    }
}