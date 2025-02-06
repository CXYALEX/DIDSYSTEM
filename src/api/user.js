import request from '@/utils/request'

export function login(data) {
  return request({
    url: "/users/login",
    method: 'post',
    data
  })
}

export function register(data) {
  return request({
    url: "/users/register",
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/users/getInfo',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}

export function login2(data) {
  return request({
    url: "/users/login",
    method: 'post',
    data
  })
}
