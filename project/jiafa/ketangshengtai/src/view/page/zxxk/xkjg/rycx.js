/*
 * @Author: xm
 * @Date: 2020-07-23 21:00:00
 * @Last Modified by: xm
 * @Last Modified time: 2020-12-09 10:14:21
 * 人员查询
 */

import React, { useCallback, useState } from 'react';
import './../../../../style/zxxk/xkjg/rycx.scss'
import { DatePonent } from './../../../components/topPonent'
import StaticData from '../../../components/zxxk/xkjg/staticdata'
import SVG from './../../../public/public-component-svg'
import PerfectScrollbar from "react-perfect-scrollbar"
import PagePonent from './../../../components/pagePonent'
import nodata from './../../../../media/picture/noneData.png'
import RycxXq from './rycxxq'
import { Input, Button, message } from 'antd'

import { getstatisticalData, exportSubsidiary, getCheckPerList } from './rycx-req'

const { Search } = Input;

const Rycx = props => {

  const [pageIndex, setPageIndex] = useState(1) // 页码
  const [total, setTotal] = useState(50) // 数据总量

  const [statistiData, setStatistiData] = useState({}) // 统计数据

  const [perList, setPerList] = useState([]) // 巡课员列表

  const [semester, setSemester] = useState('') // 学年学期
  const [startTime, setStartTime] = useState('') // 开始时间
  const [endTime, setEndTime] = useState('') // 结束时间
  const [keyword, setKeyword] = useState('') // 关键字

  const [RycxFlag, setRycxFlag] = useState(false)
  // const [rycxId, setRycxId] = useState('')
  const [rycxData, setRycxData] = useState({})
  /* 获取顶部日期信息 */
  const getDateChan = value => {
    const roleInfo = JSON.parse(sessionStorage.getItem('roleInfo'))
    setEndTime(value.endTime)
    setStartTime(value.startTime)
    setSemester(value.semester)
    setKeyword('')
    setPageIndex(1)
    getstatisticalDataFun({ startTime: value.startTime, endTime: value.endTime, semester: value.semester, roleId: roleInfo.roleId || '' }) // 获取统计数据
    getCheckPerListFun({ startTime: value.startTime, endTime: value.endTime, schoolSemester: value.semester, keyword: '', pageIndex: 1, pageSize: 20 }) // 获取巡课员列表
  }

  /* 获取统计数据 */
  const getstatisticalDataFun = async params => {
    const { data } = await getstatisticalData(params)
    // console.log(data)
    if (data.result) {
      setStatistiData(data.data)
    } else {
      message.warning(data.message)
    }
  }

  /* 导出明细 */
  const exportSubsidiaryFun = async params => {
    params.roleId = getRoleId()
    const { data } = await exportSubsidiary(params)
    if (data.result) {
      const file = data.data.excel_file
      window.open(G.serverUrl + '/' + file);
    } else {
      message.warning(data.message)
    }
  }

  /* 获取巡课员列表 */
  const getCheckPerListFun = async (params, total) => {
    params.roleId = getRoleId()
    const { data } = await getCheckPerList(params)
    if (data.result) {
      setTotal(data.total)
      setPerList(data.data)
    } else {
      message.warning(data.message)
    }
  }

  /* 关键字搜索 */
  const hanleSearchKeyword = useCallback(value => {
    setPageIndex(1)
    getCheckPerListFun({ startTime, endTime, schoolSemester: semester, keyword: value, pageIndex: 1, pageSize: 20 })
  }, [startTime, endTime, semester])

  /* 点击去详情页 */
  const hendleToDetail = useCallback((singleId, perName) => {
    setRycxData({
      singleId,
      semester,
      startTime,
      endTime,
      perName
    })
    setRycxFlag(true)
    // props.history.push({
    //   pathname: '/home/zxxk/xkjg/rycxxq/' + singleId + '/' + semester + '/' + startTime + '/' + endTime + '/' + perName
    // })
    // console.log(8888)
  }, [startTime, endTime, semester])

  /* 切换页码 */
  const handlePageChange = useCallback(page => {
    setPageIndex(page)
    getCheckPerListFun({ startTime, endTime, schoolSemester: semester, keyword, pageIndex: page, pageSize: 20 })
  }, [startTime, endTime, semester, keyword])

  const getRoleId = () => {
    let id = ''
    let roleInfo = sessionStorage.getItem('roleInfo')
    if (roleInfo) {
      roleInfo = JSON.parse(roleInfo)
      id = roleInfo.roleId
    }
    return id
  }
  return (
    <div className='xm-rycxbox'>
      <DatePonent dateChan={getDateChan} />
      <div className='xm-rycxbox-content'>
        <ul className='xm-rycxbox-content-breaklist'>
          <li>
            <StaticData name='巡课人数' tip='人' num={statistiData.checkPerNum} />
            <SVG type='rs' width='20px' height='20px' fill='#4ad8b2' />
          </li>
          <li>
            <StaticData name='检查课堂' tip='节' num={statistiData.checkClass} />
            <SVG type='kt' width='20px' height='20px' fill='#4ad8b2' />
          </li>
          <li>
            <StaticData name='检查教师' tip='人' num={statistiData.checkTeacher} />
            <SVG type='js' width='20px' height='20px' fill='#4ad8b2' />
          </li>
          {/* <li>
            <StaticData name='检查课程' tip='门' num={statistiData.checkCourse} />
            <SVG type='kc' width='20px' height='20px' fill='#4ad8b2' />
          </li> */}
        </ul>
        <div className='xm-rycxbox-content-list'>
          <div className='xm-rycxbox-content-list-top'>
            <p className='xm-rycxbox-content-list-top-title'>巡课员列表</p>
            <div className='xm-rycxbox-content-list-top-search'>
              <Search
                placeholder="输入巡课员姓名/教职工号"
                value={keyword}
                onSearch={value => hanleSearchKeyword(value)}
                onChange={e => setKeyword(e.target.value)}
                style={{ width: 240, height: 34 }}
              />
              <Button
                className='xm-rycxbox-content-list-top-dcbutton'
                onClick={() => exportSubsidiaryFun({ schoolSemester: semester, startTime, endTime, keyword })}
                icon={<SVG type='dc' fill='#fff' width='15px' height='15px' />}
              >
                导出明细
                </Button>
            </div>
          </div>

          {
            perList[0] ? (
              <>
                <div className='xm-rycxbox-content-list-table'>
                  <ul className='xm-rycxbox-content-list-table-head'>
                    <li>姓名</li>
                    <li>教职工号</li>
                    <li>巡课范围</li>
                    <li>检查课堂数</li>
                    <li>操作</li>
                    {/* <li></li> */}
                  </ul>
                  <PerfectScrollbar
                    className='xm-rycxbox-content-list-table-body'
                  >
                    {
                      perList[0] && perList.map(item => {
                        return (
                          <ul className='xm-rycxbox-content-list-table-body-child' key={item.singleId}>
                            <li title={item.perName}>{item.perName}</li>
                            <li title={item.perId}>{item.perId}</li>
                            <li title={item.range}>{item.range}</li>
                            <li title={item.checkNum}>{item.checkNum}</li>
                            <li onClick={() => hendleToDetail(item.singleId, item.perName)}><SVG type='ck' fill='#b6babf' width='16px' height='16px' /> <span>查看详情</span></li>
                          </ul>
                        )
                      })
                    }
                  </PerfectScrollbar>
                </div>
                <PagePonent
                  pageIndex={pageIndex}
                  pageChan={handlePageChange}
                  total={total}
                  pageSize={20}
                  len={perList.length}
                />
              </>
            ) : (
                <div className='xm-nodata'>
                  <img src={nodata} alt='' />
                  <p>暂无数据</p>
                </div>
              )
          }
        </div>
      </div>

      {/* 课堂查询盒子 */}
      {
        RycxFlag ?
          <div className='xm-rycxXq'>
            <RycxXq
              // rycxId={rycxId} 
              handleGoBack={() => {
                setRycxFlag(false)
              }}
              rycxData={rycxData} />
          </div> : ''
      }
    </div>
  )
}

export default Rycx;