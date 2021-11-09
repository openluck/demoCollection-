/**
 * 文章主页
 * 
*/

import React from 'react'
import { Link } from 'react-router-dom'
import Aside from './aside'
import BusinessCard from '../../components/BusinessCard/BusinessCard'
import { List, Typography } from 'antd';
import { ClockCircleOutlined, EyeOutlined, LikeOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { _getArticleList, _getArticleClassifyList } from '../../api/article'
import { matchReg } from '../../utils/tools'
import styles from './article.module.less'

const { Title, Paragraph, Text } = Typography


export default class Article extends React.Component {

  state = {
    classifyList: [],
    listQuery: {
      limit: 5,
      page: 1,
      classify: undefined
    },
    list: [],
    count: 0,
    loading: true,
  }


  componentDidMount() {
    this.getList()
    this.getClassify()
  }

  getList = async () => {
    const { listQuery, loading } = this.state
    this.setState({ loading: true })
    let result = await _getArticleList(listQuery)
    this.setState({ loading: false, list: result.data, count: result.count })
  }

  getClassify = async () => {
    const result = await _getArticleClassifyList()
    this.setState({ classifyList: result.data })
  }

  classifyChange = (id) => {
    const listQuery = Object.assign(this.state.listQuery, { classify: id })
    this.setState({ listQuery }, this.getList)
  }

  paginationChange = (page, pageSize) => {
    const listQuery = { ...this.state.listQuery, page, limit: pageSize }
    this.setState({ listQuery }, this.getList)
  }



  render() {
    const { list, loading, count, classifyList, listQuery } = this.state
    return (
      <div className={styles['article']}>
        <Aside list={classifyList} classify={listQuery.classify} change={this.classifyChange} />
        <div className={styles['article-list']}>
          <List
            size="large"
            header={<Title level={4}> 最新文章（{count}篇）</Title>}
            loading={loading}
            dataSource={list}
            pagination={{
              defaultCurrent: listQuery.page,
              total: count,
              hideOnSinglePage: true,
              defaultPageSize: listQuery.limit,
              onChange: this.paginationChange
            }}
            renderItem={item => <List.Item>
              <Link className={styles['article-list-item']} to={"/home/article/detail/" + item._id}>
                <Title style={{ marginBottom: '15px' }} level={5}>{item.title}</Title>
                <div className={styles['article-list-item-content']}>
                  <div className={styles['article-list-item-content-image']}><img src={item.poster}></img></div>
                  <Paragraph ellipsis={{ rows: 4, expandable: false, suffix: '.' }} className={styles['article-list-item-content-right']}>
                    {matchReg(item.content)}
                  </Paragraph>
                </div>
                <div className={styles['article-list-item-footer']}>
                  <div className={styles['article-list-item-footer-item']}>
                    <UnorderedListOutlined className={styles['article-list-item-footer-item-icon']} />
                    <Text className={styles['article-list-item-footer-item-text']}>{item.classify && item.classify.name}</Text>
                  </div>
                  <div className={styles['article-list-item-footer-item']}>
                    <ClockCircleOutlined className={styles['article-list-item-footer-item-icon']} />
                    <Text className={styles['article-list-item-footer-item-text']}>{item.createTime}</Text>
                  </div>
                  <div className={styles['article-list-item-footer-item']}>
                    <EyeOutlined className={styles['article-list-item-footer-item-icon']} />
                    <Text className={styles['article-list-item-footer-item-text']}>{item.browse} 浏览</Text>
                  </div>
                  <div className={styles['article-list-item-footer-item']}>
                    <LikeOutlined className={styles['article-list-item-footer-item-icon']} />
                    <Text className={styles['article-list-item-footer-item-text']}>{item.fabulous.length} 点赞</Text>
                  </div>
                </div>
              </Link>

            </List.Item>}
          />
        </div>
        <div className={styles['article-BusinessCard']}><BusinessCard /></div>

        <div style={{ clear: 'both' }}></div>
      </div>
    )
  }
}