import request from '@/utils/request'
const api_prefix = "/admin/edu/role"
export default {
    getRoleList(page,limit) {
        return request({
            url: `${api_prefix}/${page}/${limit}`,
            method: 'get'
        })
    }
}