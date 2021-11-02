/*
 * @Author: yrj 
 * @Date: 2019-02-26 13:59:41 
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-10-26 13:24:42
 * 教学反思--我的考勤
 */

import React, { Component } from "react";
import './../../../style/tpk/Edutitle.scss'
import Echars from "./Echars.jsx";
import { connect } from 'react-redux';
import { GETEDUDATA } from '../../../redux/jxfs/Edutitilereducer';

@connect(state => state, { GETEDUDATA })
class Edutitle extends Component {

    componentDidMount = () => {

        // this.props.GETEDUDATA()
    }


    render() {
        var { attendance, order, quality } = this.props.Edutitilereducer;

        return (
            <div className="Edubox clear">
                <div className="Edulist">
                    <span className="Ed_head">我的考勤</span>
                    <div className="strange clear">
                        <div className="str_r">
                            <p>调课换课：<span>{attendance.changing || attendance.changing === 0 ? attendance.changing > 999 ? '999+' : attendance.changing : '-'}</span></p>
                            <p>迟到：<span>{attendance.late || attendance.late === 0 ? attendance.late > 999 ? '999+' : attendance.late : '-'}</span></p>
                            <p>早退：<span>{attendance.leaveel || attendance.leaveel === 0 ? attendance.leaveel > 999 ? '999+' : attendance.leaveel : '-'}</span></p>
                            <p>缺勤：<span>{attendance.Skipping || attendance.Skipping === 0 ? attendance.Skipping > 999 ? '999+' : attendance.Skipping : '-'}</span></p>
                        </div>
                        <div className="str_l">
                            <div className="str_data">
                                <span>
                                    {attendance.attendanceException || attendance.attendanceException === 0 ?
                                        attendance.attendanceException > 999 ? '999+' :
                                            attendance.attendanceException : '-'}
                                </span>
                                <span>考勤异常</span>
                            </div>
                            <Echars />
                        </div>
                    </div>
                </div>
                <div className="Edulist">
                    <span className="Ed_head">课堂秩序</span>
                    <ul>
                        <li>
                            <p>课堂总数</p>
                            <span className="hui">{order.allclass || order.allclass === 0 ? order.allclass > 999 ? '999+' : order.allclass : '-'}</span>
                        </li>
                        <li>
                            <p>异常数</p>
                            <span className="ju">{order.abnormal || order.abnormal === 0 ? order.abnormal > 999 ? '999+' : order.abnormal : '-'}</span>

                        </li>
                        <li>
                            <p>违纪扣分</p>
                            <span className="huang">{order.violation || order.violation === 0 ? order.violation > 999 ? '999+' : order.violation : '-'}</span>
                        </li>
                    </ul>
                </div>
                <div className="Edulist">
                    <span className="Ed_head">教学质量</span>
                    <ul>
                        <li>
                            <p>教研评分</p>
                            <span className="hui">{quality.teaching || quality.teaching === 0 ? quality.teaching > 999 ? '999+' : quality.teaching : '-'}</span>
                        </li>
                        <li>
                            <p>教研课数</p>
                            <span className="ju">{quality.classnum || quality.classnum === 0 ? quality.classnum > 999 ? '999+' : quality.classnum : '-'}</span>

                        </li>
                        <li>
                            <p>听过我的课</p>
                            <span className="huang">{quality.listen || quality.listen === 0 ? quality.listen > 999 ? '999+' : quality.listen : '-'}</span>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }

}



export default Edutitle;