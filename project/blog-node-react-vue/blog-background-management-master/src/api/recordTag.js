import request from '@/utils/request'

export function _getTagList() {
  return request({
    url: '/recordTag/list',
    method: 'get'
  })
}

export function fetchArticle(id) {
  return request({
    url: '/recordTag/detail',
    method: 'get',
    params: { id }
  })
}

export function _update(data) {
  return request({
    url: '/recordTag/update',
    method: 'patch',
    data
  })
}

export function _create(data) {
  return request({
    url: '/recordTag/create',
    method: 'post',
    data
  })
}

export function _delete(id) {
  return request({
    url: '/recordTag/deleted',
    method: 'delete',
    params: { id }
  })
}

