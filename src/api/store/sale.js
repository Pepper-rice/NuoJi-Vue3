import request from '@/utils/request'

// 查询销售列表
export function listSale(query) {
  return request({
    url: '/store/sale/list',
    method: 'get',
    params: query
  })
}

// 查询销售详细
export function getSale(saleId) {
  return request({
    url: '/store/sale/' + saleId,
    method: 'get'
  })
}

// 新增销售
export function addSale(data) {
  return request({
    url: '/store/sale',
    method: 'post',
    data: data
  })
}

// 修改销售
export function updateSale(data) {
  return request({
    url: '/store/sale',
    method: 'put',
    data: data
  })
}

// 删除销售
export function delSale(saleId) {
  return request({
    url: '/store/sale/' + saleId,
    method: 'delete'
  })
}
