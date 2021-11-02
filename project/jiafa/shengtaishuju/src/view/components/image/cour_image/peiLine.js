/*
 * @Author: lxx 
 * @Date: 2020-03-18 15:53:50 
 * @Last Modified by: lxx
 * @Last Modified time: 2020-03-18 17:13:13
 * 饼图及折线图组件
 */
import React, { Component } from 'react';
import NoDataAndLoading from './../public/noDataAndLoading';
import WaveLine from '../public/waveLine';
import ColorsPieEcharts from '../public/ColorsPieEcharts'

class PeiLine extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        let { loadPie, loadLine, line, pie, color, title, timeType } = this.props;
        return (
            <div className='xq-jxzl-ul'>
                <div className='xq-jxzl-l'>
                    <div className='xq-jxzl-l-t'>{title}</div>
                    {
                        !loadPie && pie && pie.length
                            ? <div className='xq-jxzl-l-con'>
                                <ColorsPieEcharts
                                    title='%'
                                    color={color}
                                    radius={[50, 65]}
                                    scaleData={pie}
                                />
                            </div>
                            : <NoDataAndLoading loading={loadPie}/>
                    }
                </div>
                <div className='xq-jxzl-r'>
                    {
                        !loadLine && line && line.legend
                            ? <WaveLine
                                legend={line.legend}
                                lineColor={color}
                                xData={line.date}
                                yData={line.num}
                                type={timeType}
                            />
                            : <NoDataAndLoading loading={loadLine} />
                    }
                </div>
            </div>
        );
    }
}

export default PeiLine;