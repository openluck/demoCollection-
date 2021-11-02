/*
 * @Author:zxq
 * @Date: 2020-02-10 12:41:43 
 * @Last Modified by: tj
 * @Last Modified time: 2021-03-03 15:18:08
 */

import React, { Component } from 'react';
import { Select, DatePicker, Popover } from 'antd';
import moment from "moment";
import '../../../style/zxqstatic.scss'
const { Option } = Select;
const { MonthPicker } = DatePicker;

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listDate: ['日报', '周报', '月报'],
            masterDate: ['月报', '学期报'],
            selReportType: "",   //日报类型
            monthVisible: false,
            selMonth: '',
            semesterId: G.ISCED_cutSemesterData.semesterId,
            semesterName:G.ISCED_cutSemesterData.semesterName,
            disableData:[],
            disableDataList:[]

        };
        this.onSetMonth = this.onSetMonth.bind(this)
        this.onMonthVisibleChange = this.onMonthVisibleChange.bind(this)
        this.onSetSemester = this.onSetSemester.bind(this)
    }
    
    componentWillReceiveProps(nextProps){
        console.log(nextProps)
        if(nextProps.type=='1'){
            return;
        }
        if(nextProps.disableData!==this.state.disableData){
            let res = nextProps.disableData;
            let today = new Date().getTime()
            let array=[],timeList=[]
            for(let i in res){
                array.push({
                    time:res[i].time,
                    dValue:Math.abs(today-res[i].time)
                })
                timeList.push(res[i].time)
            }
            array.sort((a,b)=>{
                return (a.dValue - b.dValue)
            })
            if(array.length){
                let time=moment(new Date(array[0].time)).format('YYYY-MM'); 
                this.setState({
                    selReportType:'1',
                    selMonth:time,
                    disableData:nextProps.disableData,
                    disableDataList:timeList
                })
            }
        }
    }


    /*选择日期类型：日 周 月 */

    selType = (index) => {
        this.setState({
            selReportType: index,

        }, () => {
            if(this.props.type=='1'){
                this.props.setReportType(Number(index + 1));
            }else{
                //学期报选择
                let {semesterName,semesterId} = this.state;
                let obj={
                    semesterName,
                    semesterId,
                    selType:2,
                    selTime:''
                }
                this.setState({
                    selMonth:''
                })
                this.props.getParams(obj)
            }
        })

    }    

    /**
     * 选择月份报
     * @param {*} date 
     * @param {*} dateString 
     */
    onSetMonth(date, dateString) {
        let {semesterName,semesterId} = this.state;
        this.setState({
            selMonth:dateString,
            monthVisible:false,
            selReportType:'1'
        })
        let obj={
            semesterName,
            semesterId,
            selType:1,
            selTime:dateString
        }
        this.props.getParams(obj)
    }

    /**
     * 月份弹窗
     */
    onMonthVisibleChange(value) {
        this.setState({
            monthVisible: value
        })
    }

    /**
     * 切换学年学期
     * @param {*} semesterId 
     * @param {*} info 
     */
    onSetSemester(semesterId,info) {
        console.log(info)
        let {selReportType,selMonth} = this.state
        this.setState({
            semesterId,
            semesterName:info.props.children
        })
        let obj={
            semesterName:info.props.children,
            semesterId,
            selType:selReportType,
            selTime:selMonth
        }
        this.props.getParams(obj,'sem')
    }
    render() {
        const { listDate, number, selReportType, selMonth, monthVisible, semesterId,disableDataList } = this.state;
        let semester = G.ISCED_cutSemesterData;
        return (
            <div className="report-header">
                {
                    this.props.type == '1' ?
                        <div className="zxq-data " >
                            {

                                listDate.map((item, index) => {
                                    return (
                                        <span className={index == selReportType ? "zxq-time zxq-selTime" : "zxq-time"} key={index}
                                            onClick={this.selType.bind(this, index)}>{item}</span>
                                    )

                                })
                            }
                        </div>
                        :
                        <React.Fragment>
                            <div className="zoe-data-select">
                                <div style={{ marginRight: 30,width:300 }}>
                                    <div className='in'>学年学期：</div>
                                    <Select
                                        getPopupContainer={triggerNode => triggerNode.parentNode}
                                        value={semesterId}
                                        onChange={this.onSetSemester}
                                        style={{ width: 200 }}
                                    >
                                        {G.ISCED_semesterList.map((item, index) => (
                                            <Option key={"a" + index} value={item.semesterId}>
                                                {item.semesterName}
                                            </Option>
                                        ))}
                                    </Select>
                                </div>
                            </div>
                            <div className="zxq-data " >
                                <div id="selTime" style={{ position: 'relative' }}>
                                    <Popover
                                        onVisibleChange={this.onMonthVisibleChange}
                                        visible={monthVisible}
                                        overlayClassName="ws-popover"
                                        placement="bottom"
                                        content={
                                            <MonthPicker
                                                className="ws-datePicker-sel"
                                                dropdownClassName="ws-monthPicker"
                                                format={"YYYY-MM"}
                                                value={selMonth ? moment(selMonth, 'YYYY-MM-DD') : null}
                                                // value={selTime ? moment(selTime, 'YYYY-MM') : null}
                                                // getCalendarContainer={trigger => trigger.parentNode}
                                                getCalendarContainer={trigger =>
                                                    document.getElementById("selTime")
                                                }
                                                getPopupContainer={triggerNode => triggerNode.parentNode}
                                                onChange={this.onSetMonth}
                                                allowClear={false}
                                                // defaultPickerValue={moment(defaultDate.split("-").splice(0,2).join("-"), 'YYYY-MM-DD')}
                                                open={monthVisible}
                                                disabledDate={current => {
                                                    // let startTime = semester.startTime
                                                    //     .split("-")
                                                    //     .splice(0, 2)
                                                    //     .join("-");
                                                    // let endTime = semester.endTime
                                                    //     .split("-")
                                                    //     .splice(0, 2);
                                                    // endTime[1] = Number(endTime[1]) + 1;
                                                    // let single = endTime[1] >= 10 ? endTime[1] : '0' + endTime[1]
                                                    // endTime[1] = single;
                                                    // endTime = endTime.join("-");
                                                    let isMonth=true;
                                                    isMonth=!disableDataList.some(son=>{
                                                        return moment(current).isSame(son,'month')
                                                    })
                                                    return isMonth
                                                    // return (
                                                    //     current && (current < moment(startTime) || current >= moment(endTime))
                                                    // );
                                                }}

                                            />
                                        }
                                    >
                                        <span
                                            className={selReportType == '1' ? "zxq-time zxq-selTime" : "zxq-time"}
                                            >月报</span>
                                    </Popover>
                                    <span
                                        className={selReportType == '2' ? "zxq-time zxq-selTime" : "zxq-time"}
                                        onClick={this.selType.bind(this, '2')}>学期报</span>
                                </div>
                            </div>
                        </React.Fragment>
                }
            </div>
        );
    }
}

export default Header;