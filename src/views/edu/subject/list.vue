<template>
  <div class="app-container">
    <el-input v-model="filterText" placeholder="输入关键字进行过滤" style="margin-bottom:30px;" />

    <el-button type="text" @click="dialogFormVisible = true">添加一级分类</el-button>
    <el-tree
      ref="subjectTree"
      :data="subjectList"
      :props="defaultProps"
      :filter-node-method="filterNode"
      :expand-on-click-node="false"
      class="filter-tree"
      default-expand-all
      node-key="id"
    >
      <span slot-scope="{ node, data }" class="custom-tree-node">
        <span>{{ node.label }}</span>
        <span>
          <!-- 使用Chrome的Vue插件调试 -->
          <el-button
            v-if="node.level == 1"
            type="text"
            size="mini"
            @click="() => {dialogFormVisible2 = true; subject.parentId = data.id}"
          >添加二级分类</el-button>
          <el-button
            v-if="node.level == 2"
            type="text"
            size="mini"
            @click="() => {dialogFormVisible2 = true; subject.parentId = data.id}"
          >添加三级分类</el-button>
          <el-button type="text" size="mini" @click="() => remove(node, data)">删除</el-button>
        </span>
      </span>
    </el-tree>

    <el-dialog :visible.sync="dialogFormVisible" title="添加一级分类">
      <el-form :model="subject" label-width="120px">
        <el-form-item label="分类标题">
          <el-input v-model="subject.title" maxlength="25"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="appendLevelOne()">确 定</el-button>
      </div>
    </el-dialog>


    <el-dialog :visible.sync="dialogFormVisible2" title="添加子级分类">
      <el-form :model="subject" label-width="120px">
        <el-form-item label="分类标题">
          <el-input v-model="subject.title" maxlength="25" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="appendLevelTwo()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import subject from "@/api/edu/subject";

export default {
  data() {
    return {
      filterText: "",
      subjectList: [],
      defaultProps: {
        label: "title",
        children: "children"
      },
      dialogFormVisible: false,
      dialogFormVisible2: false,
      dialogFormVisible: false,
      subject: {
        title: "",
        parentId: '0'
      }
    };
  },
  watch: {
    filterText(val) {
      this.$refs.subjectTree.filter(val);
    }
  },

  created() {
    this.fetchNodeList();
  },

  methods: {
    //添加一级分类
    appendLevelOne() {
      subject
        .saveLevelOne(this.subject)
        .then(response => {
          if(response.data.success){
              this.$message({
                type: "success",
                message: "添加一级分类成功!"
            })
            this.dialogFormVisible = false; // 如果保存成功则关闭对话框
            this.fetchNodeList(); // 刷新列表
          }else{
            this.$message({
              type: "error",
              message: "新增一级分类失败"
            });
          }
        })
        .catch(response => {
          // console.log(response)
          this.$message({
            type: "error",
            message: response.data.message
          });
        });
    },
    //添加二级分类
    appendLevelTwo() {
    subject.saveLevelTwo(this.subject).then(response => {
        if(response.data.success){
            this.$message({
              type: 'success',
              message: '添加子级分类成功!'
          })
          this.dialogFormVisible2 = false// 如果保存成功则关闭对话框
          this.fetchNodeList()// 刷新列表
          this.subject.title = ''// 重置类别标题
          this.subject.parentId = '' // 重置表单parentId
        }else{
           this.$message({
              type: 'error',
              message: response.data.message
          })
        }
    }).catch((response) => {
        // console.log(response)
        this.$message({
            type: 'error',
            message: response.data.message
        })
    })
  },
    //显示课程分类列表
    fetchNodeList() {
      subject.getNestedTreeList().then(response => {
        this.subjectList = response.data.data.items;
      });
    },
    //关键字过滤显示
    filterNode(value, data) {
      if (!value) return true;
      return data.title.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    },
    //删除标题
    remove(node, data) {
      console.log(node);
      console.log(data);

      this.$confirm("此操作将永久删除该课程分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(response => {
          let ret = subject.removeSubjectById(data.id);
          ret.then(response => {
            console.log(response.data.success);
            if (response.data.success) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.fetchNodeList(); // 刷新列表
              this.$refs.subjectTree.remove(node); // 删除节点（效率高）
            } else {
              this.$message({
                type: "error",
                message: "当前节点下有子节点，不可以删除喔~"
              });
            }
          });
          return ret;
        })
        .catch(response => {
          // 失败
          if (response === "cancel") {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          }
        });
    }
  }
};
</script>