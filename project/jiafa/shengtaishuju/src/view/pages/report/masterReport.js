/*
 * @Author: lxx 
 * @Date: 2020-01-23 10:08:48 
 * @Last Modified by: tj
 * @Last Modified time: 2021-03-05 17:19:25
 * 报告中心-系统报告
 */
import React, { Component } from 'react';
import { Table, message, Spin } from 'antd'
import ReportHeader from '../../components/report/header'
import ReportBox from './../../components/report/reportBox';
import BarBox from './../../components/report/reportBar'
import { IMG } from './../../public/imgPub';
import NoDataAndLoading from './../../components/image/public/noDataAndLoading';
import '../../../style/zxq-report.scss'
import '../../../style/zxqstatic.scss';
import { connect } from 'react-redux';
import { getMasterInfo, getMasterSeenMonth } from './../../../redux/tj-masterReport.reducers'
import CollageNoData from './../../../view/components/image/college_image/collegeNoData';
import domtoimage from 'dom-to-image';
import moment from "moment";
@connect(state => state, { getMasterInfo, getMasterSeenMonth })
class MasterReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reportType: 1, //1日2周3月
            time: '',
            params: {},
            selTime:'',
            selType:'',
        };

        this.setReportType = this.setReportType.bind(this);
        this.nodeScrollIntoView = this.nodeScrollIntoView.bind(this);
        this.getParams = this.getParams.bind(this)
        this.getSeenMonth = this.getSeenMonth.bind(this)
        this.reportDownLoad = this.reportDownLoad.bind(this)
        this.vaildTest=this.vaildTest.bind(this)
    }

    componentDidMount() {
        this.getSeenMonth()
    }

    /**
     * 获得有报告的月份
     * @param {*} semId 
     */
    getSeenMonth(semId) {
        let params = {
            semesterId: semId || G.ISCED_cutSemesterData.semesterId
        }
        this.props.getMasterSeenMonth(params).then(res => {
            if (res && res.months.length) {
                let today = new Date().getTime()
                let array = []
                let data=res.months
                for (let i in data) {
                    array.push({
                        time: data[i].time,
                        stuOnRate:data[i].stuOnRate,
                        dValue: Math.abs(today - data[i].time)
                    })
                }
                array.sort((a, b) => {
                    return (a.dValue - b.dValue)
                })
                if(array.length){
                    let time = moment(new Date(array[0].time)).format('YYYY-MM-DD');
                    let params = {
                        semesterId: semId || G.ISCED_cutSemesterData.semesterId,
                        selTime: time,
                        selType: '1',
                        stuOnRate:array[0].stuOnRate
                    }
                    this.setState({
                        selTime:time,
                        selType:'1',
                        semesterId:semId || G.ISCED_cutSemesterData.semesterId,
                        stuOnRate:array[0].stuOnRate
                    })
                    this.props.getMasterInfo(params)
                }
            }
        })
    }

    /* 设置报告类型*/
    setReportType = (reportType) => {
        console.log("reportTyp", reportType)
        this.setState({
            reportType
        })
    }

    nodeScrollIntoView() {
        this.node.scrollIntoView();
    }

    /**
     * 筛选条件回调
     * @param {*} info 回调数据
     * @param {*} type 筛选类型
     */
    getParams(info, type) {
        console.log(info)
        this.setState({
            params: info
        }, () => {
            if (type == 'sem') {
                // 切换学年学期
                this.getSeenMonth(info.semesterId)
            } else {
                let { seenSem,semStuOnRate,seenMonth} = this.props.TJ_masterReport_reducer;
                let params;
                if(info.selType=='1'){
                    let item=_.find(seenMonth,{time:moment(info.selTime,"YYYY-MM").valueOf()})
                    console.log(item)
                    params = {
                        semesterId: info.semesterId,
                        selTime:  info.selTime + '-01',
                        selType: '1',
                        stuOnRate:item.stuOnRate||''
                    }
                }else{
                    params = {
                        semesterId: info.semesterId,
                        selTime: seenSem?moment(new Date(seenSem)).format('YYYY-MM-DD'):'',
                        selType: '2',
                        stuOnRate:semStuOnRate
                    }
                }
               
                this.props.getMasterInfo(params)
            }
        })
    }

    /**
     * 分享照片下载
     */
    shareImg() {
        let { schoolName, schoolTime } = this.props.TJ_masterReport_reducer;
        domtoimage.toPng(document.getElementById('report-cnt'), {
            quality: 2
        })
            .then((dataUrl) => {
                let link = document.createElement('a');
                link.download = `${schoolName}视频督导报告（${schoolTime}）.png`;
                link.href = dataUrl;
                link.click();
            }).catch(() => {
                message.warn('分享失败！')
            })
    }


    reportDownLoad() {
        let url = G.dataService;
        let { semesterId, selType, selTime } = this.state.params;
        let $semesterId=this.state.semesterId
        let $selType=this.state.selType
        let $selTime=this.state.selTime
        let orgCode=G.ISCED_orgcode
        console.log($selTime)
        // if (isDev) {
        //    url = "http://10.10.0.130:80"//报告中心
        // } else {
        //   url = "http://10.20.5.223";
        // }
        window.open(url + `/api/report/masterReport/downReport/${orgCode}/${$semesterId || semesterId}/${$selType||selType}/${$selType=='1'||selType == '1' ? $selTime||selTime : ''}`, true);
    }

    vaildTest(data){
        if(data===''||data===undefined||data===null){
            return '--'
        }
        if(typeof data=='number'){
            return String(data)
        }else if(typeof data=='string'){
            return data
        }else{
            return data
        }
    }

    render() {
        let { classrooms, schoolName, schoolTime, courses, orgList, globalTea, globalTeaNormal, globalTeaNormalPer, globalTeaUnnormal, globalTeaUnnormalPer,
            globalStu, globalStuAvg, stuSet, globalStuLow, globalStuLowPer, globalStuHigh, globalStuHighPer,
            globalFront, globalFrontAvg, frontSet, globalFrontLow, globalFrontLowPer, globalFrontHigh, globalFrontHighPer,
            globalSleep, globalSleepAvg, sleepSet, globalSleepLow, globalSleepLowPer, globalSleepHigh, globalSleepHighPer,
            detailTea, teaImageList, detailStuLow, detailStuHigh, stuImageList, detailFrontLow, detailFrontHigh, frontImageList,
            detailSleepHigh, detailSleepLow, sleepImageList, attDeal, attDealNormal, attDealUnnormal, attDealImageList,
            orderDeal, orderDealNormal, orderDealUnnormal, orderDealImageList, detail, detailStuSet, seenMonth, stuMonData, isLoading,seenSem
        } = this.props.TJ_masterReport_reducer;
        let dataColumns = [
            {
                title: '开课学院',
                width: 220,
                dataIndex: 'orgName',
                render: (text, record) => {
                    return <div className='tj-td' title={text || '--'}>{text || '--'}</div>
                }
            },
            {
                title: '教师考勤（课程数）',
                dataIndex: 'attence',
                render: (text, record) => {
                    return <div className='tj-td' title={this.vaildTest(text)}>{this.vaildTest(text)}</div>
                }
            },
            {
                title: '到课率（课程数）',
                dataIndex: 'arrive',
                render: (text, record) => {
                    return <div className='tj-td' title={this.vaildTest(text)}>{this.vaildTest(text)}</div>
                }
            },
            {
                title: '前排就坐率（课程数）',
                dataIndex: 'front',
                render: (text, record) => {
                    return <div className='tj-td' title={this.vaildTest(text)}>{this.vaildTest(text)}</div>
                }
            },
            {
                title: '低头率（课程数）',
                dataIndex: 'sleep',
                render: (text, record) => {
                    return <div className='tj-td' title={this.vaildTest(text)}>{this.vaildTest(text) }</div>
                }
            },
        ]
        let colColumns = [
            {
                title: '教师考勤',
                children: [{
                    title: '考勤正常率',
                    width: 120,
                    dataIndex: 'globalTeaNormalPer',
                    render: (text, record) => {
                        return <div className='tj-td' title={this.vaildTest(text)+ '%'}>{this.vaildTest(text)+ '%'}</div>
                    }
                }, {
                    title: '正常课程数/占比',
                    width: 150,
                    dataIndex: 'globalTeaNormal',
                    render: (text, record) => {
                        return <div className='tj-td' title={this.vaildTest(text)  + '/' + this.vaildTest(record.globalTeaNormalPer) + '%'}>{this.vaildTest(text) + '/' + this.vaildTest(record.globalTeaNormalPer) + '%'}</div>
                    }
                }, {
                    title: '异常课程数/占比',
                    width: 150,
                    dataIndex: 'globalTeaUnnormal',
                    render: (text, record) => {
                        return <div className='tj-td' title={this.vaildTest(text)  + '/' +this.vaildTest(record.globalTeaUnnormalPer)+ '%'}>{this.vaildTest(text) + '/' + this.vaildTest(record.globalTeaUnnormalPer)+ '%'}</div>
                    }
                }]

            },
            {
                title: '到课率',
                children: [{
                    title: '平均到课率',
                    width: 120,
                    dataIndex: 'globalStuAvg',
                    render: (text, record) => {
                        return <div className='tj-td' title={this.vaildTest(text)+ '%'}>{this.vaildTest(text)+ '%'}</div>
                    }
                }, {
                    title: `低于（含）${stuSet}%的课程数/占比`,
                    dataIndex: 'globalStuLow',
                    render: (text, record) => {
                        return <div className='tj-td' title={this.vaildTest(text)+ '/' + this.vaildTest(record.globalStuLowPer)+ '%'}>{this.vaildTest(text)  + '/' + this.vaildTest(record.globalStuLowPer)  + '%'}</div>
                    }
                }, {
                    title: `高于于（含）${stuSet}%的课程数/占比`,
                    dataIndex: 'globalStuHigh',
                    render: (text, record) => {
                        return <div className='tj-td' title={this.vaildTest(text) + '/' + this.vaildTest(record.globalStuHighPer)+ '%'}>{this.vaildTest(text) + '/' + this.vaildTest(record.globalStuHighPer)+ '%'}</div>
                    }
                }]
            },
            {
                title: '前排就坐率',
                children: [{
                    title: '平均前排就坐率',
                    dataIndex: 'globalFront',
                    render: (text, record) => {
                        return <div className='tj-td' title={this.vaildTest(text) + '%'}>{this.vaildTest(text) + '%'}</div>
                    }
                }, {
                    title: `低于（含）${frontSet}%的课程数/占比`,
                    dataIndex: 'globalFrontLow',
                    render: (text, record) => {
                        return <div className='tj-td' title={this.vaildTest(text) + '/' + this.vaildTest(record.globalFrontLowPer)  + '%'}>{this.vaildTest(text) + '/' + this.vaildTest(record.globalFrontLowPer)  + '%'}</div>
                    }
                }]
            },
            {
                title: '低头率',
                children: [{
                    title: '平均低头率',
                    dataIndex: 'globalSleepAvg',
                    render: (text, record) => {
                        return <div className='tj-td' title={this.vaildTest(text) + '%'}>{this.vaildTest(text) + '%'}</div>
                    }
                }, {
                    title: `高于（含）${sleepSet}%的课程数/占比`,
                    dataIndex: 'globalSleepHigh',
                    render: (text, record) => {
                        return <div className='tj-td' title={this.vaildTest(text)+'/' + this.vaildTest(record.globalSleepHighPer)  + '%'}>{this.vaildTest(text) + '/' + this.vaildTest(record.globalSleepHighPer) + '%'}</div>
                    }
                }]
            }
        ]
        let detailCoumns = [
            {
                title: '开课学院',
                width: 220,
                dataIndex: 'orgName',
                render: (text, record) => {
                    return <div className='tj-td' title={text || '--'}>{text || '--'}</div>
                }
            },
            {
                title: '地点',
                dataIndex: 'place',
                render: (text, record) => {
                    return <div className='tj-td' title={text || '--'}>{text || '--'}</div>
                }
            },
            {
                title: '课程名',
                dataIndex: 'subject',
                render: (text, record) => {
                    return <div className='tj-td' title={text || '--'}>{text || '--'}</div>
                }
            },
            {
                title: '教师名',
                dataIndex: 'teacher',
                render: (text, record) => {
                    return <div className='tj-td' title={text || '--'}>{text || '--'}</div>
                }
            },
            {
                title: '时间',
                dataIndex: 'time',
                render: (text, record) => {
                    return <div className='tj-td' title={text || '--'}>{text || '--'}</div>
                }
            },
            {
                title: '教师考勤类型',
                dataIndex: 'tea',
                render: (text, record) => {
                    return <div className={record.teaType == '1' ? 'tj-td error' : record.teaType == '0' ? 'tj-td normal' : 'tj-td'} title={text || '--'}>{text || '--'}</div>
                }
            },
            {
                title: '学生到课率',
                dataIndex: 'stu',
                render: (text, record) => {
                    return <div className={record.stuType == '1' ? 'tj-td error' : record.stuType == '0' ? 'tj-td normal' : 'tj-td'} title={this.vaildTest(text)+ '%'}>{this.vaildTest(text) + '%'}</div>
                }
            },
            {
                title: '前排就座率',
                dataIndex: 'front',
                render: (text, record) => {
                    return <div className={record.frontType == '1' ? 'tj-td error' : record.frontType == '0' ? 'tj-td normal' : 'tj-td'} title={this.vaildTest(text)+ '%'}>{this.vaildTest(text) + '%'}</div>
                }
            },
            {
                title: '低头率',
                dataIndex: 'sleep',
                render: (text, record) => {
                    return <div className={record.sleepType == '1' ? 'tj-td error' : record.sleepType == '0' ? 'tj-td normal' : 'tj-td'} title={this.vaildTest(text) + '%'}>{this.vaildTest(text)+ '%'}</div>
                }
            },
            {
                title: '图片',
                dataIndex: 'image',
                render: (text, record) => {
                    return <div className='tj-td' title={text || '--'}>
                        {
                            text ? <IMG src={G.dataService + text} alt="picture" isEnlarge={true} /> : '--'
                        }

                    </div>
                }
            },
        ]
        let detailCoumnsOrder = [
            {
                title: '开课学院',
                width: 220,
                dataIndex: 'orgName',
                render: (text, record) => {
                    return <div className='tj-td' title={text || '--'}>{text || '--'}</div>
                }
            },
            {
                title: '地点',
                dataIndex: 'place',
                render: (text, record) => {
                    return <div className='tj-td' title={text || '--'}>{text || '--'}</div>
                }
            },
            {
                title: '课程号',
                dataIndex: 'lessonNum',
                render: (text, record) => {
                    return <div className='tj-td' title={text || '--'}>{text || '--'}</div>
                }
            },
            {
                title: '课程名',
                dataIndex: 'subject',
                render: (text, record) => {
                    return <div className='tj-td' title={text || '--'}>{text || '--'}</div>
                }
            },
            {
                title: '课序号',
                dataIndex: 'orderNum',
                render: (text, record) => {
                    return <div className='tj-td' title={text || '--'}>{text || '--'}</div>
                }
            },
            {
                title: '教师名',
                dataIndex: 'teacher',
                render: (text, record) => {
                    return <div className='tj-td' title={text || '--'}>{text || '--'}</div>
                }
            },
            {
                title: '时间',
                dataIndex: 'time',
                render: (text, record) => {
                    return <div className='tj-td' title={text || '--'}>{text || '--'}</div>
                }
            },
            {
                title: '教师考勤类型',
                dataIndex: 'tea',
                render: (text, record) => {
                    return <div className={record.teaType == '1' ? 'tj-td error' : record.teaType == '0'&&text ? 'tj-td' : 'tj-td'} title={text || '--'}>{text || '--'}</div>
                }
            },
            {
                title: '学生到课率',
                dataIndex: 'stu',
                render: (text, record) => {
                    return <div className={record.stuType == '1' ? 'tj-td error' : record.stuType == '0' ? 'tj-td' : 'tj-td'} title={this.vaildTest(text)  + '%'}>{this.vaildTest(text)  + '%'}</div>
                }
            },
            {
                title: '前排就座率',
                dataIndex: 'front',
                render: (text, record) => {
                    return <div className={record.frontType == '1' ? 'tj-td error' : record.frontType == '0' ? 'tj-td' : 'tj-td'} title={this.vaildTest(text) + '%'}>{this.vaildTest(text)+ '%'}</div>
                }
            },
            {
                title: '低头率',
                dataIndex: 'sleep',
                render: (text, record) => {
                    return <div className={record.sleepType == '1' ? 'tj-td error' : record.sleepType == '0' ? 'tj-td' : 'tj-td'} title={this.vaildTest(text)+ '%'}>{this.vaildTest(text) + '%'}</div>
                }
            },
            {
                title: '图片',
                dataIndex: 'image',
                render: (text, record) => {
                    return <div className='tj-td'>
                        {
                            text ? <IMG src={G.dataService + text} alt="picture" isEnlarge={true} /> : '--'
                        }

                    </div>
                }
            },
        ]
        let detailCoumn = detailCoumns;
        if (G.ISCED_setInfo.isClassOrder == '1') {
            detailCoumn = detailCoumnsOrder
        } else {
            detailCoumn = detailCoumns
        }
        return (
            <div className="zxq-report-contnier" ref={(node) => { this.node = node }}>
                <div className="report-nav"></div>
                <ReportHeader disableData={seenMonth} semTime={seenSem} setReportType={this.setReportType} type={'2'} getParams={this.getParams} />
                {

                    isLoading ?
                        <div className='tj-report-noData'>
                            <Spin />
                        </div>
                        :
                        !seenMonth.length ||!schoolName?
                            <div className='tj-report-noData'>
                                <CollageNoData />
                                <p>月报/学期报暂未生成哦</p>
                            </div> :
                            <div className="report-table-content" id='report-cnt'>
                                <div className='tj-report-header'>
                                    <div className='report-hd-tit'>
                                        <img src={require('./../../../media/picture/bt.png')} width={50} />
                                        <span>{schoolName}视频督导报告</span>
                                        <img src={require('./../../../media/picture/bt.png')} className='right-bt' width={50} />
                                    </div>
                                    <div className='report-hd-time'>{schoolTime}</div>
                                    <div className='report-hd-tool'>
                                        <span onClick={this.reportDownLoad}><img src={require('./../../../media/picture/xz.png')} width={20} />下载</span>
                                        <span onClick={this.shareImg.bind(this)}><img src={require('./../../../media/picture/fx.png')} width={20} />分享</span>
                                    </div>
                                </div>
                                <ReportBox
                                    title='一、监测情况'
                                    content={
                                        <div className='monInfo'>
                                            <div className='monInfo-total'>
                                                <div>监测教室数：<span>{classrooms}</span>间</div>
                                                <div>监测课程数：<span>{courses}</span>门</div>
                                            </div>
                                            <p>各学院监测课程数</p>
                                            <div className='monInfo-table'>
                                                <Table
                                                    dataSource={orgList}
                                                    columns={dataColumns}
                                                    rowKey={record => record.orgName}
                                                    pagination={false}
                                                    locale={{ emptyText: <CollageNoData /> }}
                                                    loading={false}
                                                />
                                            </div>
                                        </div>
                                    }
                                />
                                <ReportBox
                                    title='二、学院整体情况'
                                    content={
                                        <div className='allInfo'>
                                            <p>2.1教师考勤情况</p>
                                            <div>
                                                教师考勤监测总课程数为{this.vaildTest(globalTea)}门。教师考勤正常课程数为{this.vaildTest(globalTeaNormal)}门，占总课程数的{this.vaildTest(globalTeaNormalPer)}%；教师考勤异常课程数为{this.vaildTest(globalTeaUnnormal)}门，占总课程数的{this.vaildTest(globalTeaUnnormalPer)}%
                                </div>
                                            <p>2.2到课率情况</p>
                                            <div>
                                                到课率监测总课程数为{this.vaildTest(globalStu)}门。学生平均到课率为{this.vaildTest(globalStuAvg)}%。其中到课率低于（含）{this.vaildTest(stuSet)}%的课程数为{this.vaildTest(globalStuLow)}，占总课程数的{this.vaildTest(globalStuLowPer)}%；到课率高于（含）{this.vaildTest(stuSet)}%的课程数为{this.vaildTest(globalStuHigh)}，占总课程数的{this.vaildTest(globalStuHighPer)}%
                                </div>
                                            <p>2.3前排就坐率情况</p>
                                            <div>
                                                前排就坐率监测总课程数为{this.vaildTest(globalFront)}门。学生平均前排率为{this.vaildTest(globalFrontAvg)}%。其中前排就坐率低于（含）{this.vaildTest(frontSet)}%的课程数为{this.vaildTest(globalFrontLow)}，占总课程数的{this.vaildTest(globalFrontLowPer)}%；前排就坐率高于（含）{this.vaildTest(frontSet)}%的课程数为{this.vaildTest(globalFrontHigh)}，占总课程数的{this.vaildTest(globalFrontHighPer)}%
                                </div>
                                            <p>2.4低头率情况</p>
                                            <div>
                                                低头率监测总课程数为{this.vaildTest(globalSleep)}门。学生平均睡觉率为{this.vaildTest(globalSleepAvg)}%。其中低头率低于（含）{this.vaildTest(sleepSet)}%的课程数为{this.vaildTest(globalSleepLow)}，占总课程数的{this.vaildTest(globalSleepLowPer)}%；低头率高于（含）{this.vaildTest(sleepSet)}%的课程数为{this.vaildTest(globalSleepHigh)}，占总课程数的{this.vaildTest(globalSleepHighPer)}%
                                </div>
                                            <p>学院整体情况监测数据统计表</p>
                                            <div className='allInfo-table'>
                                                <Table
                                                    dataSource={stuMonData}
                                                    columns={colColumns}
                                                    rowKey={record => record.id}
                                                    pagination={false}
                                                    locale={{ emptyText: <CollageNoData /> }}
                                                    loading={false}
                                                    className='allInfoT'
                                                />
                                            </div>
                                        </div>
                                    }
                                />
                                <ReportBox
                                    title='三、各学院情况'
                                    content={
                                        <div className='colInfo'>
                                            <p>3.1教师考勤情况</p>
                                            <div>本次共考勤{this.vaildTest(detailTea)}位教师，平均考勤正常率为{this.vaildTest(globalTeaNormalPer)}%，具体情况如下：</div>
                                            <p>考勤正常率</p>
                                            <div style={teaImageList.orgList && teaImageList.orgList.length ? {height: teaImageList.orgList.length * 65,minHeight:250} : { height: 150 }}>
                                                {
                                                    teaImageList.orgList && teaImageList.orgList.length ?
                                                        <BarBox data={teaImageList} unit={'%'} />
                                                        :
                                                        <NoDataAndLoading loading={false} />
                                                }
                                            </div>
                                            <p>3.2到课率情况</p>
                                            <div>平均到课率为{this.vaildTest(globalStuAvg)}%。其中学生平均到课率低于（含）{this.vaildTest(stuSet)}%的学院有{this.vaildTest(detailStuLow)}个；高于{this.vaildTest(stuSet)}%的学院有{this.vaildTest(detailStuHigh)}个。具体情况如下：</div>
                                            <p>到课率</p>
                                            <div style={stuImageList.orgList && stuImageList.orgList.length ? { height: stuImageList.orgList.length * 65,minHeight:250 } : { height: 150 }}>
                                                {
                                                    stuImageList.orgList && stuImageList.orgList.length ?
                                                        <BarBox data={stuImageList} unit={'%'} />
                                                        :
                                                        <NoDataAndLoading loading={false} />
                                                }
                                            </div>
                                            <p>3.3前排就坐率情况</p>
                                            <div>平均前排就坐率为{this.vaildTest(globalFrontAvg)}%。其中学生平均前排就坐率低于（含）{this.vaildTest(frontSet)}%的学院有{this.vaildTest(detailFrontLow)}个；高于{this.vaildTest(frontSet)}%的学院有{this.vaildTest(detailFrontHigh)}个。具体情况如下：</div>
                                            <p>前排就坐率</p>
                                            <div style={frontImageList.orgList && frontImageList.orgList.length ? { height: frontImageList.orgList.length * 65,minHeight:250 } : { height: 150 }}>
                                                {
                                                    frontImageList.orgList && frontImageList.orgList.length ?
                                                        <BarBox data={frontImageList} unit={'%'} />
                                                        :
                                                        <NoDataAndLoading loading={false} />
                                                }
                                            </div>
                                            <p>3.4低头率情况</p>
                                            <div>平均低头率为{this.vaildTest(globalSleepAvg)}%。其中学生平均低头率低于（含）{this.vaildTest(sleepSet)}%的学院有{this.vaildTest(detailSleepLow)}个；高于{this.vaildTest(sleepSet)}%的学院有{this.vaildTest(detailSleepHigh)}个。具体情况如下：</div>
                                            <p>低头率</p>
                                            <div style={sleepImageList.orgList && sleepImageList.orgList.length ? { height: sleepImageList.orgList.length * 65,minHeight:250 } : { height: 150 }}>
                                                {
                                                    sleepImageList.orgList && sleepImageList.orgList.length ?
                                                        <BarBox data={sleepImageList} unit={'%'} />
                                                        :
                                                        <NoDataAndLoading loading={false} />
                                                }
                                            </div>
                                        </div>
                                    }
                                />
                                <ReportBox
                                    title='四、问题课程情况'
                                    content={
                                        <div className='courseInfo'>
                                            <p>4.1教师考勤情况</p>
                                            <div>视频督导发现有异常并下发给学院进行处理的课程有{this.vaildTest(attDeal)}门，经过学院检查回复后，认定为正常的课程有{this.vaildTest(attDealNormal)}门，实际问题课程数为{this.vaildTest(attDealUnnormal)}门。具体情况如下：</div>
                                            <p>问题课程数</p>
                                            <div style={attDealImageList.orgList && attDealImageList.orgList.length ? {height: attDealImageList.orgList.length * 65,minHeight:250} : { height: 150 }}>
                                                {
                                                    attDealImageList.orgList && attDealImageList.orgList.length ?
                                                        <BarBox data={attDealImageList} xTit={'门'} />
                                                        :
                                                        <NoDataAndLoading loading={false} />
                                                }
                                            </div>
                                            <p>4.2学生课堂秩序（学生到课率/前排就坐率/低头率）情况</p>
                                            <div>视频督导发现有异常并下发给学院进行处理的课程有{this.vaildTest(orderDeal)}门，经过学院检查回复后，认定为正常的课程有{this.vaildTest(orderDealNormal)}门，实际问题课程数为{this.vaildTest(orderDealUnnormal)}门。具体情况如下：</div>
                                            <p>问题课程数</p>
                                            <div style={orderDealImageList.orgList && orderDealImageList.orgList.length ? { height: orderDealImageList.orgList.length * 65,minHeight:250 } : { height: 150 }}>
                                                {
                                                    orderDealImageList.orgList && orderDealImageList.orgList.length ?
                                                        <BarBox data={orderDealImageList} xTit={'门'} />
                                                        :
                                                        <NoDataAndLoading loading={false} />
                                                }
                                            </div>

                                        </div>
                                    }
                                />
                                <ReportBox
                                    title={`五、学生人数低于${detailStuSet}%的课堂明细`}
                                    content={
                                        <div className='detailInfo'>
                                            <div className='detailInfo-table'>
                                                <Table
                                                    dataSource={detail}
                                                    columns={detailCoumn}
                                                    rowKey={record => record.curId}
                                                    pagination={false}
                                                    locale={{ emptyText: <CollageNoData /> }}
                                                    loading={false}
                                                />
                                            </div>
                                        </div>
                                    }
                                />
                            </div>

                }
            </div>
        );
    }
}

export default MasterReport;
