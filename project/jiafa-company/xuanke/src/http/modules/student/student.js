import axios from '../../axios'

// 学生-根据学生studentId 获取选课活动视图数据（携带token就行）
export const getStudent = (data) => {
    return axios({
        url: "/api/StudentSelections/getStudentSelectionsView",
        method: "post",
        data
    })
}
// 学生-保存学生选课结果
export const saveStudent = (data) => {
    return axios({
        url: "/api/StudentSelections/saveStudentSelections",
        method: "post",
        data
    })
}
// 学生-根据登录信息获取学生选课组合选课记录
export const getSectionHistoryList = (data) => {
    return axios({
        url: "/api/StudentSelections/getSectionHistoryList",
        method: "post",
        data
    })
}
// 学生-获取学生信息
export const getSysStudentsByStudentId = (data) => {
    return axios({
        url: "/api/Students/getSysStudentsByStudentId",
        method: "post",
        data
    })
}