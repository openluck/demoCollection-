/*
 * @Author: wangsong 
 * @Date: 2020-02-27 10:10:12 
 * @Last Modified by:   wangsong 
 * @Last Modified time: 2020-02-27 10:10:12 
 * 画像中心学校头部
 */
import React, { Component } from 'react';
import { Select } from "antd";
const { Option } = Select;
import G from "../../../../config/g";
class SclTop extends Component {
    constructor(props) {
        super(props);
        this.state = {
            params:{
                semesterId:G.ISCED_cutSemesterData.semesterId,
            },
        };
        this.onChangeSemester = this.onChangeSemester.bind(this);
    }
    componentDidMount(){
        let { params } = this.state;
        this.props.editTopParams(params);
    }
    /**
     * @description 改变学期
     */
    onChangeSemester(value){
        let { params } = this.state;
        params.semesterId = value;
        this.setState({
            params
        });
        this.props.editTopParams(params);
    }
    render() {
        let { params } = this.state;
        return (
            <div className="ws-scl-top">
                <Select className="ws-select ws-noBor" placeholder={"请选择学期"} onChange={this.onChangeSemester} value={params.semesterId || undefined}>
                {
                    G.ISCED_semesterList?G.ISCED_semesterList.map((item,index)=>(
                        <Option key={item.semesterId} value={item.semesterId}>{item.semesterName}</Option>
                    )):null
                }
                </Select>
            </div>
        );
    }
}

export default SclTop;
