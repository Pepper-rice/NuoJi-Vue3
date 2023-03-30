import request from '@/utils/request'

const api = {
  product: '/oms/product'
}

// 查询商品信息列表
export function listProduct(query) {
  return request({
    url: api.product+'/list',
    method: 'get',
    params: query
  })
}

// 查询商品DTO信息列表
export function listProductDto(query) {
  return request({
    url: api.product+'/dtoList',
    method: 'get',
    params: query
  })
}

// 查询商品信息详细
export function getProduct(id) {
  return request({
    url: api.product + "/" + id,
    method: 'get'
  })
}

// 新增或修改商品信息
export function saveProduct(data) {
  return request({
    url: api.product + (data.id > 0 ? '/update' : '/save'),
    method: 'post',
    data: data
  })
}


// 删除商品信息
export function delProduct(ids) {
  return request({
    url: api.product + "/delete/" + ids,
    method: 'post'
  })
}
