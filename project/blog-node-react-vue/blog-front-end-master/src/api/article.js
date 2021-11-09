import request from '../utils/request'

export function _getArticleList(query) {
    return request({
        url: '/api/article/list',
        method: 'get',
        params: query
    })
}
export function _getArticleClassifyList() {
    return request({
      url: 'api/articleClassify/list',
      method: 'get'
    })
}

export function _getArticle(id) {
    return request({
        url: '/api/article/detail',
        method: 'get',
        params: { id }
    })
}

export function fetchPv(pv) {
    return request({
        url: '/article/pv',
        method: 'get',
        params: { pv }
    })
}

export function createArticle(data) {
    return request({
        url: '/article/create',
        method: 'post',
        data
    })
}

export function updateArticle(data) {
    return request({
        url: '/article/update',
        method: 'put',
        data
    })
}

export function deleteArticle(id) {
    return request({
        url: '/article/deleted',
        method: 'delete',
        params: { id }
    })
}
