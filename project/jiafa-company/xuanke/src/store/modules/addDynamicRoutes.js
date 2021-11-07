/**
 * 添加动态（菜单）路由
 * @param {Array} menuList 菜单列表
 * @param {Array} routers 递归创建的动态（菜单）路由
 */
function addDynamicRoutes(menuList = [], routes = []) {
    for (var i = 0; i < menuList.length; i++) {
        if (menuList[i].path && /\S/.test(menuList[i].path)) {
            menuList[i].path = menuList[i].path.replace(/^\//, '')
            // 创建路由配置
            let routeObj = {
                path: menuList[i].path,
                name: menuList[i].title,
                meta: {
                    title: menuList[i].title,
                    icon: menuList[i].icons
                },
                component: { render: h => h('router-view') },
                children: []
            }
            if (menuList[i].children && menuList[i].children.length >= 1) {
                addDynamicRoutesChild(menuList[i].children, routeObj.children)
            }
            routes.push(routeObj)
        }
    }
    return routes
}
/**
 * 添加动态（菜单）子路由
 * @param {Array} menuList 菜单列表
 * @param {Array} routeChild 递归创建的动态（菜单）子路由
 */
function addDynamicRoutesChild(menuList = [], routeChild = []) {
    for (var i = 0; i < menuList.length; i++) {
        if (menuList[i].path && /\S/.test(menuList[i].path)) {
            menuList[i].path = menuList[i].path.replace(/^\//, '')
            // 创建路由配置
            var routeObjChild = {
                path: `/${menuList[i].path}`,
                component: null,
                name: menuList[i].title,
                meta: {
                    title: menuList[i].title
                }
            }
            try {
                let array = menuList[i].path.split('/')
                let url = ''
                for (let i = 0; i < array.length; i++) {
                    url += array[i].substring(0, 1).toUpperCase() + array[i].substring(1) + '/'
                }
                url = url.substring(0, url.length - 1)
                routeObjChild.component = resolve => require([`@/views/${url}.vue`], resolve)
            } catch (e) {
                console.log('error', e);
            }
            routeChild.push(routeObjChild)
        }
    }
}
export default addDynamicRoutes