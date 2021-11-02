/*
 * @Autor: xq
 * @Date: 2020-02-19 10:16:52
 * @LastEditors: xq
 * @LastEditTime: 2020-02-20 20:37:43
 * 教学质量-教学分析
 */

import React from 'react';
import WaveLine from '../public/waveLine';
import ColorsPieEcharts from '../public/ColorsPieEcharts'
import { Spin } from 'antd';
import img_noData from '../../../../media/picture/img_noData.png'
import { request } from "../../../../util/request";
import { getConfigData } from './../../../../config/actionConfig'
import PeiLine from './peiLine'

class JxzlJxfx extends React.Component {
  constructor() {
    super();
    this.state = {
      behavPie: [],     // 教师行为-饼图数据
      behavLine: null,    // 教师行为-折线图数据
      designPie: [],    // 教学设计-饼图
      designLine: null,   // 教学设计-折线图数据
      courPie: [],      // 课程类型-饼图数据
      courLine: null,     // 课程类型-折线图数据
      oldParam: null,
      isLoadPie1: true,
      isLoadPie2: true,
      isLoadPie3: true,
      isLoadLine1: true,
      isLoadLine2: true,
      isLoadLine3: true
    }
    this.getBehavPie = this.getBehavPie.bind(this);
    this.getBehavLine = this.getBehavLine.bind(this);
    this.getDesignPie = this.getDesignPie.bind(this);
    this.getDesignLine = this.getDesignLine.bind(this);
    this.getCourPie = this.getCourPie.bind(this);
    this.getCourLine = this.getCourLine.bind(this);
  }

  componentDidMount () {
    let _param = JSON.parse(JSON.stringify(this.props.faParam));
    this.setState({
      oldParam: _param
    })
  }

  componentDidUpdate (prevProps, prevState) {
    let _newP = this.props.faParam;
    if (_newP && _newP !== this.state.oldParam) {
      // this.getBehavPie(_newP);
      // this.getBehavLine(_newP);
      this.getDesignPie(_newP);
      this.getDesignLine(_newP);
      this.getCourPie(_newP);
      this.getCourLine(_newP);
      this.setState({
        oldParam: _newP
      })
    }
  }

  /**
   * @desc 获取数据——教师行为-饼图
   * @param {object} 入参
   */
  getBehavPie (param) {
    if (!this.state.isLoadPie1) {
      this.setState({ isLoadPie1: true })
    }
    request('/api/image/getCourceBehPie', param, res => {
      if (res.result && res.data) {
        let resData = res.data;
        let _data = [
          { name: '板书', prop: resData.boardWrite },
          { name: '巡视', prop: resData.patrol },
          { name: '多媒体', prop: resData.media },
        ];
        this.setState({
          behavPie: _data,
          isLoadPie1: false
        })
      } else {
        this.setState({
          behavPie: null,
          isLoadPie1: false
        })
      }
    })
  }

  /**
   * @desc 获取数据——教学设计-饼图
   * @param {object} param 入参
   */
  getDesignPie (param) {
    if (!this.state.isLoadPie2) {
      this.setState({ isLoadPie2: true })
    }
    request('/api/image/getCourceDesPie', param, res => {
      if (res.result && res.data) {
        let resData = res.data;
        let _data = [
          { name: '学生自习', prop: resData.stuLearn },
          { name: '生生互动', prop: resData.stuInteract },
          { name: '师生互动', prop: resData.tsInteract },
          { name: '教师讲授', prop: resData.teaching },
          { name: '学生展示', prop: resData.stuShow }
        ];
        this.setState({
          designPie: _data,
          isLoadPie2: false
        })
      } else {
        this.setState({
          designPie: null,
          isLoadPie2: false
        })
      }
    })



  }

  /**
   * @desc 获取数据——课程类型-饼图
   * @param {object} 入参
   */
  getCourPie (param) {
    if (!this.state.isLoadPie3) {
      this.setState({ isLoadPie3: true })
    }
    request('/api/image/getCourceTypePie', param, res => {
      if (res.result && res.data) {
        let resData = res.data;
        let _data = [
          { name: '讲授型', prop: resData.teachingT },
          { name: '对话型', prop: resData.chatT },
          { name: '混合型', prop: resData.mixT },
          { name: '练习型', prop: resData.exeT }
        ];
        this.setState({
          courPie: _data,
          isLoadPie3: false
        })

      } else {
        this.setState({
          courPie: null,
          isLoadPie3: false
        })
      }
    })
  }

