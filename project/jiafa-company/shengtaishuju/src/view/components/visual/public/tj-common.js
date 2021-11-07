/*
 * @Author: tj
 * @Date: 2019-07-24 17:22:21 
 * @Last Modified by: tj
 * @Last Modified time: 2021-03-23 15:21:50
 * 图表组件
 */
import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts/lib/echarts';
// import 'echarts/lib/chart/pie';
// import 'echarts/lib/chart/radar';
// import 'echarts/lib/component/legend';
// import 'echarts/lib/component/tooltip';
// import 'echarts/lib/component/title';
// import 'echarts/lib/component/grid';
// import 'echarts/lib/component/graphic';
// import 'echarts/lib/chart/line';
// import 'echarts/lib/chart/gauge';
import _x from './../../../../util/file'
const SizeChange = _x.clientSizeChange;

/**
 * 仪表盘组件
 * data对象：
 * total 总数
 * finished 使用数
 * title：名称
 * fontColor 标题字体颜色
 * dataColor 数据颜色
 */
export class GaugeEchart extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    componentDidMount() {
        let screenWidth = window.screen.width;
        let range = 0.8;
        let top = 50;
        if (screenWidth >= 1366) {
            range = 1
            top = 40
        }
        if (screenWidth > 1500) {
            range = 1
            top = 45
        }
        if (screenWidth >= 1920) {
            range = 0.8
        }
        if (screenWidth > 2048) {

        }
        if (screenWidth > 2400) {
            top = 50
        }
        if (screenWidth > 2900) {
            top = 55
        }
        if (screenWidth > 3100) {
            range = 0.7;
            top = 55
        }
        if (screenWidth >= 3800) {
            range = 0.5;
        }
        this.setState({
            range, top
        })
    }

    initOption() {
        let { range, top } = this.state
        const { total, finished, fontColor, dataColor } = this.props.data;
        let value = total == 0 || finished == 0 ? 0 : !total||!finished?0:(finished / total * 100).toFixed(0)
        let $fontColor = fontColor || '#fff';
        let $dataColor = dataColor || '#03bd83';
        let option = {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: "item",
                show: false
            },
            title: {
                text: value + "%",
                textStyle: {
                    color: $fontColor,
                    fontSize: 16 * SizeChange(),
                    fontFamily: 'BankGothic'
                },
                left: 'center',
                top: top + '%',
                // subtext: '完成率',
                // subtextStyle: {
                //     align: 'center',
                //     verticalAlign: 'top',
                //     color: '#9fd2e3',
                //     fontSize: 15 * SizeChange()
                // },
            },

            grid: {
                // top: "10%",
                bottom: '0'
            },
            series: [
                // 最外层
                {
                    type: 'gauge',
                    // name: '业务指标',
                    radius: 120 * range + '%',
                    startAngle: '180',
                    endAngle: '0',
                    center: ['50%', '70%'],
                    splitNumber: '50',
                    pointer: {
                        show: false
                    },
                    title: {
                        show: false
                    },
                    detail: {
                        show: false
                    },
                    data: [{ value: value }],
                    axisLine: {
                        lineStyle: {
                            width: 10,
                            // color:'#03bd83'
                            // opacity: 0,
                            color: [
                                // [value / 100,
                                // new echarts.graphic.LinearGradient(0, 0, 1, 0, [

                                //     {
                                //         offset: 1,
                                //         color: '#bbed75'
                                //     },

                                //     {
                                //         offset: 0,
                                //         color: '#00d4fd'
                                //     },
                                //     // {
                                //     //     offset: this.props.data.value/100,
                                //     //     color: '#0e3355'
                                //     // },
                                //     // {
                                //     //     offset: 1,
                                //     //     color: '#0e3355'
                                //     // }
                                // ])
                                // ],
                                [value / 100, $dataColor],
                                [1, "#076375"]
                            ],
                        }

                    },
                    axisTick: {
                        show: false
                    },

                    splitLine: {
                        show: true,
                        length: 10,
                        lineStyle: {
                            color: '#002c33', //背景色融合
                            width: 2,
                            type: 'solid',
                            opacity: 1
                        },
                    },
                    axisLabel: {
                        show: false
                    }
                },
                // 内层
                {
                    type: 'gauge',
                    radius: 95 * range + '%',
                    startAngle: '0',
                    endAngle: '180',
                    center: ['50%', '70%'],
                    splitNumber: '25',
                    clockwise: false,
                    pointer: {
                        length: '110%',
                        show: true,
                        width: 2
                    },
                    itemStyle: {
                        color: '#02ddfd',
                    },
                    title: {
                        show: false
                    },
                    detail: {
                        show: false
                    },
                    data: [{ value: value }],
                    tooltip: {
                        formatter: '{b0}: {c0}%'
                    },
                    textStyle: {
                        fontSize: '14px'
                    },
                    axisLine: {
                        lineStyle: {
                            width: 15,
                            opacity: 0,
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: true,
                        length: 8,
                        lineStyle: {
                            color: '#57a4af',
                            width: 1.5,
                            type: 'solid',
                            opacity: 1
                        },
                    },
                    axisLabel: {
                        show: false
                    }
                },
            ]
        }
        return option;
    }


    render() {
        return (
            <div className='gauge-echarts'>
                <ReactEcharts style={{ width: '100%', height: '100%' }} option={this.initOption()}></ReactEcharts>
                <div className='tj-gauge-marker'>
                    <span className='left-marker'>0</span>
                    <span className='center-marker'>{this.props.data.title}</span>
                    <span className='right-marker'>100</span>
                    <div className='circle-marker'>
                        <div className='circle-big'>
                            <div className='circle-middle'>
                                <div className='circle-small'>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}

/**
 * 雷达图组件
 * data数组对象：
 * name 属性名称
 * value 属性值
 */
export class RadarEchart extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    initOption() {
        let { data } = this.props;
        let $indicator = [];
        let $value = []; let $data = []; let maxData = {}
        if (data.length) {
            $data = JSON.parse(JSON.stringify(data));
            $data && $data.sort((a, b) => {
                if (a.value > b.value) {
                    return -1
                }
                else if (a.value < b.value) {
                    return 1
                }
                return 0
            })
            maxData = $data[0];
            for (let i in data) {
                $indicator.push({
                    name: data[i].name,
                    num: data[i].value,
                    max: 100
                })
                $value.push(data[i].value)
            }
        }

        let option = {
            tooltip: {
                show: false
                // trigger: 'axis'
            },
            backgroundColor: 'transparent',
            radar: {
                radius: '40%',
                indicator: $indicator,
                splitNumber: 4,
                axisLine: { //指向外圈文本的分隔线样式
                    lineStyle: {
                        color: '#006366'
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: ['#006366'],
                        width: 1
                    }
                },
                splitArea: {
                    areaStyle: {
                        color: ['transparent']
                    }
                },
                name: {
                    color: '#719ba9',
                    formatter: function (value, indicator) {
                        let text = indicator.name == maxData.name ? '{high|' + indicator.num + "%" + '}\n{a|' + value + '}' : '{a|' + indicator.num + "%" + '}\n{a|' + value + '}'
                        return text

                    },
                    padding: -5,
                    lineHeight: 16,
                    rich: {
                        a: {
                            color: '#719ba9',
                            fontSize: 12 * SizeChange(),
                            align: 'center'
                        },
                        high: {
                            color: '#00fefb',
                            fontSize: 12 * SizeChange(),
                            align: 'center'
                        }
                    }
                },
            },
            series: [{
                type: 'radar',
                tooltip: {
                    trigger: 'item'
                },
                symbol: 'none',
                itemStyle: {
                    normal: {
                        color: '#00fefb',
                        borderWidth: 1,
                        borderColor: '#00fefb'
                    }
                },
                areaStyle: {
                    color: ['#00fefb'],
                    opacity: 0.6
                },
                data: [{
                    value: $value
                }]
            },]
        };
        return option;
    }


    render() {
        return (
            //<div className='radar-echarts'>
            <ReactEcharts style={{ width: '100%', height: '100%' }} option={this.initOption()}></ReactEcharts>
            //</div>

        )
    }
}


