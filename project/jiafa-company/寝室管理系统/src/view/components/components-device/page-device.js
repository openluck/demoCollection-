/*
 * @Author: yhc 
 * @Date: 2021-01-15 14:06:46 
 * @Last Modified by: yhc
 * @Last Modified time: 2021-03-24 16:54:05
 */
import React,{useEffect, useState,useLayoutEffect,useRef} from 'react'
import {Button,Radio,Checkbox,Drawer,Input,message,Empty } from 'antd'
import './../../../style/device.scss'
import {deviceList,deviceEdit,deviceDelete} from './../../../request/page-device/device-request'
import SVG from './../../public/public-component-svg'
export default function Transfers(props){
    const [deleteState,setDeleteState] = useState(false)
    const [deleteValue,setDeleteValue] = useState('ghost')
    const data = []
    const [dataList,setDataList] = useState([])
    //删除设备数据集
    const checkBox = useRef([])
    const [checkState,setCheckState] = useState([])
    const [drawerVisibile,setDrawerVisibile] = useState(false)
    const drawerData = useRef({})
    const deviceState = useRef(0)
    const deviceTime = useRef(0)
    const [itemIP,setItemIP] = useState('')
    const [deviceName,setDeviceName] = useState('')
    const [manageName,setManageName] = useState('')
    const [deviceId,setDeviceId] = useState(0) 
    const [deviceNames,setDeviceNames]= useState('')
    const [deviceManage,setDeviceManage] = useState('')
    function createList(){
       let list = dataList?.map((val,index)=>{ 
            return(
                <div key={index+'device'}  className='yhc-flex yhc-margin'>
                    <Checkbox onChange={(e)=>{
                        let checkArr = [...checkState]
                        checkArr[index].state = !checkArr[index].state
                        setCheckState(checkArr)
                        if(e.target.checked){
                            checkBox.current.push(val)
                        }
                        else{
                           checkBox.current = checkBox.current.filter((value,index)=>{
                                if(val.deviceId == value.deviceId){
                                    return false
                                }
                                else return true
                            })
                        }
                        console.log(checkBox.current)

                    }} style={{marginRight:'10px',marginBottom:"20px"}} checked={checkState[index]?.state} className={deleteState?null:'yhc-checkBox'}></Checkbox>
                    <div className='yhc-device'>
                            <div style={{width:'100%'}}>
                                <div className='yhc-dot'>
                                    <div style={{height:0,width:0,borderRadius:'50%',border:'2px solid gray'}}></div>
                                </div>
                                <div className="yhc-device-item">
                                    <span style={{width:'100%',display:'flex',alignContent:'center',flexWrap:'wrap',height:'100%',justifyContent:'center',textAlign:'center',wordBreak:'break-all'}}>{val.deviceName}</span>
                                </div>                        
                            </div>
                            <div className='yhc-flex' style={{width:'100%'}}>
                                <div className='yhc-flex'><Radio className={val.deviceState?'limegreen':'red'} style={{color:"limegreen"}} size="small" checked={true}/>{val.deviceState == 0?<span style={{color:'tomato'}}>离线</span>:val.deviceState == 1?<span style={{color:'limegreen'}}>在线</span>:'--'}</div>
                                <div style={{color:'gray',cursor:'pointer'}} onClick={()=>{
                                    deviceTime.current=val.deviceTime;setDrawerVisibile(true);
                                    drawerData.current=val;deviceState.current=val.deviceState
                                    setItemIP(val.deviceIP);
                                    setDeviceId(val.deviceId)
                                    setDeviceNames(val.deviceName)
                                    setDeviceManage(val.deviceManager)
                                    setDeviceName(val.deviceName)
                                    setManageName(val.deviceManager)
                                    }} style={{display:'flex',alignItems:'center'}}>
                                    <SVG type='bianji' style={{width:'14px',height:'14px',color:"black",marginRight:'4px',cursor:'pointer'}} /><span style={{display:"inline-block",cursor:'pointer'}}> 编辑</span>
                                </div>
                            </div>
                        </div>                    
                </div>
 
            )
        })
        return list
    }
    function checkBoxState(){
     
    }
    async function getDeviceList(){
        let res = await deviceList()
               let arr = []         
        if(res.code == 200){
            if(res.data.dataList?.length){
                setDataList(res.data.dataList)            
                res.data.dataList.map((val,index)=>{
                    arr.push({state:false})
                })
            }            
        }
        else{
            message.warn(res.message)
        }
        setCheckState(arr)           
        console.log(res)
    }
    function onClose(){
        setDrawerVisibile(false)
        setState()
    }
    async function edits(obj){
        let res =await deviceEdit(obj)
        console.log(res)
        if(res.data.code == 200){
            getDeviceList()
        }
        else{
            message.warn(res.data.message)
        }
    }
    async function deletes(arr){
        let res = await deviceDelete(arr)
        console.log(res)
        if(res.code == 200){
            checkBox.current = []
            getDeviceList()
        }
        else{
            message.warn(res.message)
        }
    }
    function setState(){
        setManageName('')
        setDeviceName('')
    }
    useLayoutEffect(()=>{
        getDeviceList()
    },[])
    useEffect(()=>{
        checkBoxState()
    },[])
    return(
        <div className='yhc-setDevice'>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:"center"}}>
                <div style={{fontSize:"16px",padding:'0px 0px 0px 24px'}}>设备管理</div>
                <Button style={{borderRadius:'4px'}} danger={deleteState} onClick={()=>{
                    if(deleteState){
                        setDeleteState(false)
                        setDeleteValue('ghost')
                        checkBoxState()
                        if(checkBox.current.length){
                            let arr = []
                            checkBox.current.map((val,index)=>{
                                let obj = val.deviceId
                                arr.push(obj)
                            })
                            deletes({deviceId:arr})                            
                        }
                        else{
                            message.warn('删除设备不能为空')
                        }
                    }
                    else{
                        setDeleteValue('primary')  
                        setDeleteState(true)                      
                    }
                }} type={deleteValue} style={{marginRight:'20px',display:'flex',alignItems:"center"}} icon={<SVG type='shanchu' style={{height:"13px",width:'13px',color:'black'}} />}>删除</Button>
            </div>
            <div className='yhc-device-block'>
                {
                    dataList.length?
                    createList()
                    :
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}></Empty>
                }
            </div>
                <Drawer 
                maskClosable={false}
                closable={true}
                footer={<div style={{display:'flex',justifyContent:'center'}}>
                     <Button style={{marginRight:'20px'}} type='primary' onClick={()=>{                          
                         let obj = {
                            deviceId:deviceId,
                            deviceName:deviceName?deviceName?.trim():deviceNames?.trim(),
                            deviceManager:manageName?manageName?.trim():deviceManage?.trim()
                         }
                         if(deviceName&&manageName){
                             setDrawerVisibile(false);
                             setState()                        
                             edits(obj)
                         }
                         else{
                             message.warn('设备名称或管理人员不能为空')
                         }                     
                        //  console.log(obj)
                         }}>确认</Button>
                     <Button type='primary' onClick={()=>{setDrawerVisibile(false);setState()}}>取消</Button>
                 </div>} title='设备名称'  getContainer={false} style={{position:"absolute"}} onClose={onClose} visible={drawerVisibile}>
                    <div style={{padding:'0px 0px 0px 20px'}}>
                        <div>
                            <div style={{borderBottom:'1px solid #dddddd'}}>
                                <div className='yhc-deviceInfo'>设备信息</div>
                            </div>
                            <div className='yhc-deviceInfoInput'>
                                <div>
                                    <span>设备IP：</span>  <Input disabled value={itemIP} style={{width:'80%'}} placeholder='默认展示IP地址'></Input>
                                </div>                                    
                                <div>
                                    <span>设备名称：</span><Input value={deviceName} onChange={(e)=>{                                      
                                        e.persist();
                                        let length = e.target.value.split('').length
                                        if(length>44){
                                            message.warn('最长输入为44个字符')
                                        }
                                        else{
                                            setDeviceName(e.target.value)
                                        }  
                                    }} style={{width:'80%'}} placeholder={deviceNames}></Input>                                    
                                </div>
                                <div>
                                    <span>管理人员：</span><Input value={manageName} onChange={(e)=>{                            
                                    e.persist();
                                    let length = e.target.value.split('').length
                                    if(length>50){
                                        message.warn('最长输入为50个字符')
                                    }
                                    else{
                                        setManageName(e.target.value);
                                    }
                                    }} style={{width:'80%'}} placeholder={deviceManage}></Input>                                    
                                </div>
                            </div>
                        </div>
                        <div>
                            <div style={{borderBottom:'1px solid #dddddd'}}>
                                <div className='yhc-deviceInfo'>设备配置</div>
                            </div>
                            <div className='yhc-deviceInfoSet'>
                                <div>
                                    <Checkbox checked={true} disabled>在寝管理</Checkbox>
                                    <p style={{paddingLeft:'25px'}}>统一场所在寝检查只可存在一份数据，如两种设备同时开启，则以班牌为准</p>
                                </div>                                    
                            </div>
                        </div>
                        <div>
                            <div style={{borderBottom:'1px solid #dddddd'}}>
                                <div className='yhc-deviceInfo'>运行状态</div>
                            </div>
                            <div className='yhc-deviceInfoSet'>
                                <div>
                                    <span style={{marginRight:'8px'}}>在线情况：<span>{deviceTime.current}</span></span>
                                    <Radio className={deviceState.current?'limegreen':'red'} style={{color:"limegreen"}} size="small" checked={true}/>                          
                                    <span style={{marginLeft:'-4px'}}>{deviceState.current?'在线':'离线'}</span>
                                </div>                                    
                            </div>
                        </div>
                    </div>
                </Drawer>                
        </div>
    )
}