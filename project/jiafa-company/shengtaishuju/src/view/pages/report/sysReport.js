/*
 * @Author: lxx 
 * @Date: 2020-01-23 10:08:48 
 * @Last Modified by: tj
 * @Last Modified time: 2021-02-23 10:12:59
 * 报告中心-系统报告
 */
import React, { Component } from 'react';
import ReportHeader from '../../components/report/header'
import ReportTable from '../../components/report/table'
import '../../../style/zxq-report.scss'
import '../../../style/zxqstatic.scss'
class SysReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reportType:1 //1日2周3月
        };

        this.setReportType = this.setReportType.bind(this);
        this.nodeScrollIntoView=this.nodeScrollIntoView.bind(this);
    }

    /* 设置报告类型*/
    setReportType = (reportType)=>{
        console.log("reportTyp",reportType)
        this.setState({
            reportType
        })
    }
    nodeScrollIntoView(){
        this.node.scrollIntoView();
    }
    render() {
        return (
            // <div>报告中心-系统报告</div>
            <div className="zxq-report-contnier" ref={(node) => { this.node = node }}>
                <div className="report-nav"></div>
                    <ReportHeader setReportType = { this.setReportType} type={'1'}/>
                <div className="report-table-content">
                    <ReportTable reportType ={ this.state.reportType} nodeScrollIntoView={this.nodeScrollIntoView}/>
                </div>
            </div>

        );
    }
}

export default SysReport;
