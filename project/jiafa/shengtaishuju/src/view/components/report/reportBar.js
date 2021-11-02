import React from 'react';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts/lib/echarts';
import _ from 'lodash';
function BarBox(props) {
    let {orgList,dataList}=props.data;
    let {unit,xTit}=props
    let array=[];
    let max=0;
    let data = _.cloneDeep(dataList);
    data.sort((a,b)=>{
        return Number(b.value)-Number(a.value)
    })
    if(Number(data[0].value)%10!==0){
        max=Number(data[0].value)+(10-(Number(data[0].value)%10))
    }else{
        max=Number(data[0].value)+10
    }
    for(let i in dataList){
        let item=dataList[i]
        item['name']=orgList[i]
        array.push({
            name:orgList[i],
            value:item.value,
            label:{
                show:true,
                position:'right',
                formatter:`{c}${unit||''}`,
                color:'#595959',
                fontSize:16
            },
            itemStyle:{
                normal:{
                    color:item.color
                }
            }
        })
    }
    let initOption={
        yAxis:{
            type:'category',
            data:orgList,
            axisTick:{
                show:false
            },
            splitLine:{
                show:false
            },
            axisLine: { //  改变x轴颜色
                lineStyle: {
                    color: '#efefef'
                }
            },
            axisLabel: { //  改变x轴字体颜色和大小
                textStyle: {
                    color:'#080808',
                    fontSize: 14
                },
                interval:0,
                formatter:function(value){
                    let str = ""; 
                    let num = 6; //每行显示字数 
                    let valLength = value.length; //该项x轴字数  
                    let rowNum = Math.ceil(valLength / num); // 行数  
                    
                    if(rowNum > 1) {
                        for(let i = 0; i < rowNum; i++) {
                            let temp = "";
                            let start = i * num;
                            let end = start + num;
                            
                            temp = value.substring(start, end) + "\n";
                            str += temp; 
                        }
                        return str;
                    } else {
                        return value;
                    } 
                }
            }
        },
        xAxis:{
            type:'value',
            axisTick:{
                show:false
            },
            splitLine:{
                show:true,
                lineStyle: {
                    color: '#efefef'
                }
            },
            axisLine: { //  改变x轴颜色
                lineStyle: {
                    color: '#efefef'
                }
            },
            axisLabel: { //  改变x轴字体颜色和大小
                textStyle: {
                    color:'#a8a8a8',
                    fontSize: 14
                },
                formatter: `{value}${unit||''}`,
            },
            name:xTit||'',
            nameLocation:'end',
            nameTextStyle:{
                color:'#a8a8a8',
                fontSize:14,
                padding:[28,0,0,0]
            },
            max:max
        },
        series:[{
            data:array,
            type:'bar',
            barWidth:20,
            itemStyle:{
                barBorderRadius: [0, 4, 4,0],
            }
        }]
    }
    return (
        <ReactEcharts
            style={{ width: '100%', height: '100%' }}
            option={initOption}
        ></ReactEcharts>
    )
}

export default BarBox;