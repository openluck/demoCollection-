/*
 * @Author: xq 
 * @Date: 2021-01-13 12:54:05 
 * @Last Modified by: xq
 * @Last Modified time: 2021-01-20 17:10:32
 * @desc 公共数据请求
 */
import { request as Ajax } from "./../util/request";

export const getUserInfo_request = (params = {}) => {
    return Ajax("public/getUserInfo", params).then( ({ data }) =>{
        return data
    });

    // 假数据
    const _res = {
        data:{
            "accountId":"admin",
        "accName":"admin",
        "accPwd":null,
        "oldPwd":null,
        "accTypeId":0,
        "accTypeIdList":[0],  // 角色权限字段['管理员 0','班主任 1','宿管 2'] 
        "user":{
            "userId":"",
            "userName":"admin",
            "sex":null,
            "telephone":null,
            "userType":null,
            "idCard":null,
            "idPhoto":null,
            "index":0,
            "belongAdminAgency":null,
            "orgInfos":null,
            "roleIdList":null,
            "orgCode":null,
            "status":null,
            "timestamp":null
        },
        "remarks":null,
        "accPtname":"超级管理员",
        "accNcname":null,
        "imgCloudId":"",
        "status":null,
        "timestamp":1610521815227,
        "absDateTime":1610525413000,
        "token":"DFAA74B3672D4C21AE3A9FEDC084EC72"
        },
        result:true,
        code:'-1',
        message:''
    }
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve(_res)
        },1000)
    })
};

export const getBuildTree_request = (params = {}) => {
    return Ajax("public/getBuildTree", params).then( ({ data }) => data);

    // 假数据
    const _res = {
        data:{
            buildTree:[
                { 
                    buildName:'东区', 
                    buildId:'1',
                    plaType:0,
                    childrenList:[
                        {
                            buildName:'第一栋有楼层',
                            buildId:'1-1',
                            plaType:1,
                            childrenList:[
                                {
                                    buildName:'01层',
                                    buildId:'1-1-1',
                                    plaType:2,
                                    childrenList:null
                                },
                                // {
                                //     buildName:'02层',
                                //     buildId:'1-1-2',
                                //     plaType:2
                                // }
                            ]
                        }
                        // {
                        //     buildName:'第二栋没楼层',
                        //     buildId:'1-2',
                        //     plaType:1,
                        //     childrenList:[]
                        // }
                    ]
                }
            ]
        },
        result:true,
        code:'-1',
        message:''
    }
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve(_res)
        },1000)
    })
}

export const getClassTree_request = (params = {}) => {
    return Ajax("public/getClassTree", params).then( ({ data }) => data);

    // 假数据
    const _res = {
        data:{
            list:[
                {
                    gradeName:'高一年级',
                    gradeId:'1',
                    children:[
                        { className:'1班', classId:'1-1'},
                        { className:'2班', classId:'1-2'},
                        { className:'3班', classId:'1-3'}
                    ]
                },
                {
                    gradeName:'高二年级',
                    gradeId:'2',
                    children:[
                        { className:'1班', classId:'2-1'},
                        { className:'2班', classId:'2-2'},
                        { className:'3班', classId:'2-3'}
                    ]
                }
            ]
        },
        result:true,
        code:'-1',
        message:''
    }
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve(_res)
        },1000)
    })
};