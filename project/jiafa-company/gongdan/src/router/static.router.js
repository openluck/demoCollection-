const staticRouter = [{
  path: "/DataModifyOrder",
  name: "DataModifyOrder",
  meta: {
    title: "考生数据修改工单",
    icon: "bianji"
  },
  redirect: "/RegInfoStatistics/ApplyDataSearch",
  component: {
    render: (h) => h("router-view")
  },
  children: [
    {
      path: "/WorkOrderSetting",
      name: "WorkOrderSetting",
      meta: {
        title: "工单设置"
      },
      component: () =>
        import( /* webpackChunkName: "layout" */ "../views/DataModifyOrder/WorkOrderSetting")
    },
    {
      path: "/RegInfoStatistics",
      name: "RegInfoStatistics",
      meta: {
        title: "报名数据查询统计",
      },
      component: {
        render: (h) => h("router-view")
      },
      children: [
        {
          path: "/RegInfoStatistics/ApplyDataSearch",
          name: "ApplyDataSearch",
          meta: {
            title: "报名数据查询"
          },
          component: () =>
            import( /* webpackChunkName: "layout" */ "../views/DataModifyOrder/RegInfoStatistics/ApplyDataSearch/index.vue")
        },
        {
          path: "/RegInfoStatistics/RegDataStatistics",
          name: "RegDataStatistics",
          meta: {
            title: "报考数据统计"
          },
          component: () =>
            import( /* webpackChunkName: "layout" */ "../views/DataModifyOrder/RegInfoStatistics/RegDataStatistics/index.vue")
        },
        {
          path: "/RegInfoStatistics/ExeeTypeStatistics",
          name: "ExeeTypeStatistics",
          meta: {
            title: "考生类型统计"
          },
          component: () =>
            import( /* webpackChunkName: "layout" */ "../views/DataModifyOrder/RegInfoStatistics/ExeeTypeStatistics/index.vue")
        }
      ]
    },

    {
      path: "/WorkOrderApply",
      name: "WorkOrderApply",
      meta: {
        title: "工单申请"
      },
      component: () =>
        import( /* webpackChunkName: "layout" */ "../views/DataModifyOrder/WorkOrderApply")
    },
    {
      path: "/WorkOrderApply/WkEditAndDetail",
      name: "WkEditAndDetail",
      meta: {
        title: "工单编辑与查看",
        hidden: true,
      },
      hidden: true,
      component: () =>
        import( /* webpackChunkName: "layout" */ "../views/DataModifyOrder/WorkOrderApply/WkEditAndDetail")
    },
    {
      path: "/WorkOrderApply/BatchImport",
      name: "BatchImport",
      meta: {
        title: "考生批量录入",
        hidden: true,
      },
      hidden: true,
      component: () =>
        import( /* webpackChunkName: "layout" */ "../views/DataModifyOrder/WorkOrderApply/BatchImport")
    },
    {
      path: "/WorkOrderApply/ExamineeAlterAndCheck",
      name: "ExamineeAlterAndCheck",
      meta: {
        title: "考生编辑与查看",
        hidden: true,
      },
      hidden: true,
      component: () =>
        import( /* webpackChunkName: "layout" */ "../views/DataModifyOrder/WorkOrderApply/ExamineeAlterAndCheck")
    },
    {
      path: "/WorkOrderApply/ExamineeRegInfo",
      name: "ExamineeRegInfo",
      meta: {
        title: "考生信息",
        hidden: true,
      },
      hidden: true,
      component: () =>
        import( /* webpackChunkName: "layout" */ "../views/DataModifyOrder/WorkOrderApply/ExamineeRegInfo")
    },
    // 仅为报名数据查询页面跳转
    {
      path: "/WorkOrderApply/LookExamineeRegInfo",
      name: "LookExamineeRegInfo",
      meta: {
        title: "考生信息查看",
        hidden: true,
      },
      hidden: true,
      component: () =>
        import( /* webpackChunkName: "layout" */ "../views/DataModifyOrder/WorkOrderApply/ExamineeRegInfo/LookExamineeRegInfo")
    },
    /* ************************************** */
    {
      path: "/DataModifyOrder/WorkOrderAudit",
      name: "DataModifyOrder/WorkOrderAudit",
      meta: {
        title: "工单审核"
      },
      component: () =>
        import(
          /* webpackChunkName: "layout" */
          "../views/DataModifyOrder/WorkOrderAudit/WorkOrderAudit"
        )
    },
    {
      path: "/DataModifyOrder/BatchReview",
      name: "DataModifyOrder/BatchReview",
      meta: {
        title: "批量审阅",
        hidden: true,
      },
      hidden: true,
      component: () =>
        import(
          /* webpackChunkName: "layout" */
          "../views/DataModifyOrder/WorkOrderAudit/ChildCon/BatchReview.vue"
        )
    },
    {
      path: "/DataModifyOrder/WorkOrderDetail",
      name: "DataModifyOrder/WorkOrderDetail",
      meta: {
        title: "工单详情",
        hidden: true,
      },
      hidden: true,
      component: () =>
        import(
          /* webpackChunkName: "layout" */
          "../views/DataModifyOrder/WorkOrderAudit/ChildCon/WorkOrderDetail.vue"
        )
    },
    {
      path: "/DataModifyOrder/examineeDetail",
      name: "DataModifyOrder/examineeDetail",
      meta: {
        title: "考生详情",
        hidden: true,
      },
      hidden: true,
      component: () =>
        import(
          /* webpackChunkName: "layout" */
          "../views/DataModifyOrder/WorkOrderAudit/ChildCon/examineeDetail.vue"
        )
    },
    /* ****************变更统计  ----   工单统计********************** */

    {
      path: "/ModifyStatistic",
      name: "ModifyStatistic",
      meta: {
        title: "工单审核统计"
      },
      component: () =>
        import(
          /* webpackChunkName: "layout" */
          "../views/DataModifyOrder/ModifyStatistic/ModifyStatistic"
        )
    },
    /**************************变更查询 ---- 变更考生查询*************************************/
    {
      path: "/ModifySearch",
      name: "ModifySearch",
      meta: {
        title: "变更考生查询"
      },
      component: () =>
        import(
          /* webpackChunkName: "layout" */
          "../views/DataModifyOrder/ModifySearch/ModifySearch"
        )
    },
    {
      path: "/ModifyStatistic/ModifyExamineeList",
      name: "ModifyStatistic/ModifyExamineeList",
      meta: {
        title: "审核考生列表",
        hidden: true,
      },
      hidden: true,
      component: () =>
        import(
          /* webpackChunkName: "layout" */
          "../views/DataModifyOrder/ModifyStatistic/ModifyExamineeList"
        )
    },
    {
      path: "/ModifyStatistic/ModifyOrderList",
      name: "ModifyOrderList",
      meta: {
        title: "审核工单列表",
        hidden: true,
      },
      hidden: true,
      component: () =>
        import(
          /* webpackChunkName: "layout" */
          "../views/DataModifyOrder/ModifyStatistic/ModifyOrderList"
        )
    },
    /**********************变更项统计***********************/
    {
      path: "/ModifyItemStatistic",
      name: "ModifyItemStatistic",
      meta: {
        title: "变更项统计"
      },
      component: () =>
        import(
          /* webpackChunkName: "layout" */
          "../views/DataModifyOrder/ModifyItemStatistic/ModifyItemStatistic"
        )
    },
    {
      path: "/ModifyExamineeItemList",
      name: "ModifyExamineeItemList",
      meta: {
        title: "变更项考生列表",
        hidden: true,
      },
      component: () =>
        import(
          /* webpackChunkName: "layout" */
          "../views/DataModifyOrder/ModifyItemStatistic/ModifyExamineeItemList"
        )
    },
  ]
}];
export default staticRouter;