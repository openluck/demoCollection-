/*
 * @Author:zxq
 * @Date: 2020-02-10 13:51:43 
 * @Last Modified by: tj
 * @Last Modified time: 2021-04-08 13:19:03
 */

import React, { Component } from 'react';
import { Table, message, Button } from 'antd';
import axios from "axios";
import Fy from '../../public/fy';
import SVG from "../../public/svg";
import { saveAs } from 'file-saver';
import { withRouter } from 'react-router-dom';
import { getTableData, downLoadTable, genReport } from '../../../request/zxq_report';
import ErrModal from '../../components/details/errModal';
import { request } from '../../../util/request';
import G from '../../../config/g';
let isDev = process.env.NODE_ENV === "development" ? true : false;
class DataTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNum: 1,  //当前页码
      pageSize: 20,  //每页条数20
      total: 0,
      loading: false,
      genLoading: false,
      claLoading: false,
      AiLoading: false,
      alertLoading: false,
      loadingId: "",
      visible: false,
      tableData: null,
      semesterId: G.ISCED_cutSemesterData.semesterId, //学年学期id
      generReport: 1,//下载报告（1.课堂报告 2.AI考勤明细3.课堂秩序明细 
      reportType: "1", //报告类型（1日.2周.3月） 默认1
      reportId: ''
    }
  }

  componentWillReceiveProps (props) {
    let reportType = props.reportType;
    if (reportType != this.state.reportType) {
      this.setState({
        reportType
      }, () => {
        //获取数据
        this.getData(reportType);

      })

    }
  }

  componentDidMount () {
    //获取数据
    this.getData();

  }
  /**
  *分页
  * @param {*} pageNum(页码)
  */
  jumpPage (pageNum) {
    // this.node.scrollIntoView();
    this.props.nodeScrollIntoView();

    this.setState({
      pageNum
    }, () => {
      //接口
      this.getData();
    })

  }

  /*** @desc 生成报告  */
  generReport = (type, reportId) => {
    let generReport;
    let loadingId = this.state.loadingId;
    loadingId = reportId;
    if (type == "classReport") {
      generReport = 1;
      this.setState({
        claLoading: true,
        loadingId

      })
    }
    else if (type == "AIcheckDetail") {
      generReport = 2;
      this.setState({
        AiLoading: true,
        loadingId
      })
    }
    else if (type == 'classDisDet') {
      generReport = 3;
      this.setState({
        disLoading: true,
        loadingId
      })

    } else {
      generReport = 4;
      this.setState({
        alertLoading: true,
        loadingId
      })
    }
    this.getGenerReport(generReport, reportId)
  }
  //生成
  getGenerReport (generReport, reportId) {
    let { reportType } = this.state;
    let { roleType, belongOrgId } = G.ISCED_curRoleInfo;
    let param = {
      roleId: roleType,
      collegeId: belongOrgId,
      reportType, //报告类型（1日.2周.3月） 默认1
      generReport,
      reportId,

    }

    //接口
    genReport(param).then((res) => {
      if (res.data.result && res.data) {
        //1生成成功 2生成失败 3生成中
        if (res.data.data == 1 || res.data.data == 3) {
          setTimeout(() => {
            this.getData();
            this.setState({
              AiLoading: false,
              disLoading: false,
              claLoading: false,
              alertLoading: false
            })
          }, 2000);
        }


      }
    })

  }

  /*** @desc 下载表格数据  */
  download = (type, reportId, reportName) => {
    let generReport;
    if (type == "classReport") {
      generReport = 1;
    }
    else if (type == "AIcheckDetail") {
      generReport = 2;
    }
    else if (type == 'classDisDet') {
      generReport = 3;

    } else {
      generReport = 4;
    }
    this.reportDownLoad(generReport, reportId, reportName)
  }

  /*** 下载报告  */
  reportDownLoad = (generReport, reportId) => {
    let { reportType } = this.state;
    let url = G.dataService;
    let { roleType, belongOrgId } = G.ISCED_curRoleInfo;
    // if (isDev) {
    //    url = "http://10.10.0.130:80"//报告中心
    // } else {
    //   url = "http://10.20.5.223";
    // }
    window.open(url + `/api/report/systemReport/downReport/${roleType}/${belongOrgId}/${reportType}/${reportId}/${generReport}`, true);
  }

  /*** @desc 获取表格数据  */
  getData (Type) {
    let { reportType, pageNum, pageSize, semesterId } = this.state;
    reportType = Type ? Type : reportType;
    let { roleType, belongOrgId } = G.ISCED_curRoleInfo;
    let params = {
      reportType, //报告类型（1日.2周.3月） 默认1
      pageNum,  //当前页码
      pageSize, //条数
      semesterId,
      roleId: roleType,
      collegeId: belongOrgId,

    }

    this.setState({
      loading: true
    })
    //调接口
    getTableData(params).then((res) => {

      if (res.data.result) {
        let tableData = res.data.data;
        let total = res.data.total;
        tableData.map((item) => {
          // 课堂报告情况
          if (item.classReportStatus == 1) {

            item.classReportStatus = "已生成";
          }
          else if (item.classReportStatus == 0) {
            item.classReportStatus = "";
          }
          else if (item.classReportStatus == 2) {
            item.classReportStatus = "等待生成";
          }
          else {
            item.classReportStatus = "生成中";
          }

          //AI考勤明细状态
          if (item.checkDetailStatus == 1) {

            item.checkDetailStatus = "已生成";
          }
          else if (item.checkDetailStatus == 0) {
            item.checkDetailStatus = "";
          }
          else if (item.checkDetailStatus == 2) {
            item.checkDetailStatus = "等待生成";
          }
          else {
            item.checkDetailStatus = "生成中";
          }
          //课堂秩序明细状态
          if (item.classDisDetStatus == 1) {

            item.classDisDetStatus = "已生成";
          }
          else if (item.classDisDetStatus == 0) {
            item.classDisDetStatus = "";
          }
          else if (item.classDisDetStatus == 2) {
            item.classDisDetStatus = "等待生成";
          }
          else {
            item.classDisDetStatus = "生成中";
          }
          //预警课堂状态
          if (item.alertClassStatus == 1) {

            item.alertClassStatus = "已生成";
          }
          else if (item.alertClassStatus == 0) {
            item.alertClassStatus = "";
          }
          else if (item.alertClassStatus == 2) {
            item.alertClassStatus = "等待生成";
          }
          else {
            item.alertClassStatus = "生成中";
          }

        })
        this.setState({
          loading: false,
          tableData,
          total
        })

      } else {
        this.setState({
          loading: false
        })
        message.error(res.data.message)
      }
    }).catch(res => {
      this.setState({
        loading: false
      })
    })
  }
  /*** @desc 查看课堂报告情况  */
  checkReport = (reportId) => {
    let reportType = this.state.reportType;
    let { roleType, belongOrgId } = G.ISCED_curRoleInfo;
    let url = G.dataService;
    // if (isDev) {
    //    url = "http://10.10.0.130:80"//报告中心
    // } else {
    //   url = "http://10.20.5.223";
    // }
    window.open(url + `/api/report/checkReport/${roleType}/${belongOrgId}/${reportType}/${reportId}`, true);
  }

  goImprove () {
    let menu = G.ISCED_curRoleInfo.menuData
    let item = _.find(menu, { name: '教学改进' })
    let menuPath = item.children.length && item.children[0].path;
    let menuReply = _.find(item.children, { name: '异常情况回复' })
    if (menuPath) {
      if (menuReply) {
        this.props.history.push(`/home/imp/reply`)
      } else {
        this.props.history.push(`/home/imp/${menuPath}`)
      }
    } else {
      message.warning('未配置教学改进功能页面！')
    }

  }

  render () {
    let { pageNum, pageSize, visible, loading, tableData, total, loadingId, claLoading, disLoading, AiLoading } = this.state;
    let menu = G.ISCED_curRoleInfo.menuData
    let item = _.find(menu, { name: '教学改进' })
    let menuReply = item.children && item.children.length && _.find(item.children, { name: '异常情况回复' })
    let hasReply = false;
    if (menuReply) {
      hasReply = true
    }
    const columns = [
      {
        title: '报告名',
        dataIndex: 'reportName',
        key: 'reportName',
      },
      {
        title: '课堂情况报告',
        dataIndex: 'classReportStatus',
        key: 'classReportStatus',
        render: (tags, record) => (
          <div>
            {tags == "已生成" ? <div>
              {/* v2.12屏蔽查看功能 */}
              {/* <span className="zxq-show" onClick={this.checkReport.bind(this, record.reportId)}><SVG type="de_show" />查看</span> */}
              <span className="table-download" onClick={this.download.bind(this, "classReport", record.reportId, record.reportName)} > <SVG type="de_download" /> 下载</span> </div>
              : tags == "生成中" ? <span style={{ color: 'rgb(203,203,203)' }}>{tags + "..."}</span>
                : tags}
            {tags == "" ? <div className="genreport" onClick={this.generReport.bind(this, "classReport", record.reportId)} loading={record.reportId === loadingId ? claLoading : false}> <SVG type='shengchengzhong' color='#29C563' />生成</div>
              : null}
          </div>

        ),
      },
      {
        title: 'AI课堂秩序明细表',
        key: 'checkDetailStatus',
        dataIndex: 'checkDetailStatus',
        render: (tags, record) => (
          <div>

            {tags == "已生成" ? <span className="down-svg" onClick={this.download.bind(this, "AIcheckDetail", record.reportId, record.reportName)}> <SVG type="de_download" /> 下载</span>
              : tags == "生成中" ? <span style={{ color: 'rgb(203,203,203)' }}>{tags + "..."}</span>
                : tags}

            {tags == "" ? <div className="genreport" onClick={this.generReport.bind(this, "AIcheckDetail", record.reportId)} loading={record.reportId === loadingId ? AiLoading : false}> <SVG type='shengchengzhong' color='#29C563' />生成</div>
              : null}
          </div>
        ),

      },
      {
        title: '巡课违纪明细表',
        key: 'classDisDetStatus',
        dataIndex: 'classDisDetStatus',
        className: G.ISCED_setInfo.ifClassroomDiscipline === '1' ? '' : 'zxq-none',
        render: (tags, record) => (
          <div>
            {tags == "已生成" ? <span onClick={this.download.bind(this, "classDisDet", record.reportId, record.reportName)} className="down-svg" > <SVG type="de_download" /> 下载</span>
              : tags == "生成中" ? <span style={{ color: 'rgb(203,203,203)' }}>{tags + "..."}</span>
                : tags}

            {tags == "" ? <div className="genreport" onClick={this.generReport.bind(this, "classDisDet", record.reportId)} loading={record.reportId === loadingId ? disLoading : false}> <SVG type='shengchengzhong' color='#29C563' />生成</div>
              : null}
          </div>
        ),
      },
      {
        title: '预警课堂',
        key: 'alertClassStatus',
        dataIndex: 'alertClassStatus',
        render: (tags, record) => (
          <div>
            {tags == "已生成" ? <span onClick={this.download.bind(this, "alertClass", record.reportId, record.reportName)} className="down-svg" > <SVG type="de_download" /> 下载</span>
              : tags == "生成中" ? <span style={{ color: 'rgb(203,203,203)' }}>{tags + "..."}</span>
                : tags}

            {tags == "" ? <div className="genreport" onClick={this.generReport.bind(this, "alertClass", record.reportId)} loading={record.reportId === loadingId ? disLoading : false}> <SVG type='shengchengzhong' color='#29C563' />生成</div>
              : null}
          </div>
        ),
      }
    ];
    return (
      <div className="zxq-table">
        <div className='tj-tools'>
          {
            hasReply ?
              <div className='improve' onClick={this.goImprove.bind(this)}><SVG type="qugaijin" />
                <span>{G.ISCED_curRoleInfo.roleType === '1' || G.ISCED_curRoleInfo.roleType === '2' ? '学校请点击此处进行回复' :
                  G.ISCED_curRoleInfo.roleType === '3' || G.ISCED_curRoleInfo.roleType === '4' ? '开课单位请点击此处回复异常' : ''}</span>
              </div> : null
          }

        </div>
        <Table
          columns={columns}
          dataSource={tableData}
          loading={loading}
          rowKey={(record, index) => index}
          pagination={false}
        />
        <Fy
          pageSize={pageSize}
          pageIndex={pageNum}
          total={total}
          jumpPage={this.jumpPage.bind(this)}
        />
        {
          <ErrModal
            onCancel={() => {
              this.setState({
                visible: false
              })
            }}
            visible={visible}
          />
        }
      </div>
    );
  }

}
export default withRouter(DataTable);