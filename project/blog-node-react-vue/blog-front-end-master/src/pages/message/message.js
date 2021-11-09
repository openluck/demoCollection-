/**
 * 这是留言板的主页
 * 
*/

import React from 'react'
import BusinessCard from '../../components/BusinessCard/BusinessCard'
import { Typography, List, Avatar, Space, Input, Button, notification } from 'antd'
import { DislikeOutlined, LikeOutlined, MessageOutlined } from '@ant-design/icons';
import { _getList, _create, _getChildList, _createChild } from '../../api/message'
import styles from './message.module.less'
import Item from 'antd/lib/list/Item';

const { TextArea } = Input
const { Title, Paragraph, Text } = Typography



const IconText = ({ icon, text }) => (
    <Space>
        {React.createElement(icon)}
        {text}
    </Space>
);
export default class Album extends React.Component {


    constructor(props) {
        super(props)
        this.state = {
            is_reply: false,
            content: '',
            childContent: '',
            listQuery: {
                limit: 20,
                page: 1,
                classify: undefined
            },
            list: [],
            count: 0,
            loading: true,
        }
    }



    componentDidMount() {
        this.getList()
    }

    handleMessage = (id) => {
        this.setState({ is_reply: id })
    }

    TextAreaChange = (e) => {
        this.setState({
            content: e.target.value
        })
    }

    TextChildChange = (e) => {
        this.setState({
            childContent: e.target.value
        })
    }


    getList = async () => {
        const { listQuery } = this.state
        this.setState({ loading: true })
        let result = await _getList(listQuery)
        this.setState({ loading: false, list: result.data, count: result.count })
    }


    handeleCreate = async () => {
        const { content } = this.state
        try {
            const result = await _create({ content })
            notification.success({
                message: '成功',
                description: result.msg
            })
            this.setState({ content: '' })
        } catch (error) {

        }
    }

    handeleCreateChild = async () => {
        const { childContent, is_reply, list } = this.state
        try {
            const result = await _createChild({ id: is_reply, content: childContent })
            notification.success({
                message: '成功',
                description: result.msg
            })
            this.getList()
            this.setState({ childContent: '' })
        } catch (error) {

        }
    }

    paginationChange = (page, pageSize) => {
        const listQuery = {...this.state.listQuery, page, limit: pageSize}
        this.setState({listQuery}, this.getList)
    }

    render() {
        const { is_reply, content, list, loading, listQuery, count, childContent } = this.state
        return (
            <div className={styles.page}>
                <div className={styles['message']}>
                    <div className={styles['message-container']}>
                        <div className={styles['message-container-top']}>
                            <TextArea value={content} rows={4} onChange={this.TextAreaChange} />
                            <Button onClick={this.handeleCreate} className={styles['message-container-top-button']} type="primary">确认</Button>
                        </div>
                        <div className={styles.line}></div>
                        <div className={styles['message-container-content']}>
                            <Title style={{ marginBottom: '20px' }} level={4}>所有留言</Title>
                            <List
                                itemLayout="vertical"
                                size="large"
                                loading={loading}
                                dataSource={list}
                                pagination={{
                                    defaultCurrent: listQuery.page,
                                    total: count,
                                    hideOnSinglePage: true,
                                    defaultPageSize: listQuery.limit,
                                    onChange: this.paginationChange
                                }}
                                renderItem={item => (
                                    <List.Item
                                        key={item._id}
                                        actions={[
                                            <div><IconText icon={LikeOutlined} text={item.support} key="list-vertical-star-o" /></div>,
                                            <div><IconText icon={DislikeOutlined} text={item.oppose} key="list-vertical-like-o" /></div>,
                                            <div onClick={() => { this.handleMessage(item._id) }}><IconText icon={MessageOutlined} text={item.children.length} key="list-vertical-message" /></div>,
                                        ]}
                                    >
                                        <List.Item.Meta
                                            avatar={<Avatar src={item.person ? item.person.avatar : ''} />}
                                            title={<a>{item.person ? item.person.nickname : '--'}</a>}
                                            description={item.time}
                                        />
                                        {item.content}
                                        <div className={`${styles['list']} ${is_reply === item._id ? styles['list-active'] : null}`} >
                                            <List
                                                itemLayout="vertical"
                                                size="small"
                                                locale={{
                                                    mptyText: '没有评论'
                                                }}
                                                dataSource={item.children}
                                                renderItem={it => (
                                                    <List.Item
                                                        key={it._id}
                                                    >
                                                        <List.Item.Meta
                                                            style={{ marginBottom: 5 }}
                                                            avatar={<Avatar size="small" src={it.person ? it.person.avatar : ''} />}
                                                            title={<a style={{ fontSize: '14px' }}>{it.person ? it.person.nickname : '--'}</a>}
                                                            description={item.time}
                                                        />
                                                        <div style={{ fontSize: '12px' }}>{it.content}</div>
                                                    </List.Item>
                                                )}
                                            />
                                            {/* 回复的狂 */}
                                            <div style={{ marginTop: '20px' }}>
                                                <div className={styles['message-container-top']}>
                                                    <TextArea placeholder="回复" rows={4} value={childContent} onChange={this.TextChildChange} />
                                                    <Button onClick={this.handeleCreateChild} className={styles['message-container-top-button']} type="primary">确认</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </List.Item>
                                )}
                            />
                        </div>
                    </div>
                    <div className={styles['message-BusinessCard']}><BusinessCard /></div>
                    <div style={{ clear: 'both' }}></div>
                </div>
            </div>

        )
    }
}