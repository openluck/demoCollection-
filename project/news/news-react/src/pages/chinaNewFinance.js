/*
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-10-21 14:30:10
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-10-21 14:45:26
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
    })
  }

  render() {
    return (
      <div>2222</div>
    )
  }
}

export default chinaNewFinance
