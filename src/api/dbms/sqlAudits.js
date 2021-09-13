import request from '@/utils/request'

// 获取审核列表
export function getAuditsList(data) {
  return request({
    url: `/dbms/audits/`,
    method: 'get',
    params: data
  })
}

// 审核通过
export function sqlAudits(id, data) {
  return request({
    url: `/dbms/audits/${id}/`,
    method: 'put',
    data
  })
}

// 审核通过列表
export function auditsInfo(id) {
  return request({
    url: `/dbms/audits/${id}/`,
    method: 'get'
  })
}
