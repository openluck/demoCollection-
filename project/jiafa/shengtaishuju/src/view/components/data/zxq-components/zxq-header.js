/*
 * @Author:zxq
 * @Date: 2020-02-10 12:41:43 
 * @Last Modified by: tj
 * @Last Modified time: 2021-03-25 10:52:29
 * 资源情况-头部 学年学期选择、日周月时间选择
 */

import React, { Component } from 'react';
import { Select, DatePicker } from 'antd'
import moment from 'moment';
const { Option } = Select;
const { MonthPicker } = DatePicker;
class Header extends Component {
    constructor(props) {
        super(props);
        let tabArray = G.ISCED_tabArray || []
        this.state = {
            selTime: tabArray.length ? tabArray[tabArray.length - 1].timeType - 1 : 0,
            currentDate: ['日', '周', '月'],
            selTimeType: -2,//日周月的显示
            semester: [],
            semesterId: G.ISCED_cutSemesterData.semesterId || "", //学年学期id
            weeknumber: tabArray.length && tabArray[tabArray.length - 1].timeType == '2' ?
                tabArray.length && tabArray[tabArray.length - 1].selTime - 1 : "",  //第几周
            number: "",//当前显示的周
            date: false,
            disDate: "",
            currentTime: moment(new Date()).format('YYYY-MM-DD'),//默认为今天的日期
            curShowTime: tabArray.length && tabArray[tabArray.length - 1].timeType == '2' ? '第' +
                (tabArray.length && tabArray[tabArray.length - 1].selTime) + '周' :
                tabArray.length && tabArray[tabArray.length - 1].timeType == '3' ?
                    tabArray.length && tabArray[tabArray.length - 1].selTime : G.ISCED_cutSemesterData.isCutSemester === "1" ?
                        moment(new Date()).format("YYYY.MM.DD") : tabArray.length && tabArray[tabArray.length - 1].selTime.replace(/(-)/g, '.') || G.ISCED_cutSemesterData.startTime.replace(/(-)/g, '.'),
            startTime: "",//学期的开始时间,
            endTime: "",//学期的结束时间,
            months: false,
            tabletype: 1,    //1教学楼2教室3开课学院4教师
            semesterName: "", //学期名
            roleType: G.ISCED_curRoleInfo.roleType,
            defaultDate:''
        };
        this.disabledDate = this.disabledDate.bind(this)
        // this.weeksList = [];
        // for(let i=1;i<30;i++){
        //     this.weeksList.push('第'+i+'周')
        // }
        // for (let i = 1; i <= G.ISCED_cutSemesterData.weekMax; i++) {
        //     this.weeksList.push("第" + i + "周");
        // }
        this.weeksList = G.ISCED_cutSemesterData.weekList;
        this.hideAllMenu = this.hideAllMenu.bind(this);
        this.getDom = this.getDom.bind(this);

    }


    componentDidMount() {
        document.getElementsByClassName("zxq-dataContent")[0].addEventListener("click", this.getDom);
        let semester = G.ISCED_semesterList || [];
        let { currentTime, startTime, endTime, semesterName } = this.state;
        console.log(this.state)
        //判断本学期是否结束,当前学期为1，学期结束为0
        semester.map((item) => {
            if (item.semesterId === G.ISCED_cutSemesterData.semesterId) {
                if (G.ISCED_cutSemesterData.isCutSemester == 0) {
                    currentTime = item.startTime;
                }
            }
        })
        if (G.ISCED_cutSemesterData) {
            startTime = G.ISCED_cutSemesterData.startTime;
            endTime = G.ISCED_cutSemesterData.endTime;
            semesterName = G.ISCED_cutSemesterData.semesterName;
        }
        this.setState({
            semester,
            currentTime,
            startTime,
            endTime,
            semesterName,
            defaultDate:G.ISCED_semesterList[0].startTime
        }, () => {
            let tabArray = G.ISCED_tabArray || []
            // this.props.currentTime(currentTime);
            document.getElementsByClassName("ps")[0].addEventListener("scroll", this.hideAllMenu);
            // 更新参数
            let obj = this.props.param
            obj.selTime = tabArray.length && tabArray[tabArray.length - 1].selTime || currentTime
            this.props.changeParam(this.props.tabletype, obj)
        })
    }
    // componentWillUnmount(){
    //     if( document.getElementsByClassName("ps") || document.getElementsByClassName("zxq-dataContent")){
    //         document.getElementsByClassName("ps")[0].removeEventListener("scroll",this.hideAllMenu);
    //         document.getElementsByClassName("zxq-dataContent")[0].removeEventListener("click",this.getDom);

