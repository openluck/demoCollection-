const Mock = require('mockjs')
const Random = Mock.Random;

let getMockData = function () {
    let data = {
        statusCode: 200,
        list: {
            token: 'mocktoken',
            examId: 'mockexamid'
        },

    }

    return data;
}
let getSystemConf = function () {
    let data = {
        code: '200',
        message: 'success',
        result: true,
        version: '1.0.0',
        data: {
            paperbagSpecification: [
                {
                    id: '01',
                    name: '1'
                },
                {
                    id: '02',
                    name: '10'
                },
                {
                    id: '03',
                    name: '30'
                }
            ],
            signSwitch: true,
            equipType: 1,
            escortStatus: [
                {
                    id: '01',
                    name: '正常'
                },
                {
                    id: '02',
                    name: '异常'
                }
            ],
            functionStatus: {
                paperDemand: true,
                escort: true,
                duty: false
            },
            alarmType: [
                {
                    id: '01',
                    name: '超时'
                },
                {
                    id: '02',
                    name: '轨迹偏离'
                }
            ]
            ,
        },

    }

    return data
}

let checkToken = function () {
    let data = {
        code: '200',
        message: 'success',
        result: true,
        version: '1.0.0',
        data: {
            accountname: 'user1',
            application: [],
            dep_id: '211112',
            userid: '',
            role: [
                {
                    authority: []
                },
                {
                    examprojectid: []
                },
                {
                    exid: []
                },
                {
                    role_code: '角色代码'
                },
                {
                    role_name: '角色名称'
                }

            ]

        }
    }
    return data;
}
let getEscortCameraDevice = function () {
    let data = {
        code: '200',
        message: 'success',
        result: true,
        version: '1.0.0',
        data: [
            {
                deviceId: '111', //一体机，
                channelNum: 1,
                devType: '606',
                device_name: '一体机'
            },
            {
                deviceId: '222',//摄像头1
                channelNum: 1,
                devType: '605',
                device_name: '摄像机'
            },
            {
                deviceId: '555', //车载
                channelNum: 3,
                devType: '603',
                device_name: '车载设备'
            }
        ]
    }
    return data;
}

//  Mock.mock('/getSSO', 'get', getMockData);
// Mock.mock('/getSystemConf', 'post', getSystemConf);
Mock.mock('/getEscortCameraDevice', 'post', getEscortCameraDevice);