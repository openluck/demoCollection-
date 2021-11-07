/*
 * @Author: lj
 * @Date: 2019-02-10 13:35:50
 * @Last Modified by: lxxxxxx
 * @Last Modified time: 2021-03-24 17:32:36
 */

/**
 * @description 课堂互动组件
 */
import React, { Fragment as F, useState, useEffect } from "react";
import XqLine from './../public/xqLine.js'
import PreBar from './../public/preBar';
import Tea_btm_cont from './../public/tea_btm_cont';
import NoDataAndLoading from './../public/noDataAndLoading';
import SVG from './../../../public/svg.js';
import { Select, message, Spin } from "antd";
import {getQsData,realData} from './scl_public_function.js';
import { getSchClassActive, getSchActiveAna, getSchActiveTrend, getSchActiveTea, getSchActiveCour } from './../../../../request/lj_scl_image_request';
const { Option } = Select;
const ktxtTab = [{
  name: '学生起立',
  data: 1
}, {
  name: '教师上下讲台',
  data: 2
}]

const selArr = [...Array(2).keys()].map((i, index) => i = {
  collegeId: undefined, collegeName: undefined, ind: index + 1
})

export default function Kthd(props) {
  //学院考勤红黑榜-红黑下拉状态
  const [hhSelect, setHhSelect] = useState(0);

  //对比分析tab
  const [dbTab, setDbTab] = useState(1);

  //趋势tab
  const [qsTab, setQsTab] = useState(1);

  //红黑榜tab
  const [hhTab, setHhTab] = useState(1);

  //趋势下拉1
  const [qsSelectOne, setQsSelectOne] = useState(undefined);

  //趋势下拉2
  const [qsSelectTwo, setQsSelectTwo] = useState(undefined);

  //基本信息数据
  const [infoData, setInfoData] = useState({});

  //开课单位对比分析数据
  const [dbfxData, setDbfxData] = useState({});

  //趋势数据
  const [qsData, setQsData] = useState({});

  //红黑课程数据
  const [hhkcData, setHhkcData] = useState([]);

  //红黑课程数据
  const [hhjsData, setHhjsData] = useState([]);

  //排序
  const [sortValue, setSortValue] = useState('0');

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


  useEffect(() => {
    setHhSelect(0);
    setSortValue('0');
    setQsSelectOne(undefined);
    setQsSelectTwo(undefined);
    getSchClassActivea();
  }, [props.params])

  //对比分析数据更新
  useEffect(()=>{
    getSchActiveAnaa()
  },[sortValue,dbTab]);

  //趋势数据更新
  useEffect(()=>{
    getSchActiveTrenda('',0);
    if(qsSelectOne){
      getSchActiveTrenda(qsSelectOne,1);
    }
    if(qsSelectTwo){
      getSchActiveTrenda(qsSelectTwo,2);
    }
  },[qsTab]);

  //红黑榜数据更新
  useEffect(()=>{
    getSchActiveCoura();
    getSchActiveTeaa();
  },[hhTab,hhSelect]);
  

  //对比分析状态切换
  const onChangeDbTab = (v) => {
    setDbTab(v);
  }

  //红黑榜下拉切换
  const hhChange = (v) => {
    setHhSelect(v);
  }

  //趋势下拉
  const onChangeQsSelect = (v,index) => {
    console.log(index,':选择拉的东西')
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
    getSchActiveTrenda(v,index);
  }

  //排序
  const onSort = (v) => {
    if(v !== sortValue){
      setSortValue(v);
    }
  }

  const onChangeQsTab = (v) => {
    // setQsSelectOne('');
    // setQsSelectTwo('');

    let newData=qsData;

    // newData.yData=[qsData.yData[0]];
    // newData.yData[0].name="全校";
    // console.log(newData,'newDatanewDatanewData')
    setQsData(newData)
    setQsTab(v);
  }

  const onChangeHhTab = (v) => {
    setHhTab(v);
  }
  //获取基本信息
  const getSchClassActivea = () => {
    let params = {
      ...props.params,
    }
    setJcLoading(true);
    getSchClassActive(params).then((res) => {
      setJcLoading(false);
      if (res.data.data && res.data.result) {
        setInfoData(res.data.data);
      } else {
        setInfoData({});
      }
    })
  }

  //获取开课单位对比分析
  const getSchActiveAnaa = () => {
    let params = {
      ...props.params,
      sortType: sortValue,
      checkType: dbTab
    }
    setDbLoading(true);
    getSchActiveAna(params).then((res) => {
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
  const getSchActiveTrenda = (id,index) => {
    let params = {
      ...props.params,
      checkCollegeId:id,
      checkType: qsTab
    }
    setQsLoading(true);
    getSchActiveTrend(params).then((res) => {
      if (res.data.result) {
        if(id){
          let collegeIndex = _.findIndex(props.list, { collegeId: id });
          let data = getQsData(
            qsData,
            res.data.data,
            index,
            props.list[collegeIndex].collegeName,
            id,
            selClass
          );
         
          setQsData({})
          setQsData(data)
        }else{
          // if(data){
            // console.log(,'data.yDatadata.yData')
            let newData=getQsData(qsData,res.data.data,index,'',id,selClass)
            if(newData&&newData.yData&& newData.yData[0]&&  newData.yData[0].name===''){
              newData.yData[0].name="全校"
            }
           
          // }
          setQsData(newData);
        }
      } else {
        message.error(res.data.message)
      }
      setQsLoading(false);
    })

  }

  //获取考勤红黑榜课程排名
  const getSchActiveCoura = () => {
    let params = {
      ...props.params,
      colortType: hhSelect,
      checkType: hhTab
    }
    setHhkcLoading(true);
    getSchActiveCour(params).then((res) => {
      setHhkcLoading(false);
      if (res.data.data && res.data.result) {
        setHhkcData(res.data.data)
      } else {
        setHhkcData([])
      }
    })
  }
  //获取考勤红黑榜教师排名
  const getSchActiveTeaa = () => {
    let params = {
      ...props.params,
      colortType: hhSelect,
      checkType: hhTab
    }
    setHhjsLoading(true);
    getSchActiveTea(params).then((res) => {
      setHhjsLoading(false);
      if (res.data.data && res.data.result) {
        setHhjsData(res.data.data)
      } else {
        setHhjsData([]);
      }
    })
  }

  return (
    <div className="image_public kthd">
      {
        !jcLoading ?
          <div className='kt_info'>
            <div>
              <div>
                <div>
                  <div>平均<span>{infoData ? infoData.stuProp : '--'}</span>次/课程</div>
                  <div>学生起立</div>
                </div>
                <div>
                  {infoData && infoData.checkStuProp ? infoData.checkStuProp.name : ''}
                </div>
                <div>
                  {
                    infoData && infoData.checkStuProp && infoData.checkStuProp.sortType == 1 ?
                      <SVG
                        type={'imgUp'}
                      /> : infoData && infoData.checkStuProp && infoData.checkStuProp.sortType == 2 ? 
                      <SVG
                        type={'imgDown'}
                      />:null
                  }

                </div>
                <div>
                  {infoData && infoData.checkStuProp ? realData(infoData.checkStuProp.changeProp) +'%' : ''}
                </div>
              </div>
            </div>
            <div>
              <div>
                <div>
                  <div>平均<span>{infoData ? infoData.teaProp : '--'}</span>次/课程</div>
                  <div>教师上下讲台</div>
                </div>
                <div>
                  {infoData && infoData.checkTeaProp ? infoData.checkTeaProp.name : ''}
                </div>
                <div>
                  {
                    infoData && infoData.checkTeaProp && infoData.checkTeaProp.sortType == 1 ?
                      <SVG
                        type={'imgUp'}
                      /> : infoData && infoData.checkTeaProp && infoData.checkTeaProp.sortType == 2 ? 
                      <SVG
                        type={'imgDown'}
                      />:null
                  }
                </div>
                <div>
                  {infoData && infoData.checkTeaProp ? realData(infoData.checkTeaProp.changeProp) + '%' : ''}
                </div>
              </div>
            </div>
          </div>
          :
          <div style={{ 'height': '156px', 'width': '100%' }}>
            <NoDataAndLoading loading={true} />
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
          <div className='tab'>
            {
              ktxtTab.map((t, i) => {
                return <div key={i} onClick={() => { onChangeDbTab(i + 1) }} className={dbTab == i + 1 ? 'select' : 'notSelect'}>{t.name}</div>
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
                }} 
                barType="hd"  
                />
              : <NoDataAndLoading loading={dbLoading} />
          }
        </div>
      </div>
      <div className='scl_kqqs'>
        <div className='header'>
          <div><span>课堂互动趋势</span></div>
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
                    return <Option value={t.collegeId} key={i} disabled={t.collegeId == qsSelectTwo ? true :false}>{t.collegeName}</Option>
                  }) : null
              }
            </Select>
            &nbsp;&nbsp;&nbsp;<div className="vs"></div>&nbsp;&nbsp;&nbsp;
            <Select
              style={{ width: 120 }}
              value={qsSelectTwo}
              placeholder='请选择'
              onChange={(v) => onChangeQsSelect(v, 2)}
              getPopupContainer={triggerNode => triggerNode.parentNode} >
              {
                props.list.length !== 0 ?
                  props.list.map((t, i) => {
                    return <Option value={t.collegeId} key={i} disabled={t.collegeId == qsSelectOne ? true :false}>{t.collegeName}</Option>
                  }) : null
              }
            </Select>
          </div>
          <div className='tab'>
            {
              ktxtTab.map((t, i) => {
                return <div key={i} onClick={() => { onChangeQsTab(i + 1) }} className={qsTab == i + 1 ? 'select' : 'notSelect'}>{t.name}</div>
              })
            }
          </div>
        </div>
        <div className='content'>
        {/* {console.log(qsData,'qsDataqsDataqsDataqsData')} */}
          {
            !qsLoading && qsData && qsData.xData && qsData.yData && qsData.yData.length !== 0 ? 
            <XqLine
            color={['#3385ff', '#4ecc7b', '#cfdd68']}
            xData={qsData.xData}
            data={qsData.yData}
            yName='次/课程'
            yType='num'
            type={props.params.timeType}
          />:<NoDataAndLoading loading={qsLoading} />
          }
        </div>
      </div>
      <div className="scl_kq_hhb">
        <div className='header'>
          <div><span>课堂互动红黑榜</span></div>
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
          <div className='tab'>
            {
              ktxtTab.map((t, i) => {
                return <div key={i} onClick={() => { onChangeHhTab(i + 1) }} className={hhTab == i + 1 ? 'select' : 'notSelect'}>{t.name}</div>
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
                !hhkcLoading && hhkcData.length !== 0 ?
                  hhkcData.map((t, i) => {
                    return <div key={`${t.name}${i}`}>
                      <PreBar
                        data={t.prop}
                        name={t.name}
                        type={'kthd'}
                        maxData={hhkcData[0]['prop']}
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
                !hhjsLoading && hhjsData.length !== 0 ?
                  hhjsData.map((t, i) => {
                    return <div key={`${t.name}${i}`}>
                      <PreBar
                        data={t.prop}
                        name={t.name}
                        type={'kthd'}
                        maxData={hhjsData[0]['prop']}
                        rank={i + 1} />
                    </div>
                  })
                  : <NoDataAndLoading loading={hhjsLoading} />
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
