/*
 * @Author: JudyC 
 * @Date: 2017-09-12 15:24:28 
 * @Last Modified by: MinJ
 * @Last Modified time: 2019-03-12 09:43:35
 */
import React, { Component } from 'react';
import { SVG } from './../../../../base';
import './../../../../css/admin/mj_reScoreTeacher.css';

class ReScoreTeacher extends Component{
  constructor(){
    super();
    this.state={
      teaData:[]
    };
  };

  componentDidMount(){
    var newTeaData = [];
    this.props.teaData.map((item)=>{
      newTeaData.push({
        teacherName:item.teacherName,
        teacherId:item.teacherId,
        status:item.status?item.status:'normal'
      });
    });
    this.setState({
      teaData:newTeaData
    });
  };

  render(){
    return (
      <div className="cjy-rst-scoreTeaBox">
        <div className="cjy-rst-box">
          <div className="cjy-rst-boxHead"><span>选择评分老师</span></div>
          <div className="cjy-rst-boxBody">
            {
              this.state.teaData.map((item,index)=>(
                item.status === 'normal'
                ? <span className="cjy-rst-teaNormal" key={index} onClick={this.handleChoseTea.bind(this,index)}>{item.teacherName}</span>
                : <span className="cjy-rst-teaGrey" key={index}>{item.teacherName}</span>
              ))
            }
          </div>
        </div>
        <div className="cjy-rst-iconBox">
          <SVG type='icon' />
        </div>
        <div className="cjy-rst-box">
          <div className="cjy-rst-boxHead"><span>已选评分老师</span></div>
          <div className="cjy-rst-boxBody">
            {
              this.state.teaData.map((item,index)=>(
                item.status === 'chosed'
                ? <span className="cjy-rst-teaBlue" key={index}>
                    <div>{item.teacherName}</div>
                    {/* <i className="iconfont cjy-rst-close" onClick={this.handleDeleteTea.bind(this,index)}>&#xe60b;</i> */}
                    <SVG type='quxiao' onClick={this.handleDeleteTea.bind(this, index)} />
                  </span>
                : ''
              ))
            }
          </div>
        </div>
      </div>
    );
  }

  handleChoseTea(n){
    var newTeaData = this.state.teaData;
    newTeaData[n].status='chosed';
    this.setState({
      teaData:newTeaData
    });
    this.props.handlePage4(n,'chose');    
  };

  handleDeleteTea(n){
    var newTeaData = this.state.teaData;
    newTeaData[n].status='normal';
    this.setState({
      teaData:newTeaData
    });
    this.props.handlePage4(n,'del');    
  };
}

export default ReScoreTeacher;