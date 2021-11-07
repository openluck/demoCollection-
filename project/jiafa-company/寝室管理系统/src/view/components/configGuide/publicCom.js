/*
 * @Author: xq 
 * @Date: 2021-01-14 13:44:02 
 * @Last Modified by: xq
 * @Last Modified time: 2021-03-25 11:09:27
 * @desc 点击 && 拖动 文件上传组件(可批量上传)
 * className=''              // [非必填]
 * onUpload={onUpload}       // 文件上传函数 - 拖拽
 * count={1}                 // 最大文件数
 * formats={['xls']}         // 需要校验的文件类型
 * fileUpload={fileUpload}   // 文件上传函数 - 点击
 * downloadTem={downloadTem} // 下载模板函数
 * clickRef={fileUp}         // 点击上传按钮的ref
 */
import React, { useEffect, useState, useRef } from "react";
import SVG from "./../../../view/public/public-component-svg";
import { message } from 'antd';

export const ConfigDrag = (props) => {
    const [dragging, setDragging] = useState(false);
    const drop = useRef();
    const drag = useRef();

    useEffect(() => {
        drop.current.addEventListener('dragover', handleDragOver);
        drop.current.addEventListener('drop', handleDrop);
        drop.current.addEventListener('dragenter', handleDragEnter);
        drop.current.addEventListener('dragleave', handleDragLeave);
        return () => {
            drop.current.removeEventListener('dragover', handleDragOver);
            drop.current.removeEventListener('drop', handleDrop);
            drop.current.removeEventListener('dragenter', handleDragEnter);
            drop.current.removeEventListener('dragleave', handleDragLeave);
        }
    }, [])

    // 区域内移动
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    // 进入区域
    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.target !== drag.current && setDragging(true)
    };

    // 离开区域
    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.target === drag.current && setDragging(false)
    };

    // 完成拖拽（放下）
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false)
        let { count, formats } = props;
        const files = [...e.dataTransfer.files];

        if (count && count < files.length) {
            message.warning(`抱歉，每次最多只能上传${count}个文件!`);
            return;
        }

        // 校验文件类型
        let isLegal = 0;
        files.some((file) => {
            formats = formats && formats.length ? formats : ['xlsx','xls'];
            formats.some((format) => {
                let isHas = file.name.toLowerCase().endsWith(format.toLowerCase());
                if(isHas) isLegal++;
            })
        })
        if(isLegal === 0){
            message.warning(`只允许上传 ${formats.join(', ')}格式的文件`);
            return;
        }

        if (files && files.length) {
            props.onUpload(files);
        }
    };


    // 点击上传的文件校验
    const clickFileCheck = () => {
        let files = props.clickRef.current.files;
        if(!files || files.length === 0){
            document.getElementById('xqInput').value = ''
            return false;
        }

        let isLegal = 0;
        let { formats } = props;
        formats = formats && formats.length>1 ? formats : ['xlsx','xls'];
        if(files.length === 1){
            let _name = files[0].name;
            let isHas1 = _name.toLowerCase().endsWith(formats[0].toLowerCase());
            let isHas2 = _name.toLowerCase().endsWith(formats[1].toLowerCase());
                if(isHas1 || isHas2) isLegal++;
        }
        if(isLegal === 0){
            message.warning(`只允许上传 ${formats.join(', ')}格式的文件`);
            return;
        }

        if (files && files.length) {
            props.onUpload(files);
        }
    }

    return (
        <div 
            className={props.className ? `${props.className} xq-drag-con` : 'xq-drag-con'} 
            ref={drop}
        >
            {
                dragging && (
                    <div
                        ref={drag}
                        className='xq-drap-msg'
                    >
                        请放手
                    </div>
                )}
            {/* 按钮上传 */}
            <div className='xq-guide-upload-input'>
                <SVG type={'wenjian'} />
                
            </div>
            <div className='xq-guide-upload-t'>
                <span>将选定文件拖拽至框内上传</span>
                <div className='xq-guide-upload-input-btn'>
                    <span>点击上传</span>
                    <input
                        type="file"
                        id={props.isDele ? "xqInputDele" : "xqInput"}
                        ref={props.clickRef}
                        title='点击上传'
                        // onChange={props.fileUpload}
                        onChange={clickFileCheck}
                    />
                </div>
            </div>
            <span className='xq-guide-upload-p'>支持扩展名：xls、xlsx</span>
            <div className='xq-guide-download' onClick={props.downloadTem}>
                下载模板
            </div>
        </div>
    );
}
