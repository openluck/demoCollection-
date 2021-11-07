/*
 * @Author: Minj
 * @Date: 2017-09-11 10:27:54
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-11-26 14:25:26
 * 听评课-管理员部分-随堂设置-授课员审批权限设置-备选教师名列表
 */
import React, { Component } from "react";
import { Button } from "antd";
import { List } from "react-virtualized";
import _ from "lodash";
import "./../../../style/tpk/mj_listenPerName.css";

class ListenPerName extends Component {
  constructor(props) {
    super(props);
    this.state = {
      propData: [], //二维数组数据（用于展示）
      personList: [], //原始数据
      width: 400, //List插件宽度
      checkPer: "", //左侧本身
      checkList: [], //选中
      classNa: ""
    };
  }
  /**
   * 数据转换为二维数组
   */
  dataCheck = () => {
    const { data, classNa } = this.props,
      len = data.length;
    let width = document.getElementsByClassName(classNa).length
        ? document.getElementsByClassName(classNa)[0].clientWidth
        : 400,
      rowNum = parseInt((width - 25) / 89),
      num = Math.ceil(len / rowNum),
      remain = len % rowNum,
      propData = [];
    // console.log(width);

    for (let i = 0; i < num; i++) {
      let index = i + 1;
      if (remain && index === num) {
        //最后一个数组
        propData[i] = data.slice(i * rowNum, i * rowNum + remain);
      } else {
        let start = rowNum * i;
        let end = index * rowNum;
        propData[i] = data.slice(start, end);
      }
    }

    return { width, propData };
  };
  componentDidMount() {
    // const { width, propData } = this.dataCheck();
    // const { data, curPerson, checkData } = this.props;
    // // console.log(propData);

    // this.setState({
    //   width: width - 5,
    //   propData,
    //   personList: data,
    //   checkPer: curPerson.teacherId,
    //   checkList: JSON.parse(JSON.stringify(checkData))
    // })

    /**
     * 监听窗口大小变化
     */
    let _this = this;
    window.addEventListener(
      "resize",
      function() {
        const { width, propData } = _this.dataCheck();
        _this.setState({
          width: width - 5,
          propData
        });
      },
      false
    );
  }
  static getDerivedStateFromProps(nextprops, provestate) {
    const { data, curPerson, checkData, classNa } = nextprops,
      { personList, checkPer, checkList } = provestate;
    console.log("curPerson", curPerson);
    // console.log(checkData, checkList);
    // console.log(curPerson.teacherId !== checkPer);
    // console.log(JSON.stringify(data) !== JSON.stringify(personList));
    // console.log(JSON.stringify(checkData) !== JSON.stringify(checkList));
    if (
      (curPerson && curPerson.teacherId !== checkPer) ||
      JSON.stringify(data) !== JSON.stringify(personList) ||
      JSON.stringify(checkData) !== JSON.stringify(checkList)
    ) {
      const len = data.length;
      let width = document.getElementsByClassName(classNa).length
          ? document.getElementsByClassName(classNa)[0].clientWidth
          : 400,
        rowNum = parseInt((width - 25) / 89),
        num = Math.ceil(len / rowNum),
        remain = len % rowNum,
        propData = [];
      // console.log('nextprops', nextprops);
      // console.log(curPerson.teacherId !== checkPer);
      // console.log(JSON.stringify(data) !== JSON.stringify(personList));
      // console.log(JSON.stringify(checkData) !== JSON.stringify(checkList));
      for (let i = 0; i < num; i++) {
        let index = i + 1;
        if (remain && index === num) {
          //最后一个数组
          propData[i] = data.slice(i * rowNum, i * rowNum + remain);
        } else {
          let start = rowNum * i;
          let end = index * rowNum;
          propData[i] = data.slice(start, end);
        }
      }
      return {
        checkPer: curPerson?curPerson.teacherId:'',
        personList: JSON.parse(JSON.stringify(data)),
        width: width - 8,
        propData,
        checkList: JSON.parse(JSON.stringify(checkData)),
        classNa
      };
    } else return null;
  }
  componentWillUnmount() {
    this.setState({
      propData: [], //二维数组数据（用于展示）
      personList: [], //原始数据
      width: 400, //List插件宽度
      checkPer: "", //左侧本身
      checkList: [], //选中
      classNa: ""
    });
  }

  /**
   * List 插件list
   */
  rowRenderer = params => {
    const { propData } = this.state;
    const { index, key, style, isScrolling, parent } = params;
    const { checkData, curPerson } = parent.props;

    return (
      <div key={key} style={style}>
        {propData[index].map((item, i) => {
          let index1 = _.findIndex(checkData, { teacherId: item.teacherId }),
            click =
              index1 === -1 &&
              (curPerson ? curPerson.teacherId : "") !== item.teacherId
                ? true
                : false;
          return (
            <div
              key={i + Math.random()}
              title={item.teacherName}
              value={item.teacherId}
              onClick={e => (click ? this.props.handleOnChange(e, item) : null)}
              className={click ? "mj-list-cla" : "mj-list-cla mj-list-claDis"}
            >
              {item.teacherName}
            </div>
          );
        })}
      </div>
    );
  };

  render() {
    let { width, propData } = this.state,
      { height } = this.props;
    return (
      <div className="zq-lpn-perName">
        {/* <div>{JSON.stringify(this.props.checkData[0])}</div> */}
        {/* {
          this.props.data.map((value, index) => {   
            var index1 = _.findIndex(this.props.checkData, { teacherId: value.teacherId });
            if (index1 === -1 && ((this.props.curPerson ? this.props.curPerson.teacherId : '') !== value.teacherId)) {
              return <Button title={value.teacherName} onClick={this.props.handleOnChange} value={JSON.stringify(value)} key={index} disabled={false}>{value.teacherName}</Button>
            } else {
              return <Button title={value.teacherName} onClick={this.props.handleOnChange} value={JSON.stringify(value)} key={index} disabled={true}>{value.teacherName}</Button>
            }
          })
        } */}
        <List
          width={width || 400}
          height={height || 180}
          rowCount={propData.length}
          rowHeight={54}
          curPerson={this.state.checkPer}
          checkData={this.state.checkList}
          rowRenderer={this.rowRenderer}
          overscanRowCount={20}
        />
      </div>
    );
  }
}

export default ListenPerName;
