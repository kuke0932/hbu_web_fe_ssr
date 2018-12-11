import axios from 'axios'
import { getToken } from '@/utils/auth'
import { Indicator, MessageBox } from 'mint-ui'
import { MessageBox as MessageBoxPC } from 'element-ui'

// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 15000 // request timeout
})
const isMobile = () => {
  const ua = navigator.userAgent
  const ipad = ua.match(/(iPad).*OS\s([\d_]+)/)
  const isIphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/)
  const isAndroid = ua.match(/(Android)\s+([\d.]+)/)
  const isMobile = isIphone || isAndroid
  return !!isMobile
}

// request interceptor
service.interceptors.request.use(config => {
  // Do something before request is sent
  if (getToken()) {
    config.headers['x-auth-token'] = getToken() // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
  }

  if (!config.headers['Content-Type'] && !config.headers['content-Type'] && !config.headers['Content-type'] && !config.headers['content-type']) {
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'
  }
  const params = {}
  if (config.params) {
    for (const data in config.params) {
      const value = config.params[data]
      if (!(typeof value === 'string' && value === '')) {
        params[data] = value
      }
    }
  }
  config.params = params
  if (isMobile()) {
    Indicator.open()
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
  response => {
    if (isMobile()) {
      Indicator.close()
    }
    return response.data
  },
  /**
  * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
  * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
  */
  //  const res = response.data;
  //     if (res.code !== 20000) {
  //       Message({
  //         message: res.message,
  //         type: 'error',
  //         duration: 5 * 1000
  //       });
  //       // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
  //       if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
  //         MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
  //           confirmButtonText: '重新登录',
  //           cancelButtonText: '取消',
  //           type: 'warning'
  //         }).then(() => {
  //           store.dispatch('FedLogOut').then(() => {
  //             location.reload();// 为了重新实例化vue-router对象 避免bug
  //           });
  //         })
  //       }
  //       return Promise.reject('error');
  //     } else {
  //       return response.data;
  //     }
  error => {
    Indicator.close()
    console.log(error)
    if (isMobile()) {
      if (error.toString().indexOf('timeout') >= 0) {
        MessageBox({
          title: '网络超时',
          message: '网络超时,请稍后重试！'
        })
      } else {
        MessageBox({
          title: '系统出错了',
          message: error.response.data.message
        })
      }
    } else {
      if (error.toString().indexOf('timeout') >= 0) {
        MessageBoxPC({
          title: '网络超时',
          message: '网络超时,请稍后重试！'
        })
      } else {
        MessageBoxPC({
          title: '系统出错了',
          message: error.response.data.message
        })
      }
    }
    return Promise.reject(error)
  })

export default service
