<template>
  <div class="app-container">
    <el-form label-width="200px">
       <!-- 讲师头像 -->
<el-form-item label="上传头像">

    <!-- 头衔缩略图 -->
    <pan-thumb :image="teacher.avatar"/>
    <!-- 文件上传按钮 -->
    <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像
    </el-button>
    <!--
v-show：是否显示上传组件
:key：类似于id，如果一个页面多个图片上传控件，可以做区分
:url：后台上传的url地址
@close：关闭上传组件
@crop-upload-success：上传成功后的回调 -->
    <image-cropper
                   v-show="imagecropperShow"
                   :width="300"
                   :height="300"
                   :key="imagecropperKey"
                   :url="BASE_API+'/admin/oss/file/upload'"
                   field="file"
                   :max-size="2048"
                   @close="close"
                   @crop-upload-success="cropSuccess"/>

</el-form-item>
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name" style="width:600px" placeholder="如：张三" maxlength="20"/>
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" controls-position="right" :step="1" :min="0" :max="50" step-strictly/>
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option :value="1" label="高级讲师" />
          <el-option :value="2" label="首席讲师" />
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.intro" placeholder="用一句话介绍讲师" style="width:600px"/>
      </el-form-item>
      <el-form-item label="讲师简介" >
        <el-input
          v-model="teacher.career"
          :rows="10"
          placeholder="对该讲师的生平经历进行大致描述。。。。。。"
          type="textarea" style="width:600px"
        />
      </el-form-item>

     

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import teacher from "@/api/edu/teacher";
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

const defaultForm = {
  avatar: process.env.OSS_PATH + '/avatar/default.jpg'
}

export default {
  
  components: { ImageCropper, PanThumb },

  data() {
    return {
      teacher: {
        name: "",
        sort: 0,
        level: 1,
        career: "",
        intro: "",
        avatar: defaultForm.avatar,
      },
      saveBtnDisabled: false, // 保存按钮是否禁用,
      BASE_API: process.env.BASE_API+'/edu-aliyun-oss', // 接口API地址
      imagecropperShow: false, // 是否显示上传组件
      imagecropperKey: 0, // 上传组件id
    };
  },
  created() {
    console.log("页面一加载就立即执行的方法");
    if (this.$route.params && this.$route.params.id) {
      const id = this.$route.params.id;
      this.fetchDataById(id);
    }
  },

  methods: {

    // 保存
    saveData() {
      teacher
        .save(this.teacher)
        .then(response => {
          return this.$message({
            type: "success",
            message: "保存成功!"
          });
        })
        .then(resposne => {
          this.$router.push({ path: "/edu/teacher" });
        })
        .catch(response => {
          // console.log(response)
          this.$message({
            type: "error",
            message: "保存失败"
          });
        });
    },
    // 根据id查询记录
    fetchDataById(id) {
      teacher
        .getById(id)
        .then(response => {
          this.teacher = response.data.data.item;
        })
        .catch(response => {
          this.$message({
            type: "error",
            message: "获取数据失败"
          });
        });
    },
    // 根据id更新记录
    updateData() {
      this.saveBtnDisabled = true;
      teacher
        .updateById(this.teacher)
        .then(response => {
          return this.$message({
            type: "success",
            message: "修改成功!"
          });
        })
        .then(resposne => {
          this.$router.push({ path: "/edu/teacher" });
        })
        .catch(response => {
          // console.log(response)
          this.$message({
            type: "error",
            message: "保存失败"
          });
        });
    },
    //保存按钮触发的保存或更新操作
    saveOrUpdate() {
      this.saveBtnDisabled = true;
      if (!this.teacher.id) {
        this.saveData();
      } else {
        this.updateData();
      }
    },
     // 上传成功后的回调函数
    cropSuccess(data) {
      
      this.imagecropperShow = false
      this.teacher.avatar = data.data.url
      // 上传成功后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
      this.imagecropperKey = this.imagecropperKey + 1
    },

    // 关闭上传组件
    close() {
      this.imagecropperShow = false
      // 上传失败后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
      this.imagecropperKey = this.imagecropperKey + 1
    }
  }
};
</script>