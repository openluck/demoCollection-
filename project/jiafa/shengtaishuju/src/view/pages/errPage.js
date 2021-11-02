/*
 * @Author: lxx 
 * @Date: 2020-02-26 14:00:04 
 * @Last Modified by: lxx
 * @Last Modified time: 2021-03-23 16:19:46
 * 无权限页面
 */
import React, { Component } from 'react';
import { Modal } from 'antd';

class ErrPage extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return <>
            {
                Modal.error({
                    title: '提示',
                    content: "您无该系统登录权限，若有需要请联系管理员！",
                    onOk: () => {
                        window.close()
                    }
                })
            }
        </>
    }
}

export default ErrPage;
