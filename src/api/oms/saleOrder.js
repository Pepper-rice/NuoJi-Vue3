import request from '@/utils/request'

const api = {
  saleOrder: '/oms/saleOrder'
}

// 查询销售订单列表
export function listSaleOrder(query) {
  return request({
    url: api.saleOrder+'/list',
    method: 'get',
    params: query
  })
}

// 查询销售订单详细
export function getSaleOrder(id) {
  return request({
    url: api.saleOrder + "/" + id,
    method: 'get'
  })
}

// 新增或修改销售订单
export function saveSaleOrder(data) {
  return request({
    url: api.saleOrder + (data.id > 0 ? '/update' : '/save'),
    method: 'post',
    data: data
  })
}


// 删除销售订单
export function delSaleOrder(ids) {
  return request({
    url: api.saleOrder + "/delete/" + ids,
    method: 'post'
  })
}

// 确认入库
export function confirmSaleOrder(ids) {
  return request({
    url: api.saleOrder + "/confirm/" + ids,
    method: 'post'
  })
}
