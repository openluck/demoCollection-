/*
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-10-21 14:30:10
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-11-01 16:46:21
 */
// eslint-disable-next-line
import React, { Component } from "react";
import axios from 'axios'
// Divider
import { List, Avatar, Space, Input } from 'antd';
import { MessageOutlined, LikeOutlined, StarOutlined, AudioOutlined } from '@ant-design/icons';

import '../static/css/chinaNewFinance.css'

const IconText = ({ icon, text }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

const { Search } = Input;

class chinaNewFinance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataList: [],
      listData: [],
      total: 320,
      param: {
        current: 1,
        pageSize: 10
      },
      loading: false,
      searchValue: ''
    };
    this.changePage = this.changePage.bind(this)
    this.onSearch = this.onSearch.bind(this)
  }
  componentDidMount() {
    this.getXinhuaNews()
  }


  // 获取新华网的数据
  getXinhuaNews() {
    this.setState({
      loading: true
    })
    let url = "/api/getChinaNewsFinance"
    axios.post(url, {
      ...this.state.param
    }).then(res => {
      if (res.data.code === '200') {
        this.setState({
          dataList: res.data.data.list,
          loading: false
        })
      } else {
        console.log(res);
      }
    })
  }

  // 改变页数
  async changePage(page) {
    // 异步 同步。。。
    await this.setState({
      param: {
        //  注意这三个点
        ...this.state.param,
        current: page,
      }
    })
    await this.getXinhuaNews()
  }

  // 查询
  onSearch(value) {

    this.setState({
      searchValue: value,
      loading: false
    })
    let url = "/api/findKeywordList"
    axios.post(url, {
      searchValue: this.state.searchValue
    }).then(res => {
      if (res.data.code === '200') {
        this.setState({
          dataList: res.data.data.list,
          loading: false
        })
      }
    })
  }

  render() {
    const { dataList, loading } = this.state
    return (
      <div>
        <Search className="search-input" placeholder="输入关键词" onSearch={this.onSearch} enterButton />
        <List
          itemLayout="vertical"
          size="large"
          pagination={{
            onChange: page => {
              this.changePage(page)
            },
            pageSize: this.state.param.pageSize,
            total: this.state.total
          }}
          loading={loading}
          dataSource={dataList}
          renderItem={item => (
            <List.Item
              key={item.id}
              actions={[
                <IconText icon={StarOutlined} text={item.channel} key="list-vertical-star-o" />,
                <IconText icon={LikeOutlined} text={item.pubtime} key="list-vertical-like-o" />,
                <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
              ]}
              extra={
                <img
                  width={272}
                  alt="logo"
                  src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                />
              }
            >
              <List.Item.Meta
                avatar={<Avatar src={item.avatar} />}
                title={<a href={item.url}>{item.title}</a>}
              // description={item.description}
              />
              {item.content}
            </List.Item>
          )}
        />,
      </div>
    )
  }
}

export default chinaNewFinance
