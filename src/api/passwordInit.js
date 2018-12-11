import request from '@/utils/request'
import qs from 'qs'

/**
 * 根据id获取详情
 * @param account
 *
 * */

export function getUserInfoById (account) {
  const data = {
    account
  }
  return request({
    url: '/business/api/auth/getUserInfoById',
    method: 'get',
    params: data
  })
}

/**
 * 初始化密码
 * @param account
 * @param name
 * @param idCardNo
 *
 * */

export function initPassword (account, name, idCardNo) {
  const data = {
    account,
    name,
    idCardNo
  }
  return request({
    url: '/business/api/complaintPasswordAudit/initPassword',
    method: 'post',
    data: qs.stringify(data)
  })
}
