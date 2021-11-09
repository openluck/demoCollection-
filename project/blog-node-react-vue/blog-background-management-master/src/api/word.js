import request from '@/utils/request'

export function _getList(query) {
  return request({
    url: '/word/list',
    method: 'get',
    params: query
  })
}

export function _getChildList(id) {
  return request({
    url: '/word/listChild',
    method: 'get',
    params: { id }
  })
}

export function _createChild(data) {
  return request({
    url: '/word/createChild',
    method: 'post',
    data
  })
}

export function _create(data) {
  return request({
    url: '/word/create',
    method: 'post',
    data
  })
}

export function _deleteChild(id) {
  return request({
    url: '/word/deletedChild',
    method: 'delete',
    params: { id }
  })
}

export function _delete(id) {
  return request({
    url: '/word/deleted',
    method: 'delete',
    params: { id }
  })
}
