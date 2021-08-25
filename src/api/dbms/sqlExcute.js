import request from '@/utils/request'

// 获取数据库列表
export function getDBNames(id) {
  return request({
    url: `/dbms/operates/databases/${id}/`,
    method: 'get'
  })
}

// 执行sql
export function sqlExcute(id, data) {
  return request({
    url: `/dbms/operates/databases/${id}/`,
    method: 'post',
    data
  })
}

// 获取机房机柜Tree结构数据
export function getIDCCabinetsTree() {
  return request({
    url: '/cmdb/assets/cabinets/',
    method: 'get'
  })
}
