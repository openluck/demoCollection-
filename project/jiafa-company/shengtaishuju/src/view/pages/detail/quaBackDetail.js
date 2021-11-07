/*
 * @Author: lxx 
 * @Date: 2020-01-23 10:25:12 
 * @Last Modified by: lilu
 * @Last Modified time: 2020-02-17 15:58:41
 * 学生听讲反馈明细
 */
import React, { Component } from 'react';
import BackDetail from './../../components/details/backDetail'
class QuaBackDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
    }
    render() {
        return (
            <div  style={{height:'calc(100% - 36px)',width:'100%'}}>
                <BackDetail />
            </div>
        );
    }
}

export default QuaBackDetail;