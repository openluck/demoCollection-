import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/record/list',
    method: 'get',
    params: query
  })
}

export function fetchRecord(id) {
  return request({
    url: '/record/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/record/pv',
    method: 'get',
    params: { pv }
  })
}

export function createRecord(data) {
  return request({
    url: '/record/create',
    method: 'post',
    data
  })
}

export function updateRecord(data) {
  return request({
    url: '/record/update',
    method: 'put',
    data
  })
}

export function deleteRecord(id) {
  return request({
    url: '/record/deleted',
    method: 'delete',
    params: { id }
  })
}