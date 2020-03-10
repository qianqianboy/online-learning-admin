import request from '@/utils/request'

const api_name = '/edu-course-management/admin/edu/course'

export default {
  saveCourseInfo(courseInfo) {
    return request({
      url: `${api_name}/save-course-info`,
      method: 'post',
      data: courseInfo
    })
    },

    echoById(courseId) {
        return request({
            url: `${api_name}/echo/${courseId}`,
            method: 'get'
        })
    }
    
}