/*
 * @Author: kyl 
 * @Date: 2020-02-12 11:14:35 
 * @Last Modified by: tj
 * @Last Modified time: 2021-04-07 11:26:10
 * 教师考勤
 */

import React, { Component } from 'react'
import SVG from '../../../public/svg';
import { Spin, message } from 'antd';
import '../../../../style/tea_than_comp.scss';
import ColorsPieEcharts from '../public/ColorsPieEcharts';
import Tea_than_comp from '../tea_image/tea_than_comp';
import NoDataAndLoading from '../public/noDataAndLoading';
import { request } from '../../../../util/request';
import { connect } from 'react-redux'
import { getAttCode } from './../public/jumpFun'
import U from './../../../../util/_util'
import { withRouter } from 'react-router-dom';

const getMonthDate = U.getMonthDate

class Jskq extends Component {
  constructor(props) {
    super(props)
    this.state = {
      params: {},
      jxkq: {},
      loading: true
    }
  }

  componentDidMount() {
    let propParams = { ...this.props.params };
    // {
    //   "semesterId": "2019_2020_2",
    //   "collegeId": "",
    //   "teacherId": "3f0529defcf9712a5bc8b3869b47ba7c",
    //   "timeType": "1",
    //   "selTime": "2020-02-24",
    //   // "sortType": "0",
    //   "checkType": "1",
    //   "checkClassId": "",
    //   "couTypeId": 0
    // }
    this.setState({
      params: propParams
    })
    this.kyl_get_jskq(propParams)
  }
  componentDidUpdate() {
    let propParams = { ...this.props.params };
    let { params } = this.state;
    if (JSON.stringify(propParams) !== JSON.stringify(params)) {
      this.setState({
        params: propParams
      })
      this.kyl_get_jskq(propParams)
    }
  }


  //教师考勤数据
  kyl_get_jskq = (params) => {
    request('/api/image/getTeacherTeaAtten', params, (res) => {
      if (res.result && res.data) {
        // console.log(res.data)
        if (res.data.attenPie) {
          let jxkq = res.data
          let attenPie = [
            { name: "正常", prop: jxkq.attenPie.normal, key: getAttCode('normal', 1) },
            { name: "早退", prop: jxkq.attenPie.leaveEarly, key: getAttCode('leaveEarly', 1) },
            { name: "缺勤", prop: jxkq.attenPie.absence, key: getAttCode('absence', 1) },
            { name: "迟到", prop: jxkq.attenPie.beLate, key: getAttCode('beLate', 1) },
            { name: "调换课", prop: jxkq.attenPie.courseChange, key: getAttCode('courseChange', 1) },
            { name: "请假", prop: jxkq.attenPie.leave || 0, key: getAttCode('leave', 1) },
          ]
          this.setState({
            jxkq: { ...jxkq, attenPie }
          })
        }
       
      } else {
        message.warn(res.message)
        this.setState({
          jxkq: {}
        })
      }
      this.setState({
        loading: false
      })
    }, () => {
      this.setState({
        jxkq: {},
        loading: false
      })
    })
  }

  /**
   * 考勤跳转明细
   * @param {*} ind 
   */
  goRouter = (ind) => {
    let { jxkq } = this.state
    let { params } = this.props
    let info = jxkq.attenPie[ind] // 选中模块数据
    console.log('params', params, info)
    let start, end
    if (params.timeType === '1') {
      // 具体日期
      start = new Date(params.selTime).getTime();
      end = new Date(params.selTime).getTime()
    } else if (params.timeType === '2') {
      // 具体周次

    } else if (params.timeType === '3') {
      // 具体月份
      let arr = getMonthDate(params.selTime)
      if (arr.length) {
        start = new Date(arr[0]).getTime()
        end = new Date(arr[1]).getTime()
      }
    }
    this.props.history.push(`/home/det/ordtea/${info.key}/null/${start}/${end}/${params.collegeId}/${params.teacherId}/null/${params.semesterId}/${params.couTypeId}`)
  }

  render() {
    let { jxkq, loading } = this.state
    // console.log(jxkq)
    return (
      <div className='image_public dkl kyl-teaImage-cont'>
        {
          loading ?
            <div className='kyl-ttc-cont' style={{ height: '270px' }}>
              <div className='xq-load-all'><Spin /></div>
            </div> :
            <div className='kyl-ttc-cont' style={{ height: '270px' }}>
              <Tea_than_comp type='1' data={jxkq}></Tea_than_comp>
              <div style={{ position: 'relative' }}>
                <p className='kyl-ttc-pieTi'>考勤分布情况</p>
                <div style={{ height: 'calc(100% - 41px)' }}>
                  {JSON.stringify(jxkq) !== '{}' && jxkq.attenPie ?
                    <ColorsPieEcharts
                      title="人次"//title="人次" title="%"
                      color={[
                        "#3aa1ff",
                        "#f47a8f",
                        "#eed46d",
                        "#4ecb73",
                        "#975fe5",
                        "#f66464",
                      ]}//每一个，对应scaleData对应下标的颜色
                      type={1} //  1 2 不传type 3种样式
                      radius={[50, 65]}
                      scaleData={jxkq.attenPie}
                      goRouter={this.goRouter}
                    /> : <NoDataAndLoading></NoDataAndLoading>
                  }
                </div>

              </div>
            </div>
        }
      </div>
    )
  }
}
export default withRouter(connect(state => state, {})(Jskq))