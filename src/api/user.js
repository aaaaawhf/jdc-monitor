import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/auth/info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/auth/logout',
    method: 'get'
  })
}

export function searchUser(data) {
  return request({
    url: '/system-user/search',
    method: 'post',
    data
  })
}

export function createUser(data) {
  return request({
    url: '/system-user/create',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/system-user/update',
    method: 'post',
    data
  })
}

export function modifyStatus(data) {
  return request({
    url: '/system-user/modifyStatus',
    method: 'post',
    data
  })
}

export function deleteUser(data) {
  return request({
    url: '/system-user/delete',
    method: 'post',
    data
  })
}

export function getUserRole(data) {
  return request({
    url: '/system-user-role/search',
    method: 'post',
    data
  })
}
