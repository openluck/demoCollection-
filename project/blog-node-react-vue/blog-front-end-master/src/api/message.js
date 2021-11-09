import request from '../utils/request'

export function _getList(query) {
  return request({
    url: '/api/word/list',
    method: 'get',
    params: query
  })
}

export function _getChildList(id) {
  return request({
    url: '/api/word/listChild',
    method: 'get',
    params: { id }
  })
}

export function _createChild(data) {
  return request({
    url: '/api/word/createChild',
    method: 'post',
    data
  })
}

export function _create(data) {
  return request({
    url: '/api/word/create',
    method: 'post',
    data
  })
}