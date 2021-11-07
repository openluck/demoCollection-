/*
 * @Author:zxq
 * @Date: 2020-02-10 12:41:43 
 * @Last Modified by: tj
 * @Last Modified time: 2021-03-26 10:46:21
 */

import React, { Component } from 'react';
import SVG from "../../../public/svg";
import { ws_saveGlobalData } from "../../../../redux/ws-global.reducer";
import { connect } from 'react-redux';
@connect(state => state,
    {
        ws_saveGlobalData,
    })
class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonSate: 1,  //按钮状态  1正常 2悬浮 3点击过
            tabletype: props.tabletype || 2, //1教学楼 2教室
            showTeacher: props.type === 'teacher' ? true : false,
            info: this.props.ws_global_reducer.ISCED_saveInfo
        };
    }
    componentWillReceiveProps(nextProps) {
        console.log("componentWillReceiveProps", nextProps)
        if (nextProps.tabletype != this.state.tabletype) {
            this.setState({
                tabletype: nextProps.tabletype

            })
        }
        if (nextProps.type == "teacher") {
            this.setState({
                showTeacher: true

            })
        }

    }


    //返回上一级
    backBtn = () => {
        let tabletype = this.state.tabletype;
        let {type} = this.props
        //调接口，传数据给父级
        if (tabletype == 2) {
            this.setState({
                buttonSate: 3,
                tabletype: 1
            }, () => {
                //调接口，传数据给父级
                this.props.changetable(1, "back");
                // this.props.changeback(1);
                // 更新参数
                let obj = this.props.param
                obj.pageNum = 1
                if(type === "teacher") {
                    obj.collegeId = ""
                } else {
                    obj.teachingBuildId = ""
                }
                this.props.changeParam(1, obj)
            })
        }


    }
    //返回hover状态
    hoverButton = (type) => {
        let buttonSate = this.state.buttonSate;
        if (type == "hover") {
            buttonSate = 2;
        } else {
            buttonSate = 1;
        }
        this.setState({
            buttonSate
        })
    }

    //获取教学楼数据
    classRoom = () => {
        let {type} = this.props
        this.setState({
            tabletype: 1,
        }, () => {
            //传数据给父级
            this.props.changetable(1, "back");
            // this.props.changeback(1);
            // 更新参数
            let obj = this.props.param
            obj.pageNum = 1
            if(type === "teacher") {
                obj.collegeId = ""
            } else {
                obj.teachingBuildId = ""
            }
            this.props.changeParam(1, obj)
        })
    }
    render() {
        let { tabletype, showTeacher, buttonSate } = this.state;
        let roleType = G.ISCED_curRoleInfo.roleType || "";
        return (

            <div className="zxq-pagelocation">
                {showTeacher && (roleType !=="3" && roleType !== '4') && tabletype == 2 || !showTeacher && tabletype == 2 ?
                    <span onClick={this.backBtn.bind(this)} className="backBtn" >
                        <SVG type="back" color={tabletype != 1 || buttonSate == 2 ? "#60b1fc" : "#abadae"} onMouseOut={this.hoverButton.bind(this, "leave")} onMouseOver={this.hoverButton.bind(this, "hover")} />
                    </span>
                    : ""}
                <span> 当前位置：</span>
                {
                    showTeacher && (roleType =="3" ||roleType == '4') && tabletype == 2?null:
                    <span style={tabletype == 2 ? { color: "#333333" } : { color: "#adafb0" }} onClick={this.classRoom.bind(this)}>{showTeacher ? "教师统计" : "教室统计"}  &nbsp;</span>
                }
                
                {tabletype == 2 ?
                showTeacher && (roleType =="3" ||roleType == '4') ? <span style={{ color: "#adafb0" }}>教师</span>:
                    <span style={tabletype == 2 ? { color: "#adafb0" } : {}}> > &nbsp;{showTeacher ? "教师" : "教室"} </span>
                    : ""}

            </div>
        );
    }
}

export default Menu;