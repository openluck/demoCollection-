/*
 * @Author: lxx
 * @Date: 2020-02-13 23:06:07 
 * @Last Modified by: lxx
 * @Last Modified time: 2020-07-23 16:26:13
 * 菜单配置
 */
import _ from 'lodash'


export const MenuConfig = [{
    name: '可视化中心',
    roleId: 'ISCED00',
    path: 'visual',
    children: [{
        name: '教学秩序',
        roleId: 'ISCED000',
        path: 'order',
    }, {
        name: '教学质量',
        roleId: 'ISCED001',
        path: 'quality',
    }, {
        name: '资源情况',
        roleId: 'ISCED002',
        path: 'info',
    }]
}, {
    name: '画像中心',
    roleId: 'ISCED01',
    path: 'img',
    children: [{
        name: '学校画像',
        roleId: 'ISCED010',
        path: 'org',
    }, {
        name: '学院画像',
        roleId: 'ISCED011',
        path: 'col',
    }, {
        name: '课程画像',
        roleId: 'ISCED012',
        path: 'cour',
    }, {
        name: '教师画像',
        roleId: 'ISCED013',
        path: 'tea',
    }]
}, {
    name: '报表统计',
    roleId: 'ISCED02',
    path: 'data',
    children: [{
        name: '教学秩序',
        roleId: 'ISCED020',
        path: '',
        children: [{
            name: '课程统计',
            roleId: 'ISCED0200',
            path: 'ordcour',
        }, {
            name: '教师统计',
            roleId: 'ISCED0201',
            path: 'ordtea',
        }]
    }, {
        name: '教学质量',
        roleId: 'ISCED021',
        path: '',
        children: [{
            name: '课程统计',
            roleId: 'ISCED0210',
            path: 'quacour',
        }, {
            name: '教师统计',
            roleId: 'ISCED0211',
            path: 'quatea',
        }]
    }, {
        name: '资源情况',
        roleId: 'ISCED022',
        path: '',
        children: [{
            name: '教室统计',
            roleId: 'ISCED0220',
            path: 'resclass',
        }, {
            name: '教师统计',
            roleId: 'ISCED0221',
            path: 'restea',
        }]
    }]
}, {
    name: '明细查询',
    roleId: 'ISCED03',
    path: 'det',
    children: [{
        name: '教学秩序',
        roleId: 'ISCED030',
        path: '',
        children: [{
            name: '课程考勤',
            roleId: 'ISCED0300',
            path: 'ordtea',
        }, {
            name: '到课率',
            roleId: 'ISCED0301',
            path: 'ordclass',
        }, {
            name: '前排就座率',
            roleId: 'ISCED0302',
            path: 'ordsit',
        }, {
            name: '低头率',
            roleId: 'ISCED0303',
            path: 'ordsle',
        }, {
            name: '课堂违纪',
            roleId: 'ISCED0304',
            path: 'ordbre',
        }]
    }, {
        name: '教学质量',
        roleId: 'ISCED031',
        path: '',
        children: [{
            name: '教学分析',
            roleId: 'ISCED0310',
            path: 'quaanaly',
        }, {
            name: '学生听讲反馈',
            roleId: 'ISCED0311',
            path: 'quaback',
        }, {
            name: '课堂互动',
            roleId: 'ISCED0312',
            path: 'quacour',
        }]
    }, {
        name: '资源情况',
        roleId: 'ISCED032',
        path: '',
        children: [{
            name: '多媒体使用',
            roleId: 'ISCED0320',
            path: 'info',
        }]
    }]
}, {
    name: '报告中心',
    roleId: 'ISCED04',
    path: 'rep',
    children: [{
        name: '系统报告',
        roleId: 'ISCED040',
        path: 'sysrep',
    },{
        name: '自定义报告',
        roleId: 'ISCED041',
        path: 'custom',
    },{
        name: '校长报告',
        roleId: 'ISCED042',
        path: 'master',
    }]
}, {
    name: '教学改进',
    roleId: 'ISCED05',
    path: 'imp',
    children: [{
        name: '首页',
        roleId: 'ISCED050',
        path: 'total',
    },{
        name: '异常情况下发',
        roleId: 'ISCED051',
        path: 'allot',
    },{
        name: '异常情况回复',
        roleId: 'ISCED052',
        path: 'reply',
    },{
        name: '异常情况跟踪',
        roleId: 'ISCED053',
        path: 'follow',
    }]
}, {
    name: '设置',
    roleId: 'ISCED06',
    path: 'set',
    children: [{
        name: '角色权限',
        roleId: 'ISCED060',
        path: 'role',
    },{
        name: '角色分配',
        roleId: 'ISCED061',
        path: 'config',
    },{
        name: '功能设置',
        roleId: 'ISCED062',
        path: 'sz',
    },{
        name: '消息设置',
        roleId: 'ISCED063',
        path: 'msg',
    }]
}]

/**
 * 用户权限配置
 * role用户角色
 * type用户typeId
 */
export const GetMenu = (menuData) => {
    let menus = MenuConfig; // 获取菜单配置
    // 最低层数据查找
    const findChild = (funr) => {
        // console.log(funr)
        let ind = _.findIndex(menuData, { id: funr.roleId })
        if (ind > -1) {
            return menuData[ind]
        }
    }
    // 各层级菜单处理
    const findMenu = (parArr, arr) => {
        // let childData = [];
        arr.map((li, ind) => {
            if (li.children && li.children.length) {
                // 存在子级
                let parData = findChild(li);
                // console.log(parData, li)
                if (parData) {
                    parArr.push({
                        name: parData.name,
                        key: parData.id,
                        path: li.path,
                        children: []
                    })
                    // 重复遍历
                    findMenu(parArr[parArr.length - 1].children, li.children)
                }
                return

            } else {
                // 不存在子级
                let data = findChild(li);
                if (data) {
                    parArr.push({
                        name: data.name,
                        key: data.id,
                        path: li.path,
                    })
                }

            }
        })
        return parArr
    }
    // 遍历配置文件筛选已有权限
    let menuList = findMenu([], menus); // 处理后的菜单
    console.log(menuList)
    return menuList;
}