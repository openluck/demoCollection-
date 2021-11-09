import request from '../utils/request'

export function _login(data) {
  return request({
    url: '/api/user/login',
    method: 'post',
    data
  })
}

export function _register(data) {
  return request({
    url: '/api/user/register',
    method: 'post',
    data
  })
}

export function _getInfo(token) {
    return request({
      url: '/api/user/info',
      method: 'get',
      headers: {
        Authorization: token
      }
    })
  }