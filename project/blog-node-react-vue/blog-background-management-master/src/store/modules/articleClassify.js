import { _getArticleClassifyList } from '../../api/articleClassify'

const getDefaultState = () => {
  return {
    classifyList: []
  }
}
const state = getDefaultState()

const mutations = {
  SET_CLASSIFY_LIST: (state, list) => {
    state.classifyList = list
  }
}

const actions = {
  getClassifyList: ({ commit }) => {
    return new Promise((resolve, reject) => {
      _getArticleClassifyList().then(response => {
        const { data } = response
        commit('SET_CLASSIFY_LIST', data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

