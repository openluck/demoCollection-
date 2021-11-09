import request from '@/utils/request'

export function _getArticleClassifyList() {
  return request({
    url: '/articleClassify/list',
    method: 'get'
  })
}

export function fetchArticle(id) {
  return request({
    url: '/articleClassify/detail',
    method: 'get',
    params: { id }
  })
}

export function _update(data) {
  return request({
    url: '/articleClassify/update',
    method: 'patch',
    data
  })
}

export function _create(data) {
  return request({
    url: '/articleClassify/create',
    method: 'post',
    data
  })
}

export function _delete(id) {
  return request({
    url: '/articleClassify/deleted',
    method: 'delete',
    params: { id }
  })
}

