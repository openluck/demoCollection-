/*
 * @Descripttion:
 * @version:
 * @Author: OpenLcuk
 * @Date: 2021-06-08 17:58:45
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-06-21 15:52:45
 */
/*
 * @Descripttion:
 * @version:
 * @Author: OpenLcuk
 * @Date: 2021-06-08 17:58:45
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-06-09 10:02:56
 */
/*
 * 接口统一集成模块
 */
import * as init from "./modules/init";
//权限设置
import * as permissionSetting from "./modules/permissionSetting/permissionSetting";
import * as ArrangeOperation from "./modules/arrangeOperation/ArrangeOperation";

import * as PreviewTimetable from "./modules/SmartArrLesson/ArrLesson/PreviewTimetable"; // 课表预览
import * as ArrLessonRule from "./modules/SmartArrLesson/ArrLesson/ArrLessonSetting/ArrLessonRule"; // 规则设置
import * as TeacherLesArrange from "./modules/SmartArrLesson/ArrLesson/ArrLessonSetting/TeacherLesArrange"; // 教师任课
import * as ClassArrange from "./modules/SmartArrLesson/ArrLesson/ArrLessonSetting/ClassArrange"; // 教师任课
import * as ClassTeachArrange from "./modules/SmartArrLesson/ArrLesson/ArrLessonSetting/ClassTeachArrange"; // 教师任课
import * as CourseSecArrange from "./modules/SmartArrLesson/ArrLesson/ArrLessonSetting/CourseSecArrange"; // 教师任课
import * as ArrlessonList from './modules/SmartArrLesson/ArrLessonList/index'
import * as Common from "./modules/common"; // 公共分类
import * as DivideClassList from "./modules/SmartArrLesson/DivideClassList"; // 分班
import * as SectionArrList from "./modules/SmartArrLesson/SectionArrList"; // 节次安排
import * as ArrLessonSetting from "./modules/SmartArrLesson/ArrLessonSetting"; // 安排

// 默认全部导出
export default {
  init,
  permissionSetting,
  ArrangeOperation,
  PreviewTimetable,
  ArrLessonRule,
  Common,
  DivideClassList,
  SectionArrList,
  TeacherLesArrange,
  ClassArrange,
  ClassTeachArrange,
  CourseSecArrange,
  ArrlessonList,
  ArrLessonSetting
};
