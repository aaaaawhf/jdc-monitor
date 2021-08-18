import request from '@/utils/request'

export function searchDeviceList(data) {
  return request({
    url: '/account-device-list/search',
    method: 'post',
    data
  })
}

export function updateCost(data) {
  return request({
    url: '/account-device-list/updateCost',
    method: 'post',
    data
  })
}

export function updateReboot(data) {
  return request({
    url: '/account-device-list/reboot',
    method: 'post',
    data
  })
}
