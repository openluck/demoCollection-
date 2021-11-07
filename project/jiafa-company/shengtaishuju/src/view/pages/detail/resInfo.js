/*
 * @Author: zxq
 * @Date: 2020-02-13 22:53:15 
 * @Last Modified by: zxq
 * @Last Modified time: 2020-02-20 10:16:57
 * 多媒体使用
 */
import React, { Component } from 'react';
import ResInfoContent from '../../components/details/zxq_resInfo'
import '../../../style/zxq_detail.scss'
class ResInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
    }
    render() {
        return (
            <div style={{height:'calc(100% - 36px)',width:'100%'}}>
                <ResInfoContent />
            </div>
        );
    }
}

export default ResInfo;