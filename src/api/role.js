import request from '@/utils/request'

export function search(data) {
  return request({
    url: '/system-role/search',
    method: 'post',
    data
  })
}

export function createRole(data) {
  return request({
    url: '/system-role/create',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: '/system-role/update',
    method: 'post',
    data
  })
}

export function deleteRole(data) {
  return request({
    url: '/system-role/delete',
    method: 'post',
    data
  })
}

export function getRoleAuthority(data) {
  return request({
    url: '/system-role-authority/search',
    method: 'post',
    data
  })
}
