import request from '@/utils/request'

// 获取审核列表
export function getAuditsList(data) {
  return request({
    url: `/dbms/audits/`,
    method: 'get',
    params: data
  })
}

// 审核通过列表
export function passSqlAudits(data) {
  return request({
    url: `/dbms/audits/`,
    method: 'update',
    params: data
  })
}

