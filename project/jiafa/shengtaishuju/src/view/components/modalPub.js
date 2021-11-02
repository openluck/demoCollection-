/*
 * @Author: lxx 
 * @Date: 2020-07-24 10:50:39 
 * @Last Modified by: tj
 * @Last Modified time: 2020-09-16 10:37:51
 * 弹窗公共组件 
 * title 标题 默认“提示”
 * width 宽度 默认500px
 * visiable 是否显示
 * onCancel 关闭取消回调
 * onOk 确认回调
 * footer 底部按钮，
 * {ok：'确认按钮文字', okIcon: svg或icon, cancel: '取消按钮文字', cancelIcon: svg或icon, okDis: 确定按钮是否禁用，默认false, onCancel: 取消按钮的特殊回调}, 默认：保存，取消
 * paddingLeft 按钮非居中时，居左间距, 如100px
 * onlyOk 只显示确定按钮
 */
import React from 'react'
import { Modal, Button } from 'antd'

export default function ModalPub(props) {

    let { visible, width, content, footer, title, paddingLeft, className, loading } = props

    return <Modal
        title={title || '提示'}
        width={width || 500}
        maskClosable={false}
        visible={visible}
        onCancel={props.onCancel}
        footer={null}
        className={className ? `lxx-g-modal ${className}` : `lxx-g-modal`}
    >
        {content}
        {
            footer.isOnly
                ? null
                : <div className="lxx-md-g-footer"
                    style={{
                        paddingLeft: paddingLeft ? paddingLeft : 0,
                        textAlign: paddingLeft ? 'left' : 'center'
                    }}
                >
                    <Button
                        className="lxx-ft-m-primary"
                        disabled={footer && footer.okDis || false}
                        loading={loading || false}
                        onClick={props.onOk} //footer.isOnly ? props.onCancel : props.onOk
                    >
                        {footer && footer.okIcon}
                        {footer && footer.ok || '提交'}
                    </Button>
                    {
                        footer.onlyOk
                            ? null
                            : <Button
                        className="lxx-ft-m-default"
                        onClick={footer && footer.onCancel || props.onCancel}
                    >
                        {footer && footer.cancelIcon}
                        {footer && footer.cancel || '取消'}
                    </Button>
                    }

                </div>
        }

    </Modal>

}
