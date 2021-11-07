/*
 * @Author: xq
 * @Date: 2020-02-19 10:16:52
 * @LastEditors: xq
 * @LastEditTime: 2020-02-20 21:18:57
 * 教学质量-学生听讲反馈
 */
import React from 'react';
import WaveLine from '../public/waveLine';
// import ColorsPieEcharts from '../public/ColorsPieEcharts'
import Radar from '../tea_image/radar'
import { Spin } from 'antd';
import img_noData from '../../../../media/picture/img_noData.png'
import { request } from "../../../../util/request";
import { getConfigData } from './../../../../config/actionConfig'
import PeiLine from './peiLine'
import NoDataAndLoading from './../public/noDataAndLoading';

class JxzlTjfk extends React.Component {
    constructor() {
        super();
        this.state = {
            behavPie: [],     // 学生行为-饼图数据
            behavLine: null,    // 学生行为-折线图数据
            designPie: [],    // 教学设计-饼图
            designLine: null,   // 教学设计-折线图数据
            courPie: [],      // 综合情况-；雷达图
            courLine: null,     // 综合情况-折线图数据
            oldParam: {},
            isLoadPie1: true,
            isLoadPie2: true,
            isLoadPie3: true,
            isLoadLine1: true,
            isLoadLine2: true,
            isLoadLine3: true    // 雷达图
        }
        this.getBehavPie = this.getBehavPie.bind(this);
        this.getBehavLine = this.getBehavLine.bind(this);
        this.getDesignPie = this.getDesignPie.bind(this);
        this.getDesignLine = this.getDesignLine.bind(this);
        this.getCourPie = this.getCourPie.bind(this);
        this.getCourLine = this.getCourLine.bind(this);
    }

    componentDidMount() {
        let _param = JSON.parse(JSON.stringify(this.props.faParam));
        this.setState({
            oldParam: _param
        })
    }

    componentDidUpdate(prevProps, prevState) {
        let _newP = this.props.faParam;
        if (_newP && _newP !== this.state.oldParam) {
            this.getBehavPie(_newP);
            this.getBehavLine(_newP);
            this.getDesignPie(_newP);
            this.getDesignLine(_newP);
            this.getCourPie(_newP);
            this.getCourLine(_newP);
            this.setState({
                oldParam: _newP
            })
        }
    }

    /**
     * @desc 获取数据——学生行为-饼图
     * @param {object} 入参
     */
    getBehavPie(param) {
        if (!this.state.isLoadPie1) {
            this.setState({ isLoadPie1: true })
        }
        request('/api/image/getCourceStuBehPie', param, res => {
            if (res.result && res.data) {
                let resData = res.data;
                let _data = [
                    { name: '阅读', prop: resData.read },
                    { name: '书写', prop: resData.write },
                    { name: '听讲', prop: resData.listen },
                    { name: '举手', prop: resData.handUp },
                    { name: '起立', prop: resData.standUp },
                    { name: '玩手机', prop: resData.playPhone },
                    { name: '趴桌子', prop: resData.onTable }
                ];
                this.setState({
                    behavPie: _data,
                    isLoadPie1: false
                })
            } else {
                this.setState({
                    behavPie: null,
                    isLoadPie1: false
                })
            }
        })

    }

    /**
     * @desc 获取数据——学生表情-饼图
     * @param {object} 入参
     */
    getDesignPie(param) {
        if (!this.state.isLoadPie2) {
            this.setState({ isLoadPie2: true })
        }
        request('/api/image/getCourceStuFacPie', param, res => {
            if (res.result && res.data) {
                let resData = res.data;
                let _data = [
                    { name: '高兴', prop: resData.happy },
                    { name: '害怕', prop: resData.scare },
                    { name: '中性', prop: resData.neuter },
                    { name: '惊讶', prop: resData.amzed },
                    { name: '愤怒', prop: resData.anger },
                    { name: '难过', prop: resData.sad },
                    { name: '厌恶', prop: resData.detest }
                ];
                this.setState({
                    designPie: _data,
                    isLoadPie2: false
                })
            } else {
                this.setState({
                    designPie: null,
                    isLoadPie2: false
                })
            }
        })
    }

    /**
     * @desc 获取数据——综合情况-雷达图
     * @param {object} 入参
     */
    getCourPie(param) {
        if (!this.state.isLoadPie3) {
            this.setState({ isLoadPie3: true })
        }
        request('/api/image/getCourceStuZhRade', param, res => {
            if (res.result && res.data) {
                let resData = res.data;
                let _legend = [], _data = [], _max = 0;
                _data = [resData.involvement, resData.concentration, resData.activation, resData.distrust];
                _max = Math.max(..._data);
                _legend = [
                    { name: '参与度', max: _max },
                    { name: '专注度', max: _max },
                    { name: '活跃度', max: _max },
                    { name: '疑惑度', max: _max }
                ]
                this.setState({
                    courPie: {
                        data: _data,
                        legend: _legend
                    },
                    isLoadPie3: false
                })
            } else {
                this.setState({
                    courPie: null,
                    isLoadPie3: false
                })
            }
        })

    }

