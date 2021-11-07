const adminRouter = [
  {
    path: "/PlanGroup",
    name: "智能分班",
    meta: {
      title: "智能分班",
      icon: "retweet",
    },
    component: () =>
      import(/* webpackChunkName: "layout" */ "../views/PlanGroup/PlanGroup"),
  },
  {
    path: "/PermissionSetting",
    name: "权限配置",
    meta: {
      title: "权限配置",
      icon: "lock",
      // isShow: true,
    },
    component: () =>
      import(
        /* webpackChunkName: "layout" */ "../views/PermissionSetting/PermissionSetting"
      ),
  },
  {
    path: "/SmartDivideClass",
    name: "选考分班",
    meta: {
      title: "选考分班",
      isShow: true,
    },
    component: () =>
      import(
        /* webpackChunkName: "layout" */ "../views/SmartDivideClass/SmartDivideClass"
      ),
  },
  {
    path: "/ViewResult",
    name: "查看结果",
    meta: {
      title: "查看结果",
      isShow: true,
    },
    component: () =>
      import(
        /* webpackChunkName: "layout" */ "../views/SmartDivideClass/ViewResult"
      ),
  },
  // {
  //   path: 'setRole',
  //   name: '权限设置',
  //   meta: {
  //     title: '权限设置',
  //     icon: 'icon_nav_01',
  //   },
  //   component: { render: (h) => h('router-view') },
  //   children: [
  //     {
  //       path: '/roleSet',
  //       name: '权限设置',
  //       meta: {
  //         title: '权限设置',
  //       },
  //       component: () =>
  //         import(/* webpackChunkName: "layout" */ '../views/admin/setRole'),
  //     },
  //   ],
  // },

  {
    path: "/DivideClassList",
    name: "智能分班方案列表",
    meta: {
      title: "智能分班方案列表",
      isShow: true,
    },
    component: () =>
      import(
        /* webpackChunkName: "layout" */ "../views/DivideClass/DivideClass"
      ),
  },
  {
    path: "/SchemeCompare",
    name: "方案报告对比",
    meta: {
      title: "方案报告对比",
      isShow: true,
    },
    component: () =>
      import(
        /* webpackChunkName: "layout" */ "../views/SchemeCompare/SchemeCompare"
      ),
  },
  {
    path: "/seeResult",
    name: "查看结果",
    meta: {
      title: "查看结果",
      isShow: true,
    },
    component: () =>
      import(/* webpackChunkName: "layout" */ "../views/PlanGroup/SeeResult"),
  },
];
export default adminRouter;
