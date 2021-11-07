/*
 * @Desc:
 * @Version: v1.00
 * @Author: went
 * @Date: 2021-08-06 13:30:24
 * @LastEditors: YanQY
 * @LastEditTime: 2021-09-30 11:48:08
 */
export default [
  {
    id: "kbgl_01",
    title: "节次管理",
    icons: "menu_1",
    path: "LesSortManage",
    hasChildMenu: true,
    isHideMenu: false
  },
  {
    id: "kbgl_01_01",
    icons: "",
    hasChildMenu: false,
    isHideMenu: false,
    title: "时段设置",
    path: "LesSortManage/DiffNoonSetting"
  },
  {
    id: "kbgl_01_02",
    icons: "",
    hasChildMenu: false,
    isHideMenu: false,
    title: "节次设置",
    path: "LesSortManage/lesSortSetting"
  },
  {
    id: "kbgl_01_03",
    icons: "",
    hasChildMenu: false,
    isHideMenu: true,
    title: "",
    path: "LesSortManage/EditLesSortItem"
  },
  {
    id: "kbgl_01_04",
    icons: "",
    hasChildMenu: false,
    isHideMenu: true,
    title: "",
    path: "LesSortManage/TimePlan"
  },
  {
    id: "kbgl_01_05",
    icons: "",
    hasChildMenu: false,
    isHideMenu: true,
    title: "",
    path: "LesSortManage/EditTimePlan"
  },
  {
    id: "kbgl_01_07",
    icons: "",
    hasChildMenu: false,
    isHideMenu: true,
    title: "",
    path: "LesSortManage/RangeDiffNoon"
  },
  {
    id: "kbgl_01_08",
    icons: "",
    hasChildMenu: false,
    isHideMenu: true,
    title: "",
    path: "LesSortManage/PreviewLesSortPlan"
  },
  // {
  //   id: "kbgl_01_09",

  //   isHideMenu: true,
  //   // title: "",
  //   path: "LesSortManage/PreviewLesSortPlan"
  // },

  //课表管理
  {
    id: "kbgl_02",
    title: "课表管理",
    icons: "menu_2",
    path: "TimetableManage/timetableManage",
    hasChildMenu: false,
    isHideMenu: false
  },
  {
    id: "kbgl_02_01",
    icons: "",
    title: "导入检测",
    path: "TimetableManage/ImportCheck",
    isChildPage: true,
    hasChildMenu: false,
    isHideMenu: true
  },
  {
    id: "kbgl_02_02",
    icons: "",
    title: "手动导入",
    path: "TimetableManage/ImportManually",
    isChildPage: true,
    hasChildMenu: false,
    isHideMenu: true
  },
  {
    id: "kbgl_02_03",
    title: "导入校验",
    icons: "",
    path: "TimetableManage/ImportVerify",
    isChildPage: true,
    hasChildMenu: false,
    isHideMenu: true
  },
  {
    id: "kbgl_02_04",
    title: "导入成功",
    icons: "",
    path: "TimetableManage/ImportSuccess",
    isChildPage: true,
    hasChildMenu: false,
    isHideMenu: true
  },
  //课表查询
  {
    id: "kbgl_03",
    title: "课表查询",
    icons: "menu_3",
    path: "TimetableQuery",
    hasChildMenu: true,
    isHideMenu: false
  },
  {
    id: "kbgl_03_01",
    title: "我的课表",
    icons: "",
    path: "TimetableQuery/myTimetable",
    hasChildMenu: false,
    isHideMenu: false
  },
  {
    id: "kbgl_03_02",
    title: "年级课表",
    icons: "",
    path: "TimetableQuery/GradeTimetable",
    hasChildMenu: false,
    isHideMenu: false
  },
  {
    id: "kbgl_03_03",
    title: "班级课表",
    icons: "",
    path: "TimetableQuery/ClassTimetable",
    hasChildMenu: false,
    isHideMenu: false
  },
  {
    id: "kbgl_03_04",
    title: "学生课表",
    icons: "",
    path: "TimetableQuery/StuTimetable",
    hasChildMenu: false,
    isHideMenu: false
  },
  {
    id: "kbgl_03_05",
    title: "教室课表",
    icons: "",
    path: "TimetableQuery/ClassroomTimetable",
    hasChildMenu: false,
    isHideMenu: false
  },
  {
    id: "kbgl_03_06",
    title: "教师课表",
    icons: "",
    path: "TimetableQuery/TechTimetable",
    hasChildMenu: false,
    isHideMenu: false
  },
  {
    id: "kbgl_03_07",
    title: "课表详情",
    icons: "",
    path: "TimetableQuery/LessonDetails",
    hasChildMenu: false,
    isHideMenu: true
  },
  //课表调整
  {
    id: "kbgl_04",
    title: "课表调整",
    icons: "menu_4",
    path: "TimetableAdjust",
    hasChildMenu: true,
    isHideMenu: false
  },
  {
    id: "kbgl_04_01",
    title: "周内调换课调整",
    icons: "",
    path: "TimetableAdjust/SwitchTimetable",
    hasChildMenu: false,
    isHideMenu: false
  },
  {
    id: "kbgl_04_02",
    title: "跨周调换课调整",
    icons: "",
    path: "TimetableAdjust/SwitchTimetableAw",
    hasChildMenu: false,
    isHideMenu: false
  },
  {
    id: "kbgl_04_03",
    title: "代课调整",
    icons: "",
    path: "TimetableAdjust/ReplaceLes",
    hasChildMenu: false,
    isHideMenu: false
  },
  {
    id: "kbgl_04_04",
    title: "场所调整",
    icons: "",
    path: "TimetableAdjust/PlaceAdjust",
    hasChildMenu: false,
    isHideMenu: false
  },
  {
    id: "kbgl_04_05",
    title: "学生换课",
    icons: "",
    path: "TimetableAdjust/StuCgLes",
    hasChildMenu: false,
    isHideMenu: false
  },
  {
    id: "kbgl_04_06",
    title: "换休调整",
    icons: "",
    path: "TimetableAdjust/SpelledAdjustment",
    hasChildMenu: false,
    isHideMenu: false
  },
  {
    id: "kbgl_04_07",
    title: "删除课程",
    icons: "",
    path: "TimetableAdjust/DeleteCouese",
    hasChildMenu: false,
    isHideMenu: false
  },
  {
    id: "kbgl_04_08",
    title: "课表调整记录",
    icons: "",
    path: "TimetableAdjust/ScheduleAdjustment",
    hasChildMenu: false,
    isHideMenu: false
  },
  // 课时统计
  {
    id: "kbgl_05",
    title: "课时统计",
    icons: "menu_5",
    path: "TimeHourStatistic/TimeHourStatistic",
    hasChildMenu: false,
    isHideMenu: false
  },
  // 操作日志
  {
    id: "kbgl_06",
    title: "操作日志",
    icons: "menu_6",
    path: "SysSetting/OperationLog",
    hasChildMenu: false,
    isHideMenu: false
  }
  // 消息页面
  // {
  //   id: "kbgl_06_01",
  //   title: "消息页面",
  //   icons: "",
  //   path: "Message/Message",
  //   isChildPage: true,
  //   hasChildMenu: false,
  //   isHideMenu: true
  // }
];
