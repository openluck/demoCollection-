const Mock = require('mockjs')

// const getUserInfo1 = function() {
//     const data = {
//         result: true,
//         code: "200",
//         message: "查询成功",
//         data: {
//             menuList: "[{\"id\":502,\"icons\":\"jigou\",\"title\":\"机构应用111\",\"path\":\"AgencyApplication\",\"scopedSlots\":{\"title\":\"custom\"},\"children\":[{\"id\":2785,\"title\":\"机构和账户\",\"path\":\"/AgencyApplication/AgencyAccount\",\"scopedSlots\":{\"title\":\"custom\"}},{\"id\":7918,\"title\":\"应用管理\",\"path\":\"/AgencyApplication/ApplicationManagement\",\"scopedSlots\":{\"title\":\"custom\"}},{\"id\":2263,\"title\":\"应用通知公告\",\"path\":\"/AgencyApplication/ApplicationAnnouncements\",\"scopedSlots\":{\"title\":\"custom\"}},{\"id\":9000,\"title\":\"三方应用信息\",\"path\":\"/AgencyApplication/ApplicationMessage\",\"scopedSlots\":{\"title\":\"custom\"}}]},{\"id\":2322,\"icons\":\"InfoManage\",\"title\":\"信息管理\",\"path\":\"InfoManage\",\"scopedSlots\":{\"title\":\"custom\"},\"children\":[{\"id\":7052,\"title\":\"新闻资讯\",\"path\":\"/InfoManage/NewsInformation\",\"scopedSlots\":{\"title\":\"custom\"}},{\"id\":7109,\"title\":\"通知公告\",\"path\":\"/InfoManage/Announcements\",\"scopedSlots\":{\"title\":\"custom\"}},{\"id\":1846,\"title\":\"意见反馈\",\"path\":\"/InfoManage/Feedback\",\"scopedSlots\":{\"title\":\"custom\"}},{\"id\":361,\"title\":\"短信推送\",\"path\":\"/InfoManage/SMSPush\",\"scopedSlots\":{\"title\":\"custom\"}},{\"id\":9449,\"title\":\"消息推送\",\"path\":\"/InfoManage/MessagePush\",\"scopedSlots\":{\"title\":\"custom\"}},{\"id\":1568,\"title\":\"移动端BANNER\",\"path\":\"/InfoManage/MobileBanner\",\"scopedSlots\":{\"title\":\"custom\"}},{\"id\":9270,\"title\":\"移动端广告页\",\"path\":\"/InfoManage/MobileAdvertising\",\"scopedSlots\":{\"title\":\"custom\"}},{\"id\":6471,\"title\":\"关于我们\",\"path\":\"/InfoManage/AboutUs\",\"scopedSlots\":{\"title\":\"custom\"}}]},{\"id\":5585,\"icons\":\"UserManagement\",\"title\":\"用户管理\",\"path\":\"UserManagement\",\"scopedSlots\":{\"title\":\"custom\"},\"children\":[{\"id\":3608,\"title\":\"移动端用户管理\",\"path\":\"/UserManagement/MobileUser\",\"scopedSlots\":{\"title\":\"custom\"}},{\"id\":1633,\"title\":\"移动端实名认证\",\"path\":\"/UserManagement/MobileCertify\",\"scopedSlots\":{\"title\":\"custom\"}},{\"id\":4189,\"title\":\"WEB端用户管理\",\"path\":\"/UserManagement/WebUser\",\"scopedSlots\":{\"title\":\"custom\"}}]},{\"id\":2708,\"icons\":\"ApiManagement\",\"title\":\"API管理\",\"path\":\"ApiManagement\",\"scopedSlots\":{\"title\":\"custom\"},\"children\":[{\"id\":8258,\"title\":\"开放API管理\",\"path\":\"/ApiManagement/OpenApi\",\"scopedSlots\":{\"title\":\"custom\"}},{\"id\":6527,\"title\":\"API调用记录\",\"path\":\"/ApiManagement/ApiCallRecords\",\"scopedSlots\":{\"title\":\"custom\"}}]},{\"id\":4287,\"icons\":\"gengxin\",\"title\":\"APP更新\",\"path\":\"AppUpdate\",\"scopedSlots\":{\"title\":\"custom\"},\"children\":[{\"id\":631,\"title\":\"APP更新\",\"path\":\"/AppUpdate/AppUpdate\",\"scopedSlots\":{\"title\":\"custom\"}}]},{\"id\":9877,\"icons\":\"xitong\",\"title\":\"系统管理\",\"path\":\"SystemManagement\",\"scopedSlots\":{\"title\":\"custom\"},\"children\":[{\"id\":3514,\"title\":\"码表管理\",\"path\":\"/SystemManagement/CodeTable\",\"scopedSlots\":{\"title\":\"custom\"}},{\"id\":6445,\"title\":\"角色管理\",\"path\":\"/SystemManagement/Role\",\"scopedSlots\":{\"title\":\"custom\"}},{\"id\":1539,\"title\":\"敏感词库\",\"path\":\"/SystemManagement/SensitiveWord\",\"scopedSlots\":{\"title\":\"custom\"}},{\"id\":3857,\"title\":\"行为日志\",\"path\":\"/SystemManagement/ActionLog\",\"scopedSlots\":{\"title\":\"custom\"}},{\"id\":9137,\"title\":\"个人中心\",\"path\":\"/SystemManagement/PersonalCenter\",\"scopedSlots\":{\"title\":\"custom\"}}]}]",
//             gender: "2",
//             nickName: "2020年10月27日11:11:56",
//             contactName: "测试",
//             remark: "2020年9月4日14:05:0423",
//             permission: "[[[\"platformStats01\",\"platformStats02\",\"platformStats03\",\"platformStats04\",\"platformStats05\",\"platformStats06\",\"platformStats07\",\"platformStats08\",\"platformStats09\",\"platformStats10\"]],[[\"agencyAccount_add\",\"agencyAccount_search\",\"agencyAccount_edit\",\"agencyAccount_delete\",\"agencyAccount_list\"],[\"ApplicationManagement_add\",\"ApplicationManagement_search\",\"ApplicationManagement_list\",\"ApplicationManagement_edit\",\"ApplicationManagement_key\",\"ApplicationManagement_setting\",\"ApplicationManagement_delete\"],[\"ApplicationAnnouncements_batchDelete\",\"ApplicationAnnouncements_search\",\"ApplicationAnnouncements_edit\",\"ApplicationAnnouncements_Delete\",\"ApplicationAnnouncements_list\"],[\"ApplicationMessage_list\",\"ApplicationMessage_delete\"]],[[\"NewsInformation_list\",\"NewsInformation_add\",\"NewsInformation_delete\"],[\"Announcements_list\",\"Announcements_add\",\"Announcements_delete\"],[\"Feedback_list\",\"Feedback_edit\",\"Feedback_delete\"],[\"SMSPush_list\",\"SMSPush_add\",\"SMSPush_info\",\"SMSPush_delete\"],[\"MessagePush_list\",\"MessagePush_add\",\"MessagePush_info\",\"MessagePush_delete\"],[\"banner_create\",\"banner_delete\",\"banner_edit\",\"banner_list\",\"banner_changeState\",\"banner_changeOrder\"],[\"AD_create\",\"AD_delete\",\"AD_edit\",\"AD_serach\",\"AD_list\",\"AD_changeState\"],[\"getIntroduce\",\"getServiceAgreement\",\"getPrivacyPolicy\",\"getEULA\",\"updateIntroduce\",\"updateServiceAgreement\",\"updatePrivacyPolicy\",\"updateEULA\"]],[[\"appUser_create\",\"appUser_delete\",\"appUser_edit\",\"appUser_search\",\"appUser_list\",\"appUser_logList\",\"appUser_authList\",\"appUser_authDelete\"],[\"nameAuth_create\",\"nameAuth_edit\",\"nameAuth_list\"],[\"WebUser_list\",\"WebUser_search\",\"WebUser_add\",\"WebUser_edit\",\"WebUser_delete\"]],[[\"API_list\",\"API_search\",\"API_add\",\"API_startAndStop\",\"API_delete\",\"API_edit\"],[\"ApiCallRecords_list\",\"ApiCallRecords_info\"]],[[\"APP_list\",\"APP_search\",\"APP_add\",\"APP_startAndStop\",\"APP_delete\",\"APP_edit\"]],[[\"CodeTable_list\",\"CodeTable_search\",\"CodeTable_add\",\"CodeTable_delete\",\"CodeTable_edit\"],[\"role_add\",\"role_refresh\",\"role_list\",\"role_changeStatus\",\"role_edit\",\"role_delete\"],[\"SensitiveWord_list\",\"SensitiveWord_add\",\"SensitiveWord_update\",\"SensitiveWord_statusUpdate\",\"SensitiveWord_getbatchStatus\",\"SensitiveWord_downloadForm\",\"SensitiveWord_batchAdd\",\"SensitiveWord_delete\",\"SensitiveWord_toggle\"],[\"ActionLog_list\",\"ActionLog_info\"],[\"PersonalCenter_edit\"]]]",
//             userId: "1",
//             realName: "测试",
//             password: "admin123",
//             phoneNumber: "15982823757",
//             PASSWORD: "admin123",
//             ownPermission: "[[[\"platformStats01\",\"platformStats02\",\"platformStats03\",\"platformStats04\",\"platformStats05\",\"platformStats06\",\"platformStats07\",\"platformStats08\",\"platformStats09\",\"platformStats10\"]],[[\"agencyAccount_add\",\"agencyAccount_search\",\"agencyAccount_edit\",\"agencyAccount_delete\",\"agencyAccount_list\"],[\"ApplicationManagement_add\",\"ApplicationManagement_search\",\"ApplicationManagement_list\",\"ApplicationManagement_edit\",\"ApplicationManagement_key\",\"ApplicationManagement_setting\",\"ApplicationManagement_delete\"],[\"ApplicationAnnouncements_batchDelete\",\"ApplicationAnnouncements_search\",\"ApplicationAnnouncements_edit\",\"ApplicationAnnouncements_Delete\",\"ApplicationAnnouncements_list\"],[\"ApplicationMessage_list\",\"ApplicationMessage_delete\"]],[[\"NewsInformation_list\",\"NewsInformation_add\",\"NewsInformation_delete\"],[\"Announcements_list\",\"Announcements_add\",\"Announcements_delete\"],[\"Feedback_list\",\"Feedback_edit\",\"Feedback_delete\"],[\"SMSPush_list\",\"SMSPush_add\",\"SMSPush_info\",\"SMSPush_delete\"],[\"MessagePush_list\",\"MessagePush_add\",\"MessagePush_info\",\"MessagePush_delete\"],[\"banner_create\",\"banner_delete\",\"banner_edit\",\"banner_list\",\"banner_changeState\",\"banner_changeOrder\"],[\"AD_create\",\"AD_delete\",\"AD_edit\",\"AD_serach\",\"AD_list\",\"AD_changeState\"],[\"getIntroduce\",\"getServiceAgreement\",\"getPrivacyPolicy\",\"getEULA\",\"updateIntroduce\",\"updateServiceAgreement\",\"updatePrivacyPolicy\",\"updateEULA\"]],[[\"appUser_create\",\"appUser_delete\",\"appUser_edit\",\"appUser_search\",\"appUser_list\",\"appUser_logList\",\"appUser_authList\",\"appUser_authDelete\"],[\"nameAuth_create\",\"nameAuth_edit\",\"nameAuth_list\"],[\"WebUser_list\",\"WebUser_search\",\"WebUser_add\",\"WebUser_edit\",\"WebUser_delete\"]],[[\"API_list\",\"API_search\",\"API_add\",\"API_startAndStop\",\"API_delete\",\"API_edit\"],[\"ApiCallRecords_list\",\"ApiCallRecords_info\"]],[[\"APP_list\",\"APP_search\",\"APP_add\",\"APP_startAndStop\",\"APP_delete\",\"APP_edit\"]],[[\"CodeTable_list\",\"CodeTable_search\",\"CodeTable_add\",\"CodeTable_delete\",\"CodeTable_edit\"],[\"role_add\",\"role_refresh\",\"role_list\",\"role_changeStatus\",\"role_edit\",\"role_delete\"],[\"SensitiveWord_list\",\"SensitiveWord_add\",\"SensitiveWord_update\",\"SensitiveWord_statusUpdate\",\"SensitiveWord_getbatchStatus\",\"SensitiveWord_downloadForm\",\"SensitiveWord_batchAdd\",\"SensitiveWord_delete\",\"SensitiveWord_toggle\"],[\"ActionLog_list\",\"ActionLog_info\"],[\"PersonalCenter_edit\"]]]",
//             roleKey: 1,
//             roleName: "超级管理员",
//             account: "admin",
//             email: "123456@123.com"
//         },
//         version: "v1.00",
//         total: 0
//     }
//     return data;
// };


