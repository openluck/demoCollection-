/*
 * @Author: xq 
 * @Date: 2021-01-08 13:20:10 
 * @Last Modified by: xq
 * @Last Modified time: 2021-03-23 15:33:45
 * @desc 住宿管理 - 配置向导
 * updateStatus 上传状态 '' 未上传、'0' 成功、'1' 失败-无异常数据、'2' 失败-有异常数据、'3' 正在上传
 */
import React, { useRef,useState } from 'react'
import { withRouter,useHistory } from 'react-router-dom'
import { message } from 'antd';
import SVG from "./../../../view/public/public-component-svg";
import './../../../style/configGuide.scss'
import './../../../style/configGuideDrag.scss'
import { ConfigDrag } from './../../components/configGuide/publicCom'
import {UpdateProgress} from './../../components/configGuide/updateProgress'
import {
    uploadConfigs_request,
    downloadConfigErr_request
} from './../../../request/page-room/configGuide.js'
import {cancelReq} from './../../../util/request'

export default withRouter(props => {
    const [updateStatus, setUpdateStatus] = useState(''); 
    const [progress, setProgress] = useState(0); 
    const [fileId, setFileId] = useState(0); 
    const fileUp = useRef();
    const guideList = [
        {
            icon: 'tishi',
            title: '向导说明',
            list: ['可不进行学生住宿信息上传，直接在本系统中操作学生住宿信息管理']
        },
        {
            icon: 'tishi',
            title: '学生住宿名单上传帮助说明',
            list: [
                '可在此处上传学生住宿信息，上传信息包含如下。为增量上传',
                '选填信息：（宿舍信息：学生房间分配信息，宿舍所属类型），（学生信息：手机号，性别，年级，班级）',
                '必填信息：学生姓名，证件号',
            ]
        }
    ];
    const explainList = [
        {
            icon: 'ruzhu',
            title: '办理入住',
            key: '0',
            to: '/home/room/studentCheckIn'
        },
        {
            icon: 'fenpei',
            title: '房间分配',
            key: '1',
            to: '/home/room/distributeManage'
        }
    ];

    /**
     * @desc 模板下载
     */
    const downloadTem = () => {
        let token = sessionStorage.getItem("token") || '';
        let orgcode = sessionStorage.getItem("orgcode") || '';
        var temWin=window.open(G.dataService + '/config/downloadTem?' +`token=${token}&orgCode=${orgcode}`  )
        setTimeout(() => {
            temWin.close();
        }, 500);
    }

    /**
     * @desc 文件上传
     * @param {object} file 需要上传的文件
     */
    const fileUpdate = files => {
        let params = {
            files
        }
        setUpdateStatus('3')
        uploadConfigs_request(
            params,
            res => {
                if (res.result) {
                    if(res.data.errId){
                        setFileId(res.data.errId)
                        setUpdateStatus('2')
                    } else {
                        setUpdateStatus('0')
                    }
                } else {
                    setUpdateStatus('1');
                    message.error(res.message || '上传失败！')
                }
                setProgress(0);
                document.getElementById('xqInput').value = ''
            }, 
            err => {
                if(err.message && err.message.isCancel){
                    // 手动中断
                    message.error(err.message.message)
                } else {
                    // 非手动中断
                    message.error(err || '上传失败！')
                }
                setUpdateStatus('1')
                setProgress(0);
                document.getElementById('xqInput').value = ''
            }, 
            pro => {
                setProgress(pro)
            }
        )
    }

    // 下载错误数据
    const downloadErr =() => {
        let param = {
            errId:fileId
        };
        downloadConfigErr_request(param);
    }

    return <div className='xq-guide-con'>
        <div className='xq-guide-name'>配置向导</div>

        {/* 向导说明 */}
        <DetailTem data={guideList[0]} />
        <div className='xq-guide-explain'>
            <ExplainTem data={explainList[0]} />
            <div className='xq-guide-explain-svg'>
                <SVG type={'jian11tou'} />
            </div>
            <ExplainTem data={explainList[1]} />
        </div>

        {/* 上传帮助说明 */}
        <DetailTem data={guideList[1]} />

        {/* 文件上传 */}
        <div className='xq-guide-upload'>
            <div className='xq-guide-upload-l'>
                <ConfigDrag
                    onUpload={files => fileUpdate(files)}
                    count={1}
                    formats={['xlsx','xls']}
                    clickRef={fileUp}
                    fileUpload={() => fileUpdate(fileUp.current.files)}
                    downloadTem={downloadTem}
                />
            </div>
            {/* 上传记录*/}
            <div className='xq-guide-upload-r'>
                {
                    updateStatus
                    ?<UpdateProgress 
                        status={updateStatus} 
                        progress={progress}
                        downloadErr={downloadErr}
                        cancelFunc={cancelReq} 
                    />
                    :''
                }
            </div>
        </div>
    </div>
})

const ExplainTem = props => {
    const hash = useHistory();
    return <div 
            className='xq-guide-explain-li' 
            style={{cursor:'pointer'}} 
            onClick={() => hash.push(props.data.to) }>
            <SVG type={props.data.icon} />
            {props.data.title}
        </div>
}

const DetailTem = props => {
    return <div className='xq-guide-detail'>
        <div className='xq-guide-detail-t'>
            <SVG type={props.data.icon} />
            {props.data.title}
        </div>
        <div className='xq-guide-detail-p'>
            {
                props.data.list.map((item, index) => {
                    return <div key={index}>{item}</div>
                })
            }
        </div>
    </div>
}
