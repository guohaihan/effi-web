import request from '@/utils/request'

// 新增数据库
export function createDatabase(data) {
  return request({
    url: '/dbms/db/',
    method: 'post',
    data
  })
}

// 删除数据库
export function deleteDatabase(id) {
  return request({
    url: `/dbms/db/${id}/`,
    method: 'delete'
  })
}

// 批量删除数据库
export function deleteDatabases(ids) {
  return request({
    url: '/dbms/db/',
    method: 'delete',
    data: { 'ids': ids }
  })
}

// 修改数据库
export function updateDatabase(id, data) {
  return request({
    url: `/dbms/db/${id}/`,
    method: 'put',
    data
  })
}

// 获取数据库列表
export function getDatabases(data) {
  return request({
    url: '/dbms/db/',
    method: 'get',
    params: data
  })
}

// 获取数据库详情
export function getDatabase(id) {
  return request({
    url: `/dbms/db/${id}/`,
    method: 'get'
  })
}

// 获取数据库类型列表
export function getDatabaseType() {
  return request({
    url: '/dbms/db/type/',
    method: 'get'
  })
}
