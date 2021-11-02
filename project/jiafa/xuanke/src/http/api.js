/* 
 * 接口统一集成模块
 */
import * as init from './modules/init'
// 教师
import * as teacher from './modules/teacher/teacher'
// 选课设置
import * as courseSet from './modules/teacher/components/courseSet'
// 选课结果
import * as courseResult from './modules/teacher/components/courseResult'
// 选考课程
import * as chooseTest from './modules/teacher/chooseTest'
//学生
import * as student from './modules/student/student'
//权限设置
import * as admin from './modules/admin/admin'

// 默认全部导出
export default {
    init,
    teacher,
    courseSet,
    courseResult,
    chooseTest,
    student,
    admin
}