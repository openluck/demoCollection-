/*
 * @Author: xq 
 * @Date: 2021-01-15 13:17:03 
 * @Last Modified by: xq
 * @Last Modified time: 2021-02-24 11:06:35
 * @desc 上传进度
 * @param {string} status 上传状态 '' 未上传、'0' 成功、'1' 失败-无异常数据、'2' 失败-有异常数据、'3' 正在上传
 */
import React, { useEffect, useState, useRef } from "react";
import SVG from "./../../../view/public/public-component-svg";
import { message,Progress ,Button} from 'antd';

export const UpdateProgress = props => {
    const { progress, status } = props;
    const [color,setColor] = useState('');
    const [fileSvg,setFileSvg] = useState('');
    const [upText,setUpText] = useState('');

    useEffect(()=>{
        if(status){
            let _fileSvg='',_color='',_upText='';
            switch(status){
                case '0':
                    _fileSvg = 'fujian';
                    _color = '#5b9fe5';
                    _upText = '上传成功';
                    break;
                case '1':
                    _fileSvg = 'fujian';
                    _color = 'red';
                    _upText = '上传失败';
                    break;
                case '2':
                    _fileSvg = 'fujian';
                    _color = 'red';
                    _upText = '上传失败，存在异常数据';
                    break;
                case '3':
                    _fileSvg = 'jiazaizhong';
                    _color = '#aeb3b8';
                    _upText = '正在上传';
                    break;
            }
            setFileSvg(_fileSvg);
            setColor(_color);
            setUpText(_upText);
        }
    },[status])
    
    return (
        <div className='xq-config-pro'>
            <div className='xq-config-pro-l'>
                <SVG type={fileSvg} color={color}/>
            </div>
            <div className='xq-config-pro-r'>
                {/* 标题  上传中显示文件名，上传结束显示状态文案 */}
                <span style={{color}}>
                    { upText }
                </span>

                {/* 下载异常数据 */}
                {
                    status === '2'
                    ?<span 
                        className='xq-config-download'
                        onClick={props.downloadErr}
                    >
                        下载异常数据
                    </span>
                    :null
                }

                {/* 右侧中断按钮 */}
                {
                    status === '3'
                    ?<span onClick={props.cancelFunc}>
                        <SVG 
                            type={'x'}  
                            style={{color,width:8,height:8}}
                            className='xq-config-pro-del'
                        />
                    </span>
                    :null
                }
            </div>

            {/* 进度条 */}
            {
                status === '3'
                ?<div className='xq-config-pro-line'>
                    <Progress 
                        percent={progress} 
                        showInfo={false} 
                        strokeWidth={6} 
                        status="active"
                    />
                </div>
                :null
            }
        </div>
    )
}
