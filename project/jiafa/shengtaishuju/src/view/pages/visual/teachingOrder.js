/*
 * @Author: lxx 
 * @Date: 2020-01-22 15:37:35 
 * @Last Modified by: tj
 * @Last Modified time: 2020-02-13 15:52:05
 * 教学秩序
 */
import React, { Component } from 'react';
import TeachingOrderClass from './teachingOrderClass';
import TeachingOrderView from './teachingOrderView';
import './../../../style/visual_com.scss';
import VisualHeaer from './../../components/visual/visualHeader'
class TeachingOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isView: true
        };
    }
    onChange() {
        this.setState({
            isView: !this.state.isView
        })
    }
    render() {
        let { isView } = this.state;
        return (
            <div className='visual-container'>
                <VisualHeaer />
                <div className='visual-cnt'>
                    {/* <div className='change-icon' onClick={this.onChange.bind(this)}>
                        <div className='icon'></div>
                        <div>切换为{isView ? '课堂' : '总览'}</div>
                    </div> */}
                    {
                        isView ? <TeachingOrderView /> : <TeachingOrderClass />
                    }
                </div>
            </div>
        );
    }
}

export default TeachingOrder;

