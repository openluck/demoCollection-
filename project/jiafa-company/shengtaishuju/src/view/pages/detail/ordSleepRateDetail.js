/*
 * @Author: lxx 
 * @Date: 2020-01-23 10:19:31 
 * @Last Modified by: lilu
 * @Last Modified time: 2020-02-17 15:58:28
 * 低头率明细 
 */
import React, { Component } from 'react';
import G from '../../../config/g';
import SleepRateDetail from './../../components/details/sleepRateDetail'
class OrdSleepRateDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
    }
    render() {
        return (
            <div style={{height:'calc(100% - 36px)',width:'100%'}}>
              <SleepRateDetail />
            </div>
        );
    }
}

export default OrdSleepRateDetail;