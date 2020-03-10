import request from '@/utils/request'

const api_name = '/edu-course-management/admin/edu/subject'

export default {

  getNestedTreeList() {
    return request({
      url: `${api_name}`,
      method: 'get'
    })
  },
  //根据id删除课程一二三级分类
  removeSubjectById(id) {
    return request({
      url: `${api_name}/${id}`,
      method: 'delete'
    })
  },
  //添加课程一级分类
  saveLevelOne(subject) {
    return request({
        url: `${api_name}/save-level-one`,
        method: 'post',
        data: subject
    })
  },
  //添加课程二级分类
  saveLevelTwo(subject) {
    return request({
      url: `${api_name}/save-level-two`,
      method: 'post',
      data: subject
    })
  },
  //根据ID查询课程类别
  getSubjectById(subjectId) {
    return request({
      url: `${api_name}/${subjectId}`,
      method: 'get'
    })
  }
}