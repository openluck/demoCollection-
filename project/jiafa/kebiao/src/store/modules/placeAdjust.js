/*
 * @Description:场所选择组件
 * @Version: 
 * @Autor: cb
 * @Date: 2021-08-17 10:13:46
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-09-02 15:31:46
 */
const placeAdjust = {
  namespaced: true,
  state: {
    placeId: '',
    treeData: [],
    treeDefaultExpandedKeys: []
  },
  mutations: {
    setPlace(state, item) {
      state.placeId = item.placeIdTemp
      state.treeData = item.treeDataTemp
      state.treeDefaultExpandedKeys = item.treeDefaultExpandedKeys
    },
    setTreeData(state, data) {
      state.treeData = data
      state.treeData = [...state.treeData]
    }
  },
  actions: {

  }
};

export default placeAdjust;