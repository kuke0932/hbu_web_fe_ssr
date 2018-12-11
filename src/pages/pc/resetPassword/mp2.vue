<template>
  <div class="tabItem steps2" style="display: block;">
    <div class="step2">
      <div class="steps">
        <ul>
          <li class="bgStep1">基本信息</li>
          <li class="bgStep2 bgStep2Selected">手机验证</li>
          <li class="bgStep3">完成</li>
        </ul>
      </div>
      <el-form ref="form" :rules="rules" :model="form" label-width="100px" class="forms" style="margin-top: 60px;">
        <el-form-item label="手机号码">
          <el-input v-model="showPhone" disabled></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="validateCode">
          <el-input style="width: 230px;display: block;float: left;" v-model="form.validateCode"></el-input>
          <el-button class="getCode" type="warning" @click="getSmsCode" :disabled="isDisabled" size="mini" round>{{getCodeText}}</el-button>
        </el-form-item>
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
          <el-button type="primary" :loading="btnLoading"  @click="next('form')">下一步</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { sendSmsCode, resetPasswordByMobile } from '@/api/auth'
import { Base64 } from 'js-base64'

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
      join: true,
      form: {
        sessionId: null,
        mobile: '',
        validateCode: '',
        newPwd: '',
        confirmPwd: ''
      },
      btnLoading: false,
      phone: '',
      showPhone: '',
      isDisabled: false,
      getCodeText: '获取验证码',
      rules: {
        validateCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ],
        newPwd: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { pattern: /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{6,12}$/, message: '请至少输入字母，数字，字符中的两种,6-12位长度', trigger: 'blur' }
        ],
        confirmPwd: [
          { required: true, message: '请确认新密码', trigger: 'blur' },
          { pattern: /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{6,12}$/, message: '6-12个字符长度，必须含有英文字母和数字', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.inWeChat = sessionStorage.getItem('inWeChat')
    this.form.sessionId = this.$route.query.sessionId
    this.form.mobile = Base64.decode(this.$route.query.mobile)
    this.phone = this.form.mobile
    this.showPhone = '*******' + this.form.mobile.substring(7)
  },
  methods: {
    getSmsCode () {
      sendSmsCode(this.phone).then(resp => {
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
          resetPasswordByMobile(this.form.sessionId, this.form.validateCode, this.form.newPwd, this.form.confirmPwd, this.join).then(resp => {
            this.$router.push({ path: '/pc/resetPassword/mp3' })
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
    margin-left: 10px;
    -webkit-border-radius: 0;
    -moz-border-radius: 0;
    border-radius: 0;}
  .getCode span{
    display: block;
    height: 40px;
    line-height: 40px;
  }
</style>
