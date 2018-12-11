<template>
  <div>
    <div class="container">
      <mt-field label="手机号码" :disable-clear="true" placeholder="请输入手机号码" readonly v-model="showPhone" ></mt-field>
      <mt-field label="验证码" v-model="captcha" placeholder="请输入验证码">
        <mt-button class="get_code" type="primary" size="small" @click="getSmsCode" :disabled="isDisabled">{{getCodeText}}</mt-button>
      </mt-field>
      <mt-field label="新密码" placeholder="请输入新密码"  type="password" v-model="newPwd"></mt-field>
      <mt-field label="确认新密码" placeholder="请确认新密码" type="password" v-model="confirmPwd"></mt-field>
      <div class="checkType div" v-if="!inWeChat">
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
    <div class="next">
      <mt-button type="primary"  style="width:100%;" @click="submit">提交</mt-button>
    </div>
  </div>
</template>

<script>
import { Toast, MessageBox } from 'mint-ui'
import { sendSmsCode, resetPasswordByMobile, jssdk } from '@/api/auth'
export default {
  name: 'phoneResetPassword',
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
      sessionId: '',
      accountDisabled: false,
      phone: '',
      showPhone: '',
      email: '',
      answer: '',
      captcha: '',
      newPwd: '',
      confirmPwd: '',
      getCodeText: '获取验证码',
      isDisabled: false
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
    const mobile = this.$route.query.mobile
    this.phone = mobile
    this.showPhone = '*******' + mobile.substring(7)
  },
  methods: {
    showNotice () {
      MessageBox.alert(
        '1.微信验证用于关联您在河北大学微门户中的身份，为您开放更多个性化应用权限。<br />2.请使用河北大学统一认证用户信息验证您的身份。'
      ).then(action => {
        console.log(action)
      })
    },
    getSmsCode () {
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
    submit () {
      if (this.captcha === '') {
        Toast({
          message: '请输入验证码',
          duration: 1000
        })
        return
      }
      // 上面分别判断
      // eslint-disable-next-line
      const passwordRegex = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[])+$)([^(0-9a-zA-Z)]|[]|[a-z]|[A-Z]|[0-9]){6,12}$/g
      if (this.newPwd === '') {
        Toast({
          message: '请输入新密码',
          duration: 1000
        })
        return
      }
      if (!this.newPwd.match(passwordRegex)) {
        this.$toast('请至少输入字母，数字，字符中的两种,6-12位长度')
        return
      }
      if (this.confirmPwd === '') {
        Toast({
          message: '请确认新密码',
          duration: 1000
        })
        return
      }
      if (!this.confirmPwd.match(passwordRegex)) {
        this.$toast('请至少输入字母，数字，字符中的两种,6-12位长度')
        return
      }
      if (this.newPwd !== this.confirmPwd) {
        Toast({
          message: '两次输入密码不一致',
          duration: 1000
        })
        return
      }
      if (this.checked[0] === '0' && !this.inWechat) {
        this.join = true
      } else {
        this.join = false
      }
      resetPasswordByMobile(this.sessionId, this.captcha, this.newPwd, this.confirmPwd, this.join).then(resp => {
        const instance = Toast({
          message: '修改成功,即将关闭窗口'
        })
        setTimeout(() => {
          instance.close()
          window.wx.closeWindow()
        }, 2000)
      })
    }
  }
}
</script>
<style scoped lang="less">
 .next{
   position: fixed;
   bottom: 0;
   width: 100%;
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
