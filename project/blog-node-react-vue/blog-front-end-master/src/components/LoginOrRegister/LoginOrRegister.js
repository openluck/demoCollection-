/**
 * 
 * 登录注册弹出框
 */

import React from 'react'
import ReactDOM from 'react-dom'
import Login from './Login'
import Register from './Register'
import styles from './LoginOrRegister.module.less'
import { Modal, notification } from 'antd'
import { _login, _register} from '../../api/user'
import { setToken } from '../../utils/auth'

class LoginOrRegister extends React.Component {

    constructor(props) {
        super(props)
        this.callback = null
        this.state = {
            isModalVisible: false,
            status: 0,
        }
    }

    open = (status, callback) => {
        this.setState({status, isModalVisible: true})
        this.callback = callback
    }

    close = () => {
        this.setState({status: 0, isModalVisible: false})
    }


    handleOk () {
        console.log('Ok')
        this.close()
    }

    handleCancel () {
        this.close()
    }

    registerFinish = async (values, form) => {
        try {
            const result = await _register(values)
            form.current.resetFields();
            this.handleCancel()
            notification.success({
                message: '成功',
                description: result.msg
            })
        } catch (error) {
            console.log(error)
        }
    }

    loginFinish = async (values, form) =>{
        try {
            const result = await _login(values)
            form.current.resetFields();
            this.handleCancel()
            notification.success({
                message: '成功',
                description: result.msg
            })
            setToken(result.data.token)
            this.callback()
        } catch (error) {
            console.log(error)
        }
        
    }


    render() {
        const { isModalVisible, status } = this.state
        return (
            <div>
                <Modal footer={null} visible={isModalVisible} title={status ? '注册' : '登录'} onOk={this.handleOk.bind(this)} onCancel={this.handleCancel.bind(this)}>
                    <div className={styles.container}>
                        {
                            status ? <Register onFinish={this.registerFinish} /> : <Login onFinish={this.loginFinish} />
                        }
                    </div>
                </Modal>
            </div>
        )
    }
}
let div = document.createElement('div');
document.body.appendChild(div);

let Box = ReactDOM.render(React.createElement(
    LoginOrRegister
), div);



export default Box;