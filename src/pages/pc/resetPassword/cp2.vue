<template>
  <div class="tabItem steps2" style="display: block;">
    <div class="step2">
      <div class="steps">
        <ul>
          <li class="bgStep1">基本信息</li>
          <li class="bgStep2 bgStep2Selected">提交资料</li>
          <li class="bgStep3">完成</li>
        </ul>
      </div>

      <el-form ref="form" :rules="rules" :model="form" label-width="100px" class="forms" style="margin-top: 35px;">
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="form.mobile"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="validateCode">
          <el-input style="width: 230px;display: block;float: left;" v-model="form.validateCode"></el-input>
          <el-button class="getCode" type="warning" @click="getSmsCode" :disabled="isDisabled">{{getCodeText}}</el-button>
        </el-form-item>
        <el-form-item label="身份证号" prop="idCode">
          <el-input v-model="form.idCode"></el-input>
        </el-form-item>
        <el-form-item label="手持身份证" prop="handId">
          <el-upload style="display: block;float: left;"
            class="avatar-uploader"
            action=""
            :before-upload="beforeAvatarUpload"
            accept="image/jpeg,image/jpg,image/png"
            :show-file-list="false"
            :on-success="handleAvatarSuccess">
            <img v-if="imgUrlBase64" :src="imgUrlBase64" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <div class="demo">
            <div class="imgDescrib">示例：</div>
            <img src="/img/pc/sample.jpg" width="130" height="148" alt="">
          </div>
        </el-form-item>

        <el-form-item>
          <el-button :loading="btnLoading" class="next" type="primary"  @click="next('form')">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { sendSmsCode, complaintResetPassword } from '@/api/auth'

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
      form: {
        sessionId: '',
        mobile: '',
        validateCode: '',
        idCode: '',
        handId: ''
      },
      // imageUrl: '',
      dialogImage: false,
      imgUrl: '',
      imgUrlBase64: '',
      getCodeText: '获取验证码',
      isDisabled: false,
      rules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        validateCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ],
        idCode: [
          { required: true, message: '请输入身份证号', trigger: 'blur' },
          { pattern: /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/, message: '请输入正确的身份证号', trigger: 'blur' }
        ],
        handId: [
          { required: true, message: '请上传手持身份证', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.form.sessionId = this.$route.query.sessionId
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
    handleAvatarSuccess (resp, file) {
      this.imgUrl = URL.createObjectURL(file.raw)
      const that = this
      const reader = new FileReader()
      reader.readAsDataURL(file.raw)
      reader.onload = function (e) {
        that.imgUrlBase64 = e.srcElement.result
      }
    },
    getSmsCode () {
      if (this.form.mobile === '') {
        this.$message('请先输入手机号')
        return
      }
      sendSmsCode(this.form.mobile).then(() => {
        this.isDisabled = true
        let time = 60
        let codeTime = setInterval(() => {
          time--
          this.getCodeText = time + 's后重新获取'
          if (time === 0) {
            this.getCodeText = '重新获取'
            this.isDisabled = false
            clearInterval(codeTime)
          }
        }, 1000)
      })
    },
    next (formName) {
      this.form.handId = this.imgUrlBase64
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          complaintResetPassword(this.form.sessionId, this.form.mobile, this.form.validateCode, this.form.idCode, this.form.handId).then(resp => {
            this.$router.push({ path: '/pc/resetPassword/cp3' })
          }).catch(() => {
            this.btnLoading = false
          })
        }
      })
    }
  }
}
</script>

<style scoped>
  .demo{
    width: 200px;
    height: 148px;
    float: right;
    overflow: hidden;
  }
  .demo .imgDescrib{
    width: 70px;
    float: left;
  }
  .demo>img{
    float: left;
  }
  .getCode{
    width: 110px;
    height: 40px;
    margin-left: 10px;
    padding: 0;
    -webkit-border-radius: 0;
    -moz-border-radius: 0;
    border-radius: 0;}
  .getCode span{
    display: block;
    height: 40px;
    line-height: 40px;
  }
</style>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 148px;
    height: 148px;
    line-height: 148px;
    text-align: center;
  }
  .avatar {
    width: 148px;
    height: 148px;
    display: block;
  }
</style>