/**
 * 柱状图组件
 * data数组对象：
 * name 属性名称
 * prop 属性值
 * 
 * color颜色数组
 */
export class BarEchart extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
        this.clickIndex;
        this.onChartClick = this.onChartClick.bind(this)
    }

    initOption() {
        let color = this.props.color;
        let array = this.props.data;
        // let array=[{name:'1',value:20},{name:'2',value:50}]
        let data = []; let yData = []
        array.forEach((item, index) => {

            yData.push(item.name)
            data.push({
                name: item.name,
                value: item.prop,
                label: {
                    color: color[index].end,
                    fontSize: 16 * SizeChange()
                }
            })
            
        });
        console.log(data)
        let index = 0;
        let option = {
            backgroundColor: 'transparent',
            color: [new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                offset: 0,
                color: "#0167e8"
            }, {
                offset: 1,
                color: "#13ace8"
            }], false)],
            grid: {
                left: '8%',
                right: '25%',
                top: '12%',
                bottom: '5%',
                containLabel: true
            },
            tooltip: {
                show: false,
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            yAxis: {
                data: yData,
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                axisLabel: {
                    show: true,
                    color: "#9fd2e3",
                    fontSize: 14 * SizeChange()
                }
            },
            //第二种显示方法
            // yAxis: [{
            //     data: yData,
            //     axisTick: {
            //         show: false
            //     },
            //     axisLine: {
            //         show: false
            //     },
            //     axisLabel: {
            //         show: true,
            //         color: "#9fd2e3",
            //         fontSize: 14 * SizeChange()
            //     },

            // }, {
            //     data: data,
            //     axisTick: {
            //         show: false
            //     },
            //     axisLine: {
            //         show: false
            //     },
            //     axisLabel: {
            //         show: true,
            //         color: "#9fd2e3",
            //         fontSize: 14 * SizeChange(),
            //         formatter: function (val, index) {
            //             return '{color' + index + '|' + val + '}' + '课时'
            //         },
            //         rich: {
            //             color0: {
            //                 color: color[0].end,
            //                 fontSize: 16 * SizeChange()
            //             },
            //             color1: {
            //                 color: color[1].end,
            //                 fontSize: 16 * SizeChange()
            //             },
            //             color2: {
            //                 color: color[2].end,
            //                 fontSize: 16 * SizeChange()
            //             },
            //             color3: {
            //                 color: color[3].end,
            //                 fontSize: 16 * SizeChange()
            //             },
            //         },
            //     },

            // }],
            xAxis: [{
                axisTick: {
                    show: false
                },
                type: 'value',
                axisLine: {
                    show: false
                },
                axisLabel: {
                    show: false
                },
                splitLine: {
                    show: false
                }
            }],
            series: [{
                name: '违规',
                type: 'bar',
                barWidth: 10,
                itemStyle: {
                    normal: {
                        show: true,
                        color: function (params) {
                            return {
                                type: 'linear',
                                colorStops: [{
                                    offset: 0,
                                    color: color[params.dataIndex].start
                                }, {
                                    offset: 1,
                                    color: color[params.dataIndex].end
                                }],
                            }
                        },
                        borderWidth: 0,
                        borderColor: '#333',
                    }
                },
                label: {
                    normal: {
                        formatter: function (params) {
                            return params.data.value + '{a|课程}'
                        },
                        rich: {
                            a: {
                                color: '#9fd2e3',
                                fontSize: 12 * SizeChange()
                            },
                        },
                        show: true,
                        // show: false, //第二种显示方法
                        position: 'right',
                        textStyle: {
                            fontSize: 14 * SizeChange()
                        }
                    }
                },
                data: data
            }]
        };
        return option;
    }

    onChartClick(a) {
        console.log(a)
    }
    componentDidMount() {
        // if(this.echartsReactRef){

        // }else{
        //   return;
        // }
        this.echartsInstance = this.echartsReactRef.getEchartsInstance();
        this.zr = this.echartsInstance.getZr();
        // this.zr.on('click', (...rest) => {
        //     var pointInPixel= [rest.offsetX, rest.offsetY];
        //     var xIndex=this.echartsInstance.convertFromPixel({seriesIndex:0},[rest[0].offsetX, rest[0].offsetY]);
        //     var index=parseInt(xIndex);
        //     console.log(index);
        //     console.log('App:onClickChart', rest);
        //     });
        this.zr.on('click', (e) => {
            if (e.target && e.target.dataIndex >= 0) {
                let index = e.target.dataIndex
                switch (index) {
                    case 0:
                        if (this.props.type == 0) {
                            this.props.goRouter(2, '3')
                        } else {
                            this.props.goRouter(9, '95', null)
                        }

                        break;
                    case 1:
                        if (this.props.type == 0) {
                            this.props.goRouter(2, '4')
                        } else {
                            this.props.goRouter(9, '90', '95')
                        }

                        break;
                    case 2:
                        if (this.props.type == 0) {
                            this.props.goRouter(2, '5')
                        } else {
                            this.props.goRouter(9, '80', '90')
                        }

                        break;
                    case 3:
                        if (this.props.type == 0) {
                            this.props.goRouter(2, '2')
                        } else {
                            this.props.goRouter(9, '70', '80')
                        }

                        break;
                    case 4:
                        if (this.props.type == 0) {
                        } else {
                            this.props.goRouter(9, null, '70')
                        }
                        break;
                }
            } else {
                if (e.topTarget && e.topTarget.__textCotentBlock) {
                    let text = e.topTarget.__textCotentBlock.lines[0]
                    if (this.props.type == 0) {
                        switch (text) {
                            case '早退':
                                this.props.goRouter(2, '3')
                                break;
                            case '缺勤':
                                this.props.goRouter(2, '4')
                                break;
                            case '调换课':
                                this.props.goRouter(2, '5')
                                break;
                            case '迟到':
                                this.props.goRouter(2, '2')
                                break;
                        }
                    } else {
                        switch (text) {
                            case '95%以上':
                                this.props.goRouter(9, '95', null)
                                break;
                            case '90%-95%':
                                this.props.goRouter(9, '90', '95')
                                break;
                            case '80%-90%':
                                this.props.goRouter(9, '80', '90')
                                break;
                            case '70%-80%':
                                this.props.goRouter(9, '70', '80')
                                break;
                            case '70%以下':
                                this.props.goRouter(9, null, '70')
                                break;
                        }

                    }

                }
            }

        });
    }

    render() {
        let onEvents = {
            'click': this.onChartClick,
        }
        return (
            //<div className='radar-echarts'>
            <ReactEcharts
                ref={(e) => this.echartsReactRef = e}
                style={{ width: '100%', height: '100%' }}
                option={this.initOption()}
            // onEvents={onEvents}
            ></ReactEcharts>
            //</div>

        )
    }
}


/**
 * 预警圆形组件
 * data对象：
 * name 预警项名称
 * value 课时数
 * 
 * other 其他文字
 * type 1是红色 2是黄色
 */
export class Circle extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        let { value, name } = this.props.data;
        let { other, type } = this.props;
        let style = 'circle-wrap red';
        if (type == 1) {
        } else {
            style = 'circle-wrap yellow';
        }
        return (
            <div className='tj-circle'>
                <div className={value == 0 ? 'circle-wrap blue' : style}>
                    <div className='circle-inner'>
                        <div className='circle-text'>
                            <div><span className='data'>{value}</span>课程</div>
                            <div>{name}</div>
                            {
                                other ? <div>{other}</div> : ''
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}