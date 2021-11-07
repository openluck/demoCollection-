/*
 * @Author: lj
 * @Date: 2019-02-10 13:35:50
 * @Last Modified by: tj
 * @Last Modified time: 2021-03-25 16:09:31
 */

/**
 * @description 教师考勤组件
 */
import React, { Fragment as F, useState, useEffect } from "react";
import XqLine from './../public/xqLine.js'
import {withRouter} from 'react-router-dom';
import ColorsPieEcharts from './../public/ColorsPieEcharts.js';
import PreBar from './../public/preBar';
import {realData,getQsData} from './../scl_image/scl_public_function.js';
import Tea_btm_cont from './../public/tea_btm_cont';
import NoDataAndLoading from './../public/noDataAndLoading';
import SVG from './../../../public/svg.js';
import {getAttCode} from './../public/jumpFun'
import { Select, message, Progress  } from "antd";
import _util from './../../../../util/_util'
import _ from 'lodash';
import G from './../../../../config/g.js';
import { getSchTeaAtten, getSchAttenAna, getSchAttenTrend, getSchAttenTea, getSchAttenCour, getSchTypeLine } from './../../../../request/lj_scl_image_request';
const {getMonthDate}=_util
const { Option } = Select;
const subTab = [{
  type: '1',
  name: '正常'
}, {
  type: '2',
  name: '迟到'
},
{
  type: '3',
  name: '早退'
},
{
  type: '4',
  name: '缺勤'
},
{
  type: '5',
  name: '调换课'
},
{
  type: '6',
  name: '请假'
}]