  /**
   * @desc 获取数据-教师行为-线图
   * @param {object} param 入参
   */
  getBehavLine (param) {
    if (!this.state.isLoadLine1) {
      this.setState({ isLoadLine1: true })
    }
    request('/api/image/getCourceBehLine', param, res => {
      if (res.result && res.data && res.data.length) {
        let data = res.data;
        let conData = getConfigData(data, 1);
        console.log(conData)
        let obj;
        if (conData) {
          obj = {
            legend: ['板书', '巡视', '多媒体'],
            date: conData.boardWrite.date,
            num: [conData.boardWrite.num || [], conData.patrol.num || [], conData.media.num || []]
          }
        }
        this.setState({
          behavLine: obj,
          isLoadLine1: false
        })
      } else {
        this.setState({
          behavLine: null,
          isLoadLine1: false
        })
      }
    })
  }

  /**
   * @desc 获取数据-教学设计-线图
   * @param {object} 入参
   */
  getDesignLine (param) {
    if (!this.state.isLoadLine2) {
      this.setState({ isLoadLine2: true })
    }
    request('/api/image/getCourceDesLine', param, res => {
      if (res.result && res.data && res.data.length) {
        let _data = res.data;
        let conData = getConfigData(_data, 2);
        console.log(conData)
        let obj;
        if (conData) {
          obj = {
            legend: ['学生自习', '生生互动', '师生互动', '教师讲授', '学生展示'],
            date: conData.stuLearn.date,
            num: [
              conData.stuLearn.num || [],
              conData.stuInteract.num || [],
              conData.tsInteract.num || [],
              conData.teaching.num || [],
              conData.stuShow.num || []]
          }
        }
        this.setState({
          designLine: obj,
          isLoadLine2: false
        })
      } else {
        this.setState({
          designLine: null,
          isLoadLine2: false
        })
      }
    })
  }

  /**
   * @desc 获取数据-课堂类型-线图
   * @param {object} 入参
   */
  getCourLine (param) {
    if (!this.state.isLoadLine3) {
      this.setState({ isLoadLine3: true })
    }
    request('/api/image/getCourceTypeLine', param, res => {
      if (res.result && res.data && res.data.length) {
        let _data = res.data;
        let conData = getConfigData(_data, 3);
        console.log(conData)
        let obj;
        if (conData) {
          obj = {
            legend: ['讲授型', '对话型', '混合型', '练习型'],
            date: conData.teachingT.date,
            num: [
              conData.teachingT.num || [],
              conData.chatT.num || [],
              conData.mixT.num || [],
              conData.exeT.num || []
            ]
          }
        }
        this.setState({
          courLine: obj,
          isLoadLine3: false
        })
      } else {
        this.setState({
          courLine: null,
          isLoadLine3: false
        })
      }
    })
  }

  render () {
    let {
      behavPie,
      behavLine,
      designPie,
      designLine,
      courPie,
      courLine,
      isLoadPie1,
      isLoadPie2,
      isLoadPie3,
      isLoadLine1,
      isLoadLine2,
      isLoadLine3
    } = this.state;
    return (
      <div className='xq-kchx-ul jxfx'>
        {/* v1.21版本删除 */}
        {/* <PeiLine 
                    title="教师行为"
                    loadPie={isLoadPie1}
                    loadLine={isLoadLine1}
                    line={behavLine}
                    pie={behavPie}
                    color={["#646fe2", "#36cbcb", "#68d388"]} 
                    timeType={this.props.faParam.timeType}
                /> */}
        <PeiLine
          title="教学设计"
          loadPie={isLoadPie2}
          loadLine={isLoadLine2}
          line={designLine}
          pie={designPie}
          color={["#3aa1ff", "#f47a8f", "#eed46d", "#4ecb73", "#975fe5"]}
          timeType={this.props.faParam.timeType}
        />
        <PeiLine
          title="课程类型"
          loadPie={isLoadPie3}
          loadLine={isLoadLine3}
          line={courLine}
          pie={courPie}
          color={["#3aa1ff", "#f47a8f", "#eed46d", "#4ecb73"]}
          timeType={this.props.faParam.timeType}
        />
      </div>
    )
  }
}
export default JxzlJxfx;
