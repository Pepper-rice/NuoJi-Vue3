import request from '@/utils/request'

const api = {
  warehouse: '/oms/warehouse'
}

// 查询仓库信息列表
export function listWarehouse(query) {
  return request({
    url: api.warehouse+'/list',
    method: 'get',
    params: query
  })
}

// 查询所有仓库信息列表
export function listAllWarehouse(query) {
  return request({
    url: api.warehouse+'/allList',
    method: 'get',
    params: query
  })
}

// 查询仓库信息详细
export function getWarehouse(id) {
  return request({
    url: api.warehouse + "/" + id,
    method: 'get'
  })
}

// 新增或修改仓库信息
export function saveWarehouse(data) {
  return request({
    url: api.warehouse + (data.id > 0 ? '/update' : '/save'),
    method: 'post',
    data: data
  })
}


// 删除仓库信息
export function delWarehouse(ids) {
  return request({
    url: api.warehouse + `/delete/${ids}`,
    method: 'post'
  })
}
