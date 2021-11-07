/*
 * @Descripttion:
 * @version:
 * @Author: YanQY
 * @Date: 2021-08-02 15:27:47
 * @LastEditors: YanQY
 * @LastEditTime: 2021-08-23 16:59:41
 */
import * as init from "./modules/init";
// 公共
import * as common from "./modules/common/common";

// 课时统计
import * as TimeHourStatistic from "./modules/TimeHourStatistic/TimeHourStatistic";

// 系统设置
import * as RolePermission from "./modules/SysSetting/RolePermission";
import * as PersonSetting from "./modules/SysSetting/PersonSetting";
import * as OperationLog from "./modules/SysSetting/OperationLog";

// 课表管理
import * as TimetableManage from "./modules/TimetableManage/TimetableManage";

// 课表查询
import * as MyTimetable from "./modules/TimetableQuery/MyTimetable";
import * as GradeTimetable from "./modules/TimetableQuery/GradeTimetable";
import * as ClassTimetable from "./modules/TimetableQuery/ClassTimetable";
import * as StuTimetable from "./modules/TimetableQuery/StuTimetable";
import * as ClassroomTimetable from "./modules/TimetableQuery/ClassroomTimetable";
import * as TechTimetable from "./modules/TimetableQuery/TechTimetable";

//课表调整
import * as SwitchTimetable from "./modules/TimetableAdjust/switchTimetable";
import * as ReplaceLes from "./modules/TimetableAdjust/replaceLes";
import * as scheduleAdjustment from "./modules/TimetableAdjust/scheduleAdjustment";
import * as spelledAdjustment from "./modules/TimetableAdjust/spelledAdjustment";  // 换休调整
import * as studentAdjustment from "./modules/TimetableAdjust/studentAdjustment";
import * as placeAdjust from "./modules/TimetableAdjust/placeAdjust"; //场所调整
import * as deleteCouese from "./modules/TimetableAdjust/DeleteCouese"; //删除课程

//节次管理
import * as diffNoonSetting from "./modules/lesSortManage/diffNoonSetting"; //时段设置
import * as lesSortSetting from "./modules/lesSortManage/lesSortSetting"; //节次设置-首页
import * as timePlan from "./modules/lesSortManage/timePlan"; //节次时间方案

// 消息管理
import * as Message from "./modules/Message/Message"; //消息列表
// 操作日志
// import * as OperationLog from "./modules/OperationLog/OperationLog"; //消息列表、

// 默认全部导出
export default {
  init,
  common,

  TimeHourStatistic,
  TimetableManage,
  RolePermission,
  PersonSetting,
  OperationLog,

  MyTimetable,
  GradeTimetable,
  ClassTimetable,
  StuTimetable,
  ClassroomTimetable,
  TechTimetable,

  SwitchTimetable,
  ReplaceLes,
  scheduleAdjustment,
  spelledAdjustment,
  studentAdjustment,
  placeAdjust,
  deleteCouese,

  diffNoonSetting,
  lesSortSetting,
  timePlan,

  Message,
};
