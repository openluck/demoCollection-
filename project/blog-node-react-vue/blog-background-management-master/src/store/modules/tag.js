import { _getTagList } from '../../api/recordTag'

const getDefaultState = () => {
  return {
    tagList: []
  }
}
const state = getDefaultState()

const mutations = {
  SET_TAG_LIST: (state, list) => {
    state.tagList = list
  }
}

const actions = {
    getTagList: ({ commit }) => {
    return new Promise((resolve, reject) => {
        _getTagList().then(response => {
        const { data } = response
        commit('SET_TAG_LIST', data)
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

