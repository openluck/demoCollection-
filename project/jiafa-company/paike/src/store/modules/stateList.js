/*
 * @Descripttion:
 * @version:
 * @Author: OpenLcuk
 * @Date: 2021-06-25 10:25:18
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-09-22 16:42:22
 */

export default {
  namespaced: true,
  state: {
    sectionArr: [],
    arrLessonNumber: "",
    selectIdList: [],
    onli1: true,
    onli2: false,
    onli3: false,
    onli4: false,
    onli5: false,
    successedli1: false,
    successedli2: false,
    successedli3: false,
    successedli4: false,
    successedli5: false,
    courseTime: 0, // 学生最大课时数
    stuMaxMorigningCourse: 0, // 学生最大早自习课时数
    stuMaxNightCourse: 0, // 学生最大晚自习课时数
    fbPlanId: "",
    fbPlanName: "",
    showTipe: false,
    classWeekHour: 0, // 班级授课页面-班级总课时数
    classMoriningHour: 0, // 班级授课页面-早自习课时数
    classNightHour: 0, // 班级授课页面-晚自习课时数
    showClassWeekHour: false,
    remberPath: "", // 记录去排课页面的路径,
    arrLessonCompareIdList: [],
    teacherGroupId: "",
    divideArrangeLesPage: 1, // 保存排课方案组的页数
    divideArrangeLesChangePage: 10, // 保存排课方案组的数据条数
    arrLessonListPage: 1, // 保存排课方案页数
    arrLessonListChangePage: 10 // 保存排课方案的数据条数
  },

  mutations: {
    setSectionArr(state, payload) {
      state.sectionArr = JSON.parse(JSON.stringify(payload));
    },
    setArrLessonNumber(state, payload) {
      state.arrLessonNumber = payload;
    },
    setOnLi1(state, payload) {
      state.onli1 = true;
      state.onli2 = false;
      state.onli3 = false;
      state.onli4 = false;
      state.onli5 = false;
    },
    setOnLi2(state, payload) {
      state.onli1 = false;
      state.onli2 = true;
      state.onli3 = false;
      state.onli4 = false;
      state.onli5 = false;
    },
    setOnLi3(state, payload) {
      state.onli1 = false;
      state.onli2 = false;
      state.onli3 = true;
      state.onli4 = false;
      state.onli5 = false;
    },
    setOnLi4(state, payload) {
      state.onli1 = false;
      state.onli2 = false;
      state.onli3 = false;
      state.onli4 = true;
      state.onli5 = false;
    },
    setOnLi5(state, payload) {
      state.onli1 = false;
      state.onli2 = false;
      state.onli3 = false;
      state.onli4 = false;
      state.onli5 = true;
    },
    setCourseTime(state, payload) {
      state.courseTime = payload.courseTime;
      state.stuMaxMorigningCourse = payload.stuMaxMorigningCourse;
      state.stuMaxNightCourse = payload.stuMaxNightCourse;
    },
    setFbPlanIdName(state, fbPlanId) {
      state.fbPlanId = fbPlanId;
    },
    setFbPlanName(state, fbPlanName) {
      state.fbPlanName = fbPlanName;
    },
    setShowTipe(state, payload) {
      state.showTipe = payload;
    },
    setClassWeekHour(state, payload) {
      state.classWeekHour = payload.classWeekHour;
      state.classMoriningHour = payload.classMoriningHour;
      state.classNightHour = payload.classNightHour;
    },
    setShowClassWeekHour(state, payload) {
      state.showClassWeekHour = payload;
    },
    setRemberPath(state, payload) {
      state.remberPath = payload;
    },
    setArrLessonCompareIdList(state, payload) {
      state.arrLessonCompareIdList = payload;
    },
    setTeacherGroupId(state, payload) {
      state.teacherGroupId = payload;
    },
    // 保存排课方案组的页数
    setDivideArrangeLesPage(state, payload) {
      state.divideArrangeLesPage = payload;
    },
    // 保存排课方案组的数据条数
    setDivideArrangeLesChangePage(state, payload) {
      state.divideArrangeLesChangePage = payload;
    },
    // arrLessonListPage: 1, // 保存排课方案页数
    // arrLessonListChangePage: 10 // 保存排课方案的数据条数
    // 保存排课方案页数
    setArrLessonListPage(state, payload) {
      state.arrLessonListPage = payload;
    },
     // 保存排课方案的数据条数
    setArrLessonListChangePage(state, payload) {
      state.arrLessonListChangePage = payload;
    },
  },
};
