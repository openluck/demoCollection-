/*
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-10-21 14:30:10
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-10-25 10:44:07
 */
import React, { Component } from "react";
import axios from 'axios'

class chinaNewFinance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataList: []
    };
  }

  componentDidMount() {
    this.getXinhuaNews()
  }

  // 获取新华网的数据
  getXinhuaNews() {
    let url = "/api/getChinaNewsFinance"
    axios.get(url).then(res => {
      console.log(res);
      if (res.data.code === '200') {
        console.log(111);
        this.setState({
          dataList: res.data.data
        })
      }
    })
  }

  render() {
    const { dataList } = this.state
    return (
      <div> <ul>
        {dataList.map(item => {
          return <li> {item.content} </li>
        })}
      </ul> </div>
    )
  }
}

export default chinaNewFinance
