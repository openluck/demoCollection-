/*
 * @Author: wangsong 
 * @Date: 2020-02-27 10:10:12 
 * @Last Modified by: lxx
 * @Last Modified time: 2021-03-24 17:24:19
 * 画像中心学校头部
 */
import React, { Component } from 'react';
import { Select } from "antd";
import SelInput from "../../../public/searSel/element";
import G from "../../../../config/g";
import { request } from './../../../../util/request';
const { Option } = Select;
class CourTop extends Component {
    constructor(props) {
        super(props);
        this.state = {
            params:{
                semesterId:G.ISCED_cutSemesterData.semesterId,
                courseId:"",
                collegeId:"",
            },
            courseList:G.ISCED_courseList,
            collegeList:[]
        };
        this.onChangeSemester = this.onChangeSemester.bind(this);
        this.onChangeCollege = this.onChangeCollege.bind(this);
        this.getCourseList = this.getCourseList.bind(this);
        this.getCollegeList = this.getCollegeList.bind(this);
    }
    componentDidMount(){
        if(this.props.match.params.courseId && this.props.match.params.courseId != "undefined"){
            let { params } = this.state;
            params.courseId = this.props.match.params.courseId;
            this.setState({ params });
            this.getCollegeList({
                searchValue:"",
                couTypeId:"",
                teacherId:"",
                semesterId:params.semesterId,
                courseId:params.courseId
            }).then(res=>{
                params.collegeId = this.props.match.params.collegeId && this.props.match.params.collegeId != "undefined" ? this.props.match.params.collegeId : "";
                this.setState({
                    params
                });
                this.props.editTopParams(params);
            });
            
        }
        // let { params } = this.state;
        // this.getCourseList({
        //     searchValue:"",
        //     semesterId:params.semesterId,
        //     couTypeId:"",
        //     collegeId:""
        // })
    }
    /**
     * @description 修改学期
     */
    onChangeSemester(value){
        let { params } = this.state;
        params.semesterId = value;
        params.courseId = "";
        this.getCourseList({
            searchValue:"",
            semesterId:params.semesterId,
            couTypeId:"",
            collegeId:""
        })
        params.collegeId = "";
        this.setState({
            params,
            collegeList:[]
        });
        this.props.editTopParams(params);
    }
    /**
     * @description 获取课程列表
     */
    getCourseList(params){
        request('api/public/getCourseList',params,(res)=>{
            if(res.result && res.data){
                this.setState({
                    courseList : res.data
                })
            }else{
                message.warning(res.message)
            }
        })
    }    
    /**
     * @description 获取开课单位列表
     */
    getCollegeList(params){
        return new Promise((reject,resove)=>{
            request('api/public/getDepartmentList',params,(res)=>{
                if(res.result && res.data){
                    this.setState({
                        collegeList : res.data,
                    },()=>{reject(res)});
                }else{
                    message.warning(res.message)
                }
            })
        })
    }    
    /**
     * @description 改变课程
     */
    onChangeCourse(type, value){
        let { params } = this.state;
        params.courseId = value.id;
        params.collegeId = "";
        this.getCollegeList({
            searchValue:"",
            couTypeId:"",
            teacherId:"",
            semesterId:params.semesterId,
            courseId:params.courseId
        }).then(res=>{
            params.collegeId = res.data.length === 1 ? res.data[0].collegeId : "";
            this.setState({
                params,
                courseList:G.ISCED_courseList,
            });
            this.props.editTopParams(params);
        });
        
    }
    /**
     * @description 搜索课程
     */
    onSearchCourse(type, value){
        let { params } = this.state;
        this.getCourseList({
            searchValue:value,
            semesterId:params.semesterId,
            couTypeId:"",
            collegeId:""
        })
    }
    /**
     * @description 改变开课单位
     */
    onChangeCollege(value){
        let { params } = this.state;
        params.collegeId = value;
        this.setState({
            params
        });
        this.props.editTopParams(params);
    }
    render() {
        let { params,courseList,collegeList } = this.state;
        courseList.map((item)=>{
            item.name = item.courseName;
            item.id = item.courseId;
        })
        let { roleType } = G.ISCED_curRoleInfo
        return (
            <div className="ws-scl-top">
                <Select className="ws-select ws-noBor" placeholder={"请选择学期"} onChange={this.onChangeSemester} value={params.semesterId || undefined}>
                    {
                        G.ISCED_semesterList.map((item,index)=>(
                            <Option key={item.semesterId} value={item.semesterId}>{item.semesterName}</Option>
                        ))
                    }
                    
                </Select>
                <div className="ws-top-sel">
                    <label>课程 : </label>
                    <SelInput
                        onChange={this.onChangeCourse.bind(this, 'course')}
                        onSearch={this.onSearchCourse.bind(this,'course')}
                        value={params.courseId}
                        list={courseList}
                    />
                    {(roleType==="1" || roleType === '2') ? 
                    <React.Fragment>
                    <label>开课单位 : </label>
                    <Select className="ws-select" notFoundContent={params.courseId ? "暂无数据" : "请先选择课程"} placeholder={"请选择"} onChange={this.onChangeCollege} value={params.collegeId}>
                        {collegeList.length !== 1 ? <Option key="" value="">全部</Option> : ""}
                        {
                            collegeList.map((item,index)=>(
                                <Option key={item.collegeId} value={item.collegeId}>{item.collegeName}</Option>
                            ))
                        }
                        
                    </Select>
                    </React.Fragment> : ""}
                </div>
            </div>
        );
    }
}

export default CourTop;
