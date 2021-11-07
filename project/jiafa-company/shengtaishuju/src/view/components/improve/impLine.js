import React,{Component} from 'react';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts/lib/echarts';
import _x from '../../../util/file';
const SizeChange = _x.clientSizeChange;
export default class ImpLine extends Component{
    constructor(props){
        super(props)
    }
    initOption() {
        let array = this.props.data;
        let {type} = this.props;
        // let array=[{name:'第一周',value:20},{name:'第二周',value:50},{name:'第三周',value:40},{name:'第四周',value:50}]
        let data = []; let yData = [];let xData=[]
        array.forEach((item, index) => {
            if(type=='2'){
                xData.push('第'+item.name+'周')
            }else{
                xData.push(item.name)
            }
           
            yData.push(item.value)
            // data.push({
            //     name: item.name,
            //     value: item.value,
            // })
            
        });
        let option = {
            backgroundColor: 'transparent',
            color: '#389adc',
            grid: {
                left: this.props.left||'10',
                right: this.props.right||'10',
                top: '30%',
                bottom: '0%',
                containLabel: true
            },
            tooltip: {
                show: true,
                trigger: 'axis',
                axisPointer: {
                   lineStyle:{
                       color:'transparent'
                   }
                },
                formatter:(params)=>{
                    return `<div><span>${params[0].name}</span><span class='text'>${params[0].value}课程<span></div>`
                }
            },
            yAxis: {
                name:'课程数',
                nameLocation:'end',
                nameTextStyle:{
                    color:'#dadada'
                },
                type: 'value',
                // data: yData,
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                axisLabel: {
                    show: true,
                    color: "#dadada",
                    fontSize: 14 * SizeChange()
                },
                splitNumber:3,
                splitLine:{
                    lineStyle:{
                        color:'#F0F2F6'
                    }
                }
            },
          
            xAxis: {
                type: 'category',
                data:xData,
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                axisLabel: {
                    show: true,
                    color:'#aaaab1'
                },
                splitLine: {
                    show: false
                }
            },
            series: [{
                name: '课程数',
                type: 'line',
                symbol:'circle',
                symbolSize:5,
                smooth:true,
                showSymbol:false,
                lineStyle:{
                    color:'#389adc',
                    shadowColor: 'rgba(0, 0, 0, 0.2)',
                    shadowBlur:2,
                    shadowOffsetY:12
                },
                emphasis:{
                    itemStyle:{
                        borderWidth:2,
                        borderColor:'#389adc',
                        color:'#fff',
                    }
                },
                // barWidth: 13* SizeChange(),
                // label: {
                //     normal: {
                //         formatter: function (params) {
                //             return params.data.value
                //         },
                //         show: true,
                //         // show: false, //第二种显示方法
                //         position: 'right',
                //         textStyle: {
                //             fontSize: 16 * SizeChange(),
                //             color:'#647281'
                //         }
                //     }
                // },
                data: yData
            }]
        };
        return option;
    }
    render(){
        return(
            <ReactEcharts
                ref={(e) => this.echartsReactRef = e}
                style={{ width: '100%', height: '100%' }}
                option={this.initOption()}
            ></ReactEcharts>
        )
    }
}