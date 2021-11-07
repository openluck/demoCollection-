/*
 * @Description: 
 * @Version: 
 * @Autor: cb
 * @Date: 2021-08-16 09:29:06
 * @LastEditors: cb
 * @LastEditTime: 2021-08-16 15:31:05
 */
const stuCgLes={
  namespaced: true,
  state:{
    searchDataAll: {
      secId: "",
      gradeId: "",
      classId: "",
      personId:""
    },
    secListAll: [],
    gradeListAll: [],
    classListAll: [],
    personListAll:[],
    stuName:''
  },
  mutations:{
    setAdjustData(state, item) {
      state.searchDataAll=item.searchData 
      state.secListAll=item.secList
      state.gradeListAll=item.gradeList
      state.classListAll=item.classList
      state.personListAll=item.personList
      state.stuName=item.stuName
      // console.log('点击确定存储',state);
    },
  },
  actions:{
    
  }
};

export default  stuCgLes;