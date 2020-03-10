import request from '@/utils/request'
const api_prefix = "/teacher_serv/admin/edu/teacher"
export default {

  //获取讲师列表的ajax请求
  getPageList(page, limit, searchObj) {
    return request({
      url: `${api_prefix}/${page}/${limit}`,
      method: 'post',
      data: searchObj //如果前端传输的VO对象属于{id:"1",name:"汪苏泷",level:1}Json格式,用data
                      //如果属于?id=1&name=汪苏泷&level=1类型，需要用params
    })
  },
  //逻辑删除
  removeById(teacherId) {
    return request({
      url: `${api_prefix}/${teacherId}`,
      method: 'delete'
    })
  },
  //逻辑批量删除
  removeByIds(teacherIds) {
      return request({
        url: `${api_prefix}`,
        method: 'delete',
        params: teacherIds
      })
  },
  save(teacher) {
    return request({
      url: api_prefix,
      method: 'post',
      data: teacher
    })
  },
  getById(id) {
    return request({
        url: `${api_prefix}/${id}`,
        method: 'get'
    })
  },
  updateById(teacher) {
    return request({
        url: `${api_prefix}/${teacher.id}`,
        method: 'put',
        data: teacher
    })
  }
}