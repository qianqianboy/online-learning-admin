import request from '@/utils/request'

const api_name = '/edu-course-management/admin/edu/course'

export default {

  getPageList(page, limit, searchObj) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'get',
      params: searchObj
    })
  },
    //新增课程基本信息
    saveCourseInfo(courseInfo) {
      return request({
        url: `${api_name}/save-course-info`,
        method: 'post',
        data: courseInfo
      })
    },
    //回显课程基本信息
    echoById(courseId) {
        return request({
            url: `${api_name}/echo/${courseId}`,
            method: 'get'
        })
    },
    //修改课程基本信息
    updateCourseInfoById(courseInfo) {
      return request({
        url: `${api_name}/update-course-info`,
        method: 'put',
        data: courseInfo
      })
    }
    
}