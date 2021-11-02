/*
 * @Author: lj
 * @Date: 2019-02-10 13:35:50
 * @Last Modified by: tj
 * @Last Modified time: 2021-03-25 16:10:06
 */

/**
 * @description 教师到课率,低头率，前排就座率，课堂违纪公共组件
 */
import React, { Fragment as F, useState, useEffect } from "react";
import XqLine from './../public/xqLine.js'
import ColorsPieEcharts from './../public/ColorsPieEcharts.js';
import PreBar from './../public/preBar';
import Tea_btm_cont from './../public/tea_btm_cont';
import NoDataAndLoading from './../public/noDataAndLoading';
import SVG from './../../../public/svg.js';
import { Select, message, Spin } from "antd";
import { getQsData, realData } from './scl_public_function';
import { withRouter } from 'react-router-dom'
import G from './../../../../config/g.js';
import _ from 'lodash'
import { jumpFun } from './../public/jumpFun'
import _util from './../../../../util/_util'
import { getDjswInfo, getDjswDbfx, getDjswQs, getDjswHhKc, getDjswHhJs } from './../../../../request/lj_scl_image_request';
const { Option } = Select;
const { getMonthDate } = _util
const selArr = [...Array(2).keys()].map((i, index) => i = {
  collegeId: undefined, collegeName: undefined, ind: index + 1
})

