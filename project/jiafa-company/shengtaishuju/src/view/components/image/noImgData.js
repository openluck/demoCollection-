/*
 * @Author: wangsong 
 * @Date: 2020-02-27 10:10:12 
 * @Last Modified by:   wangsong 
 * @Last Modified time: 2020-02-27 10:10:12 
 * 画像中心头部组件
 */
import React, { Component } from 'react';
class NoImgData extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render() {
        let { typeName } = this.props;
        return (
            <div className="ws-img-noData">
                <div>
                    <img src={require("../../../media/picture/img_no_data.png")} />
                    <div>{`请先选择${typeName || "学院"}`}</div>
                </div>
            </div>
        );
    }
}

export default NoImgData;
