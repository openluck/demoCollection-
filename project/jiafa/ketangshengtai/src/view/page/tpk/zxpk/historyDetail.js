/*
 * @Author: MinJ
 * @Date: 2020-01-19 13:57:33
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-08-19 15:50:12
 * 听评课V2.2——历史评课详情
 */
import { connect } from 'react-redux';
import React, { Component } from 'react';
import moment from 'moment';
import { Table, Divider, Tag, Pagination, Button, } from 'antd';
import BreadCrumb from './../../../components/breadCrumb';
import SVG from './../../../public/public-component-svg';
import noneData from './../../../../media/picture/noneData.png';
import { BreadPonent } from './../../../components/topPonent';
import PagePonent from './../../../components/pagePonent';

import './../../../../style/tpk/rwgz/fyl-rwgzgrxq.scss';
import { getHistoryShow, getHistoryList } from './../../../../redux/tpk/zxpk/history.reducer';
const roleTxt = 'admin';

@connect(state => state.fyl_historyDetailsData, { getHistoryShow, getHistoryList })
export default class HistoryDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
    }
    this.getPageIndex = this.getPageIndex.bind(this);
    this.classNumClick = this.classNumClick.bind(this);
  }
  componentDidMount() {
    const { taskId, semester } = this.props.match.params;
    // let taskId = this.props.match.params.taskId;
    let page = this.state.page;
    this.props.getHistoryShow(taskId, semester);
    this.props.getHistoryList(taskId, page, 2, 0, semester);
  };
  getPageIndex(page) {
    const { taskId, semester } = this.props.match.params;
    // let taskId = this.props.match.params.taskId;
    const { classNumSort, evaluateTimeSort } = this.props;
    this.props.getHistoryList(taskId, page, classNumSort, evaluateTimeSort, semester);
    this.setState({ page: page });
    this.node.scrollIntoView();
  }
  classNumClick(classNumSort, evaluateTimeSort) {
    const { taskId, semester } = this.props.match.params;
    // let taskId = this.props.match.params.taskId;
    this.props.getHistoryList(taskId, 1, classNumSort, evaluateTimeSort, semester)
    this.setState({ page: 1 });
  }
  render() {
    const { showData, tableData, total, classNumSort, evaluateTimeSort } = this.props;
    // console.log(tableData);

    const { page } = this.state;
    let taskId = this.props.match.params.taskId;
    let perId = this.props.match.params.perId;
    const columns = [
      {
        title: '序号',
        dataIndex: 'evaluateNum',
        key: 'evaluateNum',
        align: 'center',
        width: '5%',
        ellipsis: true,
      },
      {
        title: '开课院系',
        dataIndex: 'schoolName',
        key: 'schoolName',
        align: 'center',
        width: '14%',
        ellipsis: true,
      },
      {
        title: '课程名称',
        dataIndex: 'studyName',
        key: 'studyName',
        align: 'center',
        width: '16%',
        ellipsis: true,
      },
      {
        title: '课程类型',
        dataIndex: 'studyType',
        key: 'studyType',
        align: 'center',
        width: '8%',
        ellipsis: true,
        render: (txt) => {
          return <span>
            {
              txt === '1' ? '公共基础' :
                txt === '2' ? '公共选修' :
                  txt === '3' ? '专业基础' : '专业选修'
            }
          </span>
        }
      },
      {
        title: '教师',
        dataIndex: 'teacher',
        key: 'teacher',
        align: 'center',
        width: '10%',
        ellipsis: true,
      },
      {
        title: () => (
          <div className='fyl-hd-sort'>
            <span>节次</span>
            <div className='fyl-hd-sortSvg' >
              <SVG
                onClick={() => this.classNumClick(1, 2)}
                // onClick={() => this.props.getHistoryList(taskId, 1, 1, 2)} 
                type='nextWeek' style={{ color: classNumSort === 1 ? '#59a6ee' : '#a3a3a3' ? classNumSort === 2 : '#a3a3a3' }} />
              <SVG
                onClick={() => this.classNumClick(0, 2)}
                //  onClick={() => this.props.getHistoryList(taskId, 1, 0, 2)}
                type='nextWeek' style={{ color: classNumSort === 0 ? '#59a6ee' : '#a3a3a3' ? classNumSort === 2 : '#a3a3a3' }} />
            </div>
          </div>
        ),
        dataIndex: 'classNum',
        key: 'classNum',
        align: 'center',
        width: '15%',
        ellipsis: true,
      },
      {
        title: () => (
          <div className='fyl-hd-sort'>
            <span>评课时间</span>
            <div className='fyl-hd-sortSvg'>
              <SVG
                onClick={() => this.classNumClick(2, 1)}
                //  onClick={() => this.props.getHistoryList(taskId, 1, 2, 0)} 
                type='nextWeek' style={{ color: evaluateTimeSort === 1 ? '#59a6ee' : '#a3a3a3' ? evaluateTimeSort === 2 : '#a3a3a3' }} />
              <SVG
                onClick={() => this.classNumClick(2, 0)}
                // onClick={() => this.props.getHistoryList(taskId, 1, 2, 1)} 
                type='nextWeek' style={{ color: evaluateTimeSort === 0 ? '#59a6ee' : '#a3a3a3' ? evaluateTimeSort === 2 : '#a3a3a3' }} />
            </div>
          </div>
        ),
        dataIndex: 'evaluateTime',
        key: 'evaluateTime',
        align: 'center',
        width: '12%',
        ellipsis: true,
        render: (txt, record) => (
          <span>{moment(new Date(txt)).format("YYYY-MM-DD HH:mm:ss")}</span>
        ),
      },
      {
        title: '操作',
        key: 'caozuo',
        align: 'center',
        render: (text, record) => (
          <span className='fyl-ckpybwz' onClick={() => this.props.history.push(`/home/tpk/video/${record.studyId}/${taskId}/${perId}/${record.classId}`)}>查看评议表</span>
        ),
      },
    ];
    const title = [
      { name: '序号', id: 'evaluateNum', },
      { name: '开课院系', id: 'schoolName', },
      { name: '课程名称', id: 'studyName', },
      { name: '课程类型', id: 'studyType', },
      { name: '教师', id: 'teacher', },
      { name: '节次', id: 'classNum', },
      { name: '评课时间', id: 'evaluateTime', },
      { name: '操作', id: 'caozuo', },
    ];
    return <div className='fyl-grxq' style={{ height: '100%' }}>
      {/* <BreadCrumb ver='tpk' data={['在线评课', '历史评课', '个人详情',]} /> */}
      <BreadPonent pages={['历史评课', '个人详情',]} />

      <div style={{ padding: 16, height: 'calc(100% - 40px)' }}>
        <div className='fyl-grpk'>
          <div className='fyl-grpkju'>个人评课记录</div>
          {/* <Button onClick={() => this.props.history.goBack()} className='fyl-grpkjufh'>返回 </Button> */}

          <div className='mj-hd-txtCon'>
            <div className='mj-hd-txtLine'>
              <span>职务：</span>
              <span>{showData && showData.duty ? showData.duty : '-'}</span>
            </div>
            <div className='mj-hd-txtLine'>
              <span>所属任务：</span>
              <span>{showData && showData.task ? showData.task : '-'}</span>
            </div>
            <div className='mj-hd-txtLine'>
              <span>最低评课次数：</span>
              <span>{`${showData && showData.mixDegree ? showData.mixDegree : '0'}次`}</span>
            </div>
            <div className='mj-hd-txtLine'>
              <span>指定课程最低评课次数：</span>
              <span>{`${showData && showData.assignDegree ? showData.assignDegree : '0'}次`}</span>
            </div>
          </div>
          {/* <div>
            <div>
              <div className='fyl-tkr'><div className='fyl-yq'></div>{`职务: ${showData && showData.duty ? showData.duty : '-'}`}</div>
              <div className='fyl-zw'><div className='fyl-yq'></div>{`所属任务: ${showData && showData.task ? showData.task : '-'}`}</div>
              <div className='fyl-zw'><div className='fyl-yq'></div>{`最低评课次数: ${showData && showData.mixDegree ? showData.mixDegree : '0'} 次`}</div>
              <div className='fyl-zw'><div className='fyl-yq'></div>{`指定课程最低次数: ${showData && showData.assignDegree ? showData.assignDegree : '0'} 次`}</div>
            </div>
          </div>*/}
        </div>

        {/*评课记录  */}
        <div className='fyl-rwlb'
          style={{ height: 'calc(100% - 112px)' }}
          ref={node => (this.node = node)} >
          <div className='fyl-fh'>
            <div className='fyl-pkxqwenz'>评课记录</div>
          </div>

          <div style={{ padding: '0 16px 20px', height: 'calc(100% - 40px)' }}>
            {
              tableData && tableData.length ?
                <div className='fyl-pkjldata'>
                  <div className='fyl-title fyl-hd-title'>
                    {
                      title.map(item => {
                        return item.id === 'classNum' ?
                          <div className='fyl-hd-sort' key={item.id}>
                            <span>节次</span>
                            <div className='fyl-hd-sortSvg' >
                              <SVG
                                onClick={() => this.classNumClick(1, 2)}
                                type='nextWeek'
                                style={{ color: classNumSort === 1 ? '#59a6ee' : '#a3a3a3' ? classNumSort === 2 : '#a3a3a3' }} />
                              <SVG
                                onClick={() => this.classNumClick(0, 2)}
                                type='nextWeek'
                                style={{ color: classNumSort === 0 ? '#59a6ee' : '#a3a3a3' ? classNumSort === 2 : '#a3a3a3' }} />
                            </div>
                          </div> :
                          item.id === 'evaluateTime' ?
                            <div className='fyl-hd-sort' key={item.id}>
                              <span>评课时间</span>
                              <div className='fyl-hd-sortSvg'>
                                <SVG onClick={() => this.classNumClick(2, 1)}
                                  type='nextWeek'
                                  style={{ color: evaluateTimeSort === 1 ? '#59a6ee' : '#a3a3a3' ? evaluateTimeSort === 2 : '#a3a3a3' }} />
                                <SVG onClick={() => this.classNumClick(2, 0)}
                                  type='nextWeek'
                                  style={{ color: evaluateTimeSort === 0 ? '#59a6ee' : '#a3a3a3' ? evaluateTimeSort === 2 : '#a3a3a3' }} />
                              </div>
                            </div> :
                            < div key={item.id} > {item.name}</div>

                      })
                    }
                  </div>
                  <div className='fyl-table fyl-hd-table'>
                    {/* <div className='fyl-table fyl-hd-table'> */}
                    {
                      tableData.map(item => {
                        return <div className='fyl-tableLine' key={item.evaluateNum}>
                          <div title={item.evaluateNum}>{item.evaluateNum}</div>
                          <div title={item.schoolName}>{item.schoolName}</div>
                          <div title={item.studyName}>{item.studyName}</div>
                          <div title={item.studyType}>
                            {
                              item.studyType === '1' ? '公共基础' :
                                item.studyType === '2' ? '公共选修' :
                                  item.studyType === '3' ? '专业基础' : '专业选修'
                            }
                          </div>
                          <div title={item.teacher}>{item.teacher}</div>
                          <div title={item.classNum}>{item.classNum}</div>
                          <div title={moment(new Date(item.evaluateTime)).format("YYYY-MM-DD HH:mm:ss")}>
                            {moment(new Date(item.evaluateTime)).format("YYYY-MM-DD HH:mm:ss")}
                          </div>
                          <div className='fyl-ckpybwz'
                            onClick={() => this.props.history.push(`/home/tpk/video/${item.studyId}/${taskId}/${perId}/${item.classId}`)}>
                            查看评议表
                          </div>
                        </div>
                      })
                    }
                  </div>

                  {/* <div className='mj-ct-pagenation'>
                    <span className='mj-ct-total'>{`每页20条数据，共${total}条`}</span>
                    <Pagination
                      current={page}
                      total={total}
                      pageSize={20}
                      onChange={(page) => this.getPageIndex(page)}
                    />
                  </div> */}
                  <div className='mj-p-pages'>
                    <PagePonent
                      pageIndex={page}
                      pageSize={20}
                      pageChan={(page) => this.getPageIndex(page)}
                      len={tableData && tableData.length || 0}
                      total={total} />
                  </div>
                </div>
                :
                <div className='mj-rxq-noneData'>
                  <img src={noneData} />
                  <div>暂无数据</div>
                </div>
            }
          </div>
        </div>
        {/* <Button onClick={() => this.props.history.push('/home/tpk/zxpk/wdrw/grrwxq')}>个人任务详情 </Button> */}
      </div>
    </div >;
  }
}
