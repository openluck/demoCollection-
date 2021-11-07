/*
 * @Author: lxx 
 * @Date: 2020-01-23 10:17:46 
 * @Last Modified by: lilu
 * @Last Modified time: 2020-02-17 15:58:16
 * 明细查询-教学秩序-到课率明细
 */
import React, { Component } from 'react';
import ClassRateDetail from './../../components/details/classRateDetail';
class OrdClassRateDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
    }
    render() {
        return (
            <div style={{height:'calc(100% - 36px)',width:'100%'}}>
                <ClassRateDetail />
            </div>
        );
    }
}

export default OrdClassRateDetail;