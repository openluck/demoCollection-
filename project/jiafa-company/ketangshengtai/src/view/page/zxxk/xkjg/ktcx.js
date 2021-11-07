/*
 * @Author: xm
 * @Date: 2020-07-20 16.31.17
 * @Last Modified by: xm
 * @Last Modified time: 2020-12-14 17:01:51
 * 课堂查询
 */
import React, { useCallback, useState, useEffect } from 'react';
import './../../../../style/zxxk/xkjg/ktcx.scss'
import { DatePonent } from './../../../components/topPonent'
import StaticData from '../../../components/zxxk/xkjg/staticdata'
import SVG from './../../../public/public-component-svg'
import PagePonent from './../../../components/pagePonent'
import PerfectScrollbar from "react-perfect-scrollbar"
import nodata from './../../../../media/picture/noneData.png'
import Ktcxxq from './ktcxxq'
import { Select, Input, Button, message, Tooltip } from 'antd'

import { getStatistiData, getCollegeList, getCourseList, exportSubsidiary } from './ktcx-req'

const { Option } = Select
const { Search } = Input;

const Ktcx = props => {

  const [pageIndex, setPageIndex] = useState(1) // 页码
  const [total, setTotal] = useState(50) // 数据总量

  const [statistiData, setStatistiData] = useState({}) // 统计数据
  const [collegeList, setCollegeList] = useState([]) // 学院列表
  const [courseDataList, setCourseDataList] = useState([])

  const [semester, setSemester] = useState('') //学年学期
  const [startTime, setStartTime] = useState('') // 开始时间
  const [endTime, setEndTime] = useState('') // 结束时间
  const [collegeId, setCollegeId] = useState('') // 学院id
  const [keyword, setKeyword] = useState('') // 关键字

  const [ktcxXqId, setKtcxXqId] = useState('')
  const [ktcxXqFlag, setKtcxXqFlag] = useState(false)

  useEffect(() => {
    getCollegeListFun()
  }, [])

  /* 获取顶部日期信息 */
  const getDateChan = value => {
    console.log('value', value)
    const roleInfo = JSON.parse(sessionStorage.getItem('roleInfo'))
    setEndTime(value.endTime)
    setStartTime(value.startTime)
    setSemester(value.semester)
    setKeyword('')
    setCollegeId('')
    setPageIndex(1)
    getStatistiDataFun({ startTime: value.startTime, endTime: value.endTime, semester: value.semester, roleId: roleInfo.roleId || '' })
    getCourseListFun({ startTime: value.startTime, endTime: value.endTime, semester: value.semester, collegeId: '', keyword: '', pageIndex: 1, pageSize: 20 })
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

  const getRoleId = () => {
    let id = ''
    let roleInfo = sessionStorage.getItem('roleInfo')
    if (roleInfo) {
      roleInfo = JSON.parse(roleInfo)
      id = roleInfo.roleId
    }
    return id
  }
  /* 获取统计数据 */
  const getStatistiDataFun = async params => {
    const { data } = await getStatistiData(params)
    if (data.result) {
      setStatistiData(data.data)
    } else {
      message.warning('请求数据失败，请重试')
    }
  }

  /* 获取学院列表 */
  const getCollegeListFun = async () => {
    let params = {}
    params.roleId = getRoleId()
    const { data } = await getCollegeList(params)
    if (data.result) {
      setCollegeList(data.data)
    } else {
      message.warning(data.message)
    }
  }

  /* 获取课堂列表 */
  const getCourseListFun = async params => {
    params.roleId = getRoleId()
    const { data } = await getCourseList(params)
    if (data.result) {
      const newData = data.data
      setTotal(data.total)
      setCourseDataList(newData)
    } else {
      message.warning(data.message)
    }
  }

  /* 下拉选择 */
  const handleSelectChange = useCallback(value => {
    setCollegeId(value)
    setPageIndex(1)
    getCourseListFun({ startTime, endTime, semester, collegeId: value, keyword, pageIndex: 1, pageSize: 20 })

  }, [startTime, endTime, semester, keyword])

  /* 关键字搜索 */
  const hanleSearchKeyword = useCallback(value => {
    setPageIndex(1)
    getCourseListFun({ startTime, endTime, semester, collegeId, keyword: value, pageIndex: 1, pageSize: 20 })
  }, [startTime, endTime, semester, collegeId])

  /* 跳转详情页 */
  const hendleToDetail = useCallback(courseId => {
    setKtcxXqId(courseId)
    setKtcxXqFlag(true)
    // props.history.push({
    //   pathname: '/home/zxxk/xkjg/ktcxxq/' + courseId
    // })
  })

  /* 切换页码 */
  const handlePageChange = useCallback(page => {
    setPageIndex(page)
    getCourseListFun({ startTime, endTime, semester, collegeId, keyword, pageIndex: page, pageSize: 20 })
  }, [startTime, endTime, semester, collegeId, keyword])

  return (
    <div className='xm-ktcxbox'>
      <DatePonent dateChan={getDateChan} />
      <div className='xm-ktcxbox-content'>
        <ul className='xm-ktcxbox-content-breaklist'>
          <li>
            <StaticData name='课堂检查' tip='节' num={statistiData.checkClass} />
            <SVG type='kt' width='20px' height='20px' fill='#4ad8b2' />
          </li>
          <li>
            <StaticData name='教师违纪' tip='节' num={statistiData.teacherViolate} />
            <SVG type='js' width='20px' height='20px' fill='#4ad8b2' />
          </li>
          <li>
            <StaticData name='学生违纪' tip='节' num={statistiData.stuViolate} />
            <SVG type='xs1' width='20px' height='20px' fill='#4ad8b2' />
          </li>
          <li>
            <StaticData name='其他事件课堂' tip='节' num={statistiData.otherViolate} />
            <SVG type='qt' width='20px' height='20px' fill='#4ad8b2' />
          </li>
        </ul>
        <div className='xm-ktcxbox-content-list'>
          <div className='xm-ktcxbox-content-list-top'>
            <p className='xm-ktcxbox-content-list-top-title'>课堂列表</p>
            <div className='xm-ktcxbox-content-list-top-seach'>
              <Select
                className='xm-ktcxbox-content-list-top-seach-select'
                onChange={handleSelectChange}
                style={{ width: 120, height: 34 }}
                defaultValue={''}
                value={collegeId}
              >
                {
                  collegeList[0] && collegeList.map(item => {
                    return <Option key={item.collegeId} value={item.collegeId}>
                      {item.collegeName}
                      {/* <Tooltip
                        title={item.collegeName}
                        placement='rightTop'
                      >
                        <span>{item.collegeName}</span>
                      </Tooltip> */}
                    </Option>
                  })
                }
              </Select>
              <Search
                placeholder="输入教师/科目"
                value={keyword}
                onSearch={value => hanleSearchKeyword(value)}
                onChange={e => setKeyword(e.target.value)}
                style={{ width: 240, height: 34 }}
              />
              <Button
                className='xm-ktcxbox-content-list-top-dcbutton'
                onClick={() => exportSubsidiaryFun({ startTime, endTime, schoolSemester: semester, collegeId, keyword })}
                icon={<SVG type='dc' fill='#fff' width='15px' height='15px' />}
              >
                导出明细
              </Button>
            </div>
          </div>
          <div className='xm-ktcxbox-content-list-table'>
            {
              courseDataList && courseDataList[0] ? (
                <>
                  <ul className='xm-ktcxbox-content-list-table-head'>
                    {/* <li>课程号</li> */}
                    <li>上课班级</li>
                    <li>科目名称</li>
                    <li>上课教师</li>
                    <li>上课教室</li>
                    <li>上课时间</li>
                    <li>操作</li>
                  </ul>
                  <PerfectScrollbar
                    className='xm-ktcxbox-content-list-table-body'
                  >
                    {
                      courseDataList.map(item => {
                        return (
                          <ul className='xm-ktcxbox-content-list-table-body-child' key={item.singleId}>
                            {/* <li>{item.courseNum}</li> */}
                            <li>{item.collegeName}</li>
                            <li>{item.courseName}</li>
                            <li>{item.teacherName}</li>
                            <li>{item.classRoomName}</li>
                            <li>{item.time}</li>
                            <li onClick={() => hendleToDetail(item.courseId)}>
                              <SVG type='ck' fill='#b6babf' width='16px' height='16px' style={{ cursor: 'pointer' }} />
                              <span style={{ cursor: 'pointer' }}> 查看结果</span>
                            </li>
                          </ul>
                        )
                      })
                    }
                  </PerfectScrollbar>
                  <PagePonent
                    pageIndex={pageIndex}
                    pageSize={20}
                    len={courseDataList.length}
                    pageChan={handlePageChange}
                    total={total}
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
      </div>
      {/* 课堂查询盒子 */}
      {
        ktcxXqFlag ?
          <div className='xm-ktcxXq'>
            <Ktcxxq ktcxXqId={ktcxXqId} handleGoBack={() => {
              setKtcxXqFlag(false)
            }} />
          </div> : ''
      }

    </div>
  )
}

export default Ktcx;