
import request from '@/utils/request'

// 获取审核列表
export function getOperationLogs(data) {
  return request({
    url: `/dbms/operates/logs/`,
    method: 'get',
    params: data
  })
}
