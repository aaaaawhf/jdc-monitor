import request from '@/utils/request'

export function searchAccount(data) {
  return request({
    url: '/user-account/search',
    method: 'post',
    data
  })
}

export function createAccount(data) {
  return request({
    url: '/user-account/create',
    method: 'post',
    data
  })
}

export function updateAccount(data) {
  return request({
    url: '/user-account/update',
    method: 'post',
    data
  })
}

export function deleteAccount(data) {
  return request({
    url: '/user-account/delete',
    method: 'post',
    data
  })
}
