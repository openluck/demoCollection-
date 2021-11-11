/*
 * @Description: 删除课程
 * @Version: 
 * @Autor: cb
 * @Date: 2021-08-17 10:14:29
 * @LastEditors: cb
 * @LastEditTime: 2021-08-18 09:14:20
 */
const deleteCouese={
  namespaced: true,
  state:{
    searchDataAll: {
      typeId:'',//下拉框类型
      secId: "",
      gradeId: "",
      classId: "",
      personId:'',
      placeId:'',
      secList: [], //学段
      gradeList: [],//年级
      classList: [],//班级
      personList:[],//教师
      treeData:[], //场所
    },

  },
  mutations:{
    setCouese(state, item) {
      state.searchDataAll=JSON.parse(JSON.stringify(item))
    },
  },
  actions:{
    
  }
};

export default  deleteCouese;