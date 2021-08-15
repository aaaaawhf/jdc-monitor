import request from '@/utils/request'

export function searchDeviceList(data) {
  return request({
    url: '/account-device-list/search',
    method: 'post',
    data
  })
}
