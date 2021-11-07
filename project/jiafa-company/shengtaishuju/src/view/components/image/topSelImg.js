/*
 * @Author: wangsong 
 * @Date: 2020-02-27 10:10:12 
 * @Last Modified by:   wangsong 
 * @Last Modified time: 2020-02-27 10:10:12 
 * 画像中心头部组件
 */
import React, { Component } from 'react';
import SclTop from　"./scl_image/scl_top";
import CollegeTop from　"./college_image/college_top";
import CourTop from　"./cour_image/cour_top";
import TeaTop from　"./tea_image/tea_top";
class TopSelImg extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render() {
        let { type,match } = this.props;
        return (
            <div className="ws-img-top" id="topSelImg">
                {
                    type === "organ" ?
                    <SclTop match={match} editTopParams={this.props.editTopParams} />
                     :
                    type === "college" ?
                    <CollegeTop match={match} editTopParams={this.props.editTopParams} />
                    :
                    type === "course" ?
                    <CourTop match={match} editTopParams={this.props.editTopParams} />
                    :
                    type === "teacher" ?
                    <TeaTop match={match} editTopParams={this.props.editTopParams} />
                    :""
                }
            </div>
        );
    }
}

export default TopSelImg;
