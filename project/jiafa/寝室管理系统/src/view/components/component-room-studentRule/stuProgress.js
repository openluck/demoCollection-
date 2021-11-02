/*
 * @Author: yhc 
 * @Date: 2021-02-25 12:55:49 
 * @Last Modified by: yhc
 * @Last Modified time: 2021-02-25 13:09:17
 */
import React, { useEffect, useState, useRef } from "react";
import SVG from "./../../../view/public/public-component-svg";
import { message,Progress ,Button} from 'antd';

export const StuProgress = props => {
    const { progress, status } = props;
    const [color,setColor] = useState('');
    const [fileSvg,setFileSvg] = useState('');
    const [upText,setUpText] = useState('');
    console.log(status)
    useEffect(()=>{
        if(status.state){
            let _fileSvg='',_color='',_upText='';
            switch(status.state){
                case '0':
                    _fileSvg = 'fujian';
                    _color = '#5b9fe5';
                    _upText = status.title;
                    break;
                case '1':
                    _fileSvg = 'fujian';
                    _color = 'red';
                    _upText = status.title;
                    break;
                case '2':
                    _fileSvg = 'fujian';
                    _color = 'red';
                    _upText = status.title;
                    break;
                case '3':
                    _fileSvg = 'jiazaizhong';
                    _color = '#aeb3b8';
                    _upText = status.title;
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
