/*
 * @Desc:
 * @Version: v1.00
 * @Author: went
 * @Date: 2021-01-20 19:45:40
 * @LastEditors: went
 * @LastEditTime: 2021-09-30 09:42:57
 */
import router from "../../router";
import addDynamicRoutes from "./addDynamicRoutes";
import VueRouter from "vue-router";
const addRoutes = {
  state: {
    rootRoute: [],
    routeParam: [] //这里必须持久化参数,重新生成路由,因为里边的require方法没法持久化
  },
  mutations: {
    add_Routes(state, routeParam) {
      let dynamicRoutes = addDynamicRoutes(routeParam);
      router.options.routes[0].children = router.options.routes[0].children.concat(
        dynamicRoutes
      );
      //保存路由参数到store中
      state.routeParam = routeParam;
      state.rootRoute = router.options.routes[0].children;
      if (routeParam) {
        sessionStorage.setItem("routerInfo", JSON.stringify(routeParam));
      }
      //动态添加路由
      router.matcher = new VueRouter({
        mode: "hash"
      }).matcher;
      router.addRoutes(router.options.routes);
    }
  },
  actions: {
    add_Routes({ commit }, routeParam) {
      commit("add_Routes", routeParam);
    }
  }
};
export default addRoutes;
