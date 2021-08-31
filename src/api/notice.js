import request from '@/utils/request'

export function searchNotice(data) {
  return request({
    url: '/user-notice/search',
    method: 'post',
    data
  })
}

export function saveNotice(data) {
  return request({
    url: '/user-notice/update',
    method: 'post',
    data
  })
}
