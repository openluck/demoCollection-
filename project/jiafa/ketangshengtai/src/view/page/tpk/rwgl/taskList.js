/*
 * @Author: MinJ
 * @Date: 2020-01-19 13:57:33
 * @Last Modified by: luolei
 * @Last Modified time: 2020-08-24 14:26:02
 * 听评课V2.2——任务列表
 */

import React, { Component, useState, useEffect } from 'react';
import { Layout, Menu, Select, Button, Table, Pagination, Modal, Icon, message } from 'antd';
import SVG from "./../../../public/public-component-svg";
import BreadCrumb from './../../../components/breadCrumb';
import { requestForListen } from './../../../../util/request';
import noData from './../../../../media/picture/noneData.png';
import { G } from './../../../../config/g';
import PerfectScrollbar from "react-perfect-scrollbar"
import './../../../../style/tpk/rwgl/taskListFirstPage.scss';

import PagePonent from '../../../components/pagePonent'

const { Header, Content, Sider } = Layout;
const { Option } = Select;
// const roleLevel = sessionStorage.getItem('roleLevel');
// console.log(roleLevel, roleLevel === '1', G);


export function TaskList(props) {
  const [semesterList, setSemesterList] = useState(G.semesters)
  const [semester, setSemester] = useState("")

  const [collapsed, setCollapsed] = useState(false)
  const [searchPr, setSearchPr] = useState(
    {
      pageIndex: 1,
      pageSize: 20,
      taskCreator: 'all',
      taskType: 'all',
      taskState: 'all',
      semester: ""
    }
  )
  const [showDM, setShowDM] = useState(false)
  const [firstShow, setFirstShow] = useState(false)
  const [secondShow, setSecondShow] = useState(false)
  const [thirdShow, setThirdShow] = useState(false)
  const [selectTaskId, setSelectTaskId] = useState('')
  const [tableData, setTableData] = useState([])
  const [total, setTotal] = useState(0)
  const [mouseId, setMouseId] = useState(0);
  const [roleLevel, setRoleLevel] = useState('0');
  const [taskState, setTaskState] = useState("all")
  const columns = [
    {
      title: '序号',
      dataIndex: 'taskNum',
      key: 'taskNum',
      width: 50
    },
    {
      title: '任务类型',
      dataIndex: 'taskType',
      key: 'taskType',
      width: '100px',
      // render: (text) => {
      //   if (text === '001') {
      //     return '督导专家'
      //   }
      //   else {
      //     return '领导干部'
      //   }
      // }
    },
    {
      title: '任务名称',
      dataIndex: 'taskName',
      key: 'taskName',
      width: '100px',
      render: (text) => {
        return <span className='cut1' style={{ width: 200, display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text}</span>
      }
    },
    {
      title: '创建日期',
      dataIndex: 'createTime',
      key: 'createTime',
      width: '100px',
      render: text => {
        return formatDate(text)
      }
    },
    {
      title: '截止日期',
      dataIndex: 'deadline',
      key: 'deadline',
      width: '100px',
      render: text => {
        return formatDate(text)
      }
    },
    {
      title: '创建者',
      dataIndex: 'taskCreator',
      key: 'taskCreator',
      width: '100px',
      render: (text) => {
        return <span className='cut1' style={{ width: 200, display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text}</span>
      }
    },
    {
      title: '状态',
      dataIndex: 'taskState',
      key: 'taskState',
      width: '100px',
      render: (text) => {
        if (text === 0) {
          return '未发布'
        }
        else if (text === 1) {
          return '进行中'
        }
        else {
          return '已结束'
        }
      }
    },
    {
      title: '操作',
      className: "textCenter",
      width: '200px',
      dataIndex: 'isPublished',
      key: 'isPublished',
      render: (txt, record) => {
        // console.log(txt)
        return txt === 0 && record.isOperation === 0 ?
          // txt === 0 ?
          <span>
            <span className='operationItem' onClick={() => publish(record)}>
              <SVG title={'发布'} type='fb' />
            </span>
            <span className='operationItem' onClick={() => props.history.push(`/home/tpk/rwgl/rwlb/cjpkrw/0/${record.taskId}`)}>
              <SVG title={'编辑'} type='bj' />
            </span>
            <span className='operationItem-del' onClick={() => { passAndOpen(record.taskId) }} >
              <SVG title={'删除'} type='sc' />
            </span>
          </span> :
          <span
            className='operationItem'
            onClick={() => {
              props.history.push(`/home/tpk/rwgl/rwlb/cjpkrw/1/${record.taskId}`)
            }}
            style={{ margin: 0 }}
          >
            <SVG title={'查看'} type={'ck'} />
          </span>
        //    operation.map(
        //     item => {
        //       if (item === '查看') {
        //         return <span
        //           className='operationItem'
        //           title={item}
        //           key={record.taskId}
        //           // onMouseOver={() => { moveIn(record.taskId) }}
        //           // onMouseOut={() => { moveOut(0) }}
        //         >
        //           <SVG title={item} type={mouseId === record.taskId ? 'ck' : 'icon-chakanxq'}
        //             onClick={() => {
        //               props.history.push(`/admin/tpk/rwgl/rwlb/cjpkrw/1/${record.taskId}`)
        //             }} />
        //         </span>
        //       }
        //       else if (item === '发布') {
        //         return <span className='operationItem' title={item} key={Math.random()}>
        //           <SVG title={item} type='fb' onClick={() => publish(record)} />
        //         </span>
        //       }
        //       else if (item === '编辑') {
        //         return <span className='operationItem' title={item} key={Math.random()}><SVG title={item} type='bj' onClick={() => props.history.push(`/admin/tpk/rwgl/rwlb/cjpkrw/0/${record.taskId}`)} /></span>
        //       }
        //       else {
        //         return <span className='operationItem' title={item} key={Math.random()}><SVG title={item} type='sc' onClick={() => { passAndOpen(record.taskId) }} /></span>
        //       }
        //     }
        //   )
      }
    }
  ]

  useEffect(() => {
    getData({
      ...searchPr,
      semester: semester
    })
  }, [semester])

  useEffect(() => {
    if (G.semesters && G.semesters.length > 0) {
      setSemester(G.semesters[0].id)
    }
  }, [G.semesters])

  function passAndOpen(a) {
    setSelectTaskId(a)
    setShowDM(true)
  }

  //发送获取列表数据请求
  const getData1 = (pr) => {
    return requestForListen('get/taskList', pr)
  }

  //获取列表数据
  const getData = async a => {
    let { data } = await getData1(a)
    if (data.result) {
      if (searchPr.pageIndex === 1) {
        setTableData(data.data)
        setTotal(data.total)
      }
      else if (data.data?.length === 0) {
        let tp = searchPr
        tp.pageIndex = tp.pageIndex - 1
        setSearchPr(tp)
        let { data } = await getData1(tp)
        setTableData(data.data)
        setTotal(data.total)
      }
      else {
        setTableData(data.data)
        setTotal(data.total)
      }
    }
    else {
      message.warning(data.message)
    }
  }

  //发送发布或删除请求
  const pubOrDelRequest = (pr) => {
    return requestForListen('commit/publishOrDel', pr)
  }

  //发布或删除并重新获取数据
  const pubOrDel = async a => {
    let { data } = await pubOrDelRequest(a)
    getData(searchPr)
  }

  // useEffect(() => {
  //   getData(searchPr)
  // },[searchPr.pageIndex])



  useEffect(() => {
    getData(searchPr)

    const roleLevel = sessionStorage.getItem('roleLevel');
    // console.log(roleLevel, roleLevel === '1', G);
    setRoleLevel(roleLevel);
  }, [])

  //生成操作项
  function createOperation(tableData) {
    // console.log(tableData)
    tableData?.map(item => {
      if (item.isPublished === 0 && item.isOperation === 0) {
        item.Operation = ['发布', '编辑', '删除']
      }
      else {
        item.Operation = ['查看']
      }
    })
    return tableData
  }


  let newData = createOperation(tableData)

  //创建者下拉事件捕获
  function changeCreator(value) {
    let temp = searchPr
    temp.taskCreator = value
    // console.log(temp)
    setSearchPr(temp)
    // console.log(value)
  }

  //任务类型下拉事件捕获
  function changeType(value) {
    let temp = searchPr
    temp.taskType = value
    setSearchPr(temp)
    // console.log(temp)
  }

  //状态下来事件捕获
  function changeState(value) {
    let temp = searchPr
    temp.taskState = value
    temp.semester = (value == 1 || value == 2) ? semester : ""
    // console.log(temp)
    setSearchPr(temp)
    setTaskState(value)
    // console.log(temp)
  }

  //查看
  function check(a) {
    // console.log('check:', a.key)
  }

  //发布
  function publish(a) {
    // console.log(a);
    setSelectTaskId(a.taskId);
    if (a.ifForm === 1) { //有表单
      setSecondShow(true);
    } else {  //无表单
      setThirdShow(true);
    }
    // setFirstShow(true)
  }

  //删除
  function del(a) {
    let pr = {
      taskId: a,
      taskOperation: '2'
    }
    setShowDM(false)
    pubOrDel(pr)
  }

  //鼠标移入
  function moveIn(a) {
    // console.log(a)
    setMouseId(a)
  }

  //鼠标移出
  function moveOut(a) {
    // console.log(a)
    setMouseId(a)
  }

  //捕获查询所需参数
  function getSearchPr() {
    let tp = searchPr
    tp.pageIndex = 1
    // console.log(tp)
    getData(searchPr)
  }

  //传递分页信息
  function passPage(e) {
    let pr = searchPr
    pr.pageIndex = e
    getData(pr);
    // document.getElementById('taskList').scrollIntoView();
    document.documentElement.scrollTop
  }

  //隐藏1
  function hide1() {
    // setFirstShow(false)
  }
  //展示1
  function show1() {
    // setFirstShow(true)
  }

  //隐藏2
  function hide2() {
    setSecondShow(false)
  }
  //展示2
  function show2() {
    setSecondShow(true)
    hide1()
  }

  //隐藏3
  function hide3() {
    setThirdShow(false)
  }
  //展示3
  function show3() {
    setThirdShow(true)
    hide1()
  }

  // function moveToCreate() {
  //   hide3()
  //   props.history.push('/admin/tpk/rwgl/rwlb/cjpkrw/1')
  // }

  function realPublish() {
    hide2()
    let pr = {
      taskId: selectTaskId,
      taskOperation: '1'
    }
    // console.log(pr)
    pubOrDel(pr)
  }

  //转换时间格式
  function formatDate(k) {
    if (k) {
      let now = new Date(k)
      var year = now.getFullYear();
      var month = (now.getMonth() + 1 < 10) ? '0' + (now.getMonth() + 1) : (now.getMonth() + 1);
      var date = (now.getDate() < 10 ? '0' + now.getDate() : now.getDate());
      var hour = (now.getHours() < 10 ? '0' + now.getHours() : now.getHours());
      var minute = (now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes());
      return year + "-" + month + "-" + date;
    }
    else {
      return '--'
    }
  }

  function selectCondition(a) {
    // console.log('a:', a)
    let b = a.map(item => {
      return <Option key={item.taskTypeId} value={item.taskTypeId}>{item.tasktype}</Option>
    })
    return b
  }

  function builderList(a) {
    //
    // console.log(a)
    return (
      a.map(item => {
        return <Option key={item.builderId}>{item.builder}</Option>
      })
    )
  }

  function TableList(props) {
    if (!tableData?.length) {
      return <div style={{ textAlign: "center", paddingTop: '100px' }}>
        <img style={{ width: '200px', height: '200px' }} src={noData}></img>
        <p style={{ paddingTop: 20 }}>暂无数据</p>
      </div>
    } else {
      return (

        <div style={{ height: "100%" }}>
          <PerfectScrollbar style={{ height: "calc(100% - 70px)" }}>
            <Table
              columns={columns}
              dataSource={newData}
              // scroll={{ y: 530 }}
              pagination={false}
              rowKey={record => record.taskId}
            // rowClassName={(record, index) => {
            //   return index % 2 === 1 ? 'dark-row' : 'light-row'
            // }}
            />
          </PerfectScrollbar>
          <div className='ll-paginationCTN'>
            {/* <Pagination
              defaultCurrent={1}
              total={total}
              pageSize={20}
              // showTotal={total => `每页20条数据，共${total}条`}
              onChange={passPage}
              current={searchPr.pageIndex}
            /> */}
            <PagePonent
              pageIndex={searchPr.pageIndex}
              pageSize={20}
              pageChan={passPage}
              len={newData && newData.length || 0}
              total={total}
            />
          </div>
        </div>
      )
    }

  }

  return (
    <div style={{ height: "100%" }}>
      <div style={{ height: 50, backgroundColor: "white", width: "100%", display: taskState == "1" || taskState == "2" ? "block" : "none" }}>
        <div className='mj-dp-semester'>
          <Select
            onChange={(val, option) => {
              console.log(val)
              setSemester(val)
              let temp = searchPr
              temp.semester = (taskState == 1 || taskState == 2) ? val : ""
              setSearchPr(temp)
            }}
            value={semester ?? ''}
            suffixIcon={<SVG type='xl' />}
            dropdownClassName='mj-dp-dropDown'>
            {

              G.semesters && G.semesters?.length ?
                G.semesters?.map(item => {
                  return <Option key={item.id} value={item.id}>{item.name}</Option>
                }) : null
            }
          </Select>
        </div>
      </div>
      <Layout style={{ padding: 20, height: taskState == "1" || taskState == "2" ? "calc(100% - 50px)" : "100%" }}>
        <Content
          // id='taskList'
          style={{
            padding: 20,
            background: '#fff',
            // overflow: 'scroll'
            height: "100%",
            paddingBottom: 0
          }}
        >
          {/* <div className='firstPage-Header'> */}

          {/* <span className='title-line'></span>
          <h2 className='title-name'>任务列表</h2> */}
          {/* </div> */}

          <div className='firstPage-SecondFloor' >
            <h2 style={{ marginBottom: 20 }}>
              任务列表
            </h2>
            <div className='firstPage-SecondFloor-control'>

              <div className="ll-disaster-right">
                <div className='secondFloor-item'>
                  <span>创建者：</span>
                  <Select defaultValue='all' style={{ width: 150 }} onChange={changeCreator}>
                    {
                      G.builderList?.length > 0 && G.builderList?.map((item, i) => {
                        return (
                          <Option key={item.builderId} value={item.builderId}>{item.builder}</Option>
                        )
                      })
                    }
                  </Select>
                </div>
                <div className='secondFloor-item' >
                  <span>任务类型：</span>
                  <Select defaultValue='all' style={{ width: 150 }} onChange={changeType}>
                    {
                      G.taskTypeList?.map(item => {
                        return <Option key={item.taskTypeId} value={item.taskTypeId}>{item.tasktype}</Option>
                      })
                    }
                  </Select>
                </div>
                <div className='secondFloor-item'>
                  <span>任务状态：</span>
                  <Select onChange={changeState} style={{ width: 150 }} defaultValue='all'>
                    <Option value='all'>全部</Option>
                    <Option value='0'>未发布</Option>
                    <Option value='1'>进行中</Option>
                    <Option value='2'>已结束</Option>
                  </Select>
                </div>
                <div className='secondFloor-searchItem'>
                  <Button type='primary' onClick={getSearchPr}>筛选</Button>
                </div>
                <div className='item-createTask'>
                  <Button type='primary' onClick={() => props.history.push('/home/tpk/rwgl/rwlb/cjpkrw/0')}>
                    <SVG
                      type="tj"
                      width={16}
                      height={16}
                      fill="white"
                      style={{ marginRight: 5 }}
                    />创建评课任务
              </Button>
                </div>
              </div>
            </div>
          </div>
          <div className='firstPage-tableCTN'>
            {/* <Table
            columns={columns}
            dataSource={newData}
            // scroll={{ y: 530 }}
            pagination={false}
          /> */}
            <TableList />
          </div>
          <div>
            <Modal
              onOk={hide1}
              onCancel={hide1}
              footer={null}
              visible={firstShow}
            >
              <Button
                type='primary'
                onClick={show2}
                style={{ marginRight: 60 }}
              >已有表单时发布任务</Button>
              <Button onClick={show3}>无表单时发布任务</Button>
            </Modal>
            {/* 发布 */}
            <Modal
              title='提示'
              onOk={realPublish}
              onCancel={hide2}
              visible={secondShow}
            >
              <p>发布后不可再修改，确认发布？</p>
            </Modal>
            {/* 跳转 - 创建表单 */}
            <Modal
              title='提示'
              className={roleLevel === '1' ? 'llei-btnNone' : ''}
              onOk={() => roleLevel === '1' ? setThirdShow(false)
                : props.history.push(`/home/tpk/pksz/pybgl/xzbd/0/${null}`)}
              onCancel={hide3}
              visible={thirdShow}
              cancelText={roleLevel === '1' ? <div style={{ display: 'none' }}></div> : '取消'}
              okText={roleLevel === '1' ? '确定' : '前往'}
            >
              <p>{roleLevel === '1' ? '目前没有可用表单，请联系管理员创建表单' : '目前没有可用的表单，请前去创建表单！'}</p>
            </Modal>
            {/* 删除 */}
            <Modal
              title='提示操作'
              onOk={() => { del(selectTaskId) }}
              onCancel={() => { setShowDM(false) }}
              visible={showDM}
            >
              删除后不可恢复，确定删除？
          </Modal>
          </div>
        </Content>
      </Layout>
    </div>
  )
}
