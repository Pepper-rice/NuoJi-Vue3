import request from '@/utils/request'

const api = {
  purchase: '/oms/purchaseOrder'
}

// 查询采购订单列表
export function listPurchase(query) {
  return request({
    url: api.purchase+'/list',
    method: 'get',
    params: query
  })
}

// 查询采购订单详细
export function getPurchase(id) {
  return request({
    url: api.purchase + "/" + id,
    method: 'get'
  })
}

// 新增或修改采购订单
export function savePurchase(data) {
  return request({
    url: api.purchase + (data.id > 0 ? '/update' : '/save'),
    method: 'post',
    data: data
  })
}


// 删除采购订单
export function delPurchase(ids) {
  return request({
    url: api.purchase + "/delete/" + ids,
    method: 'post'
  })
}


// 确认入库
export function confirmPurchase(ids) {
  return request({
    url: api.purchase + "/confirm/" + ids,
    method: 'post'
  })
}
