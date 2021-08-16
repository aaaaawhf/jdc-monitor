import request from '@/utils/request'

export function searchStatistics(data) {
  return request({
    url: '/account-device-list-speed-monitor/search',
    method: 'post',
    data
  })
}
