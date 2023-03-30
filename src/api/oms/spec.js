import request from '@/utils/request'

const api = {
  spec: '/oms/spec'
}

// 查询商品规格列表
export function listSpec(query) {
  return request({
    url: api.spec+'/list',
    method: 'get',
    params: query
  })
}

// 查询商品规格详细
export function getSpec(id) {
  return request({
    url: api.spec + "/" + id,
    method: 'get'
  })
}

// 新增或修改商品规格
export function saveSpec(data) {
  return request({
    url: api.spec + (data.id > 0 ? '/update' : '/save'),
    method: 'post',
    data: data
  })
}


// 删除商品规格
export function delSpec(ids) {
  return request({
    url: api.spec + "/delete/" + ids,
    method: 'post'
  })
}
