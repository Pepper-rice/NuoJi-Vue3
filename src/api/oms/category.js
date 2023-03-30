import request from '@/utils/request'

const api = {
  category: '/oms/category'
}

// 查询商品分类信息列表
export function listCategory(query) {
  return request({
    url: api.category+'/list',
    method: 'get',
    params: query
  })
}

// 查询商品分类信息详细
export function getCategory(id) {
  return request({
    url: api.category + "/" + id,
    method: 'get'
  })
}

// 新增或修改商品分类信息
export function saveCategory(data) {
  return request({
    url: api.category + (data.id > 0 ? '/update' : '/save'),
    method: 'post',
    data: data
  })
}


// 删除商品分类信息
export function delCategory(ids) {
  return request({
    url: api.category + "/delete/" + ids,
    method: 'post'
  })
}
