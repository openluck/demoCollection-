/**
 * 这是框架主页的顶部
 * 
*/

import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import LoginOrRegister from '../../components/LoginOrRegister/LoginOrRegister'
import { Button, Avatar, Popover } from 'antd'
import styles from './header.module.less'
import { _getInfo } from '../../api/user'
import { removeToken, getToken } from '../../utils/auth'

const datasource = [
    { path: '/home/article', name: '文章' },
    { path: '/home/album', name: '相册' },
    { path: '/home/record', name: '学习记录' },
    { path: '/home/message', name: '留言板' },
    { path: '/home/about', name: '关于' },
]

class header extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            userInfo: null,
        }
    }

    componentDidMount () {
        this.getInfo()
    }

    getInfo () {
        if (getToken()) {
            _getInfo().then((res) => {
                this.setState({
                    userInfo: res.data
                })
            }).catch((err) => {
                this.setState({
                    userInfo: null,
                    removeToken
                })
            })
        }
    }

    showModal = (status) => {
        LoginOrRegister.open(status, () => {
          this.getInfo()
        })
    }

    logout = (e) => {
        this.setState({
            userInfo: null
        })
        removeToken()
        return false
    }


    render() {
        const { pathname } = this.props.location
        const { userInfo } = this.state
        return (
            <div className={styles['header-content']}>
                <div className={styles['header']}>
                    <div className={styles['header-logo']}>
                        <Link to="/">
                            <img src={'https://zos.alipayobjects.com/rmsportal/HqnZZjBjWRbjyMr.png'} />
                        </Link>
                    </div>
                    <div className={styles['header-right']}>
                        {datasource.map((item, index) => <Link key={index.toString()} to={item.path} className={`${styles['header-right-item']} ${pathname.includes(item.path) ? styles['header-right-item-active'] : ''}`}>{item.name}</Link>)}
                        {
                            userInfo ?
                                <div className={styles['header-right-action']}>
                                    {/* <Avatar src={userInfo.avatar} /> */}
                                    <Popover content={<div><a href="#" onClick={this.logout}>退出登录</a></div>}>
                                        <Button className={styles['header-right-action-button']} ghost>{userInfo.nickname}</Button>
                                    </Popover>
                                </div>
                                :
                                <div className={styles['header-right-action']}>
                            <Button onClick={() => { this.showModal(0) }} className={styles['header-right-action-button']} ghost>登录</Button>
                            &nbsp;&nbsp;/&nbsp;&nbsp;
                            <Button onClick={() => { this.showModal(1) }} className={styles['header-right-action-button']} ghost>注册</Button>
                        </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}


export default withRouter(header);