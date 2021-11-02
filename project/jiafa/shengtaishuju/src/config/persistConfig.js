import storageSession from 'redux-persist/lib/storage/session'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
/**
 * @description 配置persist
 */
const persistConfig = {
    key: 'root',
    storage: storageSession,
    stateReconciler: autoMergeLevel2, // 查看 'Merge Process' 部分的具体情况
    whitelist:[
        "ws_global_reducer"
        // "ISCED_semesterList",//学期列表
        // "ISCED_courseTypeList",//课程类型列表
        // "ISCED_roleData",//鉴权数据
        // "ISCED_courseList",//课程列表
        // "ISCED_teacherList",//教师列表
        // "ISCED_collegeList",//学院列表
        // "ISCED_codeList"//基础码表
    ]//存全局名单
};
export default  persistConfig;