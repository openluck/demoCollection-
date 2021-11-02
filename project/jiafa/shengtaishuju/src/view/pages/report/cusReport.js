/*
 * @Author: lxx 
 * @Date: 2020-01-23 10:08:48 
 * @Last Modified by: tj
 * @Last Modified time: 2020-07-22 09:35:54
 * 报告中心-自定义报告
 */
import React, { Component } from 'react';
import ReportHeader from '../../components/report/header'
import DataCusTable from '../../components/report/cusTable'
import '../../../style/zxq-report.scss'
import '../../../style/zxqstatic.scss'
class CusReport extends Component {
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
                {/* <div className="report-nav"></div> */}
                    {/* <ReportHeader setReportType = { this.setReportType}/> */}
                <div className="report-table-content">
                    <DataCusTable reportType ={ this.state.reportType} nodeScrollIntoView={this.nodeScrollIntoView}/>
                </div>
            </div>

        );
    }
}

export default CusReport;
