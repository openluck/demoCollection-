/*
 * @Author: MinJ
 * @Date: 2020-01-19 13:57:33
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-11-26 16:40:18
 * 听评课V2.2——评课设置           
 */

import React, { Component, useState, useEffect } from 'react';
import { Button, Layout, Table, Pagination, Modal, message } from 'antd';

import '../../../../style/tpk/pksz/commentList.css';
import SVG from "../../../public/public-component-svg";
import BreadCrumb from './../../../components/breadCrumb';
import { DynamicForm } from '../../../components/tpk/pksz/form-createOrDesign';
import { requestForListen } from '../../../../util/request';
import nodata from './../../../../media/picture/nodata1.png'

const { Content } = Layout

export function EvaluSetting(props) {

  const [checkHover, setCheckHover] = useState(0)
  const [editHover, setEditHover] = useState(0)
  const [delHover, setDelHover] = useState(0)
  const [formId, setFormId] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showDM, setShowDM] = useState(false)
  const [delTask, setDelTask] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [cpnl, setcpnl] = useState([])
  const [data, setData] = useState([])
  const [formTotal, setFormTotal] = useState(0)

  let columns = [
    {
      title: '序号',
      dataIndex: 'formNum',
      key: Math.random(),
      width: '5%'
    },
    {
      title: '名称',
      dataIndex: 'formName',
      key: Math.random()
    },
    {
      title: '操作',
      width: '20%',
      dataIndex: 'operation',
      key: Math.random(),
      render: (text, record) => {
        return text.map(item => {
          if (item === '预览') {
            return <span
              style={{ marginRight: 20 }}
              key={1}
              title={item}
            // onMouseOver={() => {setCheckHover(record.formId)}}
            // onMouseOut={() => {setCheckHover(0)}}
            >
              <SVG title={item} type={'ck1'} onClick={() => { showPre(record.formId) }} />
            </span>
          }
          else if (item === '编辑') {
            return <span title={item} style={{ marginRight: 20 }} key={2}>
              <SVG title={item} type={'bj'} onClick={() => { props.history.push(`/home/tpk/pksz/pybgl/xzbd/1/${record.formId}`) }} />
            </span>
          }
          else {
            return <span title={item} style={{ marginRight: 20 }} key={3}>
              <SVG title={item} type='sc' onClick={() => { passAndOpen(record.formId) }} />
            </span>
          }
        })
      }
    }
  ]
  let title = [
    { name: '序号', id: 'formNum', },
    { name: '名称', id: 'formName', },
    { name: '操作', id: 'operation', }
  ]

  // let data = [
  //   {
  //     formNum: 1,
  //     formName: '四川大学本科课堂教学评议表（领导干部用）',
  //     operation: ['预览', '编辑', '删除'],
  //     key: Math.random(),
  //     formId: Math.random(),
  //   },
  //   {
  //     formNum: 2,
  //     formName: '四川大学本科课堂教学评议表（领导干部用）',
  //     operation: ['预览', '编辑', '删除'],
  //     key: Math.random(),
  //     formId: Math.random(),
  //   },
  //   {
  //     formNum: 3,
  //     formName: '四川大学本科课堂教学评议表（领导干部用）',
  //     operation: ['预览', '编辑', '删除'],
  //     key: Math.random(),
  //     formId: Math.random(),
  //   },
  //   {
  //     formNum: 4,
  //     formName: '四川大学本科课堂教学评议表（领导干部用）',
  //     operation: ['预览', '编辑', '删除'],
  //     key: Math.random(),
  //     formId: Math.random(),
  //   },
  // ]

  //获取模板信息请求
  const getModalInfoRequest = (pr) => {
    return requestForListen('get/modalInfo', pr)
  }

  //获取模板信息
  const getModalInfo = async a => {
    let { data } = await getModalInfoRequest(a)
    // if (data.message !== '查询成功!') {
    //   message.info(data.message)
    // }
    // else {
    if (currentPage === 1) {
      data.data.map(item => {
        item.operation = ['预览', '编辑', '删除']
        item.key = item.formId
      })
      setData(data.data)
      setFormTotal(data.total)
    }
    else if (data.data.length === 0) {
      // console.log(11111111111111111)
      let a = currentPage - 1
      setCurrentPage(a)
      let pr = {
        pageIndex: a,
        pageSize: 20
      }
      let { data } = await getModalInfoRequest(pr)
      // console.log(data)
      data.data.map(item => {
        item.operation = ['预览', '编辑', '删除']
        item.key = item.formId
      })
      setData(data.data)
      setFormTotal(data.total)
    }
    else {
      // console.log(222222222222222)
      data.data.map(item => {
        item.operation = ['预览', '编辑', '删除']
        item.key = item.formId
      })
      setData(data.data)
      setFormTotal(data.total)
    }
    // data.data.map(item => {
    //   item.operation = ['预览', '编辑', '删除']
    //   item.key = item.formId
    // })
    // setData(data.data)
    // setFormTotal(data.total)
    // /
  }

  //删除模板信息请求
  const delModalInfoRequest = (pr) => {
    return requestForListen('del/delModalInfo', pr)
  }

  //删除模板信息
  const delModalInfo = async a => {
    let { data1 } = await delModalInfoRequest(a)
    let pr = {
      pageIndex: currentPage,
      pageSize: 20
    }
    getModalInfo(pr)
  }

  useEffect(() => {
    let pr = {
      pageIndex: currentPage,
      pageSize: 20
    }
    // console.log(currentPage)
    getModalInfo(pr)
  }, [currentPage])

  //获取componentList请求
  const getComponentListRequest = (pr) => {
    return requestForListen('get/getFormByID', pr)
  }

  //获取componentList
  const getComponentList = async a => {
    let { data } = await getComponentListRequest(a)
    if (data.data === null) {
      message.info(data.message)
    }
    else {
      setcpnl(JSON.parse(data.data.domJson))
      setShowModal(true)
    }
  }

  //进入页面无条件调用获取模板信息方法
  // useEffect(() => {
  //   let pr = {
  //     pageIndex: 1,
  //     pageSize: 20
  //   }
  //   getModalInfo(pr)
  // }, [])

  //删除
  function del(a) {
    let pr = {
      formId: a
    }
    setShowDM(false)

    delModalInfo(pr)
  }

  function showPre(a) {
    let pr = {
      formID: a
    }
    getComponentList(pr)
  }

  function passAndOpen(a) {
    setShowDM(true)
    setDelTask(a)
  }
  // function del(a) {
  //   console.log('del:', a)
  //   setFormId(a)
  // }

  //换页
  function passPage(e) {
    setCurrentPage(e)
    let pr = {
      pageIndex: e,
      pageSize: 20
    }
    getModalInfo(pr)
  }

  return <>
    <Layout style={{ padding: 20 }}>
      {/* <BreadCrumb ver='tpk' data={['评课设置', '评课管理表']} /> */}
      <Content className='special' style={{ backgroundColor: '#fff', padding: 20 }}>
        <div className='firstFloor'>
          <div className='ff-createBTN' style={{ float: 'right' }}>
            <Button icon={<SVG type='tj' />} type='primary' onClick={() => props.history.push(`/home/tpk/pksz/pybgl/xzbd/0/`)}>创建评议表</Button>
          </div>
          <div className='ff-name'>
            <span className='title-line'></span>
            <h2 className='first-title'>评议表</h2>
          </div>
        </div>
        {
          data && data.length ?
            <div className='tableCTN'>
              <div className='llei-title'>
                {
                  title.map(item => {
                    return <div key={item.id}>{item.name}</div>
                  })
                }
              </div>
              <div className='llei-table'>
                {
                  data.map(item => {
                    return <div className='llei-tableLine' key={item.formId}>
                      <div title={item.formNum}>{item.formNum}</div>
                      <div title={item.formName}>{item.formName}</div>
                      <div className='mj-es-iconCon'>
                        <span style={{ marginRight: 20 }} title={'预览'} onClick={() => { showPre(item.formId) }}>
                          <SVG title={'预览'} type={'ck'} />
                          预览
                        </span>
                        <span title={'编辑'}
                          onClick={() => { props.history.push(`/home/tpk/pksz/pybgl/xzbd/1/${item.formId}`) }}
                          style={{ marginRight: 20 }} key={2}>
                          <SVG title={'编辑'} type={'bj'} />
                          编辑
                        </span>
                        <span className='mj-es-iconDele' title={'删除'} key={3} onClick={() => { passAndOpen(item.formId) }}>
                          <SVG title={'删除'} type='sc' />
                          删除
                        </span>
                      </div>
                    </div>
                  })
                }
              </div>

              {/* <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            rowKey={record => record.formId}
            rowClassName={(record, index) => {
              return index % 2 === 1 ? 'dark-row' : 'light-row'
            }}
          >
          </Table> */}

              <div style={{ overflow: 'hidden' }}>
                <span style={{ float: "left", paddingTop: 10 }} className='pagination-text'>每页20条数据，共{formTotal}条</span>
                <div className='paginationCoutainer'>
                  <Pagination
                    defaultCurrent={1}
                    total={formTotal}
                    pageSize={20}
                    // showTotal={total => `每页20条数据，共${total}条`}
                    onChange={passPage}
                    current={currentPage}
                  />
                </div>
              </div>
            </div> : <div className='mj-scl-noneData' style={{ marginTop: '10%' }}>
              <img src={nodata} />
              <p>暂无数据</p>
            </div>
        }
        <Modal
          visible={showModal}
          footer={null}
          onCancel={() => { setShowModal(false) }}
          width='50%'
        >
          <DynamicForm
            isEdit={true}
            isPreview={true}
            componentList={cpnl}
          />
        </Modal>
      </Content>
    </Layout>
    <Modal
      title='提示操作'
      onOk={() => { del(delTask) }}
      onCancel={() => { setShowDM(false) }}
      visible={showDM}
    >
      删除后不可恢复，确定删除？
    </Modal>
  </>;

}
