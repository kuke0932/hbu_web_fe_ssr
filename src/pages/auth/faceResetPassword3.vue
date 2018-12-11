<template>
  <div>
    <div>
      <div >
        <template v-if="!hasMobile" >
          <mt-field label="手机号码" placeholder="请输入手机号码"  v-model="phone" ></mt-field>
          <mt-field label="验证码" v-model="captcha" placeholder="请输入验证码">
            <mt-button class="get_code" type="primary" size="small" @click="getSmsCode" :disabled="isDisabled">{{getCodeText}}</mt-button>
          </mt-field>
        </template>
        <mt-field label="新密码" placeholder="请输入新密码"  type="password" v-model="newPwd"></mt-field>
        <mt-field label="确认新密码" placeholder="请再次输入新密码" type="password" v-model="confirmPwd"></mt-field>
        <div class="checkType div" v-if="inWeChat">
          <mt-checklist
            title=""
            v-model="checked"
            :options="options2">
          </mt-checklist>
          <span class="checkTypeRight" @click="showNotice">
            <img src="../../assets/icon/helpPwd.svg" width="20" height="20">
          </span>
        </div>
      </div>
      <div class="introduce" v-if="hasMobile">
        <p>人脸识别比对成功，请输入6到20位新密码。密码需包括字母、数字、符号中至少2类</p>
      </div>
      <div class="introduce" v-else>
        <p>人脸识别比对成功，请绑定手机号，输入6到20位新密码。密码需包括字母、数字、符号中至少2类</p>
      </div>
      <div class="btn_box">
        <mt-button type="primary" style="width:100%;" @click="confirm" >提交</mt-button>
      </div>
    </div>
  </div>
</template>

<script>
import { sendSmsCode, faceResetPassword3, jssdk } from '@/api/auth'
import { Toast, MessageBox } from 'mint-ui'

export default {
  name: 'faceResetPassword3',
  head () {
    return {
      title: '找回密码'
    }
  },
  data () {
    return {
      inWeChat: false,
      checked: ['0'],
      options2: [{
        label: '将此微信用于“河北大学微门户”权限验证',
        value: '0'
      }],
      join: true,
      hasMobile: false,
      phone: '',
      captcha: '',
      newPwd: '',
      confirmPwd: '',
      sessionId: '',
      isDisabled: false,
      getCodeText: '获取验证码'
    }
  },
  mounted () {
    this.inWeChat = sessionStorage.getItem('inWeChat') || false
    jssdk(encodeURIComponent(location.href)).then(resp => {
      window.wx.config({
        beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
        // debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        jsApiList: ['closeWindow', 'hideOptionMenu'], // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        ...resp.data
      })
    })
    window.wx.ready(() => {
      // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
      // 隐藏右上角菜单
      window.wx.hideOptionMenu()
    })
    this.sessionId = this.$route.query.sessionId
    this.hasMobile = this.$route.query.hasMobile
    if (!this.hasMobile) {
      this.$toast('您尚未完善手机号，请先绑定手机号！')
    }
  },
  methods: {
    getSmsCode () {
      if (this.phone === '') {
        Toast({
          message: '请输入手机号',
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
    confirm () {
      if (!this.hasMobile) {
        const phoneRegex = /^(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/
        if (this.phone === '') {
          this.$toast('请输入手机号')
          return
        }
        if (!this.phone.match(phoneRegex)) {
          this.$toast('手机号格式错误,请输入正确的手机号')
          return
        }
        if (this.captcha === '') {
          this.$toast('请输入验证码')
          return
        }
      }
      // eslint-disable-next-line
      const passwordRegex = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[])+$)([^(0-9a-zA-Z)]|[]|[a-z]|[A-Z]|[0-9]){6,12}$/g
      if (this.newPwd === '') {
        this.$toast('请输入新密码')
        return
      }
      if (!this.newPwd.match(passwordRegex)) {
        this.$toast('请至少输入字母，数字，字符中的两种,6-12位长度')
        return
      }
      if (this.confirmPwd === '') {
        this.$toast('请确认密码')
        return
      }
      if (!this.confirmPwd.match(passwordRegex)) {
        this.$toast('请至少输入字母，数字，字符中的两种,6-12位长度')
        return
      }
      if (this.newPwd !== this.confirmPwd) {
        this.$toast('两次密码输入不一致')
        return
      }
      if (this.checked[0] === '0' && this.inWeChat) {
        this.join = true
      } else {
        this.join = false
      }
      faceResetPassword3(this.sessionId, this.newPwd, this.confirmPwd, this.phone, this.captcha, this.join).then(resp => {
        const instance = this.$toast({
          message: '密码重置成功'
        })
        setTimeout(() => {
          instance.close()
          window.wx.closeWindow()
        }, 2000)
      })
    },
    showNotice () {
      MessageBox.alert(
        '1.微信验证用于关联您在河北大学微门户中的身份，为您开放更多个性化应用权限。<br />2.请使用河北大学统一认证用户信息验证您的身份。'
      ).then(action => {
        console.log(action)
      })
    }
  }
}
</script>

<style scoped lang="less">
  .btn_box {
    position: fixed;
    width: 100%;
    bottom: 0;
  }
  .introduce{
    margin-top: 10px;
    padding: 10px 20px;
    text-align: left;
    color: #888;
    p {
      font-size: 14px;
      margin-top: 5px;
    }
  }
  .checkType{
    display: flex;
    background: none;
    .checkTypeLeft{
      /*flex:10;*/
      float: left;
      background: none;
    }
    .checkTypeRight{
      margin-top: 8px;
      /*flex:2;*/
      float: left;
      position: relative;
      img {
        margin-top: 14px;
      }
    }
    /*.checkTypeRight:after {*/
      /*content: " ";*/
      /*position: absolute;*/
      /*left: 0;*/
      /*top: 0;*/
      /*width: 100%;*/
      /*height: 1px;*/
      /*background-image: linear-gradient(180deg, #d9d9d9, #d9d9d9 50%, transparent 50%);*/
    /*}*/
  }
</style>
<style>
  .mint-checklist .mint-cell{
    background: none;
  }
  .mint-checkbox-label{
    font-size: 14px;
    color: #929292;
  }
  .mint-checkbox-core{
    width: 15px;
    height: 15px;
  }
  .mint-checkbox-core::after{
    top: 2px;
    left: 5px;
  }
  .checkType .mint-cell-wrapper{
    background: none;
  }
  .mint-msgbox-message {
    text-align: left;
  }
</style>
