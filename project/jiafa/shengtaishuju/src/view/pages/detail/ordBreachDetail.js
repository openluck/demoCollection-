/*
 * @Author: lxx 
 * @Date: 2020-01-23 10:22:08 
 * @Last Modified by: lilu
 * @Last Modified time: 2020-02-17 15:58:07
 * 课堂违纪明细
 */
import React, { Component } from 'react';
import BreachDetail from './../../components/details/breachDetail'
class OrdBreachDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
    }
    render() {
        return (
            <div style={{height:'calc(100% - 36px)',width:'100%'}}>
                <BreachDetail />
            </div>
        );
    }
}

export default OrdBreachDetail;