// 修改
const getUserInfo = function() {
    const data = {
        result: true,
        code: "200",
        message: "查询成功",
        // data: {},
        data: {
            // menuListL: "[]",
            menuList: "[{\"id\":502,\"icons\":\"jigou\",\"title\":\"功能1\",\"path\":\"AgencyApplication\",\"scopedSlots\":{\"title\":\"custom\"},\"children\":[{\"id\":2785,\"title\":\"机构和账户\",\"path\":\"/AgencyApplication/AgencyAccount\",\"scopedSlots\":{\"title\":\"custom\"}},{\"id\":9000,\"title\":\"三方应用信息\",\"path\":\"/AgencyApplication/ApplicationMessage\",\"scopedSlots\":{\"title\":\"custom\"}}]},{\"id\":9877,\"icons\":\"xitong\",\"title\":\"功能2\",\"path\":\"SystemManagement\",\"scopedSlots\":{\"title\":\"custom\"},\"children\":[{\"id\":1539,\"title\":\"敏感词库\",\"path\":\"/SystemManagement/SensitiveWord\",\"scopedSlots\":{\"title\":\"custom\"}}]},{\"id\":9899,\"icons\":\"xitong\",\"title\":\"大屏\",\"path\":\"BigScreen\",\"scopedSlots\":{\"title\":\"custom\"},\"children\":[{\"id\":1539,\"title\":\"大屏\",\"path\":\"/BigScreen/BigScreen\",\"scopedSlots\":{\"title\":\"custom\"}}]}]",
            gender: "2",
            nickName: "2020年10月27日11:11:56",
            contactName: "测试",
            remark: "2020年9月4日14:05:0423",
            permission: "[[[\"platformStats01\",\"platformStats02\",\"platformStats03\",\"platformStats04\",\"platformStats05\",\"platformStats06\",\"platformStats07\",\"platformStats08\",\"platformStats09\",\"platformStats10\"]],[[\"agencyAccount_add\",\"agencyAccount_search\",\"agencyAccount_edit\",\"agencyAccount_delete\",\"agencyAccount_list\"],[\"ApplicationManagement_add\",\"ApplicationManagement_search\",\"ApplicationManagement_list\",\"ApplicationManagement_edit\",\"ApplicationManagement_key\",\"ApplicationManagement_setting\",\"ApplicationManagement_delete\"],[\"ApplicationAnnouncements_batchDelete\",\"ApplicationAnnouncements_search\",\"ApplicationAnnouncements_edit\",\"ApplicationAnnouncements_Delete\",\"ApplicationAnnouncements_list\"],[\"ApplicationMessage_list\",\"ApplicationMessage_delete\"]],[[\"NewsInformation_list\",\"NewsInformation_add\",\"NewsInformation_delete\"],[\"Announcements_list\",\"Announcements_add\",\"Announcements_delete\"],[\"Feedback_list\",\"Feedback_edit\",\"Feedback_delete\"],[\"SMSPush_list\",\"SMSPush_add\",\"SMSPush_info\",\"SMSPush_delete\"],[\"MessagePush_list\",\"MessagePush_add\",\"MessagePush_info\",\"MessagePush_delete\"],[\"banner_create\",\"banner_delete\",\"banner_edit\",\"banner_list\",\"banner_changeState\",\"banner_changeOrder\"],[\"AD_create\",\"AD_delete\",\"AD_edit\",\"AD_serach\",\"AD_list\",\"AD_changeState\"],[\"getIntroduce\",\"getServiceAgreement\",\"getPrivacyPolicy\",\"getEULA\",\"updateIntroduce\",\"updateServiceAgreement\",\"updatePrivacyPolicy\",\"updateEULA\"]],[[\"appUser_create\",\"appUser_delete\",\"appUser_edit\",\"appUser_search\",\"appUser_list\",\"appUser_logList\",\"appUser_authList\",\"appUser_authDelete\"],[\"nameAuth_create\",\"nameAuth_edit\",\"nameAuth_list\"],[\"WebUser_list\",\"WebUser_search\",\"WebUser_add\",\"WebUser_edit\",\"WebUser_delete\"]],[[\"API_list\",\"API_search\",\"API_add\",\"API_startAndStop\",\"API_delete\",\"API_edit\"],[\"ApiCallRecords_list\",\"ApiCallRecords_info\"]],[[\"APP_list\",\"APP_search\",\"APP_add\",\"APP_startAndStop\",\"APP_delete\",\"APP_edit\"]],[[\"CodeTable_list\",\"CodeTable_search\",\"CodeTable_add\",\"CodeTable_delete\",\"CodeTable_edit\"],[\"role_add\",\"role_refresh\",\"role_list\",\"role_changeStatus\",\"role_edit\",\"role_delete\"],[\"SensitiveWord_list\",\"SensitiveWord_add\",\"SensitiveWord_update\",\"SensitiveWord_statusUpdate\",\"SensitiveWord_getbatchStatus\",\"SensitiveWord_downloadForm\",\"SensitiveWord_batchAdd\",\"SensitiveWord_delete\",\"SensitiveWord_toggle\"],[\"ActionLog_list\",\"ActionLog_info\"],[\"PersonalCenter_edit\"]]]",
            userId: "1",
            realName: "测试",
            password: "admin123",
            phoneNumber: "15982823757",
            PASSWORD: "admin123",
            ownPermission: "[[[\"platformStats01\",\"platformStats02\",\"platformStats03\",\"platformStats04\",\"platformStats05\",\"platformStats06\",\"platformStats07\",\"platformStats08\",\"platformStats09\",\"platformStats10\"]],[[\"agencyAccount_add\",\"agencyAccount_search\",\"agencyAccount_edit\",\"agencyAccount_delete\",\"agencyAccount_list\"],[\"ApplicationManagement_add\",\"ApplicationManagement_search\",\"ApplicationManagement_list\",\"ApplicationManagement_edit\",\"ApplicationManagement_key\",\"ApplicationManagement_setting\",\"ApplicationManagement_delete\"],[\"ApplicationAnnouncements_batchDelete\",\"ApplicationAnnouncements_search\",\"ApplicationAnnouncements_edit\",\"ApplicationAnnouncements_Delete\",\"ApplicationAnnouncements_list\"],[\"ApplicationMessage_list\",\"ApplicationMessage_delete\"]],[[\"NewsInformation_list\",\"NewsInformation_add\",\"NewsInformation_delete\"],[\"Announcements_list\",\"Announcements_add\",\"Announcements_delete\"],[\"Feedback_list\",\"Feedback_edit\",\"Feedback_delete\"],[\"SMSPush_list\",\"SMSPush_add\",\"SMSPush_info\",\"SMSPush_delete\"],[\"MessagePush_list\",\"MessagePush_add\",\"MessagePush_info\",\"MessagePush_delete\"],[\"banner_create\",\"banner_delete\",\"banner_edit\",\"banner_list\",\"banner_changeState\",\"banner_changeOrder\"],[\"AD_create\",\"AD_delete\",\"AD_edit\",\"AD_serach\",\"AD_list\",\"AD_changeState\"],[\"getIntroduce\",\"getServiceAgreement\",\"getPrivacyPolicy\",\"getEULA\",\"updateIntroduce\",\"updateServiceAgreement\",\"updatePrivacyPolicy\",\"updateEULA\"]],[[\"appUser_create\",\"appUser_delete\",\"appUser_edit\",\"appUser_search\",\"appUser_list\",\"appUser_logList\",\"appUser_authList\",\"appUser_authDelete\"],[\"nameAuth_create\",\"nameAuth_edit\",\"nameAuth_list\"],[\"WebUser_list\",\"WebUser_search\",\"WebUser_add\",\"WebUser_edit\",\"WebUser_delete\"]],[[\"API_list\",\"API_search\",\"API_add\",\"API_startAndStop\",\"API_delete\",\"API_edit\"],[\"ApiCallRecords_list\",\"ApiCallRecords_info\"]],[[\"APP_list\",\"APP_search\",\"APP_add\",\"APP_startAndStop\",\"APP_delete\",\"APP_edit\"]],[[\"CodeTable_list\",\"CodeTable_search\",\"CodeTable_add\",\"CodeTable_delete\",\"CodeTable_edit\"],[\"role_add\",\"role_refresh\",\"role_list\",\"role_changeStatus\",\"role_edit\",\"role_delete\"],[\"SensitiveWord_list\",\"SensitiveWord_add\",\"SensitiveWord_update\",\"SensitiveWord_statusUpdate\",\"SensitiveWord_getbatchStatus\",\"SensitiveWord_downloadForm\",\"SensitiveWord_batchAdd\",\"SensitiveWord_delete\",\"SensitiveWord_toggle\"],[\"ActionLog_list\",\"ActionLog_info\"],[\"PersonalCenter_edit\"]]]",
            roleKey: 1,
            roleName: "超级管理员",
            account: "admin",
            email: "123456@123.com"
        },
        version: "v1.00",
        total: 0
    }
    return data;
};
const login = function() {
    const data = {
        code: "200",
        data: "749a6f86911e3cf61ec591d074cc81e0",
        message: "登录成功",
        result: true,
        total: 0
    }
    return data;
};
//角色管理
const roleList = function() {
    const data = {
        code: '200',
        message: 'success',
        result: true,
        data: {
            list: [{
                roleName: "超级管理员",
                roleId: '1',
                ownPermission: "权限一，权限二",
                remark: "超级管理员超级管理员",
                status: '1'
            }, {
                roleName: "超级管理员",
                roleId: '2',
                ownPermission: "权限一，权限二",
                remark: "超级管理员超级管理员",
                status: '1'
            }, {
                roleName: "超级管理员",
                roleId: '3',
                ownPermission: "权限一，权限二",
                remark: "超级管理员超级管理员",
                status: '1'
            }, {
                roleName: "超级管理员",
                roleId: '4',
                ownPermission: "权限一，权限二",
                remark: "超级管理员超级管理员",
                status: '1'
            }],
            total: 100
        }
    }
    return data;
};

