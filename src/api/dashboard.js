import request from '@/utils/request'

export function index(data) {
  return request({
    url: '/dashboard/index',
    method: 'post',
    data
  })
}
