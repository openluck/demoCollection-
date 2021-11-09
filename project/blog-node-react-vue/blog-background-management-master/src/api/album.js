import request from '@/utils/request'

export function _getList(query) {
  return request({
    url: '/album/list',
    method: 'get',
    params: query
  })
}

export function _getPhotoList(query) {
  return request({
    url: '/album/photoList',
    method: 'get',
    params: query
  })
}

export function _createPhoto(data) {
  return request({
    url: '/album/addPhoto',
    method: 'post',
    data
  })
}

export function _create(data) {
  return request({
    url: '/album/create',
    method: 'post',
    data
  })
}

export function _update(data) {
    return request({
        url: '/album/update',
        method: 'patch',
        data
    })
}

export function _deletePhoto(id) {
  return request({
    url: '/album/deletePhoto',
    method: 'delete',
    params: { id }
  })
}

export function _delete(id) {
  return request({
    url: '/album/deleted',
    method: 'delete',
    params: { id }
  })
}