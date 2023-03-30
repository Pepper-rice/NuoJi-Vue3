import request from '@/utils/request'

const api = {
  inventoryLog: '/oms/inventoryLog'
}

// 查询库存操作日志列表
export function listInventoryLog(query) {
  return request({
    url: api.inventoryLog+'/list',
    method: 'get',
    params: query
  })
}

// 查询库存操作日志详细
export function getInventoryLog(id) {
  return request({
    url: api.inventoryLog + "/" + id,
    method: 'get'
  })
}

// 新增或修改库存操作日志
export function saveInventoryLog(data) {
  return request({
    url: api.inventoryLog + (data.id > 0 ? '/update' : '/save'),
    method: 'post',
    data: data
  })
}


// 删除库存操作日志
export function delInventoryLog(ids) {
  return request({
    url: api.inventoryLog + "/delete/" + ids,
    method: 'post'
  })
}
