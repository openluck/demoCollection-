/*
 * @Author: zoe ღ 
 * @Date: 2020-02-10 15:39:42 
 * @Last Modified by: tj
 * @Last Modified time: 2021-04-07 13:26:32
 * 课程统计-统计率组件
 */

import React, { Component } from 'react';
import SVG from "../../../public/svg"
import { connect } from 'react-redux'
import G from "../../../../config/g";
@connect(state => state.zoe_orderData, {})
class ZoeOrderStatis extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.statis = ['', '', '', '', '', '']
    }
    //获取课程统计纬度下的统计dom
    getClaDom = (curSign) => {
        //解构课程的redux
        const { ClaSchRate, ClaColRate, ClaCourRate, ClaRoomRate } = this.props
        switch (curSign) {
            case 1:
                return <div className="zoe-data-statis-cont">
                <div>课程总数</div>
                <div title={Object.keys(ClaSchRate).length ? ClaSchRate.courseTotal :0
                    }>{Object.keys(ClaSchRate).length ? ClaSchRate.courseTotal :0
                        }</div>
            </div>
            case 2:
                return <div className="zoe-data-statis-cont">
                <div>课程总数</div>
                <div title={Object.keys(ClaColRate).length ? ClaColRate.courseTotal :0
                    }>{Object.keys(ClaColRate).length ? ClaColRate.courseTotal :0
                        }</div>
            </div>
            case 3:
                return <div className="zoe-data-statis-cont">
                    <div>教学班总数</div>
                    <div title={Object.keys(ClaCourRate).length ? ClaCourRate.teaClaTotal : 0}>{Object.keys(ClaCourRate).length ? ClaCourRate.teaClaTotal : 0}</div>
                </div>
            case 4:
                return <div className="zoe-data-statis-cont1">
                    <div >
                        <div>教师</div>&nbsp;
                        <div className='tj-teas' title={Object.keys(ClaRoomRate).length ?ClaRoomRate.teacherName:''}>{Object.keys(ClaRoomRate).length ?ClaRoomRate.teacherName:''}</div>
                    </div>
                    <div>
                        <div style={{ display: 'flex' }}>
                            <div>课堂总数</div>&nbsp;
                            <div title={Object.keys(ClaRoomRate).length ?ClaRoomRate.claRoomTotal:0}>{Object.keys(ClaRoomRate).length ?ClaRoomRate.claRoomTotal:0}</div>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <div>学生人数</div>&nbsp;
                            <div title={Object.keys(ClaRoomRate).length ?ClaRoomRate.stuNum:0}>{Object.keys(ClaRoomRate).length ?ClaRoomRate.stuNum:0}</div>
                        </div>
                    </div>
                </div>
        }
    }
    //获取教师统计纬度下的统计dom
    getTeaDom = (curSign) => {
        //解构教师的redux
        const { MasSchRate, MasColRate, MasTeaRate, MasAdmRate } = this.props
        switch (curSign) {
            case 1:
                return <div className="zoe-data-statis-cont">
                <div>授课教师总数</div>
                <div title={Object.keys(MasSchRate).length ? MasSchRate.teacherTotal :0
                    }>{Object.keys(MasSchRate).length ? MasSchRate.teacherTotal :0
                        }</div>
            </div>
            case 2:
                return <div className="zoe-data-statis-cont">
                <div>授课教师总数</div>
                <div title={Object.keys(MasColRate).length ? MasColRate.teacherTotal :0
                    }>{Object.keys(MasColRate).length ? MasColRate.teacherTotal :0
                        }</div>
            </div>
            case 3:
                return <div className="zoe-data-statis-cont">
                    <div>教学班总数</div>
                    <div title={Object.keys(MasTeaRate).length ? MasTeaRate.teaClaTotal : 0}>{Object.keys(MasTeaRate).length ? MasTeaRate.teaClaTotal : 0}</div>
                </div>
            case 4:
                return <div className="zoe-data-statis-cont1">
                    <div >
                        <div>教师</div>&nbsp;
                        <div>{Object.keys(MasAdmRate).length ?MasAdmRate.teacherName:''}</div>
                    </div>
                    <div>
                        <div style={{ display: 'flex' }}>
                            <div>课堂总数</div>&nbsp;
                            <div>{Object.keys(MasAdmRate).length ?MasAdmRate.claRoomTotal:0}</div>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <div>学生人数</div>&nbsp;
                            <div>{Object.keys(MasAdmRate).length ?MasAdmRate.stuNum:0}</div>
                        </div>
                    </div>
                </div>
        }
    }

    //获取课堂或教师统计率
    getStatis=(type)=>{
        const {curSign,ClaSchRate, ClaColRate, ClaCourRate, ClaRoomRate,MasSchRate, MasColRate, MasTeaRate, MasAdmRate,subPageType}=this.props
        if(subPageType===1){
            //课程统计
            switch(curSign){
                case 1:
                   return this.getSubStatis(type,ClaSchRate)
                case 2:
                   return this.getSubStatis(type,ClaColRate)
                case 3:
                   return this.getSubStatis(type,ClaCourRate)
                case 4:
                   return this.getSubStatis(type,ClaRoomRate)
            }
        }
        if(subPageType===2){
            //教师统计
            switch(curSign){
                case 1:
                  return  this.getSubStatis(type,MasSchRate)
                case 2:
                  return  this.getSubStatis(type,MasColRate)
                case 3:
                  return  this.getSubStatis(type,MasTeaRate)
                case 4:
                  return  this.getSubStatis(type,MasAdmRate)
            }
        }
    }

    //获取具体率
    getSubStatis=(type,value)=>{
        switch(type){
            case 'tea':
                return Object.keys(value).length ? value.teaAtNormalRate :0
            case 'stu':
                return Object.keys(value).length ? value.stuOnAttRate : 0
            case 'seat':
                return Object.keys(value).length ? value.frontSeatRate : 0
            case 'sleep':
                return Object.keys(value).length ? value.sleepRate : 0
            case 'cla':
                return Object.keys(value).length ? value.disClaRate : 0
        }
    }
    render() {
        const {subPageType, curSign ,ClaSchRate} = this.props
        return (
            <div className="zoe-data-statis">
                {
                    subPageType === 1 ?//课程统计
                        this.getClaDom(curSign)
                        : subPageType === 2 ?//教师统计
                            this.getTeaDom(curSign)
                            : null
                }

                {G.ISCED_setInfo.isTeacherCheck === '0' ?
                  null
                  : 
                  <div className="zoe-data-statis-cont">
                    <div>
                      <div><SVG type="da_jskqzcl"></SVG></div>
                      <div>教师考勤正常率</div>
                    </div>
                    <div>{
                      this.getStatis('tea')
                    }%</div>
                  </div>
                }

                <div className="zoe-data-statis-cont">
                    <div>
                        <div><SVG type="da_xsdkl"></SVG></div>
                        <div>学生到课率</div>
                    </div>
                    <div>{  
                        this.getStatis('stu')
                    }%</div>
                </div>
                {
                  G.ISCED_setInfo.isFrontRate === '0' ? //1.21前排就坐率关闭，此处不显示
                  null
                  : <div className="zoe-data-statis-cont">
                        <div>
                            <div><SVG type="da_qpjzl"></SVG></div>
                            <div>前排就座率</div>
                        </div>
                        <div>{
                            this.getStatis('seat')
                        }%</div>
                    </div>
                }
                {
                  G.ISCED_setInfo.isHeadLow === '0' ? //1.21低头率关闭，此处不显示
                  null
                  :<div className="zoe-data-statis-cont">
                      <div>
                          <div><SVG type="da_sjl"></SVG></div>
                          <div>低头率</div>
                      </div>
                      <div>{
                          this.getStatis('sleep')
                      }%</div>
                    </div>
                }
                
                {
                    G.ISCED_setInfo.ifClassroomDiscipline==='1'?
                    <div className="zoe-data-statis-cont">
                    <div>
                        <div><SVG type="da_ktwjl"></SVG></div>
                        <div>巡课违纪率</div>
                    </div>
                    <div>{
                        this.getStatis('cla')
                    }%</div>
                </div>:null
                }
                
            </div>
        );
    }
}

export default ZoeOrderStatis;