const adminRouter = [
  {
    path: "/DivideArrangeLes",
    name: "智能排课",
    meta: {
      title: "分班方案",
      icon: "menu-znpk",
      isShow: true,
    },
    component: () =>
      import(
        /* webpackChunkName: "layout" */ "../views/SmartArrLesson/DivideClassList/DivideArrangeLes"
      ),
  },
  {
    path: "/ArrLessonList",
    name: "排课方案列表",
    meta: {
      title: "排课方案列表",
      icon: "lock",
      // isShow: true,
    },
    component: () =>
      import(
        /* webpackChunkName: "layout" */ "../views/SmartArrLesson/ArrLessonList/ArrLessonList"
      ),
  },

  {
    path: "/PreviewTimetable",
    name: "课表预览",
    meta: {
      title: "课表预览",
      icon: "lock",
      // isShow: true,
    },
    component: () =>
      import(
        /* webpackChunkName: "layout" */ "../views/SmartArrLesson/ArrLesson/PreviewTimetable"
      ),
  },
  {
    path: "/PlanReportorCompare", // 保留，这个版本目前不写
    name: "方案对比",
    meta: {
      title: "方案对比",
      icon: "lock",
      // isShow: true,
    },
    component: () =>
      import(
        /* webpackChunkName: "layout" */ "../views/SmartArrLesson/ArrLesson/PlanReportorCompare"
      ),
  },
  {
    path: "/ArrangeCourse",
    name: "置课安排",
    meta: {
      title: "置课安排",
      icon: "menu-znpk",
      isShow: false,
    },
    component: () =>
      import(
        /* webpackChunkName: "layout" */ "../views/SmartArrLesson/ArrLesson/ArrLessonSetting/ArrangeCourse"
      ),
    children: [
      {
        path: "/CourseSecArrange",
        name: "排课节次安排",
        meta: {
          title: "排课节次安排",
          icon: "lock",
          isShow: true,
        },
        component: () =>
          import(
            /* webpackChunkName: "layout" */ "../views/SmartArrLesson/ArrLesson/ArrLessonSetting//CourseSecArrange/CourseSecArrange"
          ),
      },
      {
        path: "/ClassTeachArrange",
        name: "班级授课安排",
        meta: {
          title: "班级授课安排",
          icon: "lock",
          isShow: true,
        },
        component: () =>
          import(
            /* webpackChunkName: "layout" */ "../views/SmartArrLesson/ArrLesson/ArrLessonSetting//ClassTeachArrange/ClassTeachArrange"
          ),
      },
      {
        path: "/TeacherLesArrange",
        name: "教师任课安排",
        meta: {
          title: "教师任课安排",
          icon: "lock",
          isShow: true,
        },
        component: () =>
          import(
            /* webpackChunkName: "layout" */ "../views/SmartArrLesson/ArrLesson/ArrLessonSetting//TeacherLesArrange/TeacherLesArrange"
          ),
      },
      {
        path: "/ClassArrange",
        name: "教室安排",
        meta: {
          title: "教室安排",
          icon: "lock",
          isShow: true,
        },
        component: () =>
          import(
            /* webpackChunkName: "layout" */ "../views/SmartArrLesson/ArrLesson/ArrLessonSetting//ClassArrange/ClassArrange"
          ),
      },
      {
        path: "/ArrLessonRule",
        name: "排课规则",
        meta: {
          title: "排课规则",
          icon: "lock",
          isShow: true,
        },
        component: () =>
          import(
            /* webpackChunkName: "layout" */ "../views/SmartArrLesson/ArrLesson/ArrLessonSetting/ArrLessonRule"
          ),
      },
    ],
  },
];
export default adminRouter;
