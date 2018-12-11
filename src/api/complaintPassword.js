import request from '@/utils/request'
import qs from 'qs'

export function auditList (account, pageNum, pageSize) {
  const data = {
    account,
    pageNum,
    pageSize
  }
  return request({
    url: '/business/api/complaintPasswordAudit/auditList',
    method: 'get',
    params: data
  })
}

export function unAuditList (account, pageNum, pageSize) {
  const data = {
    account,
    pageNum,
    pageSize
  }
  return request({
    url: '/business/api/complaintPasswordAudit/unAuditList',
    method: 'get',
    params: data
  })
}

export function auditDetail (id) {
  const data = {
    id
  }
  return request({
    url: '/business/api/complaintPasswordAudit/auditDetail',
    method: 'get',
    params: data
  })
}

export function audit (id, auditStatus, reason) {
  const data = {
    id,
    auditStatus,
    reason
  }
  return request({
    url: '/business/api/complaintPasswordAudit/audit',
    method: 'post',
    data: qs.stringify(data)
  })
}
