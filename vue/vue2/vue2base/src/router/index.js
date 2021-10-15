/*
 * @Descripttion:
 * @version:
 * @Author: OpenLcuk
 * @Date: 2021-10-14 09:34:14
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-10-14 09:34:14
 */
import VueRouter from "vue-router";
/* 注意：以下配置仅为部分配置，并且省去了 component 的配置 */
export const routes = [
  {
    path: "/",
    name: "Admin",
    label: "首页",
  },
  {
    path: "/user",
    name: "User",
    label: "用户",
    redirect: { name: "UserList" },
    children: [
      {
        path: "list",
        name: "UserList",
        label: "用户列表",
      },
      {
        path: "group",
        name: "UserGroup",
        label: "用户组",
        redirect: { name: "UserGroupList" },
        children: [
          {
            path: "list",
            name: "UserGroupList",
            label: "用户组列表",
          },
          {
            path: "config",
            name: "UserGroupConfig",
            label: "用户组设置",
          },
        ],
      },
    ],
  },
  {
    path: "/setting",
    name: "Setting",
    label: "系统设置",
  },
  {
    path: "/login",
    name: "Login",
    label: "登录",
  },
];

const router = new VueRouter({
  routes,
});

export default router;
