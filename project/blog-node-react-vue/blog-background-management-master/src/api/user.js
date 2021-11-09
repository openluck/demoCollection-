import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function _register(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}

export function _update(data) {
  return request({
    url: '/user/update',
    method: 'post',
    data
  })
}

export function _delete(id) {
  return request({
    url: '/user/deleted',
    method: 'delete',
    params: { id }
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    headers: {
      Authorization: token
    }
  })
}

export function getUserList(params) {
  return request({
    url: '/user/list',
    method: 'get',
    params
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
