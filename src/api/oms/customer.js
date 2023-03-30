import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";

const api = {
  customer: '/oms/customer'
}

// 查询客户信息列表
export function listCustomer(query) {
  return request({
    url: api.customer+'/list',
    method: 'get',
    params: query
  })
}

// 查询所有客户信息列表
export function listAllCustomer(query) {
  return request({
    url: api.customer+'/allList',
    method: 'get',
    params: query
  })
}


// 查询客户信息详细
export function getCustomer(id) {
  return request({
    url: api.customer + "/" +praseStrEmpty(id),
    method: 'get'
  })
}

// 新增或修改客户信息
export function saveCustomer(data) {
  return request({
    url: api.customer + (data.id > 0 ? '/update' : '/save'),
    method: 'post',
    data: data
  })
}


// 删除客户信息
export function delCustomer(ids) {
  return request({
    url: api.customer + `/delete/${ids}`,
    method: 'post'
  })
}