const selArr = [...Array(2).keys()].map((i, index) => i = {
  collegeId: undefined, collegeName: undefined, ind: index + 1
})

 function Jskq(props) {
  //开课单位下拉数据
  const[xyList,setXyList] = useState(props.list); 

  //开课单位对比-考勤状态
  const [dbTab, setDbTab] = useState('1');

  //开课单位考勤趋势-考勤状态
  const [qsTab, setQsTab] = useState('1');

  //开课单位考勤红黑榜-考勤状态
  const [hhTab, setHhTab] = useState('1');

  //开课单位考勤红黑榜-红黑下拉状态
  const [hhSelect, setHhSelect] = useState(0);

  //趋势下拉1
  const [qsSelectOne, setQsSelectOne] = useState(undefined);

  //趋势下拉2
  const [qsSelectTwo, setQsSelectTwo] = useState(undefined);

  //基本信息数据
  const [infoData, setInfoData] = useState({});

  //考勤信息数据
  const [attPie, setAttPieData] = useState([]);

  //开课单位对比分析数据
  const [dbfxData, setDbfxData] = useState({});

  //趋势数据
  const [qsData, setQsData] = useState({});

  //红黑课程数据
  const [hhkcData, setHhkcData] = useState([]);

  //红黑课程数据
  const [hhjsData, setHhjsData] = useState([]);

  //排序
  const [sortValue, setSortValue] = useState("0");

  //基础loading
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


  //初始化数据更新
  useEffect(() => {
    setDbTab('1');
    setQsTab('1');
    setHhTab('1');
    setHhSelect(0);
    setSortValue('0');
    setQsSelectOne(undefined);
    setQsSelectTwo(undefined);
    getSchTeaAttena();
  }, [props.params])

  //对比分析数据更新
  useEffect(()=>{
    getSchAttenAnaa();
  },[sortValue,dbTab]);

  //趋势数据更新
  useEffect(()=>{
    getSchAttenTrenda('',0)
      if(qsSelectOne){
        getSchAttenTrenda(qsSelectOne,1);
      }
      if(qsSelectTwo){
        getSchAttenTrenda(qsSelectTwo,2);
      }
  },[qsTab]);

  //红黑榜数据更新
  useEffect(()=>{
    getSchAttenCoura();
    getSchAttenTeaa();
  },[hhTab,hhSelect]);
  

  //对比分析状态切换
  const onChangeDbTab = (v) => {
    setDbTab(v);
  }

  //排序
  const onSort = (v) => {
    if(v !== sortValue){
      setSortValue(v);
    }
  }
  //考勤趋势状态切换
  const onChangeQsTab = (v) => {
    setQsTab(v);
  }
  //趋势下拉
  const onChangeQsSelect = (v,index) => {
    console.log(props.list, v)
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
    if(index == 1){
      setQsSelectOne(v);
    }else{
      setQsSelectTwo(v);
    }
    getSchAttenTrenda(v,index);
  }
  //考勤红黑榜状态切换
  const onChangeHhTab = (v) => {
    setHhTab(v);
  }

  //考勤红黑榜下拉切换
  const hhChange = (v) => {
    setHhSelect(v);
  }

  //获取考勤基本信息
  const getSchTeaAttena = () => {
    let params = {
      ...props.params,
    }
    setJcLoading(true);
    getSchTeaAtten(params).then((res) => {
      setJcLoading(false);
      if (res.data.result) {
        setInfoData(res.data.data);
        let $infoData=res.data.data;
        let arr=[
          {
            name: '正常',
            prop: $infoData.attenPie.teaAttNormal,
            key:getAttCode('teaAttNormal')
          },
          {
            name: "迟到",
            prop: $infoData.attenPie.teaAttLate,
            key:getAttCode('teaAttLate')
          },
          {
            name: "缺勤",
            prop: $infoData.attenPie.teaAttAbsence,
            key:getAttCode('teaAttAbsence')
          },
          {
            name: "调换课",
            prop: $infoData.attenPie.teaAttExchange,
            key:getAttCode('teaAttExchange')
          },
          {
            name: "早退",
            prop: $infoData.attenPie.teaEarly,
            key:getAttCode('teaEarly')
          },
          {
            name: "请假",
            prop: $infoData.attenPie.leave||0,
            key:getAttCode('leave')
          },
        ]
        setAttPieData(arr)
      } else {
        message.error(res.data.message)
      }
    })
  }

  //获取开课单位对比分析
  const getSchAttenAnaa = () => {
    let param = {
      ...props.params,
      sortType:sortValue,
      checkType:dbTab
    } 
    setDbLoading(true);
    getSchAttenAna(param).then((res) => {
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

  //获取考勤趋势
  const getSchAttenTrenda = (id,index) => {
    let param = {
      ...props.params,
      checkCollegeId:id,
      checkType:qsTab
    } 
    setQsLoading(true);
    getSchAttenTrend(param).then((res) => {
      
      if (res.data.result) {
        if(id){
          let collegeIndex = _.findIndex(props.list, { collegeId: id });
          let data = getQsData(
            qsData, 
            res.data.data,
            index,
            props.list[collegeIndex].collegeName,
            id,
            selClass, 
          );
          setQsData({})
          setQsData(data)
        }else{
          let data = getQsData(qsData,res.data.data,index,'全校',id,selClass);
          setQsData({})
          setQsData(data)
        }
      } else {
        message.error(res.data.message)
      }
      setQsLoading(false);
    })
  }

  //获取考勤红黑榜课程排名
  const getSchAttenCoura = () => {
    let param = {
      ...props.params,
      checkType:hhTab,
      colortType:hhSelect
    } 
    setHhkcLoading(true)
    getSchAttenCour(param).then((res) => {
      setHhkcLoading(false)
      if (res.data.result) {
        setHhkcData(res.data.data)
      } else {
        message.error(res.data.message)
      }
    })
  }

  //获取考勤红黑榜教师排名
  const getSchAttenTeaa = () => {
    let param = {
      ...props.params,
      checkType:hhTab,
      colortType:hhSelect
    } 
    setHhjsLoading(true)
    getSchAttenTea(param).then((res) => {
      setHhjsLoading(false)
      if (res.data.result) {
        setHhjsData(res.data.data)
      } else {
        message.error(res.data.message)
      }
    })
  }

  const goRouter=(index)=>{
   //明细 教学秩序 课堂考勤
   console.log(props)
   let value=attPie[index].key;
   let {timeType,selTime,semesterId,couTypeId} = props.params;
   let startT,endT,colId=null,teaId=null,courId=null,semId=semesterId;
   if(timeType==1){
    startT = new Date(selTime).getTime();
    endT = new Date(selTime).getTime();
   }else if(timeType==2){
    let item=_.find(G.ISCED_cutSemesterData.weekList,{weekId:selTime})
    startT = String(item.startTime);
    endT = String(item.endTime);
   }else{
    let monthDate=getMonthDate(selTime)
    startT = new Date(monthDate[0]).getTime();
    endT = new Date(monthDate[1]).getTime();
   }
    props.history.push(`/home/det/ordtea/${value}/null/${startT}/${endT}/${colId}/${teaId}/${courId}/${semId}/${couTypeId}`)
  }

  return (
    <div className="image_public jskq">
      {
        jcLoading ? 
        <div style={{'height':'276px','width':'100%'}}>
           <NoDataAndLoading loading={true} />
        </div>
        : <div className='scl_kq_info'>
        <div className="scl_kq_info_l">
            <div className="scl_kq_info_l_info">
            <div>
              <div>{infoData ? realData(infoData.normalProp) + '%' : '--'}</div>
              <div>正常率</div>
            </div>
            <div>
              {infoData && infoData.checkProp ? infoData.checkProp.name : '--'}
            </div>
            <span>
              {
                infoData && infoData.checkProp && infoData.checkProp.sortType == 1 ? 
                <SVG
                type={'imgUp'}
              />:
              infoData && infoData.checkProp && infoData.checkProp.sortType == 2 ? 
              <SVG
              type={'imgDown'}
              />
              :null
              }
            </span>
            <span>
              { 
                infoData && 
                infoData.checkProp ? 
                realData(infoData.checkProp.changeProp) + '%' : 
                '--'}
            </span>
          </div>
        </div>
        <div>
          <div className="kqfb_header">
            考勤分布情况
            
            </div>
          <div className="kqfb_con" style={{ 'height': "230px" }}>
            {
              infoData && infoData.attenPie && infoData.attenPie.length !== 0 ?
                <ColorsPieEcharts
                  title="课程"//title="人次" title="%"
                  color={[
                    "#4ecb73",
                    "#eed46d",
                    "#f47a8f",
                    "#3aa1ff",
                    "#975fe5",
                    "#f66464",
                  ]}//每一个，对应scaleData对应下标的颜色
                  radius={[60, 75]}
                  type={1} //  1 2 不传type 3种样式
                  scaleData={attPie}
                  goRouter={goRouter}
                  jumpType={'jskq'}
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
          <div>
            {
              subTab.map((t, i) => {
                return <div
                  className={dbTab == t.type ? 'lj_tab activeTab' : 'lj_tab'}
                  onClick={() => onChangeDbTab(t.type)}
                  key={t.name + i}
                >
                  {t.name}
                </div>
              })
            }
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
          <div><span>教师考勤趋势</span></div>
          <div>
            <span>全校</span>
            &nbsp;&nbsp;&nbsp;<div className="vs"></div>&nbsp;&nbsp;&nbsp;
            <Select 
            style={{ width: 120 }} 
            value={qsSelectOne}
            onChange={(v) => onChangeQsSelect(v,1)}
            getPopupContainer={triggerNode => triggerNode.parentNode} 
            placeholder='请选择'>
              {/* {
                xyList.length !== 0 ?
                xyList.map((t,i) => {
                  return <Option value={t.collegeId}>{t.collegeName}</Option>
                })
                :null
              } */}
              {
                props.list.length !== 0 ?
                  props.list.map((t, i) => {
                    return <Option value={t.collegeId} key={i} disabled={t.collegeId == qsSelectTwo ? true :false}>{t.collegeName}</Option>
                  }) : null
              }
            </Select>
            &nbsp;&nbsp;&nbsp;<div className="vs"></div>&nbsp;&nbsp;&nbsp;
            <Select 
            style={{ width: 120 }} 
            value={qsSelectTwo}
            placeholder={"请选择"}
            onChange={(v) => onChangeQsSelect(v,2)}
            getPopupContainer={triggerNode => triggerNode.parentNode} >
              {
                props.list.length !== 0 ?
                  props.list.map((t, i) => {
                    return <Option value={t.collegeId} key={i} disabled={t.collegeId == qsSelectOne ? true :false}>{t.collegeName}</Option>
                  }) : null
              }
            </Select>
          </div>
          <div>
            {
              subTab.map((t, i) => {
                return <div
                  className={qsTab == t.type ? 'lj_tab activeTab' : 'lj_tab'}
                  onClick={() => onChangeQsTab(t.type)}
                  key={t.name + i}
                >
                  {t.name}
                </div>
              })
            }</div>
        </div>
        <div className='content'>
          {
            !qsLoading && qsData && qsData.xData && qsData.yData && qsData.yData.length !== 0 ? 
            <XqLine
            color={['#3385ff', '#4ecc7b', '#cfdd68']}
            xData={qsData.xData}
            data={qsData.yData}
            type={props.params.timeType}
          />:<NoDataAndLoading loading={qsLoading} />
          }
          
        </div>
      </div>
      <div className="scl_kq_hhb">
        <div className='header'>
          <div><span>教师考勤红黑榜</span></div>
          <div>
            <Select 
            defaultValue={hhSelect} 
            getPopupContainer={triggerNode => triggerNode.parentNode}
            style={{ width: 80 }} 
            onChange={(e) => hhChange(e)}>
              <Option value={0}>红榜</Option>
              <Option value={1}>黑榜</Option>
            </Select>
          </div>
          <div>
            {
              subTab.map((t, i) => {
                return <div
                  className={hhTab == t.type ? 'lj_tab activeTab' : 'lj_tab'}
                  onClick={() => onChangeHhTab(t.type)}
                  key={t.name + i}
                >
                  {t.name}
                </div>
              })
            }
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
          考勤异常分析
        </div>
        <div className="content">
            <div className="header">考勤异常共计<span>
            {
                infoData ?
                parseInt(infoData.abnormalHour)
                :'--'
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
                  !jcLoading && infoData && infoData.teacherPie && infoData.teacherPie.length ?
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

export default withRouter(Jskq)