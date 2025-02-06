import request from '@/utils/request'

export function createAuthorInfo(data) {
  return request({
    url: "/author/",
    method: 'post',
    data
  })
}

export function getAuthorInfo() {
  return request({
    url: "/author/",
    method: 'get',
  })
}

export function getAuthorInfoById(id) {
  return request({
    url: "/author/" + id,
    method: 'get',
  })
}

export function UpdateAuthorInfoById(data) {
  return request({
    url: "/author/" + data.id,
    method: 'put',
    data: data
  })
}

export function DeleteAuthorInfoById(id) {
  return request({
    url: "/author/" + id,
    method: 'delete',
  })
}
