  <template>
  <div class="app-container">

    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline" >
      <el-form-item>
        <el-button class="demo-form-inline" type="danger" size="mini" icon="el-icon-delete" :disabled="this.ids.length === 0" @click="removeBatchByIds(ids)">批量删除</el-button>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchObj.name" placeholder="讲师姓名"/>
      </el-form-item>

      <el-form-item>
        <el-select v-model="searchObj.level" clearable placeholder="讲师头衔">
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>

      <el-form-item label="添加时间">
        <el-date-picker
          v-model="searchObj.begin"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="12:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="searchObj.end"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="12:00:00"
        />
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="fetchData()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>
   
  <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="数据加载中"
      border
      fit
      highlight-current-row
      @selection-change="handleSelectionChange">

      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        label="序号"
        width="70"
        align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="name" label="名称" width="80" />

      <el-table-column label="头衔" width="80">
        <template slot-scope="scope">
          {{ scope.row.level===1?'高级讲师':'首席讲师' }}
        </template>
      </el-table-column>

      <el-table-column prop="intro" label="资历" show-overflow-tooltip />

      <el-table-column prop="gmtCreate" label="添加时间" width="160"/>

      <el-table-column prop="sort" label="优先级" width="60"/>


      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/edu/teacher/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

       <!-- 分页 -->
    <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="fetchData"
    />

     
    </div>
  </template>

<script>
import teacher from '@/api/edu/teacher'
export default {

  data() {// 定义数据
      return{
        listLoading: true, // 是否显示loading信息
        list: [], // 数据列表
        total: 0, // 总记录数
        page: 1, // 默认当前页码
        limit: 10, // 每页记录数
        searchObj: {},// 查询条件
        tableChecked:[],//选中内容
        ids:[] //所有选中内容的ids
      } 
  },
    
  created() { // 当页面加载时获取数据
    this.fetchData()
    
  },
    
    methods: {
      //重置查询条件
      resetData() {
        this.searchObj = {}
        this.fetchData()
      },
      handleSelectionChange(value){
          this.ids=value
      },
      //查询列表(带条件亦可)
      fetchData(page = 1) { // 调用api层获取数据库中的数据
      console.log('加载列表')
      this.page = page
      this.listLoading = true
      teacher.getPageList(this.page, this.limit, this.searchObj).then(response => {
          this.list = response.data.data.items
          this.total = response.data.data.total
          this.listLoading = false
      })
      
    },
    //逻辑删除
    removeDataById(id) {
    // debugger
    // console.log(memberId)
    this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        let ret=teacher.removeById(id)
        ret.then(response=>{
          if(response.data.success){
            this.$message({
                type: 'success',
                message: '删除成功!'
            })
            this.fetchData()// 刷新列表
          } else {
            this.$message({
                type: 'error',
                message: '删除失败！'
            })
          }
        })
        return ret
    }).catch((response) => { // 失败
        if (response === 'cancel') {
            this.$message({
                type: 'info',
                message: '已取消删除'
            })
        }
    })
},
    //批量逻辑删除
    removeBatchByIds(ids){
        this.$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
          debugger
          for (let index = 0; index < this.tableChecked.length; index++) {
            let element = tableChecked[index];
            console.log(element.id)
          }
          return teacher.removeByIds(ids)
      }).then(() => {
          this.fetchData()
          this.$message({
              type: 'success',
              message: '删除成功!'
          })
      }).catch((response) => { // 失败
          if (response === 'cancel') {
              this.$message({
                  type: 'info',
                  message: '已取消删除'
              })
          } else {
              this.$message({
                  type: 'error',
                  message: '删除失败'
              })
          }
      })
    }
  }
}


</script>