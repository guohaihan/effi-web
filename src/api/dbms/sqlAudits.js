import request from '@/utils/request'

// 获取审核列表
export function getAuditsList() {
  return request({
    url: `/dbms/audits/`,
    method: 'get'
  })
}

