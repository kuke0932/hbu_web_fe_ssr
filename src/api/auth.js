import request from '@/utils/request'
import qs from 'qs'

export function register (account, password, verifyCode, email, mobile) {
  const data = {
    account,
    password,
    verifyCode,
    email,
    mobile
  }
  return request({
    url: '/business/api/auth/register',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function registerHelper (account, password, verifyCode, mobile) {
  const data = {
    account,
    password,
    verifyCode,
    mobile
  }
  return request({
    url: '/business/api/auth/registerHelper',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function sendSmsCode (mobile) {
  const data = {
    mobile
  }
  return request({
    url: '/business/api/auth/sendSmsCode',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function login (account, password, code) {
  const data = {
    account,
    password,
    code
  }
  return request({
    url: '/business/api/auth/auth',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function jssdk (url) {
  const data = {
    url
  }
  return request({
    url: '/business/api/auth/jssdk',
    method: 'get',
    params: data
  })
}

export function verifyHasMobile (account) {
  const data = {
    account
  }
  return request({
    url: '/business/api/auth/verifyHasMobile',
    method: 'post',
    data: qs.stringify(data)
  })
}

/***
 * 获取验证方式
 *  @param account
 * **/
export function getResetPasswordTypes (account) {
  const data = {
    account
  }
  return request({
    url: '/business/api/auth/getResetPasswordTypes',
    method: 'get',
    params: data
  })
}

export function resetPassword1 (account, userName, openIdOrUserId) {
  const data = {
    account,
    userName,
    openIdOrUserId
  }
  return request({
    url: '/business/api/auth/resetPassword1',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function faceResetPassword2 (sessionId, face1, face2, face3) {
  const data = {
    face1,
    face2,
    face3,
    sessionId
  }
  return request({
    url: '/business/api/auth/faceResetPassword2',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 申诉重置密码
 * @param sessionId
 * @param password
 * @param confirmPassword
 * @param mobile
 * @param verifyCode
 */
export function faceResetPassword3 (sessionId, password, confirmPassword, mobile, verifyCode, join) {
  const data = {
    sessionId,
    password,
    confirmPassword,
    mobile,
    verifyCode,
    join
  }
  return request({
    url: '/business/api/auth/faceResetPassword3',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 根据手机号重置密码
 * @param sessionId
 * @param verifyCode
 * @param password
 * @param confirmPassword
 */
export function resetPasswordByMobile (sessionId, verifyCode, password, confirmPassword, join) {
  const data = {
    sessionId,
    verifyCode,
    password,
    confirmPassword,
    join
  }
  return request({
    url: '/business/api/auth/resetPasswordByMobile2',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function getUserInfo () {
  return request({
    url: '/business/api/auth/getUserInfo',
    method: 'get'
  })
}

export function complaintResetPassword (sessionId, mobile, verifyCode, idCardNo, handIdCard) {
  const data = {
    sessionId,
    mobile,
    verifyCode,
    idCardNo,
    handIdCard
  }
  return request({
    url: '/business/api/auth/complaintResetPassword2',
    method: 'post',
    data: qs.stringify(data)
  })
}
/* **
* 修改密码
* */
export function modifyPassword (account, name, oldPassword, newPassword, confirmPassword, mobile, verifyCode, weWorkVerify, join) {
  const data = {
    account, name, oldPassword, newPassword, confirmPassword, mobile, verifyCode, weWorkVerify, join
  }
  return request({
    url: '/business/api/auth/modifyPassword',
    method: 'post',
    data: qs.stringify(data)
  })
}
