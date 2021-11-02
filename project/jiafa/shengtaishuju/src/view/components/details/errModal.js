/*
 * @Author: lxx 
 * @Date: 2020-01-23 10:17:46 
 * @Last Modified by: lilu
 * @Last Modified time: 2020-08-03 14:07:18
 * 到课率明细
 */
import React, { Component } from 'react';
import { Button, Modal } from 'antd';
import './../../../style/ll-errModal.scss'
import SVG from './../../public/svg'

class ErrModal extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div >
                <Modal
                    title="提示"
                    visible={this.props.visible||false}
                    onCancel={()=>{
                        this.props.onCancel()
                    }}
                    className='ll-err'
                >
                    <div className='ll-err-content'>
                        <SVG type='de_inf' />
                        <div>数据量过大，请重新选择下载范围</div>
                    </div>


                </Modal>
            </div>
        );
    }
}

export default ErrModal;