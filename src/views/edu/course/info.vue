<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="提交审核"/>
    </el-steps>

    <el-form label-width="100px" size="medium">

  <!-- 所属分类：级联下拉列表 -->
  <!-- 一级分类 -->
  <el-form-item label="课程类别">
    <el-select
      v-model="courseInfo.subjectGrandParentId"
      placeholder="请选择" @change="subjectLevelOneChanged">
      <el-option
        v-for="subject in subjectNestedList"
        :key="subject.id"
        :label="subject.title"
        :value="subject.id"/>
    </el-select>
     <!--二级分类 -->
    <el-select
      v-model="courseInfo.subjectParentId"
      placeholder="请选择" @change="subjectLevelTwoChanged">
      <el-option
        v-bind="twoLevel"
        v-for="subject in secondSubjectList"
        :key="subject.id"
        :label="subject.title"
        :value="subject.id"/>
    </el-select>

     <!--三级分类 -->
    <el-select
      v-model="courseInfo.subjectId"
      placeholder="请选择" >
      <el-option
        v-bind="threeLevel"
        v-for="subject in thirdSubjectList"
        :key="subject.id"
        :label="subject.title"
        :value="subject.id"/>
    </el-select>
  </el-form-item>

  

  <el-form-item label="课程标题">
    <el-input style="width:500px"  maxlength="30" v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。"/>
  </el-form-item>

  <el-form-item label="总课时">
    <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
  </el-form-item>

  <el-form-item label="课程价格">
    <el-input-number :min="0" :precision="2" :step="0.01" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/> 元
  </el-form-item>

 <!-- 课程封面-->
  <el-form-item label="封面预览">
    <!-- 课程封面缩略图 -->
    <img width="450px" height="280px" :src="courseInfo.cover"/>

  </el-form-item>

 <el-form-item label="更换封面">
  <el-upload
    ref="upload"
    :action="BASE_API+'/admin/oss/file/upload?host=cover'"
    :auto-upload="false"
    :on-success="fileUploadSuccess"
    :on-error="fileUploadError"
    :disabled="importBtnDisabled"
    :limit="1"
    name="file">
    <el-button icon="el-icon-upload" slot="trigger" size="small" type="primary">选取文件</el-button>
    <el-button
            :loading="loading"
            style="margin-left: 10px;"
            size="small"
            type="success"
            @click="submitUpload"
          >{{ fileUploadBtnText }}</el-button>
  </el-upload>
</el-form-item>





 

  <!-- 课程简介-->
  <el-form-item label="课程简介">
      <tinymce :height="300" v-model="courseInfo.description"/>
  </el-form-item>

  <el-form-item>
    <el-button :disabled="saveBtnDisabled" type="primary" @click="next">保存并下一步</el-button>
  </el-form-item>

  
</el-form>
  </div>
</template>
<script>
import course from '@/api/edu/course'
import subject from '@/api/edu/subject'
import Tinymce from '@/components/Tinymce'


const defaultForm = {
  id: '',
  title: '',
  subjectGrandParentId: '',
  subjectParentId: '',
  subjectId: '',
  teacherId: '1236920881782132738',
  lessonNum: 0,
  description: '',
  cover: '',
  price: 0,
  cover: process.env.OSS_PATH + '/cover/default.png'
  
}

