/*
 * @Author: lxx 
 * @Date: 2020-01-23 10:18:53 
 * @Last Modified by: lilu
 * @Last Modified time: 2020-02-17 15:58:20
 * 前排就座率明细
 */
import React, { Component } from 'react';
import SiteRateDetail  from './../../components/details/siteRateDetail';

class OrdSiteRateDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
    }
    render() {
        return (
            <div  style={{height:'calc(100% - 36px)',width:'100%'}}>
                <SiteRateDetail />
            </div>
        );
    }
}

export default OrdSiteRateDetail;