    //     }

    // }
    componentWillReceiveProps(props) {
        let tabletype = props.tabletype;
        if (tabletype != this.state.tabletype) {
            this.setState({
                tabletype,

            })
        }
    }
    //监听页面点击，隐藏日周月
    getDom(e) {
        if (e.target.classList[0] == 'zxq-time' || e.target.classList[0] == "ant-calendar-prev-year-btn" ||
            e.target.classList[0] == 'ant-calendar-date' || e.target.classList[0] == "ant-calendar-prev-month-btn" ||
            e.target.classList[0] == 'zxq-number' || e.target.classList[0] == "ant-calendar-next-month-btn" ||
            e.target.classList[0] == 'ant-calendar-month-panel-month' || e.target.classList[0] == "ant-calendar-next-year-btn" ||
            e.target.classList[0] == 'ant-calendar-month-panel-prev-year-btn' || e.target.classList[0] == "ant-calendar-month-panel-next-year-btn" ||
            e.target.classList[0] == "ant-calendar-today-btn"

        ) {
        } else {
            this.setState({
                selTimeType: -2
            })
        }
    }
    //监听页面滚动，隐藏日周月
    hideAllMenu(e) {
        this.setState({
            selTimeType: -2
        })

    }
    /*选择日期类型：日 周 月 */
    selType = (index) => {
        if (index == 0) {
            this.setState({
                selTimeType: -1,
                // selTime:0
            })
        }
        else if (index == 1) {
            this.setState({
                selTimeType: 0,
                // selTime:1
            })
        }
        else {
            this.setState({
                selTimeType: 1,
                // selTime:2
            })
        }

    }

    /*选择日*/
    selDate = (date, dateString) => {
        this.setState({
            currentTime: moment(dateString).format('YYYY-MM-DD'),
            curShowTime: moment(dateString).format('YYYY.MM.DD'),
            selTimeType: -2,
            selTime: 0,
            weeknumber: -1,

        }, () => {
            // this.props.currentTime(this.state.currentTime);
            // this.props.selDatetype(1);
            // 更新参数
            let obj = this.props.param
            obj.selTime = this.state.currentTime
            obj.timeType = 1
            this.props.changeParam(this.props.tabletype, obj)
        })

    }
    /*选择周*/
    selweek = (index, item) => {
        if (item.disable == true) {
            return;
        }
        let number = Number(index) + Number(1);
        this.setState({
            weeknumber: index,
            number,
            selTime: 1,
            selTimeType: -2,
            currentTime: '第' + number + '周',
            curShowTime: '第' + number + '周',
        }, () => {
            // this.props.currentTime(number);
            // this.props.selDatetype(2);
            // 更新参数
            let obj = this.props.param
            obj.selTime = number
            obj.timeType = 2
            this.props.changeParam(this.props.tabletype, obj)
        })

    }

    /*选择月*/
    selMonth = (date, dateString) => {
        this.setState({
            currentTime: moment(dateString).format('YYYY-MM'),
            curShowTime: moment(dateString).format('YYYY.MM'),
            selTimeType: -2,
            weeknumber: -1,
            selTime: 2,
        }, () => {
            // this.props.currentTime(moment(dateString).format('YYYY-MM'));
            // this.props.selDatetype(3);
            // 更新参数
            let obj = this.props.param
            obj.selTime = moment(dateString).format('YYYY-MM')
            obj.timeType = 3
            this.props.changeParam(this.props.tabletype, obj)
        })
    }
    /*学期选择*/
    setSemester = (semesterId) => {
        let { disDate, semester } = this.state;
        let startTime = semester.find(item => item.semesterId == semesterId).startTime;
        let endTime = semester.find(item => item.semesterId == semesterId).endTime;
        let semesterName = semester.find(item => item.semesterId == semesterId).semesterName;
        this.setState({
            semesterId,
            disDate,
            startTime,
            endTime,
            currentTime: startTime,
            semesterName

        }, () => {
            // this.props.currentTime(startTime)
            // this.props.semesterId(semesterId);
            // this.props.changeParam()
            // 更新参数
            let obj = this.props.param
            obj.semesterId = semesterId
            obj.selTime = startTime
            obj.timeType = 1
            this.props.changeParam(this.props.tabletype, obj)
        })
    }

