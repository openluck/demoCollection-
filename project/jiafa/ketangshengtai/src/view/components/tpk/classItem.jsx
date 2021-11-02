/*
 * @Author: JudyC 
 * @Date: 2017-09-15 16:31:20 
 * @Last Modified by: xm
 * @Last Modified time: 2021-01-21 14:09:38
 */
import React, { Component } from 'react';
import './../../../style/tpk/mj_classItem.css';

class ClassItem extends Component{
  constructor(){
    super();
    this.state = {
      className:''
    }
  }
  
  // componentWillMount(){
  //   switch(this.props.color){
  //     case 'normal':
  //       this.setState({
  //         className:'cjy-ci-item cjy-ci-normal'
  //       });
  //       break;
  //     case 'grey':
  //       this.setState({
  //         className:'cjy-ci-item cjy-ci-grey'
  //       });
  //       break;
  //     case 'blue':
  //       this.setState({
  //         className:'cjy-ci-item cjy-ci-blue'
  //       });
  //       break;
  //     case 'dsbd':
  //       this.setState({
  //         className:'cjy-ci-item cjy-ci-dsbd'
  //       });
  //       break;
  //     default:
  //       this.setState({
  //         className:'cjy-ci-item'
  //       });
  //   }
  // };

  render(){
    return (
      <div>
        {/* {
          this.props.color === 'dsbd'
          ? <div className={this.state.className}>{this.props.text}</div>
          : this.props.color==='normal'
            ? <div className={this.state.className} onClick={this.handleChoseClass.bind(this)}>{this.props.text}</div>
            : <div className={this.state.className} onClick={this.handleChoseClass.bind(this)}>{this.props.text}</div>
        } */}
        {
          this.props.color === 'grey'
            ? <div className="cjy-ci-item cjy-ci-grey" title={this.props.text}>{this.props.text}</div>
          : this.props.color === 'dsbd'
            ? <div className="cjy-ci-item cjy-ci-dsbd">{this.props.text}</div>
            : this.props.color==='normal'
                ? <div className="cjy-ci-item cjy-ci-normal" title={this.props.text} onClick={this.handleChoseClass.bind(this)}>{this.props.text}</div>
                : <div className="cjy-ci-item cjy-ci-blue" title={this.props.text} onClick={this.handleChoseClass.bind(this)}>{this.props.text}</div>
        }
      </div>
    );
  }
  handleChoseClass(){
    console.log(this.props.color)
    console.log(this.props.classInfo)
    let oprt = '';
    if(this.props.color==='normal'){
      oprt = 'add';
    }else if(this.props.color==='blue'){
      oprt = 'del';
    }
    this.props.handleClassChange(oprt,this.props.classInfo);
  }
}

export default ClassItem;