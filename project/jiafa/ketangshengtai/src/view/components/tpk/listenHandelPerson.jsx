/*
 * @Author: Minj 
 * @Date: 2017-09-11 10:27:54 
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-11-26 14:23:33
 * 听评课-管理员部分-随堂设置-授课员审批权限设置-权限所属教师名列表
 */
import React, { Component } from 'react';
import { Row, Col, Radio } from 'antd';
import { List } from 'react-virtualized';
import './../../../style/tpk/mj_listenPerName.css';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
class ListenHandelPerson extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollToIndex: 2,
      propData: [],   //二维数组数据（用于展示）
      personList: [],   //原始数据
      width: 400,     //List插件宽度
      checkPer: '',     //选中
    }
  }
  /**
   * 数据转换为二维数组
   */
  dataCheck = () => {
    const { perLists, classNa } = this.props,
      len = perLists.length;
    let width = document.getElementsByClassName(classNa).length ?
      document.getElementsByClassName(classNa)[0].clientWidth : 400,
      rowNum = parseInt((width - 25) / 89),
      num = Math.ceil(len / rowNum),
      remain = len % rowNum,
      propData = [];
    for (let i = 0; i < num; i++) {
      let index = i + 1;
      if (remain && index === num) {     //最后一个数组
        propData[i] = perLists.slice(i * rowNum, (i * rowNum + remain));
      } else {
        let start = rowNum * i;
        let end = index * rowNum;
        propData[i] = perLists.slice(start, end);
      }
    }
    // console.log(width, rowNum);

    return { width, propData };
  }
  componentDidMount() {
    const { width, propData } = this.dataCheck();
    const { perLists, curPerson } = this.props;
    this.setState({
      width: width - 5,
      propData,
      personList: perLists,
      checkPer: curPerson.teacherId
    })

    /**
     * 监听窗口大小变化
     */
    let _this = this;
    window.addEventListener("resize", function () {
      const { width, propData } = _this.dataCheck();
      _this.setState({
        width: width - 5,
        propData
      })
    }, false);
  }

  static getDerivedStateFromProps(nextprops, provestate) {
    const { perLists, curPerson, classNa } = nextprops,
      { personList, checkPer } = provestate;
    if (curPerson.teacherId !== checkPer || JSON.stringify(perLists) !== JSON.stringify(personList)) {
      const len = perLists.length;
      let width = document.getElementsByClassName(classNa).length ?
       document.getElementsByClassName(classNa)[0].clientWidth : 400,
        rowNum = parseInt((width - 25) / 89),
        num = Math.ceil(len / rowNum),
        remain = len % rowNum,
        propData = [];
      for (let i = 0; i < num; i++) {
        let index = i + 1;
        if (remain && index === num) {     //最后一个数组
          propData[i] = perLists.slice(i * rowNum, (i * rowNum + remain));
        } else {
          let start = rowNum * i;
          let end = index * rowNum;
          propData[i] = perLists.slice(start, end);
        }
      }
      return {
        checkPer: curPerson.teacherId,
        personList: perLists,
        width: width - 5,
        propData
      }
    } else
      return null
  }

  /**
   * List 插件list
   */
  rowRenderer = (params) => {
    const { propData } = this.state;
    const { index, key, style, isScrolling } = params;
    let check = this.props.curPerson ? this.props.curPerson.teacherId : '';
    return <div key={key} style={style}>
      {
        propData[index].map((item, i) => {
          return <div
            key={i + Math.random()}
            title={`${item.teacherName} ${item.relaTeachers.length}`}
            value={item.teacherId}
            datai={item}
            onClick={(e) => this.props.handleOntTea(e, item)}
            className={check === item.teacherId ? 'mj-list-cla mj-list-claHigh' : 'mj-list-cla'}>
            {item.teacherName}
            <span className='zq-lpn-perNum'>{item.relaTeachers.length}</span>
          </div>
        })
      }
    </div>
  }
  render() {
    let { width, propData } = this.state;

    return (
      <div className='zq-lpn-perName mj-lpn-perName'>
        {/* <RadioGroup value={check} size="large" onChange={this.props.handleOntTea}>
          {
            this.props.perLists.map((value, index) => (
              <RadioButton value={value.teacherId} key={index} datai={value}>
                {value.teacherName}
                <span className='zq-lpn-perNum'>{value.relaTeachers.length}</span>
              </RadioButton>
            ))
          }
        </RadioGroup> */}
        <List
          width={width || 400}
          height={310}
          rowCount={propData.length}
          rowHeight={54}
          curPerson={this.props.curPerson}
          rowRenderer={this.rowRenderer}
          overscanRowCount={50}
        />
      </div >
    );
  }
}

export default ListenHandelPerson;