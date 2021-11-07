/**
 * @description 公共状态store
 * @version v1.0
 * @author WuQiao
 * @date 2021-6-8 14:26:24
 */
import {
  getActionCourse,
  getClassroomTree,
  getActionPerson,
} from '@/http/modules/common'
import { getUseClassList } from '@/http/modules/SmartArrLesson/ArrLesson/ArrLessonSetting/ArrLessonRule'
import { message } from 'ant-design-vue'
export default {
  namespaced: true,
  state: {
    classroomTree: [], // 场所（教室）树
    courseList: [], // 作用课程列表
    useStaticClassList: [], // 标准班级列表
    useClassList: [], // 作用班级列表
    actionPerson: [], // 作用人员列表
    
  },
  getters: {},
  mutations: {
    setClassroomTree(state, payload) {
      state.classroomTree = payload
    },
    setActionCourse(state, payload) {
      state.courseList = payload
    },
    setUseStaticClassList(state, payload) {
      state.useStaticClassList = payload
    },
    setUseClassList(state, payload) {
      state.useClassList = payload
    },
    setActionPerson(state, payload) {
      state.actionPerson = payload
    },
  },
  actions: {
    // 获取作用课程列表
    async getActionCourseAsync(context, params) {
      try {
        // const params = { arrLessonId }
        const res = await getActionCourse(params)
        console.log('res', res)
        if (res.code === '200' || res.code === 200) {
          const {
            data,
          } = res
          const adminCouse = data.filter((i) => i.courseType === 1) // 课程类型  String  1行政
          const chooseCouse = data.filter((i) => i.courseType === 2) // 课程类型  String  2选考
          const studyCouse = data.filter((i) => i.courseType === 3) // 课程类型  String  3学考
          const courseList = [
            { label: '行政班级', icon: 'user-add', data: adminCouse },
            { label: '选考班级', icon: 'usergroup-delete', data: chooseCouse },
            { label: '学考班级', icon: 'team', data: studyCouse },
          ]
          console.log('courseList', courseList)
          context.commit('setActionCourse', courseList)
        } else {
          message.error('获取作用课程失败！' + res.message)
        }
      } catch (error) {
        throw new Error(error)
      }
    },
    // 获取场所（教室）树
    async getClassroomTreeAsync(context) {
      try {
        const params = {}
        const res = await getClassroomTree(params)
        if (res.code === '200' || res.code === 200) {
          const {
            data: { list },
          } = res
          context.commit('setClassroomTree', list)
        } else {
          message.error('获取场所结构树失败！' + res.message)
        }
      } catch (error) {
        throw new Error(error)
      }
    },
    // 作用标准班级列表
    async getStaticUseClassListAsync(context, params) {
      console.log('获取标准班级');
      try {
        // const params = { arrLessonId, courseType, courseId }
        const res = await getUseClassList(params)
        if (res.code === '200' || res.code === 200) {
          const {
            data: { list },
          } = res
          context.commit('setUseStaticClassList', list)
        } else {
          message.error('获取作用班级列表失败！' + res.message)
        }
      } catch (error) {
        throw new Error(error)
      }
    },
    // 作用班级列表
    async getUseClassListAsync(context, params) {
      try {
        // const params = { arrLessonId, courseType, courseId }
        const res = await getUseClassList(params)
        if (res.code === '200' || res.code === 200) {
          const {
            data: { list },
          } = res
          context.commit('setUseClassList', list)
        } else {
          message.error('获取作用班级列表失败！' + res.message)
        }
      } catch (error) {
        throw new Error(error)
      }
    },
    // 作用人员列表
    async getActionPersonAsync(context, { arrLessonId }) {
      try {
        const params = { arrLessonId }
        const res = await getActionPerson(params)
        if (res.code === '200' || res.code === 200) {
          const {
            data: { list },
          } = res
          context.commit('setActionPerson', list)
        } else {
          message.error('获取作用人员失败！' + res.message)
        }
      } catch (error) {
        throw new Error(error)
      }
    },
  },
}