function SclPublic(props) {
  //开课单位红黑榜-红黑下拉状态
  const [hhSelect, setHhSelect] = useState(0);

  //趋势下拉数据
  const [qsSelectOne, setQsSelectOne] = useState(undefined);

  const [qsSelectTwo, setQsSelectTwo] = useState(undefined);

  //基本信息数据
  const [infoData, setInfoData] = useState({});

  //开课单位对比分析数据
  const [dbfxData, setDbfxData] = useState({});

  //趋势数据
  const [qsData, setQsData] = useState({});

  //红黑课程数据
  const [hhkcData, setHhkcData] = useState([]);

  //红黑教师数据
  const [hhjsData, setHhjsData] = useState([]);

  //排序
  const [sortValue, setSortValue] = useState('0');

  //基础信息loading
  const [jcLoading, setJcLoading] = useState(true);

  //对比分析loading
  const [dbLoading, setDbLoading] = useState(true);

  //趋势loading
  const [qsLoading, setQsLoading] = useState(true);

  //红黑课程loading
  const [hhkcLoading, setHhkcLoading] = useState(true);

  //红黑教师loading
  const [hhjsLoading, setHhjsLoading] = useState(true);

  // 下拉选中对象 [{teaClaId: '', teaClaName: '', ind: 0}]
  const [selClass, setSelClass] = useState([{ collegeId: '', collegeName: '全校', ind: 0 }, ...selArr]);

  const [max, setMax] = useState(100)
  useEffect(() => {
    setHhSelect(0);
    setQsSelectOne(undefined);
    setQsSelectTwo(undefined);
    setSortValue('0');
    getSchTeaAtten();
    getDjswQsa('', 0);
  }, [props.params])

  //对比分析数据更新
  useEffect(() => {
    getDjswDbfxa();
  }, [sortValue]);

  //红黑榜数据更新
  useEffect(() => {
    getDjswHhKca();
    getDjswHhJsa();
  }, [hhSelect]);

  const getTitle = (v) => {
    switch (v) {
      case 'dkl':
        return '到课率'
        break;
      case 'jzl':
        return '前排就座率'
        break;
      case 'sjl':
        return '低头率'
        break;
      case 'ktwj':
        return '课堂违纪'
        break;
      default:
        return '--'
    }
  }

  const getPieColor = (v) => {
    switch (v) {
      case 'dkl':
        // return ['#646fe2', '#36cbcb', '#68d388', '#eed46d', '#f47a8f', '#975fe5']
        return ([
          "#4ecb73",
          "#eed46d",
          "#f47a8f",
          "#3aa1ff",
          "#975fe5",
        ])
        break;
      default:
        return ['#646fe2', '#36cbcb', '#68d388', '#eed46d', '#f47a8f', '#975fe5'] //['#36cbcb','#68d388','#646fe2']
    }
  }

  const getFw = (v) => {
    switch (v) {
      case 'dkl':
        return G.ISCED_setInfo.attenRaleUnder || 'xx'
        break;
      case 'jzl':
        return G.ISCED_setInfo.seatedRateUnder || 'xx'
        break;
      case 'sjl':
        return G.ISCED_setInfo.sleepRateOver || 'xx'
        break;
      default:
        return '--'
    }
  }
  //考勤红黑榜下拉切换
  const hhChange = (v) => {
    setHhSelect(v);
  }
  //排序
  const onSort = (v) => {
    if (v !== sortValue) {
      setSortValue(v);
    }
  }
  //趋势下拉
  const onChangeQsSelect = (v, index) => {
    // 存储下拉筛选数据
    let t = _.find(props.list, { collegeId: v })
    let obj = Object.assign(t, { ind: index })
    if (selClass.length) {
      selClass[index] ? selClass[index] = obj : selClass.push(obj);
    } else {
      selClass.push(obj)
    }
    // console.log(selClass)
    setSelClass(selClass)
    if (index == 1) {
      setQsSelectOne(v);
    } else {
      setQsSelectTwo(v);
    }
    getDjswQsa(v, index);
  }
  //获取基本信息
  const getSchTeaAtten = () => {
    let params = {
      ...props.params,
    }
    setJcLoading(true);
    getDjswInfo(props.type, params).then((res) => {
      setJcLoading(false);
      if (res.data.result) {
        setInfoData(res.data.data);
      } else {
        message.error(res.data.message)
      }
    })
  }

  //获取开课单位对比分析
  const getDjswDbfxa = () => {
    let params = {
      ...props.params,
      sortType: sortValue
    }
    setDbLoading(true);
    getDjswDbfx(props.type, params).then((res) => {
      setDbLoading(false);
      if (res.data.result) {
        let dbfxData = {
          xData: [],
          yData: []
        }
        res.data.data.map((t, i) => {
          dbfxData.xData.push(t.name);
          dbfxData.yData.push(t.prop);
        })
        setDbfxData(dbfxData);
      } else {
        message.error(res.data.message)
      }
    })
  }
  //获取最大值
  const getMax = (data) => {
    if (data.length) {
      let list = []
      data.map((v, k) => {
        if (typeof v === 'number') {
          list.push(v)
        }
      })
      return Math.max(...list) || 100
    } else {
      return 100
    }
  }
  //获取考勤趋势
  const getDjswQsa = (id, index) => {
    let params = {
      ...props.params,
      checkCollegeId: id,
    }
    setQsLoading(true);
    getDjswQs(props.type, params).then((res) => {
      if (res.data.result) {
        if (id) {
          let collegeIndex = _.findIndex(props.list, { collegeId: id });
          let data = getQsData(
            qsData,
            res.data.data,
            index,
            props.list[collegeIndex].collegeName,
            id,
            selClass
          );
          setQsData({});
          setQsData(data);
          if (data.yData) {
            let first = data.yData[0] ? data.yData[0].list : [0]
            let sec = data.yData[1] ? data.yData[1].list : [0]
            let thr = data.yData[2] ? data.yData[2].list : [0]
            let max = Math.max(...[getMax(first), getMax(sec), getMax(thr)])
            setMax(max)
          }
        } else {
          setQsData({});
          let newData = getQsData(qsData, res.data.data, index, '', id, selClass)
          setQsData(newData);
          if (newData.yData) {
            setMax(getMax(newData.yData[0].list))
          }
        }
      } else {
        message.error(res.data.message)
      }
      setQsLoading(false);
    })
  }

  //获取考勤红黑榜课程排名
  const getDjswHhKca = () => {
    let params = {
      ...props.params,
      colortType: hhSelect,
    }
    setHhkcLoading(true);
    getDjswHhKc(props.type, params).then((res) => {
      setHhkcLoading(false);
      if (res.data.result) {
        setHhkcData(res.data.data)
      } else {
        message.error(res.data.message)
      }
    })
  }

  //获取考勤红黑榜教师排名
  const getDjswHhJsa = () => {
    let params = {
      ...props.params,
      colortType: hhSelect,
    }
    setHhjsLoading(true);
    getDjswHhJs(props.type, params).then((res) => {
      setHhjsLoading(false);
      if (res.data.result) {
        setHhjsData(res.data.data)
      } else {
        message.error(res.data.message)
      }
    })
  }

  const goRouter = (index, type) => {
    let keyValue = jumpFun(infoData.attenPie[index].name)
    let { timeType, selTime,semesterId,couTypeId } = props.params;
    let startT, endT, colId = null, teaId = null, courId = null, breType = null,semId=semesterId;
    if (timeType == 1) {
      startT = new Date(selTime).getTime();
      endT = new Date(selTime).getTime();
    } else if (timeType == 2) {
      let item=_.find(G.ISCED_cutSemesterData.weekList,{weekId:selTime})
      startT = String(item.startTime);
      endT = String(item.endTime);
    } else {
      let monthDate = getMonthDate(selTime)
      startT = new Date(monthDate[0]).getTime();
      endT = new Date(monthDate[1]).getTime();
    }
    if (type === 'dkl') {
      //明细 教学秩序 到课率
      props.history.push(`/home/det/ordclass/${keyValue[1]}/${keyValue[0]}/null/${startT}/${endT}/${colId}/${teaId}/${courId}/${semId}/${couTypeId}`)
    } else if (type === 'jzl') {
      //明细 教学秩序 就座率
      props.history.push(`/home/det/ordsit/${keyValue[1]}/null/${keyValue[0]}/${startT}/${endT}/${colId}/${teaId}/${courId}/${semId}/${couTypeId}`)
    } else if (type === 'sjl') {
      //明细 教学秩序 睡觉率
      props.history.push(`/home/det/ordsle/${keyValue[0]}/null/${keyValue[1]}/${startT}/${endT}/${colId}/${teaId}/${courId}/${semId}/${couTypeId}`)
    } else if (type === 'ktwj') {
      //明细 教学秩序 课堂违纪
      breType=infoData.attenPie[index].id
      props.history.push(`/home/det/ordbre/null/${startT}/${endT}/${colId}/${teaId}/${courId}/${breType}/${semId}/${couTypeId}`)
    }

  }

  return (
    <div className="image_public dkl">
      {
        jcLoading ?
          <div style={{ 'height': '276px', 'width': '100%' }}>
            <NoDataAndLoading loading={true} />
          </div>
          : <div className='scl_kq_info'>
            <div className="scl_kq_info_l">
              {
                infoData && infoData.checkProp ?
                  <div className="scl_kq_info_l_info">
                    <div>
                      <div>{`${realData(infoData.normalProp)}%`}</div>
                      <div>{props.type == 'ktwj' ? '违纪率' : getTitle(props.type)}</div>
                    </div>
                    <div>
                      {infoData && infoData.checkProp ? infoData.checkProp.name : '--'}
                    </div>
                    <span>
                      {
                        infoData && infoData.checkProp && infoData.checkProp.sortType == 1 ?
                          <SVG
                            type={'imgUp'}
                          /> : infoData && infoData.checkProp && infoData.checkProp.sortType == 2 ?
                            <SVG
                              type={'imgDown'}
                            /> : null
                      }
                    </span>
                    <span>
                      {infoData &&
                        infoData.checkProp ?
                        `${realData(infoData.checkProp.changeProp)}%` :
                        '--'}
                    </span>
                  </div> : <NoDataAndLoading loading={false} />
              }

            </div>
            <div>
              <div className="kqfb_header">
                {props.type == 'ktwj' ? '违纪事件' : getTitle(props.type)}分布
            </div>
              <div className="kqfb_con" style={{ 'height': "230px" }}>
                {
                  infoData && infoData.attenPie && infoData.attenPie.length !== 0 ?
                    <ColorsPieEcharts
                      title={props.type == 'ktwj' ? '次' : '课程'}//title="人次" title="%"
                      color={getPieColor(props.type)}//每一个，对应scaleData对应下标的颜色
                      radius={[60, 75]}
                      type={3} //  1 2 不传type 3种样式
                      scaleData={infoData.attenPie}
                      jumpType={props.type}
                      goRouter={goRouter}
                    />
                    : <NoDataAndLoading loading={false} />
                }
              </div>
            </div>
          </div>
      }

      <div className='scl_xydb'>
        <div className='header'>
          <div>
            <span>开课单位对比分析</span>
            <span className='sort_svg'>
              <SVG
                type={'de_sort3'}
                color={sortValue == '1' ? "#1890ff" : "#a1adb3"}
                onClick={() => onSort('1')}
              />
              <SVG
                type={'de_sort2'}
                color={sortValue !== '1' ? "#1890ff" : "#a1adb3"}
                onClick={() => onSort('0')}
              />
            </span>
          </div>
        </div>
        <div className='content'>
          {
            !dbLoading && dbfxData && dbfxData.xData && dbfxData.xData.length !== 0 ?
              <Tea_btm_cont
                barData={{   //数据   Object
                  xData: dbfxData.xData,    //x轴数据  Array
                  yData: dbfxData.yData   //y轴数据  Array
                }} />
              : <NoDataAndLoading loading={dbLoading} />
          }
        </div>
      </div>
      <div className='scl_kqqs'>
        <div className='header'>
          <div><span>{props.type == 'ktwj' ? '违纪率' : getTitle(props.type)}趋势</span></div>
          <div>
            <span>全校</span>
            &nbsp;&nbsp;&nbsp;<div className="vs"></div>&nbsp;&nbsp;&nbsp;
            <Select
              style={{ width: 120 }}
              value={qsSelectOne}
              placeholder='请选择'
              onChange={(v) => onChangeQsSelect(v, 1)}
              getPopupContainer={triggerNode => triggerNode.parentNode} >
              {
                props.list.length !== 0 ?
                  props.list.map((t, i) => {
                    return <Option value={t.collegeId} key={i} disabled={t.collegeId == qsSelectTwo ? true : false}>{t.collegeName}</Option>
                  }) : null
              }
            </Select>
            &nbsp;&nbsp;&nbsp;<div className="vs"></div>&nbsp;&nbsp;&nbsp;
            <Select
              placeholder={"请选择学期"}
              value={qsSelectTwo}
              style={{ width: 120 }}
              placeholder='请选择'
              onChange={(v) => onChangeQsSelect(v, 2)}
              getPopupContainer={triggerNode => triggerNode.parentNode} >
              {
                props.list.length !== 0 ?
                  props.list.map((t, i) => {
                    return <Option value={t.collegeId} key={i} disabled={t.collegeId == qsSelectOne ? true : false}>{t.collegeName}</Option>
                  }) : null
              }
            </Select>
          </div>
        </div>
        <div className='content'>
          {
            !qsLoading && qsData && qsData.xData && qsData.xData.length !== 0 ?
              <XqLine
                color={['#3385ff', '#4ecc7b', '#cfdd68']}
                xData={qsData.xData}
                data={qsData.yData}
                type={props.params.timeType}
                max={max}
              /> : <NoDataAndLoading loading={qsLoading} />
          }

        </div>
      </div>
      <div className="scl_kq_hhb">
        <div className='header'>
          <div style={{ "width": props.type == 'jzl' ? '140px' : 'auto' }}><span>{props.type == 'ktwj' ? '违纪率' : getTitle(props.type)}红黑榜</span></div>
          <div>
            <Select
              defaultValue={hhSelect}
              style={{ width: 80 }}
              getPopupContainer={triggerNode => triggerNode.parentNode}
              onChange={(e) => hhChange(e)}>
              <Option value={0}>红榜</Option>
              <Option value={1}>黑榜</Option>
            </Select>
          </div>
        </div>
        <div className="content">
          <div>
            <div className='title'>
              <div>课程排名</div>
            </div>
            <div className='pm'>
              {
                !hhkcLoading && hhkcData && hhkcData.length !== 0 ?
                  hhkcData.map((t, i) => {
                    return <div key={`${t.name}${i}`}>
                      <PreBar
                        data={t.prop}
                        name={t.name}
                        rank={i + 1} />
                    </div>
                  })
                  : <NoDataAndLoading loading={hhkcLoading} />
              }
            </div>
          </div>
          <div>
            <div className='title'>
              <div>教师排名</div>
            </div>
            <div className='pm'>
              {
                !hhjsLoading && hhjsData && hhjsData.length !== 0 ?
                  hhjsData.map((t, i) => {
                    return <div key={`${t.name}${i}`}>
                      <PreBar
                        data={t.prop}
                        name={t.name}
                        rank={i + 1} />
                    </div>
                  })
                  : <NoDataAndLoading loading={hhjsLoading} />
              }
            </div>

          </div>
        </div>
      </div>
      <div className="scl_kq_ycfx">
        <div className='header'>
          {props.type == 'ktwj' ?
            '违纪课堂分析' : props.type == 'sjl' ?
              `${getTitle(props.type)}高于${getFw(props.type)}%课堂分析` :
              `${getTitle(props.type)}低于${getFw(props.type)}%课堂分析`}
        </div>
        <div className="content">
          <div className="header">
            {props.type == 'ktwj' ?
              '违纪课堂共计' : props.type == 'sjl' ?
                `${getTitle(props.type)}高于${getFw(props.type)}%共计` :
                `${getTitle(props.type)}低于${getFw(props.type)}%共计`}
            <span>
              {
                infoData ?
                  parseInt(infoData.abnormalHour)
                  : '--'
              }
            </span>课程</div>
          <div className="content">
            <div>
              <p>开课单位分布</p>
              <div>
                {
                  !jcLoading && infoData && infoData.collegePie && infoData.collegePie.length !== 0 ?
                    <ColorsPieEcharts
                      title="课程"//title="人次" title="%"
                      titleSize={16}
                      titleSubSize={10}
                      radius={[45, 55]}
                      other={5}
                      color={[
                        "#7bd9e3",
                        "#56bbee",
                        "#ebcd54",
                        "#e7ad66",
                        "#4ecb73",
                        "#3aa1ff",
                      ]}//每一个，对应scaleData对应下标的颜色
                      type={2} //  1 2 不传type 3种样式
                      scaleData={infoData.collegePie}
                    /> : <NoDataAndLoading loading={jcLoading} />
                }
              </div>

            </div>
            <div>
              <p>课程分布</p>
              <div>
                {
                  !jcLoading && infoData && infoData.classPie && infoData.classPie.length !== 0 ?
                    <ColorsPieEcharts
                      title="课程"//title="人次" title="%"
                      titleSize={16}
                      titleSubSize={10}
                      radius={[45, 55]}
                      other={5}
                      color={[
                        "#7bd9e3",
                        "#56bbee",
                        "#ebcd54",
                        "#e7ad66",
                        "#4ecb73",
                        "#3aa1ff",
                      ]}//每一个，对应scaleData对应下标的颜色
                      type={2} //  1 2 不传type 3种样式
                      scaleData={infoData.classPie}
                    /> : <NoDataAndLoading loading={jcLoading} />
                }
              </div>

            </div>
            <div>
              <p>教师分布</p>
              <div>
                {
                  !jcLoading && infoData && infoData.teacherPie && infoData.teacherPie.length !== 0 ?
                    <ColorsPieEcharts
                      title="课程"//title="人次" title="%"
                      titleSize={16}
                      titleSubSize={10}
                      radius={[45, 55]}
                      other={5}
                      color={[
                        "#7bd9e3",
                        "#56bbee",
                        "#ebcd54",
                        "#e7ad66",
                        "#4ecb73",
                        "#3aa1ff",
                      ]}//每一个，对应scaleData对应下标的颜色
                      type={2} //  1 2 不传type 3种样式
                      scaleData={infoData.teacherPie}
                    /> : <NoDataAndLoading loading={jcLoading} />
                }
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );

}

export default withRouter(SclPublic)
