import {request as Ajax,formRequest} from './../../util/request'
//房间规则-男女寝宿舍设置
//宿舍列表获取
export const getRoomList = (params={})=>{
    return Ajax("roomManage/roomList",params).then(({data})=>data);
}
//男女寝设置
export const setsRoomType = (params={})=>{
    return Ajax("roomManage/roomSet",params).then(({data})=>data);
    // return {data:'设置成功'}
}

//学生入住管理
//学生入住管理-搜索
export const stuManegeSearch = (params={})=>{
    return Ajax("roomManage/searchStu",params).then(({data})=>data);
}
//学生入住管理-批量退宿
export const stuManegeExit = (params={},scb, fcb, pro)=>{
    return formRequest("roomManage/stuExit", params, scb, fcb, pro);
}
//学生入住管理-批量删除
export const stuManegeDel = (params={},scb, fcb, pro)=>{
    return formRequest("roomManage/stuDel", params, scb, fcb, pro);
}
//学生入住管理-添加学生
export const stuManegeAdd = (params={})=>{
    return Ajax("roomManage/addStudents",params).then(({data})=>data);
}
//学生入住管理-当前住宿信息
export const stuManegeInfo = (params={})=>{
    return Ajax("roomManage/roomInfo",params).then(({data})=>data);
}
//学生入住管理-操作
export const stuManegeOpera = (params={})=>{
    return Ajax("roomManage/roomOperation",params).then(({data})=>data);
}

//房间分配管理
//首页列表获取
export const roomManageList = (params={})=>{
    return Ajax("roomManage/distributeRoomList",params).then(({data})=>data);
}
//首页搜索-搜索
export const roomManageSearch = (params={})=>{
    return Ajax("roomManage/indexSearch",params).then(({data})=>data);
}
//首页搜索-移入/移除
export const roomManageChange = (params={})=>{
    return Ajax("roomManage/roomIdConfirm",params).then(({data})=>data);
}
//根据楼栋id搜索寝室
export const roomManageRoom = (params={})=>{
    return Ajax("roomManage/quicklyBuildingTree",params).then(({data})=>data);
}
//快速分配年级
export const roomManageClassRoom = (params={})=>{
    return Ajax("roomManage/quicklyClassTree",params).then(({data})=>data);
}
//按寝室号分配-班级搜索
export const roomManageClassSearch = (params={})=>{
    // let datas = [
    //     {number:10,className:'一年级一班',classId:'1-1',list:[{idcard:123,stuName:'白安安'},{idcard:1234,stuName:'李潇潇'}]}
    // ]
    // return({dataList:datas,code:200})
    return Ajax("roomManage/asClassSearch",params).then(({data})=>data);
}
//快速分配-班级树
export const roomManageAsClassSel = (params={})=>{
    // let datas = [
    //         {gradeName:'一年级',gradeId:'a-2-1',children:[{classId:'a-2-1-1',className:'一班',number:12},{classId:'a-2-1-2',className:'二班',number:11}]},
    //         {gradeName:'二年级',gradeId:'b-2-2',children:[{classId:'b-2-2-1',className:'一班',number:13},{classId:'b-2-2-2',className:'二班',number:14}]}
    //     ]
    // return({data:{dataList:datas},code:200})
    return Ajax("roomManage/quicklyClassTree",params).then(({data})=>data);
}

//按寝室号分配-姓名搜索
export const roomManageNameSearch = (params={})=>{
    // let datas = [{idcard:123,stuName:'白安安1'},{idcard:1234,stuName:'李潇潇1'}]
    // return({dataList:datas,code:200})
    return Ajax("roomManage/asNameSearch",params).then(({data})=>data);
}
//根据寝室id搜索寝室人员信息
export const roomManageRoomInfo = (params={})=>{
    // let datas = {
    //     totalBedNum:6,
    //     freeBedNum:2,
    //     dataList:[
    //         {stuName:"白安安1"},
    //         {stuName:"白安安2"},
    //         {stuName:"白安安3"},
    //     ]
    // }
    // return {data:datas,code:200}
    return Ajax("roomManage/noBedStu",params).then(({data})=>data);
}
//快速分配-确认
export const distributeQuickConfirm = (params={})=>{
    return Ajax("roomManage/distributeQuickConfirm",params).then(({data})=>data);
}