<template>
  <div :style="'min-height:' + screenHeight + 'px'" class="container register">
    <div style="height: 30px;width: 100%;"></div>
    <div class="logo">
      <img src="../../assets/logo.jpg" alt="" style="width: 60%;">
    </div>
    <div>
      <div class="registerForm" >
        <mt-field class="inputItem" @blur.native.capture="accountBlur" id="account" label="账号" placeholder="请输入账号" v-model="account"></mt-field>
        <mt-field class="inputItem" v-if="!hasPhone" label="密码" placeholder="请输入密码" type="password" v-model="password"></mt-field>
        <mt-field class="inputItem" v-if="!hasPhone" label="手机号" placeholder="请输入手机号码" type="tel" v-model="phone"></mt-field>
        <mt-field class="inputItem" v-if="!hasPhone" label="验证码" placeholder="请输入验证码" v-model="captcha">
          <mt-button class="get_code" type="primary" size="small" @click="getCode" :disabled="isDisabled">{{getCodeText}}</mt-button>
        </mt-field>
      </div>
      <div class="line"></div>
      <div class="noticeInfor">
        <p>1.在校教职工已开通统一认证帐号，用户名为工资号，初始密码为身份证号末6位</p>
        <p>2.在校学生已开通统一认证帐号，本科生及研究生用户名为学号，初始密码为身份证号末6位</p>
        <p style="padding-bottom: 10px">3.用户初次登录须绑定手机，主要用于用户密码自助找回。</p>
      </div>
      <div class="btn_box">
        <mt-button v-if="!hasPhone && !doChangePhone" class="btn" type="primary" @click="register">绑定手机号</mt-button>
        <mt-button v-if="!hasPhone && doChangePhone" class="btn" type="primary" @click="register">更改手机号</mt-button>
      </div>
    </div>
  </div>
</template>

<script>
import { jssdk, sendSmsCode, verifyHasMobile, registerHelper } from '@/api/auth'
import { Toast, MessageBox } from 'mint-ui'

export default {
  name: 'register',
  head () {
    return {
      title: '绑定手机号'
    }
  },
  data () {
    return {
      screenHeight: 1000,
      account: '',
      password: '',
      email: '',
      phone: '',
      captcha: '',
      getCodeText: '获取验证码',
      isDisabled: false,
      hasPhone: true,
      needVerify: 'yes',
      doChangePhone: false
    }
  },
  directives: {
    'mtfocus' (el, binding, vnode) {
      const value = binding.value
      const mtinput = el.querySelector('input')
      mtinput.onfocus = () => {
      }
      mtinput.onblur = () => {
        value.methods.call(this, value)
      }
    }
  },
  mounted () {
    this.screenHeight = document.documentElement.clientHeight - 41
    const url = window.location.href
    this.needVerify = decodeURIComponent(url.split('?')[1])
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
  },
  watch: {
    account: function (e) {
      if (!e) {
        document.querySelector('#account input').focus()
      }
    }
  },
  methods: {
    accountBlur () {
      setTimeout(() => {
        if (this.account) {
          verifyHasMobile(this.account).then((resp) => {
            if (resp.status === 200) {
              this.hasPhone = true
              MessageBox.confirm(
                '您已绑定手机号，手机号码为' + resp.data.replace(/(.{3}).*(.{4})/, '$1****$2') + '，是否更换此手机号？请确保手机号与本人微信绑定的手机号相同。',
                '温馨提示',
                {
                  cancelButtonText: '取消操作',
                  confirmButtonText: '更换手机号'
                }
              ).then(action => {
                this.doChangePhone = true
                this.hasPhone = false
              }).catch(err => {
                console.log(err)
              })
            }
            if (resp.status === 211) {
              this.hasPhone = true
              this.doChangePhone = true
              Toast({
                message: resp.message,
                position: 'bottom',
                duration: 2000
              })
            } else if (resp.status === 210) {
              this.hasPhone = false
              this.doChangePhone = false
            }
          })
        }
      }, 200)
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
      if (this.account === '') {
        Toast({
          message: '请输入账号',
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
      if (this.phone && !phone.test(this.phone)) {
        Toast({
          message: '手机号格式错误',
          position: 'bottom',
          duration: 1000
        })
        return
      }
      registerHelper(this.account, this.password, this.captcha, this.phone).then(resp => {
        if (resp.status === 200) {
          Toast({
            message: '操作成功,即将关闭窗口',
            position: 'bottom',
            duration: 1000
          })
          setTimeout(() => {
            window.wx.closeWindow()
          }, 1000)
        }
      }).catch(e => {
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .container {
    background: #fff;
    padding-bottom: 41px;
    .logo {
      width: 100%;
      height: auto;
      text-align: center;
    }
    .noVerify {
      p {
        margin-top: 2rem;
        font-size: 1.1rem;
        padding: 1rem;
        color: #666;
      }
    }
    .noticeInfor {
      padding: 0 2rem;
      text-align: left;
      font-size: 0.6rem;
      color: #999;
      margin-top: 0.5rem;
    }
    .registerForm {
      padding: .5rem 1rem 0 1rem;
      /*.inputItem:last-child {
        position: relative;
      }
      .inputItem:last-child:after {
        content: " ";
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 1px;
        background-image: linear-gradient(180deg, #d9d9d9, #d9d9d9 50%, transparent 50%);
      }*/
      .get_code {
        font-size: 0.7rem;
      }
    }
    .line {
      margin: 0 1rem 0 .3rem;
      background-image: linear-gradient(180deg, #d9d9d9, #d9d9d9 50%, transparent 51%);
      background-size: 120% 1px;
      background-repeat: no-repeat;
      background-position: top left;
      background-origin: content-box;
      align-items: center;
      box-sizing: border-box;
      display: flex;
      font-size: 16px;
      line-height: 1;
      height: 1px;
      overflow: hidden;
      padding: 0 10px;
      width: 100%;
    }
    .btn_box {
      position: fixed;
      bottom: 0;
      width: 100%;
      .btn{
        width: 100%;
      }
    }
  }
</style>