//获取敏感词列表
const SensitiveWord = function() {
    const data = {
        code: '200',
        message: 'success',
        result: true,
        data: {
            list: [{
                sensitiveId: '1',
                sensitiveWord: "敏感词1",
                belongToLexicon: '低俗色情',
                sensitiveLevel: "警告词（中等）",
                status: '1',
                hitCounts: '101',
                updateTime: "2020-8-10 14:00"
            }, {
                sensitiveId: '2',
                sensitiveWord: "敏感词1",
                belongToLexicon: '低俗色情',
                sensitiveLevel: "警告词（中等）",
                status: '1',
                hitCounts: '101',
                updateTime: "2020-8-10 14:00"
            }, {
                sensitiveId: '3',
                sensitiveWord: "敏感词1",
                belongToLexicon: '低俗色情',
                sensitiveLevel: "警告词（中等）",
                status: '1',
                hitCounts: '101',
                updateTime: "2020-8-10 14:00"
            }, {
                sensitiveId: '4',
                sensitiveWord: "敏感词1",
                belongToLexicon: '低俗色情',
                sensitiveLevel: "警告词（中等）",
                status: '1',
                hitCounts: '101',
                updateTime: "2020-8-10 14:00"
            }, {
                sensitiveId: '5',
                sensitiveWord: "敏感词1",
                belongToLexicon: '低俗色情',
                sensitiveLevel: "警告词（中等）",
                status: '1',
                hitCounts: '101',
                updateTime: "2020-8-10 14:00"
            }],
            total: 100
        }
    }
    return data;
};
//获取敏感词批量状态
const getbatchStatus = function() {
    const data = {
        code: '200',
        message: 'success',
        result: true,
        data: {
            list: [{
                lexicon: '低俗色情',
                lexiconId: '1',
                sensitiveWordLevel: '1',
                switch: true
            }, {
                lexicon: '低俗色情',
                lexiconId: '2',
                sensitiveWordLevel: '2',
                switch: false
            }, {
                lexicon: '低俗色情',
                lexiconId: '3',
                sensitiveWordLevel: '3',
                switch: false
            },
            {
                lexicon: '政治非法',
                lexiconId: '4',
                sensitiveWordLevel: '1',
                switch: true
            },
            {
                lexicon: '政治非法',
                lexiconId: '5',
                sensitiveWordLevel: '2',
                switch: false
            },
            {
                lexicon: '政治非法',
                lexiconId: '6',
                sensitiveWordLevel: '3',
                switch: true
            },
            {
                lexicon: '网络媒体',
                lexiconId: '7',
                sensitiveWordLevel: '1',
                switch: false
            },
            {
                lexicon: '网络媒体',
                lexiconId: '8',
                sensitiveWordLevel: '2',
                switch: false
            }, {
                lexicon: '网络媒体',
                lexiconId: '9',
                sensitiveWordLevel: '3',
                switch: false
            },
            {
                lexicon: '网络媒体',
                lexiconId: '7',
                sensitiveWordLevel: '1',
                switch: false
            },
            {
                lexicon: '网络媒体',
                lexiconId: '8',
                sensitiveWordLevel: '2',
                switch: false
            }, {
                lexicon: '网络媒体',
                lexiconId: '9',
                sensitiveWordLevel: '3',
                switch: false
            }
        ],
            total: 100
        }
    }
    return data;
};

