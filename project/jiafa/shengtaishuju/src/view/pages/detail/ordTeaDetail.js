/*
 * @Author: lxx 
 * @Date: 2020-01-23 10:16:13 
 * @Last Modified by: lilu
 * @Last Modified time: 2020-02-17 15:58:33
 * 明细查询-教师考勤明细
 */
import React, { Component } from 'react';
import TeaDetail from './../../components/details/teaDetail'
class OrdTeaDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
    }
    render() {
        return (
            <div style={{height:'calc(100% - 36px)',width:'100%'}}>
              <TeaDetail />
            </div>
        );
    }
}

export default OrdTeaDetail;