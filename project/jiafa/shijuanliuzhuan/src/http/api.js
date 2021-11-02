/* 
 * 接口统一集成模块
 */
import * as taskMonitor from './modules/taskMonitor'
import * as init from './modules/init'
import * as workRequireMent from './modules/workRequireMent'
import * as escortTask from './modules/escortTask'
import * as escortPlan from './modules/escortPlan'
import * as exportApi from './modules/export'

// 默认全部导出
export default {
    taskMonitor,
    init,
    workRequireMent,
    escortPlan,
    escortTask,exportApi
}