export default {
  components: { Tinymce},
  data() {
    return {
      courseInfo: defaultForm,
      saveBtnDisabled: false, // 保存按钮是否禁用
      subjectNestedList: [],//一级分类列表
      secondSubjectList: [],//二级分类列表
      thirdSubjectList: [],//二级分类列表
      
      BASE_API: process.env.BASE_API+'/edu-aliyun-oss', // 课程封面文件上传接口API地址
      fileUploadBtnText: "上传到服务器", // 按钮文字
      importBtnDisabled: false, // 按钮是否禁用,
      loading: false,

      twoLevel: '',
      threeLevel: ''
    }
  },

  watch: {
    $route(to, from) {
      console.log('watch $route')
      this.init()
    }
  },

  created() {
    console.log('info created')
    this.init()
  },

  methods: {

    init() {
      //点击上一步回显出课程基本基本信息
      if (this.$route.params && this.$route.params.id) {
        const id = this.$route.params.id
        course.echoById(id).then(response=>{
          this.courseInfo=response.data.data.item

          subject.getNestedTreeList().then(response=>{
            //再次获取所有课程类别列表
            this.subjectNestedList=response.data.data.items
            for (let i = 0; i < this.subjectNestedList.length; i++) {
              if(this.subjectNestedList[i].id===this.courseInfo.subjectGrandParentId){
                this.secondSubjectList=this.subjectNestedList[i].children
              }
            }
             for (let k = 0; k < this.secondSubjectList.length; k++) {
                  if(this.secondSubjectList[k].id===this.courseInfo.subjectParentId){
                    this.thirdSubjectList=this.secondSubjectList[k].children
                  }
                    
                }
          })
        })
      } else {
        this.courseInfo = { ...defaultForm } //清空表单
      }

      // 初始化分类列表
      this.initSubjectList()
    },

    //一级分类选中后，显示二级分类
    subjectLevelOneChanged(value) {
    for (let i = 0; i < this.subjectNestedList.length; i++) {
        if (this.subjectNestedList[i].id === value) {
            this.secondSubjectList = this.subjectNestedList[i].children
            this.courseInfo.subjectParentId = ''
            this.courseInfo.subjectId = ''
        }
      }
    },

    //二级分类选中后，显示三级分类
    subjectLevelTwoChanged(value){
      for (let i = 0; i < this.secondSubjectList.length; i++) {
              if (this.secondSubjectList[i].id === value) {
                  this.thirdSubjectList = this.secondSubjectList[i].children
                  this.courseInfo.subjectId = ''
              }
            }
    },

    //保存并下一步
    next() {
      console.log('next')
      this.saveBtnDisabled = true
      if (!this.courseInfo.id) {
        this.saveData()
      } else {
        this.updateData()
      }
    },

    //初始化一二三级分类列表
    initSubjectList(){
      subject.getNestedTreeList().then(response => {
      this.subjectNestedList = response.data.data.items
      })
    },

    // 保存课程基本信息
    saveData() {
      course.saveCourseInfo(this.courseInfo).then(response => {
        this.$message({
          type: 'success',
          message: '添加课程基本信息成功!'
        })
        return response// 将响应结果传递给then
      }).then(response => {
        this.$router.push({ path: '/edu/course/chapter/' + response.data.data.courseId })
      }).catch((response) => {
        this.$message({
          type: 'error',
          message: response.data.message
        })
      })
    },
    //修改课程基本信息
    updateData() {
        this.saveBtnDisabled = true
        course.updateCourseInfoById(this.courseInfo).then(response => {
            this.$message({
                type: 'success',
                message: '修改成功!'
            })
            return response// 将响应结果传递给then
        }).then(response => {
            this.$router.push({ path: '/edu/course/chapter/' + this.courseInfo.id })
        }).catch((response) => {
            // console.log(response)
            this.$message({
                type: 'error',
                message: '保存失败'
            })
        })
    },





    submitUpload() {
          this.fileUploadBtnText = "正在上传";
          this.importBtnDisabled = true;
          this.loading = true;
          this.$refs.upload.submit();
        },

        fileUploadSuccess(response) {
          if (response.success === true) {
            this.fileUploadBtnText = "上传成功";
            this.loading = false;
            this.courseInfo.cover=response.data.url
            console.log(this.courseInfo.cover)
            this.$message({
              type: "success",
              message: response.message
            });
          } else {
            this.fileUploadBtnText = "上传失败";
            this.loading = false;
            const messages = response.data.data.messageList;
            let msgString = "<ul>";
            messages.forEach(msg => {
              msgString += `<li>${msg}</li>`;
            });
            msgString += "</ul>";
            this.$alert(msgString, response.message, {
              dangerouslyUseHTMLString: true
            });
          }
        },

        fileUploadError(response) {
          this.fileUploadBtnText = "上传失败";
          this.loading = false;
          this.$message({
            type: "error",
            message: "上传失败"
          });
        }
  }
}
</script>

<style scoped>
.tinymce-container {
  line-height: 29px;
}
</style>