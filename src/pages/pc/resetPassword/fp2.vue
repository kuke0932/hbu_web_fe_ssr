<template>
  <div class="tabItem" style="display: block;">
      <div class="steps" style="width: 888px;">
        <ul>
          <li class="bgStep1_1">基本资料</li>
          <li class="bgStep2_2 bgStep2_2Selected">上传照片</li>
          <li class="bgStep3_3">设置新密码</li>
          <li class="bgStep4_4">完成</li>
        </ul>
      </div>

      <div class="stepCon" style="padding-top: 20px;">
        <div style="padding: 10px 0;">请上传2张照片</div>
        <div style="padding: 20px 30px;width: 70%;margin: 0 auto;border: 1px dashed  #5490ff;">
          <el-upload
            class="upload-demo"
            action=""
            list-type="picture-card"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :on-success = 'onSuccess'
            :on-exceed="handleExceed"
            :before-upload="beforeAvatarUpload"
            accept="image/jpeg,image/jpg,image/png"
            multiple
            :limit="2"
            :file-list="fileList">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogImage">
            <img width="100%" :src="previewImgUrl" alt="">
          </el-dialog>
        </div>
        <el-button type="primary" :loading="btnLoading"  style="margin: 30px auto 0;" @click="next">下一步</el-button>
      </div>
  </div>
</template>

<script>
import { faceResetPassword2 } from '@/api/auth'

export default {
  name: 'baseInfo',
  head () {
    return {
      title: '找回密码'
    }
  },
  data () {
    return {
      btnLoading: false,
      dialogImage: false,
      sessionId: '',
      imgUrl: [],
      previewImgUrl: [],
      fileList: []
    }
  },
  mounted () {
    this.sessionId = this.$route.query.sessionId
  },
  methods: {
    beforeAvatarUpload (file) {
      var testmsg = /^image\/(jpeg|png|jpg)$/.test(file.type)
      const isLt4M = file.size / 1024 / 1024 <= 4 // 图片大小不超过2MB
      if (!testmsg) {
        this.$message.error('上传图片格式不对!')
        return false
      }
      if (!isLt4M) {
        this.$message.error('上传图片大小不能超过 4M!')
        return false
      }
      return testmsg && isLt4M
    },
    onSuccess (resp, file, fileList) {
      const that = this
      this.fileList = fileList
      this.fileList.forEach((file, i) => {
        that.imgUrl = []
        const reader = new FileReader()
        reader.readAsDataURL(file.raw)
        reader.onload = function (e) {
          that.$set(that.imgUrl, i, e.srcElement.result)
        }
      })
      if (this.fileList.length >= 2) {
        document.querySelectorAll('.el-upload--picture-card')[0].style.display = 'none'
      }
    },
    handleRemove (file, fileList) {
      const that = this
      this.fileList = fileList
      this.fileList.forEach((file, i) => {
        that.imgUrl = []
        const reader = new FileReader()
        reader.readAsDataURL(file.raw)
        reader.onload = function (e) {
          that.$set(that.imgUrl, i, e.srcElement.result)
        }
      })
      if (this.fileList.length < 2) {
        document.querySelectorAll('.el-upload--picture-card')[0].style.display = 'inline-block'
      }
    },
    handlePreview (file) {
      this.previewImgUrl = file.url
      this.dialogImage = true
    },
    handleExceed (files, fileList) {
      this.$message.warning('只能上传 2 个文件')
    },
    beforeRemove (file, fileList) {
      return this.$confirm('确定移除' + file.name + '?')
    },
    next () {
      if (this.imgUrl.length === 2) {
        this.btnLoading = true
        // console.log(this.sessionId, this.imgUrl[0], this.imgUrl[1], this.imgUrl[2])
        faceResetPassword2(this.sessionId, this.imgUrl[0], this.imgUrl[1], '').then(resp => {
          if (resp.status === 200) {
            this.$router.push({ path: '/pc/resetPassword/fp3', query: { sessionId: resp.data.sessionId, hasMobile: resp.data.hasMobile } })
          }
          if (resp.status === 250) {
            this.$message('人脸比对不通过,请重新上传图片！')
            this.btnLoading = false
          }
        }).catch(() => {
          this.btnLoading = false
        })
      } else {
        this.$message('请上传两张照片！')
      }
    }
  }
}
</script>
