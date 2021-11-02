/*
 * @Author: MinJ
 * @Date: 2020-05-13 13:37:16 
 * @Last Modified by: xm
 * @Last Modified time: 2021-01-28 10:57:44
 * 模态框
 * width 模态框宽
 * title 模态框标题
 * visible 模态框显隐
 * content 内容
 * footer 底部按钮，不展示：null{ok：确认按钮，不展示:null  cancel取消按钮，不展示:null}
 * onOk 确认函数
 * onCancel 取消函数
 * paddingLeft 底部按钮距左距离，不传则居中
 */
import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

import './../../style/modalPonent.scss';

class ModalPonent extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    const { title, visible, content, footer, width, height, paddingLeft } = this.props;
    return (
      <Modal
        title={title}
        width={width}
        visible={visible}
        maskClosable={false}
        className={title === null ? 'mj-modal-content mj-modal-titleNull' : 'mj-modal-content'}
        onCancel={() => this.props.onCancel()}
        footer={null}
      >
        {content}
        {
          footer ?
            <div className='mj-modal-footer'
              style={{
                paddingLeft: paddingLeft ? paddingLeft : '0',
                textAlign: paddingLeft ? 'left' : 'center'
              }}>
              {
                footer.ok ?
                  <Button
                    type="primary"
                    className='mj-footer-primary'
                    onClick={() => this.props.onOk()}>{footer.ok || '确认'}</Button> : null
              }
              {
                footer.cancel ?
                  <Button
                    className='mj-footer-default'
                    onClick={() => this.props.onCancel()}>{footer.cancel || '取消'}</Button> : null
              }
            </div> : null
        }
      </Modal>
    );
  }
}

export default ModalPonent;
