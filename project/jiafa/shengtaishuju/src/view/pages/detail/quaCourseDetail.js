/*
 * @Author: lxx 
 * @Date: 2020-01-23 10:25:56 
 * @Last Modified by: zxq
 * @Last Modified time: 2020-02-20 10:14:02
 * 课堂互动明细   v1.21删除
 */
import React, { Component } from 'react';
import TableDetail from '../../components/details/classRoomDetail'
import '../../../style/zxq_detail.scss'
class QuaCourseDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
    }
    render() {
        return (
            <div  style={{height:'calc(100% - 36px)',width:'100%'}}>
                {/* <TableDetail /> */}
            </div>    
        );
    }
}

export default QuaCourseDetail;