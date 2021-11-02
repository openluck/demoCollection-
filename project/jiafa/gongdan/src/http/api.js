/* 
 * 接口统一集成模块
 */
import * as workOrderAudit from './modules/WorkOrderAudit'

/* 
 * 变更统计
 */
import * as ModifyStatistic from './modules/ModifyStatistic/ModifyStatistic'

/* 
 * 变更统计
 */
import * as ModifySearch from './modules/ModifySearch/ModifySearch'
/* 
 * 变更项统计
 */
import * as ModifyItemStatistic from './modules/ModifyItemStatistic/ModifyItemStatistic'
/**
 * 工单申请
 */
import * as WorkOrderApply from './modules/WorkOrderApply'

/**
 * 工单设置
 */
import * as WorkOrderSetting from './modules/WorkOrderSetting'

/**
 * 报名数据查询
 */
import * as ApplyDataSearch from './modules/ApplyDataSearch/ApplyDataSearch'



import * as user from './modules/user/user'
/**
 * 公共
 */
import * as common from './modules/common/common'
/**
 * 考生类型统计
 */
import * as exeeTypeStatistics from './modules/exeeTypeStatistics/exeeTypeStatistics'
/**
 * 报考数据统计
 */
import * as ApplyDataStatistical from './modules/ApplyDataStatistical'

// 默认全部导出
export default {

  // 变更统计
  ModifyStatistic,
  // 变更项统计
  ModifyItemStatistic,
  // 变更查询
  ModifySearch,
  // 系统管理
  user,
  workOrderAudit,
  WorkOrderSetting,
  WorkOrderApply,
  ApplyDataSearch,
  exeeTypeStatistics,
  common,
  ApplyDataStatistical
}