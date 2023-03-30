import request from '@/utils/request'

const api = {
  supplier: '/oms/supplier'
}

// 查询供应商信息列表
export function listSupplier(query) {
  return request({
    url: api.supplier+'/list',
    method: 'get',
    params: query
  })
}

// 查询所有供应商信息列表
export function listAllSupplier(query) {
  return request({
    url: api.supplier+'/allList',
    method: 'get',
    params: query
  })
}

// 查询供应商信息详细
export function getSupplier(id) {
  return request({
    url: api.supplier + "/" +id,
    method: 'get'
  })
}

// 新增或修改供应商信息
export function saveSupplier(data) {
  return request({
    url: api.supplier + (data.id > 0 ? '/update' : '/save'),
    method: 'post',
    data: data
  })
}


// 删除客户信息
export function delSupplier(ids) {
  return request({
    url: api.supplier + `/delete/${ids}`,
    method: 'post'
  })
}


