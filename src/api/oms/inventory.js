import request from '@/utils/request'

const api = {
  inventory: '/oms/inventory'
}

// 查询库存信息列表
export function listInventory(query) {
  return request({
    url: api.inventory+'/list',
    method: 'get',
    params: query
  })
}

// 查询库存信息列表-弹出框
export function selectList(query) {
  return request({
    url: api.inventory+'/selectList',
    method: 'get',
    params: query
  })
}

// 查询库存信息详细
export function getInventory(id) {
  return request({
    url: api.inventory + "/" + id,
    method: 'get'
  })
}

// 新增或修改库存信息
export function saveInventory(data) {
  return request({
    url: api.inventory + (data.id > 0 ? '/update' : '/save'),
    method: 'post',
    data: data
  })
}


// 删除库存信息
export function delInventory(ids) {
  return request({
    url: api.inventory + "/delete/" + ids,
    method: 'post'
  })
}
