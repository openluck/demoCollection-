/*
 * @Author: xq
 * @Date: 2020-02-19 15:34:58
 * @LastEditors: xq
 * @LastEditTime: 2020-02-21 11:35:54
 * 課程畫像-課堂互動
 */
import React from 'react';
import { Select, Spin } from 'antd';
import _ from 'lodash';
import img_noData from '../../../../media/picture/img_noData.png'
import { request } from "../../../../util/request";
import SVG from "../../../public/svg"
import XqLine from '../public/xqLine';
import Tea_btm_cont from "./../public/tea_btm_cont";
import ContLine from './contLine'
import NoDataAndLoading from './../public/noDataAndLoading';

const { Option } = Select;

export default class JxzlKthd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            baseData: {},        // 公共入参获取的基础数据
            attenPie: {},        // 到课率分布（格式化后） 
            teaPie: null,          // 教师分布 （格式化后）
            teaLine: null,
            checkTypeCls: '1',    // 教学班对比：1 学生起立     2 教师上下讲台
            checkTypeQs: '1',    // 课堂互动趋势：1 学生起立     2 教师上下讲台
            lineParam: ['', ''],
            oldParam: {},
            teaComparBar: [],     // 到课率对比分析-柱图
            teaComparSort: '0',  // 教学班对比分析-柱图-排序  "0" 降序 1"升序"
            checkClassId1: '',     // 下拉教学班班级id
            checkClassId2: '',     // 下拉教学班班级id
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
        this.actionCompar = this.actionCompar.bind(this);
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
                classesList: _list,
                checkTypeCls: '1',    // 教学班对比：1 学生起立     2 教师上下讲台
                checkTypeQs: '1',
                checkType: '1',
            })
        }
    }

    /**
     * @desc 学生起立/教师上下讲台
     * @param {*} name  checkTypeCls:教学班对比    checkTypeQs：互动趋势
     * @param {*} id 
     */
    actionCompar(id) {
        let { checkTypeCls, checkTypeQs } = this.state;
        // 教学班对比 柱图
        if (checkTypeCls === id) return false;
        this.setState({ checkTypeCls: id });
        this.getTeaBar(this.state.oldParam, { checkTypeCls: id })
    }

    /**
     * @desc 教学班及类型切换 
     * @param {Object} obj 
     */
    classChange(obj) {
        if (obj.arr) {
            obj.arr.map(dt => {
                // type切换请求趋势数据
                if(!dt.teaClaId && !dt.teaClaName) {
                    return
                }
                let param = Object.assign(this.state.oldParam, { checkClassId: dt.teaClaId, checkType: obj.type })
                // console.log('param', param)
                this.getTeaAtten(param)
            })
        } else {
            // 请求对应教学班趋势数据
            let param = Object.assign(this.state.oldParam, { checkClassId: obj.id, checkType: obj.type })
            this.getTeaAtten(param)
        }

    }

    /**
     * @desc 获取教学班到课率对比分析数据 teaComparBar
     */
    getTeaBar(param, chaObj) {
        if (!this.state.isLoadBar) {
            this.setState({ isLoadBar: true })
        }

        let _param = _.cloneDeep(param);
        _param.sortType = chaObj && chaObj.teaComparSort ? chaObj.teaComparSort : this.state.teaComparSort;
        _param.checkType = chaObj && chaObj.checkTypeCls ? chaObj.checkTypeCls : this.state.checkTypeCls;

        request('/api/image/getCourceActiveAna', _param, res => {
            if (res.result && res.data && res.data.length) {
                let resData = res.data;
                let xData = [], yData = [];
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
        let _param = _.cloneDeep(param);
        _param = _param.checkClassId ? _param : Object.assign(_param, { checkClassId: '' });
        _param = _param.checkType ? _param : Object.assign(_param, { checkType: '1' });

        request('/api/image/getCourceTrend', _param, res => {
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
     * @desc 获取学生起立及教师上下讲台数据 /api/image/getCourceToClass
     * @param {*} name 
     * @param {*} val 
     */
    getBaseData(param) {
        if (!this.state.isLoadBase) {
            this.setState({ isLoadBase: true })
        }
        request('/api/image/getCourceActive', param, res => {
            if (res.result && res.data) {
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
            checkTypeCls,
            checkTypeQs,
            classesList,
            checkClassId1,
            checkClassId2,
            isLoadBase,
            isLoadBar,
            isLoadLine
        } = this.state;
        let checkStuProp = baseData && baseData.checkStuProp ? baseData.checkStuProp : null;
        let checkTeaProp = baseData && baseData.checkTeaProp ? baseData.checkTeaProp : null;
        // console.log('render teaLine :',teaLine)
        return (
            <div className='xq-kchx-ul'>
                <div className='xq-kchx-ul-t'>课堂互动</div>
                <div className='xq-kchx-ul-con'>
                    {
                        isLoadBase
                            ? <div className='xq-load-all'><Spin /></div>
                            : (
                                baseData
                                    ? <div className='xq-kchx-li' style={{ height: '180px' }}>
                                        <div className='xq-kchx-li-datas'>
                                            <div className='xq-kchx-datas-all'>
                                                <div style={{ fontSize: '14px', color: '#333' }}>
                                                    平均
                                                    <span style={{ color: '#313233', fontSize: '28px' }}>
                                                        {baseData.stuProp || '--'}
                                                    </span>次/课程
                                        </div>
                                                <div>学生起立</div>
                                            </div>
                                            <div className='xq-kchx-datas-ul'>
                                                <div className='xq-kchx-datas-li'>
                                                    <span>{checkStuProp ? checkStuProp.name : ''}</span>
                                                    {
                                                        checkStuProp && checkStuProp.sortType !== '0'
                                                            ? <SVG type={checkStuProp.sortType === '2' ? 'imgDown' : 'imgUp'} />
                                                            : null
                                                    }
                                                    <span>{checkStuProp ? checkStuProp.changeProp : '-- '}</span>
                                                    %
                                        </div>
                                            </div>
                                        </div>
                                        <div className='xq-kchx-li-datas'>
                                            <div className='xq-kchx-datas-all'>
                                                <div style={{ fontSize: '14px', color: '#333' }}>
                                                    平均
                                                    <span style={{ color: '#313233', fontSize: '28px' }}>
                                                        {baseData.teaProp || '-- '}
                                                    </span>次/课程
                                        </div>
                                                <div>教师上下讲台</div>
                                            </div>
                                            <div className='xq-kchx-datas-ul'>
                                                <div className='xq-kchx-datas-li'>
                                                    <span>{checkTeaProp ? checkTeaProp.name : ''}</span>
                                                    {
                                                        checkTeaProp && checkTeaProp.sortType !== '0'
                                                            ? <SVG type={checkTeaProp.sortType === '2' ? 'imgDown' : 'imgUp'} />
                                                            : null
                                                    }
                                                    <span>{checkTeaProp ? checkTeaProp.changeProp : '-- '}</span>
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
                        <div className='xq-kthd-types'>
                          
                            <div
                                className={checkTypeCls === '2' ? 'curr' : ''}
                                onClick={() => this.actionCompar('2')}
                            >
                                教师上下讲台
                            </div>
                            <div
                                className={checkTypeCls === '1' ? 'curr' : ''}
                                onClick={() => this.actionCompar('1')}
                            >
                                学生起立
                            </div>
                          
                        </div>
                    </div>
                    <div className='xq-kchx-li' style={{ height: '320px', padding: '0 20px' }}>
                        {
                            !isLoadBar && teaComparBar && teaComparBar.xData.length
                                ? <Tea_btm_cont barData={teaComparBar} 
                                      barType="hd"  
                                />
                                : <NoDataAndLoading loading={isLoadBar} />
                        }
                    </div>
                    <ContLine
                        title="课堂互动趋势"
                        list={classesList}
                        onChange={this.classChange}
                        liData={teaLine}
                        load={isLoadLine}
                        color={['#1890ff', '#4ecb73', '#fbd437']}
                        isHas={true}
                        timeType={this.props.faParam.timeType}
                    />
                </div>
            </div>
        )
    }
}
