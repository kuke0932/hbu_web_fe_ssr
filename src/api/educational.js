import request from '@/utils/request'
// import qs from 'qs'

export function listCurriculumSchedule (schoolYear, term, weeks) {
  const data = {
    schoolYear,
    term,
    weeks
  }
  return request({
    url: '/business/api/educational/listCurriculumSchedule',
    method: 'get',
    params: data
  })
}

export function listExam (schoolYear, term) {
  const data = {
    schoolYear,
    term
  }
  return request({
    url: '/business/api/educational/listExam',
    method: 'get',
    params: data
  })
}

export function listCourseScore (schoolYear, term) {
  const data = {
    schoolYear,
    term
  }
  return request({
    url: '/business/api/educational/listCourseScore',
    method: 'get',
    params: data
  })
}
// 查询教室接口

// 获取所有教室列表
export function listAllBuildingClassroom () {
  return request({
    url: '/business/api/educational/listAllBuildingClassroom',
    method: 'get'
  })
}

// 查询教室接口
export function listUnUsedBuildingClassroom (xqh, jxlh, fromJc, toJc, syrq, classroom, pageNum, pageSize) {
  const data = {
    xqh,
    jxlh,
    fromJc,
    toJc,
    syrq,
    classroom,
    pageNum,
    pageSize
  }
  return request({
    url: '/business/api/educational/listUnUsedBuildingClassroom',
    method: 'get',
    params: data
  })
}

export function getFirstWeekDate (schoolYear, term) {
  const data = {
    schoolYear,
    term
  }
  return request({
    url: '/business/api/educational/getFirstWeekDate',
    method: 'get',
    params: data
  })
}

// 图书列表
export function listBook (keywords, searchType, pageNum, pageSize) {
  const data = {
    keywords,
    searchType,
    pageNum,
    pageSize
  }
  return request({
    url: '/business/api/educational/listBook',
    method: 'get',
    params: data
  })
}

// 图书详情
export function bookDetail (id) {
  const data = {
    id
  }
  return request({
    url: '/business/api/educational/bookDetail',
    method: 'get',
    params: data
  })
}

// 借阅记录
export function myBorrowedBook (bookStatus, beginTime, endTime, pageNum, pageSize) {
  const data = {
    bookStatus,
    beginTime,
    endTime,
    pageNum,
    pageSize
  }
  return request({
    url: '/business/api/educational/myBorrowedBook',
    method: 'get',
    params: data
  })
}
