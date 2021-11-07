import {request as Ajax} from './../../util/request'
//获取设备
export const deviceList = (params={})=>{
    return Ajax("deviceManage/getList",params).then(({data})=>data);
}
//编辑设备
export const deviceEdit = (params={})=>{
    return Ajax("deviceManage/deviceEdit",params);
}
//删除设备
export const deviceDelete = (params={})=>{
    return Ajax("deviceManage/deviceDelete",params).then(({data})=>data);
}