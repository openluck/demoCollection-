/*
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-06-08 10:21:54
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-08-25 18:52:56
 */
/*
 * 接口统一集成模块
 */
import * as init from './modules/init'
//权限设置
import * as permissionSetting from './modules/permissionSetting/permissionSetting'

//智能分班
import * as chooseExam from './modules/divideClass/chooseExam'
import * as adminClass from './modules/divideClass/adminClass'
import * as getDivideClassList from './modules/getDivideClassList/getDivideClassList'
import * as viewResult from './modules/divideClass/viewResult'

// 默认全部导出
export default {
  init,
  permissionSetting,
  chooseExam,
  adminClass,
  getDivideClassList,
  viewResult
}
