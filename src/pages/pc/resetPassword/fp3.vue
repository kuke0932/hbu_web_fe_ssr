<template>
  <div class="tabItem steps2" style="display: block;">
    <div class="step2">
      <div class="steps" style="width: 888px;">
        <ul>
          <li class="bgStep1_1">基本资料</li>
          <li class="bgStep2_2">上传照片</li>
          <li class="bgStep3_3 bgStep3_3Selected">设置新密码</li>
          <li class="bgStep4_4">完成</li>
        </ul>
      </div>
      <div style="padding: 20px 0 0;">人脸比对成功！请填写如下信息：</div>
      <el-form ref="form" :rules="rules" :model="form" label-width="100px" class="forms" style="margin-top: 30px;">
        <template v-if="!hasMobile">
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="form.mobile"></el-input>
          </el-form-item>
          <el-form-item label="验证码" prop="validateCode">
            <el-input style="width: 230px;display: block;float: left;" v-model="form.validateCode"></el-input>
            <el-button type="warning" class="getCode" @click="getSmsCode" :disabled="isDisabled">{{getCodeText}}</el-button>
          </el-form-item>
        </template>
        <el-form-item label="新密码" prop="newPwd">
          <el-input type="password" v-model="form.newPwd"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPwd">
          <el-input type="password" v-model="form.confirmPwd"></el-input>
        </el-form-item>
        <el-form-item label="" v-if="inWeChat">
          <el-checkbox v-model="checked">加入河北大学微门户</el-checkbox>
          <span @click="showNotice">
          <img src="../../../assets/icon/helpPwd.svg" width="24" height="24" style="vertical-align: -6px">
        </span>
        </el-form-item>
        <el-form-item>
          <el-button :loading="btnLoading" class="next" type="primary"  @click="next('form')">下一步</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { sendSmsCode, faceResetPassword3 } from '@/api/auth'

export default {
  name: 'baseInfo',
  head () {
    return {
      title: '找回密码'
    }
  },
  data () {
    return {
      inWeChat: false,
      checked: true,
      form: {
        sessionId: null,
        mobile: '',
        validateCode: '',
        newPwd: '',
        confirmPwd: ''
      },
      btnLoading: false,
      hasMobile: null,
      isDisabled: false,
      getCodeText: '获取验证码',
      rules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        validateCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ],
        newPwd: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { pattern: /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{6,12}$/, message: '请至少输入字母，数字，字符中的两种,6-12位长度', trigger: 'blur' }
        ],
        confirmPwd: [
          { required: true, message: '请确认新密码', trigger: 'blur' },
          { pattern: /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{6,12}$/, message: '请至少输入字母，数字，字符中的两种,6-12位长度', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.inWeChat = sessionStorage.getItem('inWeChat')
    this.form.sessionId = this.$route.query.sessionId
    this.hasMobile = this.$route.query.hasMobile
    if (this.hasMobile) {
    } else {
      this.$message('您尚未完善手机号，请先绑定手机号！')
    }
  },
  methods: {
    getSmsCode () {
      if (this.form.mobile === '') {
        this.$message('请输入手机号')
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
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          if (this.form.newPwd !== this.form.confirmPwd) {
            this.$message('两次输入的密码不一致')
            this.form.confirmPwd = ''
            this.btnLoading = false
            return
          }
          if (this.checked === true && !this.inWeChat) {
            this.join = true
          } else {
            this.join = false
          }
          faceResetPassword3(this.form.sessionId, this.form.newPwd, this.form.confirmPwd, this.form.mobile, this.form.validateCode, this.join).then(resp => {
            this.$router.push({ path: '/pc/resetPassword/fp4' })
          }).catch(() => {
            this.btnLoading = false
          })
        }
      })
    },
    showNotice () {
      this.$alert('1. 微信验证用于关联您在河北大学微门户中的身份，为您开放更多个性化应用权限。<br />2. 请使用河北大学统一认证用户信息验证您的身份。', '温馨提示', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        callback: action => {}
      })
    }
  }
}
</script>

<style scoped>
  .getCode{
    width: 110px;
    height: 40px;
    padding: 0;
    margin-left: 10px;
    -webkit-border-radius: 0;
    -moz-border-radius: 0;
    border-radius: 0;}
  .getCode>span{
    display: block;
    width: 100%;
    height: 40px;
    line-height: 40px;
  }
</style>
