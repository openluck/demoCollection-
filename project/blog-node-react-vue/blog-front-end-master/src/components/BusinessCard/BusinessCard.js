


import React from 'react'
import PanThumb from '../PanThumb'
import { Typography } from 'antd';
import styles from './BusinessCard.module.less'

const { Title, Paragraph, Text } = Typography


export default class BusinessCard extends React.PureComponent {
    
    render() {
        return (
            <div className={styles['BusinessCard']}>
                <div className={styles['BusinessCard-avatar']}>
                    <PanThumb width={80} height={80} image={'../../../images/user.jpg'}>
                        <Title level={5} style={{lineHeight: '40px'}}>你好</Title>
                    </PanThumb>
                </div>
                <div className={styles['BusinessCard-content']}>
                    <Title className={styles['BusinessCard-content-title']} level={5}>一缕阳光</Title>
                    <Paragraph style={{marginTop: '20px'}}>
                        <Text>职业：</Text><Text>前端程序员</Text>
                    </Paragraph>
                    <Paragraph style={{marginTop: '20px'}}>
                        <Text>现居：</Text><Text>安徽省合肥市</Text>
                    </Paragraph>
                    <Paragraph style={{marginTop: '20px'}}>
                        <Text>爱好：</Text><Text>看电影，写代码</Text>
                    </Paragraph>
                    <Paragraph style={{marginTop: '20px'}}>
                        <Text>邮箱：</Text><Text copyable={{ tooltips: '复制'}}>1185359346@qq.com</Text>
                    </Paragraph>
                    <Paragraph style={{marginTop: '20px'}}>
                        <Text>微信：</Text><Text copyable={{tooltips: '复制'}}>wxfasdfadsfdas</Text>
                    </Paragraph>
                </div>
            </div>
        )
    }
}