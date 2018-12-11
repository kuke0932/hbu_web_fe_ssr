<template>
  <div class="container register">
    <div class="registerForm">
      <mt-field label="账号" placeholder="请输入账号" v-model="username"><span class="must">*</span></mt-field>
      <mt-field label="密码" placeholder="请输入密码" type="password" v-model="password"><span class="must">*</span></mt-field>
      <mt-field label="手机号码" placeholder="请输入手机号码" type="tel" v-model="phone"><span class="must">*</span></mt-field>
      <mt-field class="captcha" label="验证码" placeholder="请输入验证码" v-model="captcha">
        <span class="must">*</span>
        <mt-button class="get_code" type="primary" size="small" @click="getCode" :disabled="isDisabled">{{getCodeText}}</mt-button>
      </mt-field>
      <mt-field label="邮箱地址" placeholder="请输入邮箱地址" type="email" v-model="email"><span class="must">*</span></mt-field>
    </div>
    <div class="pwd_set">
      <span @click="forgetPassword">忘记密码？</span> | <span @click="complaintPassword">  &nbsp;密码申诉?</span>
    </div>
    <div class="btn_box">
      <mt-button class="btn" type="primary" @click="register">注册</mt-button>
    </div>
    <div class="helpBtn" style="position: fixed; bottom: 30px;right: 30px;">
      <mt-palette-button  @expanded="goHelp" content="帮助" mainButtonStyle="color:#fff;background-color:#26a2ff;font-size:1rem" direction="rt" class="pb" :radius="80">
        <div class="my-icon-button"></div>
      </mt-palette-button>
    </div>
    <mt-popup v-model="popupVisible" style="width: 95%;border-radius: 10px;overflow: hidden">
      <div style="padding: 0.5rem;font-weight: bold;font-size: 1.3rem">注册成功!</div>
      <img src="/img/qrcode.png" style="width: 100%;">
    </mt-popup>
  </div>
</template>

<script>
import { register, sendSmsCode } from '@/api/auth'
import { Toast } from 'mint-ui'

export default {
  name: 'register',
  head () {
    return {
      title: '注册'
    }
  },
  data () {
    return {
      username: '',
      password: '',
      email: '',
      phone: '',
      captcha: '',
      popupVisible: false,
      getCodeText: '获取验证码',
      isDisabled: false
    }
  },
  methods: {
    goHelp () {
      this.$router.push({ path: '/auth/help' })
    },
    forgetPassword () {
      this.$router.push({ path: '/auth/forgetPassword' })
    },
    complaintPassword () {
      this.$router.push({ path: '/auth/complaintResetPassword' })
    },
    getCode () {
      const phone = /^(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/
      if (this.phone === '') {
        Toast({
          message: '请输入手机号',
          position: 'bottom',
          duration: 1000
        })
        return
      }
      if (!phone.test(this.phone)) {
        Toast({
          message: '手机号格式错误',
          position: 'bottom',
          duration: 1000
        })
        return
      }
      sendSmsCode(this.phone).then(() => {
        Toast({
          message: '发送成功！',
          position: 'bottom',
          duration: 1000
        })
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
    register () {
      const phone = /^(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/
      const email = /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/
      if (this.username === '') {
        Toast({
          message: '请输入用户名',
          position: 'bottom',
          duration: 1000
        })
        return
      }
      if (this.password === '') {
        Toast({
          message: '请输入密码',
          position: 'bottom',
          duration: 1000
        })
        return
      }
      if (this.phone === '') {
        Toast({
          message: '请输入手机号',
          position: 'bottom',
          duration: 1000
        })
        return
      }
      if (!phone.test(this.phone)) {
        Toast({
          message: '手机号格式错误',
          position: 'bottom',
          duration: 1000
        })
        return
      }
      if (this.captcha === '') {
        Toast({
          message: '请输入验证码',
          position: 'bottom',
          duration: 1000
        })
        return
      }
      if (this.email === '') {
        Toast({
          message: '请输入邮箱',
          position: 'bottom',
          duration: 1000
        })
        return
      }
      if (!email.test(this.email)) {
        Toast({
          message: '邮箱格式错误',
          position: 'bottom',
          duration: 1000
        })
        return
      }
      register(this.username, this.password, this.captcha, this.email, this.phone).then(resp => {
        this.popupVisible = true
      }).catch(e => {
        Toast({
          message: e.response.data.message,
          position: 'bottom',
          duration: 1000
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .container {
    .registerForm {
      .get_code {
        font-size: 0.7rem;
      }
      .must {
        display: inline-block;
        float: right;
        color: #e4393c;
        font-size: 1.3rem;
        width: 20px;
        height: 32px;
        line-height: 42px;
      }
    }
    .pwd_set {
      color: #ccc;
      font-size: 0.8rem;
      text-align: right;
      padding: 1rem 2rem;
    }
    .btn_box {
      margin-top: 2rem;
      width: 100%;
      text-align: center;
      .btn{
        width: 80%;
      }
    }
  }
</style>
