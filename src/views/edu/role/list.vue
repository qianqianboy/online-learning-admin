<template>
    <div class="app-container">
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary">添加角色</el-button>
                </el-col>
            </el-row>
        </el-card>
            
    </div>
</template>
<script>
import role from '@/api/edu/role'
export default {
    data(){
        return{
            list: [],
            total: 0, // 总记录数
            page: 1, // 默认当前页码
            limit: 10 // 每页记录数
        }
    },

    created(){
        this.getRoleList()
    },

    methods:{
        getRoleList(){
            role.getRoleList(this.page, this.limit).then
        },

    }
}
</script>