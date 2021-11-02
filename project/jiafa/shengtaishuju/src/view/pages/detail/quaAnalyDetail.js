/*
 * @Author: lxx 
 * @Date: 2020-01-23 10:24:23 
 * @Last Modified by: lilu
 * @Last Modified time: 2020-02-17 15:58:37
 * 教学分析明细
 */
import React, { Component } from 'react';
import AnalyDetail from './../../components/details/analyDetail'
class QuaAnalyDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
    }
    render() {
        return (
            <div style={{height:'calc(100% - 36px)',width:'100%'}}>
                <AnalyDetail />
            </div>
        );
    }
}

export default QuaAnalyDetail;