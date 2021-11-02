/*
 * @Author: xq
 * @Date: 2020-02-19 16:34:38
 * @LastEditors: xq
 * @LastEditTime: 2020-02-20 21:52:21
 * 多媒体使用-资源情况
 */
import React from 'react';
import { Select, Spin } from 'antd';
import _ from 'lodash'
import SVG from "../../../public/svg"
import XqLine from '../public/xqLine';
import ReactEcharts from 'echarts-for-react';
import { request } from "../../../../util/request";
import img_noData from '../../../../media/picture/img_noData.png'
import Tea_btm_cont from "./../public/tea_btm_cont";
import ContLine from './contLine'
import NoDataAndLoading from './../public/noDataAndLoading';

const { Option } = Select;
let ReqNum = 0;

export default class JxzlKthd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            baseData: {},        // 公共入参获取的基础数据
            attenPie: {},        // 到课率分布（格式化后） 
            teaPie: {},          // 教师分布 （格式化后）
            teaLine: null,
            checkTypeCls: '1',    // 教学班对比：1 学生起立     2 教师走向讲台
            checkTypeQs: '1',    // 课堂互动趋势：1 学生起立     2 教师走向讲台
            lineParam: ['', ''],
            oldParam: {},
            teaComparBar: [],     // 到课率对比分析-柱图
            teaComparSort: '0',  // 教学班对比分析-柱图-排序  "0" 降序 1"升序"
            // checkClassId1:'0',     // 下拉教学班班级id
            // checkClassId2:'0',     // 下拉教学班班级id
            isLoadBase: true,
            isLoadBar: true,
            isLoadLine: true,
            classesList: [],     // 教学班列表
        };
        this.teaComparChange = this.teaComparChange.bind(this);
        this.getBaseData = this.getBaseData.bind(this);
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
     * @desc 柱状图绘制
     * @param {*} data 
     */
    getOption(data) {
        console.log(data)
        let colors = ['#389af4', '#dfeaff'];
        const option = {
            title: {
                show: true,
                text: '多媒体使用率',
                bottom: '15px',
                left: '82%',
                textStyle: {
                    fontWeight: 'normal',
                    fontSize: 14
                } 
            },
            series: [
                {
                    name: '多媒体使用率',
                    type: 'pie',
                    clockWise: false,
                    height: '180px',
                    weight: '180px',
                    radius: ['60%', '70%'],
                    itemStyle: {
                        normal: {
                            color: colors[0],
                            // shadowColor: '#fff',
                            borderColor: '#fff',
                            borderWidth: 3,
                            label: {
                                show: false
                            },
                            labelLine: {
                                show: false
                            },
                        }
                    },
                    hoverAnimation: false,
                    center: ['88%', '62%'],
                    data: [
                        {
                            value: 100 - data,
                            name: 'invisible',
                            itemStyle: {
                                normal: {
                                    color: colors[1]
                                },
                                emphasis: {
                                    color: colors[1]
                                }
                            }
                        },
                        {
                            value: data,
                            label: {
                                normal: {
                                    formatter: function (params) {
                                        return (params.value ? params.value : '--')  + '%';
                                    },
                                    position: 'center',
                                    show: true,
                                    textStyle: {
                                        fontSize: '20',
                                        color: colors[0]
                                    }
                                }
                            },
                        }]
                }
            ]
        };
        return option
    }

    /**
     * @desc 教学班切换 
     * @param {string} 选中班级的id
     * @param {string} name 'checkClassId1' 表示第一个下拉框，'checkClassId2'表示第二个下拉框
     */
    classChange(id) {
        let param = Object.assign(this.state.oldParam, { checkClassId: id })
        this.getTeaAtten(param)
    }

    /**
     * @desc 获取教学班多媒体使用趋势数据 teaComparBar
     */
    getTeaBar(param, chaObj) {
        if (!this.state.isLoadBar) {
            this.setState({ isLoadBar: true })
        }
        let _param = _.cloneDeep(param);
        _param.sortType = chaObj && chaObj.teaComparSort ? chaObj.teaComparSort : '0';
        request('/api/image/getCourceMediaAna', _param, res => {
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
     * @desc 获取教学班对比分析-折线图数据 
     * @param {*} cid 班级id  string-选择某个班级的id， object-公共入参对象
     */
    getTeaAtten(param) {
        if (!this.state.isLoadLine) {
            this.setState({ isLoadLine: true })
        }
        let _param = _.cloneDeep(param)
        _param = _param.checkClassId ? _param : Object.assign(_param, { checkClassId: '' });
        request('/api/image/getCourceMediaTrend', _param, res => {
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
     * @desc 获取到课率基本信息和到课课堂分析 /api/image/getCourceToClass
     * @param {*} name 
     * @param {*} val 
     */
    getBaseData(param) {
        if (!this.state.isLoadBase) {
            this.setState({ isLoadBase: true })
        }
        request('/api/image/getCourceMedia', param, res => {
            if (res.result) {
                let resData = res.data;
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
            teaComparBar,
            teaLine,
            classesList,
            checkClassId1,
            checkClassId2,
            isLoadBase,
            isLoadBar,
            isLoadLine
        } = this.state;
        let checkProp = baseData && baseData.checkProp ? baseData.checkProp : null;
        return (
            <div className='xq-kchx-ul'>
                <div className='xq-kchx-ul-t'>多媒体情况</div>
                <div className='xq-kchx-ul-con'>
                    <div className='xq-kchx-li-t' style={{ paddingLeft: '20px', paddingTop: '30px' }}>
                        <span>多媒体使用率</span>
                    </div>
                    {
                        isLoadBase
                            ? <div className='xq-load-all'><Spin /></div>
                            : (
                                baseData
                                    ? <div className='xq-kchx-li' style={{ height: '230px' }}>
                                        <div className='xq-kchx-li-datas dmt'>
                                            <div className='xq-kchx-datas-all'>
                                                {/* {
                                                    baseData.normalProp
                                                        ? 
                                                        <ReactEcharts option={this.getOption(baseData.normalProp)} />
                                                        : <img src={img_noData} className='xq-noData' />
                                                } */}
                                                <ReactEcharts 
                                                    option={this.getOption(baseData.normalProp)}
                                                    style={{ height: "100%", width: "100%" }} />
                                            </div>
                                            <div className='xq-kchx-datas-ul'>
                                                <div className='xq-kchx-datas-li'>
                                                    <span>{checkProp && checkProp.name ? checkProp.name : '--'}</span>
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
                                    </div>
                                    : <img src={img_noData} className='xq-noData' />
                            )
                    }

                    <div className='xq-kchx-li-head'>
                        <div className='xq-kchx-li-t'>
                            <span>教师对比分析</span>
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
                    <div className='xq-kchx-li' style={{ height: '320px', padding: '0 20px' }}>
                        {
                            !isLoadBar && teaComparBar && teaComparBar.xData.length
                                ? <Tea_btm_cont barData={teaComparBar} />
                                : <NoDataAndLoading loading={isLoadBar} />
                        }
                    </div>
                    <ContLine
                        title="多媒体使用率趋势"
                        list={classesList}
                        onChange={this.classChange}
                        liData={teaLine}
                        load={isLoadLine}
                        color={['#1890ff', '#4ecb73', '#fbd437']}
                        timeType={this.props.faParam.timeType}
                    />
                </div>
            </div>
        )
    }
}