const getClassifyPermissionList = function() {
    const data = {
        code: '200',
        message: 'success',
        result: true,
        data: [
            {
                permisssionType: "权限组0",
                permissionLIst: [
                    {
                        roleId: '',
                        roleName: '权限一',
                        isChecked: true
                    },
                    {
                        roleId: '',
                        roleName: '权限二',
                        isChecked: false
                    }
                ]
            },
            {
                permisssionType: "权限组1",
                permissionLIst: [
                    {
                        roleId: '',
                        roleName: '权限一',
                        isChecked: true
                    },
                    {
                        roleId: '',
                        roleName: '权限二',
                        isChecked: false
                    }
                ]
            },
            {
                permisssionType: "权限组2",
                permissionLIst: [
                    {
                        roleId: '',
                        roleName: '权限一',
                        isChecked: true
                    },
                    {
                        roleId: '',
                        roleName: '权限二',
                        isChecked: false
                    }
                ]
            }
        ]
    }
    return data;
}

Mock.mock('/user/info', 'post', getUserInfo)
Mock.mock('/login', 'post', login)
Mock.mock('/role/list', 'post', roleList)
Mock.mock('/role/getClassifyPermissionList', 'post', getClassifyPermissionList)
Mock.mock('/sensitiveWord/list', 'post', SensitiveWord)
Mock.mock('/sensitiveWord/getbatchStatus', 'post', getbatchStatus)
