/**
 * 
 * 登录注册弹出框
 */

import React from 'react'
import { Form, Input, Button } from 'antd';
const layout = {
    labelCol: {
        span: 5,
    },
    wrapperCol: {
        span: 16,
    },
};
const tailLayout = {
    wrapperCol: {
        offset: 5,
        span: 16,
    },
};


export default class Register extends React.Component {
    constructor (props) {
        super(props)

        this.formRef = React.createRef();
    }
    
    onFinish = (values) => {
        this.props.onFinish(values, this.formRef)
    }

    onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    }


    render () {
        return (
            <Form
                {...layout}
                name="basic"
                ref={this.formRef}
                initialValues={{
                    remember: true,
                }}
                onFinish={this.onFinish}
                onFinishFailed={this.onFinishFailed}
            >
                <Form.Item
                    label="用户名"
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: '请输入用户名',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="密码"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: '请输入你的密码!',
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    label="昵称"
                    name="nickname"
                    rules={[
                        {
                            required: true,
                            message: '请输入你的昵称',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <a></a>
                        <Button type="primary" htmlType="submit">
                            注册
                        </Button>
                    </div>
                </Form.Item>
                    
            </Form>
        )
    }
}