    /*禁止选择的日期范围*/
    disabledDate(current, type) {
        let { startTime, endTime, semester } = this.state;
        if (type == '-1') {
            return current && (current < moment(startTime) || current > moment(moment(new Date()).format('YYYY-MM-DD')));
        } else if (type == '0') {

        } else {
            let endTime = moment(new Date()).format('YYYY-MM-DD').split("-").splice(0, 2).join("-")
            return current && (current < moment(startTime) || current > moment(endTime));
        }
        // if (type === '1') {
        //     startTime = startTime.split("-").splice(0, 2).join("-");
        //     endTime = endTime.split("-").splice(0, 2).join("-");
        //     let $endTime = endTime
        //         .split("-")
        //         .splice(0, 2);
        //     // $endTime[1] = Number($endTime[1]) + 1;
        //     $endTime[1] = Number($endTime[1]);
        //     let single = $endTime[1] >= 10 ? $endTime[1] : '0' + $endTime[1]
        //     $endTime[1] = single;
        //     $endTime = $endTime.join("-");
        //     console.log(startTime, $endTime)
        //     return current && (current < moment(startTime) || current > moment(endTime));
        // } else {
        //     let end = moment(new Date()).format('YYYY-MM-DD').split("-").splice(0, 2).join("-")
        //     return current < moment(startTime) || current > moment(end);
        // }

    }
    render() {
        const { defaultDate,currentDate, selTime, selTimeType, weeknumber, semester, currentTime, curShowTime, semesterName, tabletype, roleType } = this.state;
        let isDate = !isNaN(Date.parse(currentTime));
        return (
            <div className="zxq-header">
                <div>
                    <span>学年学期：</span>
                    {
                        tabletype == 2 && (roleType !== "3" || roleType !== '4')
                            ? <span>{semesterName}</span>
                            : <Select value={this.state.semesterId} onChange={this.setSemester.bind(this)} style={{ width: 200 }} getPopupContainer={triggerNode => triggerNode.parentNode}  >
                                {
                                    semester ? semester.map((item, index) => (
                                        <Option key={index} value={item.semesterId}>{item.semesterName}</Option>
                                    ))
                                        : null
                                }
                            </Select>
                    }
                </div>
                <div className="zxq-curTime">
                    <span> 当前统计时间：{curShowTime}
                    </span>
                    {
                        tabletype == 1 || ((roleType === "3" || roleType === '4') && tabletype === 2)
                            ? <div className="zxq-data">
                                {
                                    currentDate.map((item, index) => {
                                        return (
                                            <span className={index == selTime ? "zxq-time zxq-selTime" : "zxq-time"} key={index} onMouseOver={this.selType.bind(this, index, "over")}>{item}</span>
                                            // <span className="zxq-time" key={index} onMouseOver={this.selType.bind(this,index,"over")}>{item}</span>
                                        )

                                    })
                                }

                            </div> : ""}
                    <div className="zxq-antdate">
                        {selTimeType == -1 ?
                            <DatePicker
                                disabledDate={(current) => this.disabledDate(current, '-1')}
                                open={true}
                                onChange={this.selDate.bind(this)}
                                getCalendarContainer={trigger => trigger.parentNode}
                                value={isDate ? moment(currentTime, 'YYYY-MM-DD') : null}
                                defaultPickerValue={moment(defaultDate, 'YYYY-MM-DD')}
                            />
                            : selTimeType == 0 ?
                                <div className="zxq-week" >
                                    <div className="zxq-week-title">
                                        {/* { weeknumber ?  "第"+( weeknumber+1)+"周" :""} */}
                                        {G.ISCED_cutSemesterData.semesterName || ""}

                                    </div>
                                    <div className="zxq-weeknumber">
                                        {this.weeksList.map((item, index) => {
                                            return (
                                                <span key={index} className={item.disable == true ? 'tj-week-disable' : weeknumber === index ? "zxq-selweeknumber" : "zxq-number"} onClick={this.selweek.bind(this, index, item)} >{item.weekName}</span>
                                            )
                                        })}

                                    </div>
                                </div> :
                                selTimeType == 1 ?
                                    <MonthPicker open={true} onChange={this.selMonth.bind(this)}
                                        format={"YYYY-MM"}
                                        defaultPickerValue={moment(defaultDate, 'YYYY-MM-DD')}
                                        disabledDate={(current) => this.disabledDate(current, '1')} value={isDate ? moment(currentTime, 'YYYY-MM') : null}
                                        getCalendarContainer={trigger => trigger.parentNode}
                                    /> :
                                    ""
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default Header;