/*
 * @Author: zoe ღ 
 * @Date: 2020-02-10 15:39:42 
 * @Last Modified by: zoe ღ
 * @Last Modified time: 2020-04-30 09:44:02
 */

import React, { Component } from 'react';
import SVG from "../../../public/svg"
import { connect } from 'react-redux'
@connect(state => state.zoe_quaData, {})
class ZoeQuaStatis extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.statis = ['', '', '', '', '', '']
    }
    // 获取课程统计纬度下的统计dom
    getClaDom = (curSign) => {
        const { ClaSchHea,ClaColHea,ClaAdmHea,ClaRoomHea } = this.props
        switch (curSign) {
            case 1:
                return <div className="zoe-data-statis-cont">
                <div>课程总数</div>
                <div title={Object.keys(ClaSchHea).length ? ClaSchHea.courseTotal : 0}>{Object.keys(ClaSchHea).length ? ClaSchHea.courseTotal : 0}</div>
            </div>
                break;
            case 2:
                return <div className="zoe-data-statis-cont">
                <div>课程总数</div>
                <div title={Object.keys(ClaColHea).length ? ClaColHea.courseTotal : 0}>{Object.keys(ClaColHea).length ? ClaColHea.courseTotal : 0}</div>
            </div>
                break;
            case 3:
                return <div className="zoe-data-statis-cont">
                    <div>教学班总数</div>
                    <div title={Object.keys(ClaAdmHea).length ? ClaAdmHea.teaClaTotal : 0}>{Object.keys(ClaAdmHea).length ? ClaAdmHea.teaClaTotal : 0}</div>
                </div>
                break;
            case 4:
                return <div className="zoe-data-statis-cont1">
                    <div >
                        <div>教师</div>&nbsp;
                        <div>{Object.keys(ClaRoomHea).length ?ClaRoomHea.teacherName:''}</div>
                    </div>
                    <div>
                        <div style={{ display: 'flex' }}>
                            <div>课堂总数</div>&nbsp;
                            <div>{Object.keys(ClaRoomHea).length ?ClaRoomHea.claRoomTotal:0}</div>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <div>学生人数</div>&nbsp;
                            <div>{Object.keys(ClaRoomHea).length ?ClaRoomHea.stuNum:0}</div>
                        </div>
                    </div>
                </div>
                break;
        
        }
    }
    // 获取教师统计纬度下的统计dom
    getTeaDom = (curSign) => {
        const { MasSchHea,MasColHea,MasTeaHea,MasAdmHea } = this.props
        switch (curSign) {
            case 1:
                return <div className="zoe-data-statis-cont">
                    <div>授课教师总数</div>
                    <div title={Object.keys(MasSchHea).length ? MasSchHea.teacherTotal : 0}>{Object.keys(MasSchHea).length ? MasSchHea.teacherTotal : 0}</div>
                </div>
            case 2:
                return <div className="zoe-data-statis-cont">
                    <div>授课教师总数</div>
                    <div title={Object.keys(MasColHea).length ? MasColHea.teacherTotal : 0}>{Object.keys(MasColHea).length ? MasColHea.teacherTotal : 0}</div>
                </div>
            case 3:
                return <div className="zoe-data-statis-cont">
                    <div>教学班总数</div>
                    <div title={Object.keys(MasTeaHea).length ? MasTeaHea.teaClaTotal : 0}>{Object.keys(MasTeaHea).length ? MasTeaHea.teaClaTotal : 0}</div>
                </div>
                break;
            case 4:
                return <div className="zoe-data-statis-cont1">
                <div >
                    <div>教师</div>&nbsp;
                    <div>{Object.keys(MasAdmHea).length ?MasAdmHea.teacherName:''}</div>
                </div>
                <div>
                    <div style={{ display: 'flex' }}>
                        <div>课堂总数</div>&nbsp;
                        <div>{Object.keys(MasAdmHea).length ?MasAdmHea.claRoomTotal:0}</div>
                    </div>
                    <div style={{ display: 'flex' }}>
                        <div>学生人数</div>&nbsp;
                        <div>{Object.keys(MasAdmHea).length ?MasAdmHea.stuNum:0}</div>
                    </div>
                </div>
            </div>
                break;
           
        }
    }
//获取课堂或教师统计值
getStatis=(type)=>{
    const {curSign,subPageType,ClaSchHea,ClaColHea,ClaAdmHea,ClaRoomHea,MasSchHea,MasColHea,MasTeaHea,MasAdmHea}=this.props
    if(subPageType===1){
        //课程统计
        switch(curSign){
            case 1:
               return this.getSubStatis(type,ClaSchHea)
            case 2:
               return this.getSubStatis(type,ClaColHea)
            case 3:
               return this.getSubStatis(type,ClaAdmHea)
            case 4:
               return this.getSubStatis(type,ClaRoomHea)
        }
    }
    if(subPageType===2){
        //教师统计
        switch(curSign){
            case 1:
              return  this.getSubStatis(type,MasSchHea)
            case 2:
              return  this.getSubStatis(type,MasColHea)
            case 3:
              return  this.getSubStatis(type,MasTeaHea)
            case 4:
              return  this.getSubStatis(type,MasAdmHea)
        }
    }
}

//获取具体率
getSubStatis=(type,value)=>{
    switch(type){
        case 'stu':
            return Object.keys(value).length ? value.stuStand :0
        case 'tea':
            return Object.keys(value).length ? value.teacherDown : 0
    }
}
    render() {
        const { subPageType, curSign } = this.props
        return (
            <div className="zoe-data-quastatis">
                {
                    subPageType === 1 ?//课程统计
                        this.getClaDom(curSign)
                        : subPageType === 2 ?//教师统计
                            this.getTeaDom(curSign)
                            : null
                }

                {/* <div className="zoe-data-statis-cont">
                    <div>
                        <div><SVG type="da_xsql"></SVG></div>
                        <div>学生起立</div>
                    </div>
                    <div><span>{this.getStatis('stu')}</span>次/课时</div>
                </div>
                <div className="zoe-data-statis-cont">
                    <div>
                        <div><SVG type="da_jssxjt"></SVG></div>
                        <div>教师上下讲台</div>
                    </div>
                    <div><span>{this.getStatis('tea')}</span>次/课时</div>
                </div> */}
                
            </div>
        );
    }
}

export default ZoeQuaStatis;