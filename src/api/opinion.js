import request from '@/utils/request'
import qs from 'qs'

export function list (content, pageNum, pageSize) {
  const data = {
    content,
    pageNum,
    pageSize
  }
  return request({
    url: '/business/api/opinion/list',
    method: 'get',
    params: data
  })
}

export function getById (id) {
  const data = {
    id
  }
  return request({
    url: '/business/api/opinion/getById',
    method: 'get',
    params: data
  })
}

export function save (content, imageIds) {
  console.log(content)
  const data = {
    content,
    imageIds
  }
  return request({
    url: '/business/api/opinion/save',
    /* headers: {
      'Content-Type': 'application/json;charset=utf-8'
    }, */
    method: 'post',
    data: qs.stringify(data)
  })
}
