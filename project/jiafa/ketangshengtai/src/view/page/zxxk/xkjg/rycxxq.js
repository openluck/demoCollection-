/*
 * @Author: MinJ
 * @Date: 2020-07-15 13:51:42
 * @Last Modified by: xm
 * @Last Modified time: 2020-12-28 13:54:58
 * 人员查询详情
 */
import React, { Component } from 'react';
import { Select, message, Input, Button } from 'antd';
import PerfectScrollbar from "react-perfect-scrollbar";
import moment from 'moment';
import { request } from './../../../../util/request';
import { BreadPonent } from './../../../components/topPonent';
import SVG from './../../../public/public-component-svg';
import noneData from './../../../../media/picture/noneData.png';
import PagePonent from './../../../components/pagePonent';
import Ktcxxq from './ktcxxq'

import './../../../../style/zxxk/xkjg/mj-rycxxq.scss';
const { Option } = Select;

class Rycxxq extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collegeList: [],        //学院列表
      college: '',            //选中学院
      searchKey: '',          //搜索值
      tableData: [],          //表格数据
      total: 0,               //表格数据总数
      pageSize: 20,
      pageIndex: 1,
      ktcxXqId: '',
      ktcxXqFlag: false,
    }
    this.getCollegeList = this.getCollegeList.bind(this);
    this.collegeChan = this.collegeChan.bind(this);
    this.inputChan = this.inputChan.bind(this);
    this.getTableData = this.getTableData.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.pageChan = this.pageChan.bind(this);
  }
  componentDidMount() {
    this.getCollegeList();
  }

  /**
   * @desc 获取学院列表
   */
  getCollegeList() {
    request('perSearch/getDetilList', {}, res => {
      let res1 = {
        result: true,
        data: [
          { collegeName: '学院', collegeId: '1' },
          { collegeName: '学院1', collegeId: '11' },
          { collegeName: '学院2', collegeId: '12' },
          { collegeName: '学院3', collegeId: '13' },
        ]
      }
      if (res.result) {
        let data = res.data;
        // data.unshift({ collegeName: '全部', collegeId: '' })
        const id = data.length ? data[0].collegeId : '';
        this.getTableData('', id, 1);
        this.setState({
          collegeList: data,
          college: id,
        })
      } else {
        message.info(res.message)
      }
    })
  }

  /**
   * @desc 获取列表数据
   * @param {*} keyword 搜索关键字 
   * @param {*} collegeId 学院id
   * @param {*} pageIndex 页码
   */
  getTableData(keyword, collegeId, pageIndex) {
    // console.log(this.props.match.params);
    const { pageSize } = this.state;
    const { rycxData } = this.props
    let ret = {
      perId: rycxData.singleId,
      startTime: rycxData.startTime,
      endTime: rycxData.endTime,
      semesterId: rycxData.semester,
      keyword,
      collegeId,
      pageIndex,
      pageSize
    };
    request('perSearch/getAllCollege', ret, res => {
      let res1 = {
        result: true,
        total: 50,
        data: []
      }
      if (res.result) {
        let data = res.data;
        // for (let i = 0; i < 19; i++) {
        //   data.push({
        //     order: i + 1, courseNum: '课程号' + i, courseName: '课程名称' + i, collegeName: '开课院系' + i,
        //     teacherName: '上课教师' + i, classRoom: '上课教室' + i, classTime: 1595322911017, noteId: i
        //   })
        // }
        this.setState({ tableData: data, total: res.total })
      } else {
        message.info(res.message);
        this.setState({ tableData: [], total: 0 })
      }
    })
  }

  /**
   * @desc 学院切换
   * @param {*} value 值
   */
  collegeChan(value) {
    const { searchKey } = this.state;
    this.getTableData(searchKey, value, 1);
    this.setState({
      college: value,
      pageIndex: 1
    })
  }

  /**
   * @desc 输入框变化
   */
  inputChan(event) {
    this.setState({ searchKey: event.target.value })
  }
  onSearch() {
    const { searchKey, college } = this.state;
    this.getTableData(searchKey, college, 1)
    this.setState({ pageIndex: 1 })
  }

  /**
   * @desc 页码切换
   */
  pageChan(page) {
    const { searchKey, college } = this.state;
    this.getTableData(searchKey, college, page);
    this.setState({ pageIndex: page })
  }

  render() {
    const { collegeList, college, tableData, pageIndex, pageSize, searchKey, total, ktcxXqFlag, ktcxXqId } = this.state;
    const { rycxData } = this.props
    const { endTime, perName, startTime } = rycxData;
    const { handleGoBack } = this.props
    // console.log(startTime);
    const title = [
      { name: '序号', id: 'order' },
      // { name: '课程号', id: 'courseNum' },
      { name: '上课班级', id: 'collegeName' },
      { name: '科目名称', id: 'courseName' },
      { name: '上课教师', id: 'teacherName' },
      { name: '上课教室', id: 'classRoom' },
      { name: '上课时间', id: 'classTime' },
      { name: '操作', id: 'option' },
    ];

    return <div className='mj-rxq-content'>
      <BreadPonent pages={['人员查询', '查看详情']} handleGoBack={handleGoBack} />

      <div className='mj-rxq-tableCon'>
        <div className='mj-rxq-titleCon'>
          <div className='mj-rxq-titles'>
            <span>{`${perName}巡课记录`}</span>
            <span>{`${startTime} ~ ${endTime}`}</span>
          </div>
          <div className='mj-rxq-seleCon'>
            <Select
              value={college}
              onChange={(value) => this.collegeChan(value)}
              style={{ width: 220 }}>
              {
                collegeList.map(item => {
                  return <Option key={item.collegeId} value={item.collegeId}>{item.collegeName}</Option>
                })
              }
            </Select>

            <Input
              suffix={<span onClick={() => this.onSearch()}><SVG type='xkjg' /></span>}
              onChange={(e) => this.inputChan(e)}
              onPressEnter={() => this.onSearch()}
              placeholder='输入教师/科目' />
          </div>
        </div>

        <div className='mj-rxq-tableContainer'>
          {
            tableData.length ?
              <div className='mj-p-tables'>
                <div className='mj-p-tableTitle mj-rxq-tableTitle'>
                  {
                    title.map(item => {
                      return <div key={item.id}>{item.name}</div>
                    })
                  }
                </div>
                <div className='mj-rxq-tableScroll'>
                  <PerfectScrollbar>
                    {
                      tableData.map(item => {
                        return <div key={item.noteId} className='mj-p-table mj-rxq-table'>
                          <div title={item.order}>{item.order || '-'}</div>
                          {/* <div title={item.courseNum}>{item.courseNum || '-'}</div> */}
                          <div title={item.collegeName}>{item.collegeName || '-'}</div>
                          <div title={item.courseName}>{item.courseName || '-'}</div>
                          <div title={item.teacherName}>{item.teacherName || '-'}</div>
                          <div title={item.classRoom}>{item.classRoom || '-'}</div>
                          <div title={item.classTime}>{item.classTime || '-'}</div>
                          <div onClick={() => {
                            // this.props.history.push(`/home/zxxk/xkjg/ktcxxq/${item.noteId}`)
                            this.setState({
                              ktcxXqId: item.noteId
                            }, () => {
                              this.setState({
                                ktcxXqFlag: true
                              })
                            })
                          }}>
                            <SVG type='ck' />
                            <span>查看结果</span>
                          </div>
                        </div>
                      })
                    }
                  </PerfectScrollbar>
                </div>

                <div className='mj-p-pages'>
                  <PagePonent
                    pageIndex={pageIndex}
                    pageSize={pageSize}
                    pageChan={(page) => this.pageChan(page)}
                    len={tableData && tableData.length || 0}
                    total={total} />
                </div>
              </div> :
              <div className='mj-rxq-noneData'>
                <img src={noneData} />
                <div>暂无数据</div>
              </div>
          }
        </div>
      </div>
      {/* 课堂查询盒子 */}
      {
        ktcxXqFlag ?
          <div className='xm-ktcxXq'>
            <Ktcxxq ktcxXqId={ktcxXqId} ty='ry' handleGoBack={() => {
              this.setState({
                ktcxXqFlag: false
              })
            }} />
          </div> : ''
      }
    </div>
  }
}

export default Rycxxq;