/**
 * 这是首页
 * 
*/

import React from 'react'
import { Link } from 'react-router-dom'
import QueueAnim from 'rc-queue-anim'
import Texty from 'rc-texty'
import layoutRoute from '../../router/layoutRoute'
import { Button } from 'antd'
import styles from './index.module.less'


const datasource = [
    { path: '/home/article', name: '文章'},
    { path: '/home/album', name: '相册'},
    { path: '/home/record', name: '学习记录'},
    { path: '/home/message', name: '留言板'},
    { path: '/home/about', name: '关于'},
]


export default class Index extends React.Component {

    render() {
        return (
            <div className={styles['banner']}>
                <QueueAnim
                    type={['bottom', 'top']}
                    delay={200}
                    className={styles['banner-text-wrapper']}
                >
                    <div key="title" className={styles['banner-title']}>
                        <img src='https://zos.alipayobjects.com/rmsportal/HqnZZjBjWRbjyMr.png' width="100%" alt="img" />
                    </div>
                    <div key="content" className={styles['banner-content']}>
                        <Texty duration={600} delay={200}>一个个人网站</Texty>
                    </div>
                    <div key="button">
                        {
                            datasource.map((item) => <Link key={item.path} to={item.path}><Button ghost key="button" className={styles['banner-button']}>{item.name}</Button></Link>)
                        }
                    </div>
                </QueueAnim>
            </div>
        )
    }
}