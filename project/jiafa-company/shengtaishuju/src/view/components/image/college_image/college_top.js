/*
 * @Author: wangsong 
 * @Date: 2020-02-27 10:10:12 
 * @Last Modified by: lxx
 * @Last Modified time: 2021-03-24 17:25:07
 * 画像中心开课单位头部
 */
import React, { Component } from 'react';
import { Select } from "antd";
const { Option } = Select;
import G from "../../../../config/g";
import ReactEcharts from 'echarts-for-react';
import SelInput from "../../../public/searSel/element";
import { request } from './../../../../util/request';
class CollegeTop extends Component {
    constructor(props) {
        super(props);
        this.state = {
            params: {
                semesterId: G.ISCED_cutSemesterData.semesterId,
                collegeId: ""
            },
            collegeList: G.ISCED_collegeList
        };
        this.onChangeSemester = this.onChangeSemester.bind(this);
        this.getCollegeList = this.getCollegeList.bind(this);
    }
    componentDidMount() {
        let { roleType } = G.ISCED_curRoleInfo
        if ((roleType==="3" || roleType === '4') && G.ISCED_collegeList.length) {//院级时默认选择
            let { params } = this.state;
            params.collegeId = G.ISCED_collegeList[0].collegeId;
            this.setState({ params });
            this.props.editTopParams(params);
        }
        if (this.props.match.params.collegeId && this.props.match.params.collegeId != "undefined") {//从可视化跳开课单位
            let { params } = this.state;
            params.collegeId = this.props.match.params.collegeId;
            this.setState({ params });
            this.props.editTopParams(params);
        }
        // let { params } = this.state;
        // this.getCollegeList({
        //     searchValue:"",
        //     semesterId:params.semesterId,
        //     couTypeId:""
        // })
    }
    /**
     * @description 改变学期
     */
    onChangeSemester(value) {
        let { params } = this.state;
        params.semesterId = value;
        params.collegeId = "";
        this.getCollegeList({
            searchValue: "",
            semesterId: params.semesterId,
            couTypeId: ""
        })
        this.setState({
            params
        });
        this.props.editTopParams(params);
    }
    /**
     * @description 搜索开课单位
     */
    onSearchCollege(type, value) {
        let { params } = this.state;
        this.getCollegeList({
            searchValue: value,
            semesterId: params.semesterId,
            couTypeId: ""
        })
    }
    /**
     * @description 改变开课单位
     */
    onChangeCollege(type, value) {
        let { params } = this.state;
        params.collegeId = value.id;
        this.setState({
            params,
            collegeList: G.ISCED_collegeList
        });
        this.props.editTopParams(params);
    }
    /**
     * @description 获取开课单位列表
     */
    getCollegeList(params) {
        request('api/public/getDepartmentList', params, (res) => {
            if (res.result && res.data) {
                this.setState({
                    collegeList: res.data
                })
            } else {
                message.warn(res.message)
            }
        })

    }
    render() {
        let { params, collegeList } = this.state;
        collegeList.map((item) => {
            item.name = item.collegeName;
            item.id = item.collegeId;
        })
        return (
            <div className="ws-scl-top">
                <Select className="ws-select ws-noBor" placeholder={"请选择学期"} onChange={this.onChangeSemester} value={params.semesterId || undefined}>
                    {
                        G.ISCED_semesterList.map((item, index) => (
                            <Option key={item.semesterId} value={item.semesterId}>{item.semesterName}</Option>
                        ))
                    }
                </Select>
                <div className="ws-top-sel">
                    <label>开课单位 : </label>
                    <SelInput
                        onChange={this.onChangeCollege.bind(this, 'college')}
                        onSearch={this.onSearchCollege.bind(this, 'college')}
                        value={params.collegeId}
                        list={collegeList}
                    />
                </div>
            </div>
        );
    }
}

export default CollegeTop;
