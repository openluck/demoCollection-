/**
 * 添加动态（菜单）路由
 * @param {Array} menuList 菜单列表
 * @param {Array} routers 递归创建的动态（菜单）路由
 */
function addDynamicRoutes(menuList = [], routes = []) {
  for (var i = 0; i < menuList.length; i++) {
    if (menuList[i].path && menuList[i].hasChildMenu) {
      let menuPath = menuList[i].path;
      menuPath = menuPath.replace(/^\//, "");
      // 创建路由配置
      let routeObj = {
        path: menuPath,
        name: menuList[i].name,
        meta: {
          title: menuList[i].name,
          icon: menuList[i].icons,
          hasChildMenu: menuList[i].hasChildMenu,
          isHideMenu: menuList[i].isHideMenu
        },
        component: { render: (h) => h("router-view") },
        children: []
      };
      if (menuList[i].children && menuList[i].children.length >= 1) {
        let menuChildren = [...menuList[i].children];
        addDynamicRoutesChild(menuChildren, routeObj.children);
      }
      routes.push(routeObj);
    } else {
      if (!menuList[i].path) {
        break;
      }
      menuList[i].path = menuList[i].path.replace(/^\//, "");
      let routeObjSin = {
        path: "/" + menuList[i].path,
        name: menuList[i].name,
        meta: {
          title: menuList[i].name,
          icon: menuList[i].icons,
          hasChildMenu: menuList[i].hasChildMenu,
          isHideMenu: menuList[i].isHideMenu
        },
        component: null,
        children: []
      };
      try {
        let array = menuList[i].path.split("/");
        let url = "";
        for (let i = 0; i < array.length; i++) {
          url +=
            array[i].substring(0, 1).toUpperCase() +
            array[i].substring(1) +
            "/";
        }
        url = url.substring(0, url.length - 1);
        if (!menuList[i].isHideMenu) {
          routeObjSin.component = (resolve) =>
            require([`@/views/${url}.vue`], resolve);
        } else {
          routeObjSin.component = (resolve) =>
            require([`@/views/${url}.vue`], resolve);
        }
      } catch (e) {
        console.log("error", e);
      }
      routes.push(routeObjSin);
    }
  }
  return routes;
}
/**
 * 添加动态（菜单）子路由
 * @param {Array} menuList 菜单列表
 * @param {Array} routeChild 递归创建的动态（菜单）子路由
 */
function addDynamicRoutesChild(menuList = [], routeChild = []) {
  for (var i = 0; i < menuList.length; i++) {
    if (menuList[i].path) {
      let menuPath = menuList[i].path;
      menuPath = menuPath.replace(/^\//, "");
      // 创建路由配置
      var routeObjChild = {
        path: `/${menuPath}`,
        component: null,
        name: menuList[i].name,
        meta: {
          title: menuList[i].name,
          icon: menuList[i].icons,
          hasChildMenu: menuList[i].hasChildMenu,
          isHideMenu: menuList[i].isHideMenu
        }
      };
      try {
        let array = menuList[i].path.split("/");
        let url = "";
        for (let i = 0; i < array.length; i++) {
          url +=
            array[i].substring(0, 1).toUpperCase() +
            array[i].substring(1) +
            "/";
        }
        url = url.substring(0, url.length - 1);
        if (!menuList[i].isHideMenu) {
          routeObjChild.component = (resolve) =>
            require([`@/views/${url}.vue`], resolve);
        } else {
          routeObjChild.component = (resolve) =>
            require([`@/views/${url}.vue`], resolve);
        }
      } catch (e) {
        console.log("error", e);
      }
      routeChild.push(routeObjChild);
    }
  }
}
export default addDynamicRoutes;
