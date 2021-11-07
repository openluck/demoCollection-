const studentRouter = [
  {
    path: "/studentExam",
    name: "高考选课",
    meta: {
      title: "高考选课",
      icon: "icon_subject"
    },
    component: () =>
      import(
        /* webpackChunkName: "layout" */ "../views/stuExam/studentExam"
      )
  }
];
export default studentRouter;