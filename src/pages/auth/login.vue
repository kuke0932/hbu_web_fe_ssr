<template>
  <div class="container" :style="'height:' + screenHeight + 'px'">
    <div style="height: 40px;width: 100%;"></div>
    <h2>河北大学校园微信</h2>
    <div class="logo">
      <img src="../../assets/logo.jpg" alt="" style="width: 65%;">
  </div>
    <div class="form">
      <!--<img src="../../assets/icon/username.svg" alt="">-->
      <mt-field icon="back" class="form_item" label="帐  号" placeholder="请输入用户名"  v-model="username"></mt-field>
      <!--<img src="../../assets/icon/password.svg" alt="">-->
      <mt-field style="border-bottom: 0.5px solid #D9D9D9" class="form_item" label="密  码" placeholder="请输入密码" type="password" v-model="password"></mt-field>
    </div>
    <div class="pwd_set">
      <span @click="forgetPassword">忘记密码？</span> | <span @click="complaintPassword">  &nbsp;密码申诉?</span>
    </div>
    <div class="btn_box">
      <mt-button class="btn" type="primary" @click="login">登录</mt-button>
    </div>
  </div>
</template>

<script>
import { login, jssdk } from '@/api/auth'
import { Toast } from 'mint-ui'

export default {
  name: 'login',
  head () {
    return {
      title: '登录'
    }
  },
  data () {
    return {
      screenHeight: 1000,
      username: '',
      password: ''
    }
  },
  mounted () {
    this.screenHeight = document.documentElement.clientHeight
    jssdk(encodeURIComponent(location.href)).then(resp => {
      window.wx.config({
        beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
        // debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        jsApiList: ['closeWindow'], // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        ...resp.data
      })
    })
  },
  methods: {
    login () {
      if (this.username === '') {
        Toast({
          message: '帐号不能为空',
          duration: 1000
        })
        return
      }
      if (this.password === '') {
        Toast({
          message: '密码不能为空',
          duration: 1000
        })
        return
      }
      const code = this.getQueryVariable('code')
      login(this.username, this.password, code).then(resp => {
        if (resp.status === 200) {
          Toast({
            message: '登录成功,即将关闭窗口',
            position: 'bottom',
            duration: 2000
          })
          setTimeout(() => {
            window.wx.closeWindow()
          }, 2000)
        }
      })
    },
    forgetPassword () {
      this.$router.push({ path: '/auth/forgetPassword1' })
    },
    complaintPassword () {
      this.$router.push({ path: '/auth/complaintResetPassword2' })
    }
  }
}
</script>
<style lang="less" scoped>
  .container{
    background: #fff;
    h2{
      width:100%;
      text-align: center;
      height: auto;
      font-size: 28px;
      letter-spacing: 2px;
      color: #444;
    }
    .logo{
      width:100%;
      margin-top: 15px;
      height: auto;
      text-align: center;
    }
    .form {
      padding: 0 1rem 0 1.5rem;
      margin-top: 0.5rem;
      img {
        float:left;
        width: 1.2rem;
        margin-top: 0.8rem;
      }
      .form_item{
        /*border-bottom: 1px solid #eee;*/
      }
    }
    .pwd_set {
      color: #ccc;
      font-size: 0.8rem;
      text-align: right;
      padding: 1rem 2rem;
    }
    .btn_box {
      margin-top: 1rem;
      width: 100%;
      text-align: center;
      .btn{
        width: 80%;
      }
    }
  }
</style>
