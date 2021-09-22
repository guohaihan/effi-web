import request from '@/utils/request'

// 获取数据库列表
export function getSchemaNames(id) {
  return request({
    url: `/dbms/operates/databases/${id}/`,
    method: 'get'
  })
}
// 获取全租户库列表
export function getTenantNames(id) {
  return request({
    url: `/dbms/operates/databases/${id}?tenant=1/`,
    method: 'get'
  })
}

// 执行sql
export function sqlExcute(data) {
  return request({
    url: `/dbms/operates/databases/`,
    method: 'post',
    data
  })
}
// 提交sql审核
export function auditsSql(data) {
  return request({
    url: `/dbms/audits/`,
    method: 'post',
    data

  })
}

