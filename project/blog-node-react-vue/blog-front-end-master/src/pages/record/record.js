/**
 * 记录主页
 * 
*/

import React from 'react'
import BusinessCard from '../../components/BusinessCard/BusinessCard'
import { Typography, Tag, Divider, Input, Pagination } from 'antd';
import { _getRecordList, _getTagList } from '../../api/record'
import { formatHtml } from '../../utils/tools'
import styles from './record.module.less'
const { Search } = Input;
const { Title } = Typography


export default class Record extends React.Component {

    state = {
        count: 0,
        list: [],
        loading: false,
        listQuery: {
            limit: 10,
            page: 1,
            keyword: '',
            tag: undefined,
        },
        tagList: []
    }

    componentDidMount() {
        this.getList()
        this.getTagList()
    }

    getList = async () => {
        const { listQuery } = this.state
        this.setState({ loading: true })
        let result = await _getRecordList(listQuery)
        this.setState({ loading: false, list: result.data, count: result.count })
    }

    getTagList = async () => {
        let result = await _getTagList()
        this.setState({
            tagList: result.data
        })
    }

    paginationChange = (page) => {
        const listQuery = Object.assign(this.state.listQuery, { page })
        this.setState({ listQuery }, this.getList)
    }

    SearchEvent = (e) => {
        this.getList()
    }
    SearchChange = (e) => {
        const { listQuery } = this.state
        listQuery.keyword = e.target.value
        this.setState({listQuery})
    }
    tagChange (id) {

    }

    render() {
        const { list, tagList, listQuery, count, loading } = this.state
        const skip = (listQuery.page - 1) * listQuery.limit
        return (
            <div className={styles.record}>
                <div className={styles['record-content']}>
                    <Search value={listQuery.keyword} onChange={this.SearchChange} onSearch={this.SearchEvent} size="large" className={styles['record-content-search']} placeholder="" loading={loading} enterButton="搜索一下" />
                    {/* <div className={styles['record-content-tag']}>
                        {
                            tagList.map(item => <Tag onClick={this.tagChange.bind(this, item._id)} key={item._id} className={styles['tagItem']} color={item.color}>{item.name}</Tag>)
                        }
                    </div> */}
                    <Divider />
                    <div className={styles['record-content-list-content']}>

                        {
                            list.map((item, index) => {
                                return (
                                    <div key={index}>
                                        <div className={styles['record-title']}>
                                            <Title level={4} style={{ display: 'flex', alignItems: 'center' }}>
                                                {skip + index + 1}.
                                            {
                                                    item.tag.map((it) => <Tag key={it._id} style={{ transform: 'scale(0.8)', margin: 0 }} color={it.color}>{it.name}</Tag>)
                                                }
                                            </Title>
                                            <div dangerouslySetInnerHTML={{ __html: formatHtml(item.content) }}></div>
                                            <Divider />
                                        </div>
                                    </div>
                                )
                            })
                        }
                        <Pagination total={count} defaultPageSize={listQuery.limit} onChange={this.paginationChange} />

                    </div>
                </div>
                <div className={styles['record-BusinessCard']}><BusinessCard /></div>
                <div style={{ clear: 'both' }}></div>
            </div>
        )
    }
}