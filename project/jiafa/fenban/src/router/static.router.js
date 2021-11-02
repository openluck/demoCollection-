const staticRouter = [
      {
        path: "/studentExam",
        name: "高考选科",
        meta: {
          title: "高考选科"
        },
        component: () =>
          import(
            /* webpackChunkName: "layout" */ "../views/stuExam/studentExam"
          )
      },
      {
        path: "/TeacherExam",
        name: "高考选课",
        meta: {
          title: "高考选课"
        },
        component: () =>
          import(
            /* webpackChunkName: "layout" */ "../views/teaExam/teacherExam"
          )
      },
      {
        path: "/ChooseTest",
        name: "选考课程",
        meta: {
          title: "选考课程"
        },
        component: () =>
          import(
            /* webpackChunkName: "layout" */ "../views/teaExam/chooseTest"
          )
      },
      {
        path: "/courseResult",
        name: "选课结果",
        meta: {
          title: "选课结果"
        },
        component: () =>
          import(
            /* webpackChunkName: "layout" */ "../views/teaExam/components/courseResult"
          )
      },
      {
        path: "/courseSet",
        name: "选考设置",
        meta: {
          title: "选考设置"
        },
        component: () =>
          import(
            /* webpackChunkName: "layout" */ "../views/teaExam/components/courseSet"
          )
      },
      {
        path: "/roleSet",
        name: "权限设置",
        meta: {
          title: "权限设置"
        },
        component: () =>
          import(
            /* webpackChunkName: "layout" */ "../views/admin/setRole"
          )
      }
];
export default staticRouter;