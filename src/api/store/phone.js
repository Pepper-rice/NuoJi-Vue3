import request from '@/utils/request'

// 查询手机列表
export function listPhone(query) {
  return request({
    url: '/store/phone/list',
    method: 'get',
    params: query
  })
}

// 查询手机详细
export function getPhone(phoneId) {
  return request({
    url: '/store/phone/' + phoneId,
    method: 'get'
  })
}

// 新增手机
export function addPhone(data) {
  return request({
    url: '/store/phone',
    method: 'post',
    data: data
  })
}

// 修改手机
export function updatePhone(data) {
  return request({
    url: '/store/phone',
    method: 'put',
    data: data
  })
}

// 删除手机
export function delPhone(phoneId) {
  return request({
    url: '/store/phone/' + phoneId,
    method: 'delete'
  })
}