    /**
     * @desc 获取数据-学生行为-线图
     * @param {object} 入参
     */
    getBehavLine(param) {
        if (!this.state.isLoadLine1) {
            this.setState({ isLoadLine1: true })
        }
        request('/api/image/getCourceStuBehLine', param, res => {
            if (res.result && res.data && res.data.length) {
                let _data = res.data;
                let conData = getConfigData(_data, 4);
                console.log(conData)
                let obj;
                if (conData) {
                    obj = {
                        legend: ['阅读', '书写', '听讲', '举手', '起立', '玩手机', '趴桌子'],
                        date: conData.read.date,
                        num: [
                            conData.read.num || [],
                            conData.write.num || [],
                            conData.listen.num || [],
                            conData.handUp.num || [],
                            conData.standUp.num || [],
                            conData.playPhone.num || [],
                            conData.onTable.num || []
                        ]
                    }
                }
                this.setState({
                    behavLine: obj,
                    isLoadLine1: false
                })
            } else {
                this.setState({
                    behavLine: null,
                    isLoadLine1: false
                })
            }
        })

    }

    /**
     * @desc 获取数据-學生表情-线图
     * @param {object} 入参
     */
    getDesignLine(param) {
        if (!this.state.isLoadLine2) {
            this.setState({ isLoadLine2: true })
        }
        request('/api/image/getCourceStuFacLine', param, res => {
            if (res.result && res.data && res.data.length) {
                let _data = res.data;
                let conData = getConfigData(_data, 5);
                console.log(conData)
                let obj;
                if (conData) {
                    obj = {
                        legend: ['开心', '害怕', '中性', '惊讶', '生气', '伤心', '厌恶'],
                        date: conData.happy.date,
                        num: [
                            conData.happy.num || [],
                            conData.scare.num || [],
                            conData.neuter.num || [],
                            conData.amzed.num || [],
                            conData.anger.num || [],
                            conData.sad.num || [],
                            conData.detest.num || []
                        ]
                    }
                }
                this.setState({
                    designLine: obj,
                    isLoadLine2: false
                })
            } else {
                this.setState({
                    designLine: null,
                    isLoadLine2: false
                })
            }
        })

    }

    /**
     * @desc 获取数据-綜合情況-线图
     * @param {object} 入参
     */
    getCourLine(param) {
        if (!this.state.isLoadLine3) {
            this.setState({ isLoadLine3: true })
        }
        request('/api/image/getCourceStuZhLine', param, res => {
            if (res.result && res.data && res.data.length) {
                let _data = res.data;
                let conData = getConfigData(_data, 6);
                let obj;
                // console.log(conData)
                if (conData) {
                    obj = {
                        legend: ['参与度', '专注度', '活跃度', '疑惑度'],
                        date: conData.involvement.date,
                        num: [
                            conData.involvement.num || [],
                            conData.concentration.num || [],
                            conData.activation.num || [],
                            conData.distrust.num || []
                        ]
                    }
                }
                console.log(obj)
                this.setState({
                    courLine: obj,
                    isLoadLine3: false
                })
            } else {
                this.setState({
                    courLine: null,
                    isLoadLine3: false
                })
            }
        })

    }

    render() {
        let {
            behavPie,
            behavLine,
            designPie,
            designLine,
            courPie,
            courLine,
            isLoadPie1,
            isLoadPie2,
            isLoadPie3,
            isLoadLine1,
            isLoadLine2,
            isLoadLine3
        } = this.state;
        // console.log('isLoadPie3 :', isLoadPie3)
        let color = ['#68d388', '#646fe2', '#a9d13d', '#f47a8f', '#36cbcb', '#975fe5', '#e7e137']
        return (
            <div className='xq-kchx-ul'>
                <PeiLine
                    title="学生行为"
                    loadPie={isLoadPie1}
                    loadLine={isLoadLine1}
                    line={behavLine}
                    pie={behavPie}
                    color={color} 
                    timeType={this.props.faParam.timeType}
                />
                <PeiLine
                    title="学生表情"
                    loadPie={isLoadPie2}
                    loadLine={isLoadLine2}
                    line={designLine}
                    pie={designPie}
                    color={color} 
                    timeType={this.props.faParam.timeType}
                />
                <div className='xq-jxzl-ul'>
                    <div className='xq-jxzl-l'>
                        <div className='xq-jxzl-l-t'>综合情况</div>
                        {
                            !isLoadPie3 && courPie && courPie.data
                                ? <div className='xq-jxzl-l-con'>
                                    <Radar
                                        height={210}
                                        data={courPie}
                                    />
                                </div>
                                : <NoDataAndLoading loading={isLoadPie3} />
                        }
                    </div>
                    <div className='xq-jxzl-r'>
                        {
                            !isLoadLine3 && courLine && courLine.legend
                                ? <WaveLine
                                    legend={courLine.legend}
                                    lineColor={color}
                                    xData={courLine.date}
                                    yData={courLine.num}
                                    type={this.props.faParam.timeType}
                                />
                                : <NoDataAndLoading loading={isLoadLine3} />
                        }
                    </div>
                </div>
            </div>
        )
    }
}
export default JxzlTjfk;
