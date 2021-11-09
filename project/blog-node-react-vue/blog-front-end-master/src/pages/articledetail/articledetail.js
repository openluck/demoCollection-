/**
 * 这是文章详情页面
 * 
*/

import React from 'react'
import styles from './articledetail.module.less'
import { PageHeader, Divider, Typography } from 'antd'
import { _getArticle } from '../../api/article'
import { ClockCircleOutlined, EyeOutlined, LikeOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { formatHtml } from '../../utils/tools'
const { Title, Paragraph, Text } = Typography
export default class ArticleDetail extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            content: {
                classify: null,
                fabulous: [],
                content: ''
            }
        }
    }


    componentDidMount() {
        const { id } = this.props.match.params
        this.getArticle(id)
    }

    getArticle = async (id) => {
        const result = await _getArticle(id)
        this.setState({ content: result.data })
    }




    render() {
        const { content } = this.state
        return (
            <div className={styles['page']}>
                <div className={styles['articledetail']}>
                    <PageHeader
                        onBack={() => { window.history.go(-1) }}
                        title="返回"
                    />
                    <Divider dashed />
                    <Title level={4} className={styles['articledetail-title']}>{ content.title }</Title>
                    <Paragraph className={styles['articledetail-Paragraph']}>
                        <Text className={styles['articledetail-Paragraph-item']}>
                            <UnorderedListOutlined />
                            <span>{content.classify && content.classify.name}</span>
                        </Text>
                        <Text className={styles['articledetail-Paragraph-item']}>
                            <ClockCircleOutlined />
                            <span>{content.createTime}</span>
                        </Text>
                        <Text className={styles['articledetail-Paragraph-item']}>
                            <EyeOutlined />
                            <span>{content.browse} 浏览</span>
                        </Text>
                        <Text className={styles['articledetail-Paragraph-item']}>
                            <LikeOutlined />
                            <span>{content.fabulous.length} 点赞</span>
                        </Text>
                    </Paragraph>
                    <div className={styles['articledetail-container']} dangerouslySetInnerHTML={{ __html: formatHtml(content.content) }}>
                    </div>
                </div>
            </div>
        )
    }
}

