/*
 * @Author: lxx 
 * @Date: 2020-01-22 15:41:05 
 * @Last Modified by: tj
 * @Last Modified time: 2020-02-19 10:15:40
 * 教学质量
 */
import React, { Component } from 'react';
import './../../../style/visual_com.scss';
import TeachingOrderClass from './teachingOrderClass';
import TeachingQuaView from './teachingQuaView';
import VisualHeaer from './../../components/visual/visualHeader'
class TeachingQua extends Component {
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
                     <TeachingQuaView />
                    {/* {
                        isView ? <TeachingQuaView /> : <TeachingOrderClass />
                    } */}
                </div>
            </div>
        );
    }
}

export default TeachingQua;