const pageList = [
    {
        parentNode: '平台统计',
        page: [{
            label: "平台统计",
            key: "platform_stats",
            path: "/platformStats/platformStats",
            childCom: [
                { label: "统计数据", value: 'platformStats01' },
                { label: "注册认证用户与APP下载量", value: 'platformStats02' },
                { label: "认证与未认证用户", value: 'platformStats03' },
                { label: "用户手机品牌", value: 'platformStats04' },
                { label: "开放API调用占比", value: 'platformStats05' },
                { label: "异常调用排行", value: 'platformStats06' },
                { label: "API调用趋势图", value: 'platformStats07' },
                { label: "热门应用排行", value: 'platformStats08' },
                { label: "前15热门搜索词", value: 'platformStats09' },
                { label: "消息发布占比", value: 'platformStats10' }
            ],
            checkedList: []
        }
        ]
    },
    {
        parentNode: '机构应用',
        page: [
            {
                label: "机构和账户",
                key: "AgencyAccount",
                path: "/AgencyApplication/AgencyAccount",
                childCom: [
                    { label: "添加机构账户", value: 'agencyAccount_add' },
                    { label: "搜索机构", value: 'agencyAccount_search' },
                    { label: "编辑机构", value: 'agencyAccount_edit' },
                    { label: "删除机构", value: 'agencyAccount_delete' },
                    { label: "机构账户列表", value: 'agencyAccount_list' }],
                checkedList: []
            },
            {
                label: "应用管理",
                key: "AgencyAccount",
                path: "/AgencyApplication/ApplicationManagement",
                childCom: [
                    { label: "添加应用", value: 'ApplicationManagement_add' },
                    { label: "搜索应用", value: 'ApplicationManagement_search' },
                    { label: "应用列表", value: 'ApplicationManagement_list' },
                    { label: "应用编辑", value: 'ApplicationManagement_edit' },
                    { label: "应用密钥", value: 'ApplicationManagement_key' },
                    { label: "应用设置", value: 'ApplicationManagement_setting' },
                    { label: "应用删除", value: 'ApplicationManagement_delete' }
                ],
                checkedList: []
            },
            {
                label: "应用通知公告",
                key: "ApplicationAnnouncements",
                path: "/AgencyApplication/ApplicationAnnouncements",
                childCom: [
                    { label: "通知公告批量删除", value: 'ApplicationAnnouncements_batchDelete' },
                    { label: "通知公告搜素", value: 'ApplicationAnnouncements_search' },
                    { label: "通知公告编辑", value: 'ApplicationAnnouncements_edit' },
                    { label: "通知公告单个删除", value: 'ApplicationAnnouncements_Delete' },
                    { label: "通知公告列表", value: 'ApplicationAnnouncements_list' }
                ],
                checkedList: []
            },
            {
                label: "三方应用信息",
                key: "ApplicationMessage",
                path: "/AgencyApplication/ApplicationMessage",
                childCom: [
                    { label: "三方应用列表", value: 'ApplicationMessage_list' },
                    { label: "三方应用删除", value: 'ApplicationMessage_delete' }
                ],
                checkedList: []
            }]
    },
    {
        parentNode: '信息管理',
        page: [
            {
                label: "新闻资讯",
                key: "AgencyAccount",
                path: "/InfoManage/NewsInformation",
                childCom: [
                    { label: "新闻资讯列表", value: 'NewsInformation_list' },
                    { label: "新闻资讯新增", value: 'NewsInformation_add' },
                    { label: "新闻资讯删除", value: 'NewsInformation_delete' }
                ],
                checkedList: []
            },
            {
                label: "通知公告",
                key: "Announcements",
                path: "/InfoManage/Announcements",
                childCom: [
                    { label: "通知公告列表", value: 'Announcements_list' },
                    { label: "通知公告新增", value: 'Announcements_add' },
                    { label: "通知公告删除", value: 'Announcements_delete' }
                ],
                checkedList: []
            },
            {
                label: "意见反馈",
                key: "Feedback",
                path: "/InfoManage/Feedback",
                childCom: [
                    { label: "意见反馈列表", value: 'Feedback_list' },
                    { label: "意见反馈编辑", value: 'Feedback_edit' },
                    { label: "意见反馈删除", value: 'Feedback_delete' }
                ],
                checkedList: []
            },
            {
                label: "短信推送",
                key: "SMSPush",
                path: "/InfoManage/SMSPush",
                childCom: [
                    { label: "短信推送列表", value: 'SMSPush_list' },
                    { label: "短信推送新增", value: 'SMSPush_add' },
                    { label: "短信推送详情", value: 'SMSPush_info' },
                    { label: "短信推送删除", value: 'SMSPush_delete' }
                ],
                checkedList: []
            },
            {
                label: "消息推送",
                key: "MessagePush",
                path: "/InfoManage/MessagePush",
                childCom: [
                    { label: "消息推送列表", value: 'MessagePush_list' },
                    { label: "消息推送新增", value: 'MessagePush_add' },
                    { label: "消息推送详情", value: 'MessagePush_info' },
                    { label: "消息推送删除", value: 'MessagePush_delete' }
                ],
                checkedList: []
            },
            {
                label: "移动端BANNER",
                key: "MobileBanner",
                path: "/InfoManage/MobileBanner",
                childCom: [
                    { label: "添加移动端banner", value: 'banner_create' },
                    { label: "删除移动端banner", value: 'banner_delete' },
                    { label: "编辑移动端banner", value: 'banner_edit' },
                    // { label: "搜索移动端banner", value: 'banner_serach' },
                    { label: "移动端banner列表", value: 'banner_list' },
                    { label: "修改移动端banner开关", value: 'banner_changeState' },
                    { label: "修改移动端banner顺序", value: 'banner_changeOrder' }
                ],
                checkedList: []
            },
            {
                label: "移动端广告页",
                key: "MobileAdvertising",
                path: "/InfoManage/MobileAdvertising",
                childCom: [
                    { label: "添加移动端广告", value: 'AD_create' },
                    { label: "删除移动端广告", value: 'AD_delete' },
                    { label: "编辑移动端广告", value: 'AD_edit' },
                    // { label: "搜索移动端广告", value: 'AD_serach' },
                    { label: "移动端广告列表", value: 'AD_list' },
                    { label: "修改移动端广告开关", value: 'AD_changeState' }
                ],
                checkedList: []
            },
            {
                label: "关于我们",
                key: "AboutUs",
                path: "/InfoManage/AboutUs",
                childCom: [
                    { label: "查看市民云介绍", value: 'getIntroduce' },
                    { label: "查看服务协议", value: 'getServiceAgreement' },
                    { label: "查看隐私政策", value: 'getPrivacyPolicy' },
                    { label: "查看用户授权协议", value: 'getEULA' },
                    { label: "修改市民云介绍", value: 'updateIntroduce' },
                    { label: "修改服务协议", value: 'updateServiceAgreement' },
                    { label: "修改隐私政策", value: 'updatePrivacyPolicy' },
                    { label: "修改用户授权协议", value: 'updateEULA' }
                ],
                checkedList: []
            }]
    },
    {
        parentNode: '用户管理',
        page: [
            {
                label: "移动端用户管理",
                key: "MobileUser",
                path: "/UserManagement/MobileUser",
                childCom: [
                    { label: "添加移动端用户", value: 'appUser_create' },
                    { label: "删除移动端用户", value: 'appUser_delete' },
                    { label: "编辑移动端用户", value: 'appUser_edit' },
                    // { label: "搜索移动端用户", value: 'appUser_search' },
                    { label: "查看移动端用户列表", value: 'appUser_list' },
                    { label: "查看登录记录", value: 'appUser_logList' },
                    { label: "查看授权应用", value: 'appUser_authList' },
                    { label: "解除授权", value: 'appUser_authDelete' }
                ],
                checkedList: []
            },
            {
                label: "移动端实名认证",
                key: "MobileCertify",
                path: "/UserManagement/MobileCertify",
                childCom: [
                    { label: "添加移动端实名认证", value: 'nameAuth_create' },
                    { label: "编辑审核移动端实名认证", value: 'nameAuth_edit' },
                    // { label: "审核移动端实名认证", value: 'nameAuth_check' },
                    // { label: "搜索移动端实名认证", value: 'nameAuth_search' },
                    { label: "查看移动端实名认证列表", value: 'nameAuth_list' }
                    // { label: "CDIT检测", value: 'nameAuth_CDIT' },
                ],
                checkedList: []
            },
            {
                label: "WEB端用户管理",
                key: "WebUser",
                path: "/UserManagement/WebUser",
                childCom: [
                    { label: "WEB端用户列表", value: 'WebUser_list' },
                    // { label: "WEB端用户搜索", value: 'WebUser_search' },
                    { label: "WEB端用户添加", value: 'WebUser_add' },
                    { label: "WEB端用户编辑", value: 'WebUser_edit' },
                    { label: "WEB端用户删除", value: 'WebUser_delete' }
                ],
                checkedList: []
            }
        ]
    },
    {
        parentNode: 'API管理',
        page: [
            {
                label: "开放API管理",
                key: "OpenApi",
                path: "/ApiManagement/OpenApi",
                childCom: [
                    { label: "API列表", value: 'API_list' },
                    // { label: "API搜索", value: 'API_search' },
                    { label: "API添加", value: 'API_add' },
                    { label: "API启用/停止", value: 'API_startAndStop' },
                    { label: "API删除", value: 'API_delete' },
                    { label: "API编辑", value: 'API_edit' }
                ],
                checkedList: []
            },
            {
                label: "API调用记录",
                key: "ApiCallRecords",
                path: "/ApiManagement/ApiCallRecords",
                childCom: [
                    { label: "API调用记录", value: 'ApiCallRecords_list' },
                    { label: "API调用记录详情", value: 'ApiCallRecords_info' }
                    // { label: "API调用记录搜索", value: 'ApiCallRecords_search' },
                ],
                checkedList: []
            }
        ]
    },
    {
        parentNode: 'APP更新',
        page: [
            {
                label: "APP更新",
                key: "OpenApi",
                path: "/AppUpdate/AppUpdate",
                childCom: [
                    { label: "APP版本列表", value: 'APP_list' },
                    // { label: "APP版本搜索", value: 'APP_search' },
                    { label: "APP版本添加", value: 'APP_add' },
                    { label: "APP版本启用/停止", value: 'APP_startAndStop' },
                    { label: "APP版本删除", value: 'APP_delete' },
                    { label: "APP版本编辑", value: 'APP_edit' }
                ],
                checkedList: []
            }
        ]
    },
    {
        parentNode: '系统管理',
        page: [
            {
                label: "码表管理",
                key: "CodeTable",
                path: "/SystemManagement/CodeTable",
                childCom: [
                    { label: "码表列表", value: 'CodeTable_list' },
                    // { label: "码表搜索", value: 'CodeTable_search' },
                    { label: "码表添加", value: 'CodeTable_add' },
                    { label: "码表删除", value: 'CodeTable_delete' },
                    { label: "码表编辑", value: 'CodeTable_edit' }
                ],
                checkedList: []

            },
            {
                label: "角色管理",
                key: "role",
                path: "/SystemManagement/Role",
                childCom: [
                    { label: "角色添加", value: 'role_add' },
                    { label: "角色数据刷新", value: 'role_refresh' },
                    { label: "角色列表", value: 'role_list' },
                    { label: "角色状态修改", value: 'role_changeStatus' },
                    { label: "角色编辑", value: 'role_edit' },
                    { label: "角色删除", value: 'role_delete' }
                ],
                checkedList: []
            },
            {
                label: "敏感词库",
                key: "SensitiveWord",
                path: "/SystemManagement/SensitiveWord",
                childCom: [
                    { label: "敏感词查询", value: 'SensitiveWord_list' },
                    { label: "敏感词新增", value: 'SensitiveWord_add' },
                    { label: "敏感词编辑", value: 'SensitiveWord_update' },
                    { label: "批量状态修改", value: 'SensitiveWord_statusUpdate' },
                    { label: "获取批量状态", value: 'SensitiveWord_getbatchStatus' },
                    { label: "下载模板", value: 'SensitiveWord_downloadForm' },
                    { label: "批量新增", value: 'SensitiveWord_batchAdd' },
                    { label: "敏感词删除", value: 'SensitiveWord_delete' },
                    { label: "敏感词修改状态", value: 'SensitiveWord_toggle' }
                ],
                checkedList: []
            },
            {
                label: "行为日志",
                key: "ActionLog",
                path: "/SystemManagement/ActionLog",
                childCom: [
                    { label: "行为日志列表", value: 'ActionLog_list' },
                    { label: "行为日志详情", value: 'ActionLog_info' }
                ],
                checkedList: []
            },
            {
                label: "个人中心",
                key: "PersonalCenter",
                path: "/SystemManagement/PersonalCenter",
                childCom: [
                    { label: "修改个人资料", value: 'PersonalCenter_edit' }
                ],
                checkedList: []
            }
        ]
    }

]
export default pageList