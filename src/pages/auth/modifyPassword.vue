<template>
  <div class="container" id="modify">
    <div>
      <div class="registerForm" >
        <mt-field class="inputItem" id="account" label="账号" placeholder="请输入账号" v-model="account" @blur.native.capture="accountBlur"></mt-field>
        <mt-field class="inputItem" label="姓名" placeholder="请输入姓名" v-model="userName"></mt-field>
        <mt-field class="inputItem" v-if="noPhone" label="手机号" placeholder="请输入手机号码" type="tel" v-model="phone"></mt-field>
        <mt-field class="inputItem" v-if="noPhone" label="验证码" placeholder="请输入验证码" v-model="verifyCode">
          <mt-button class="get_code" type="primary" size="small" @click="getCode" :disabled="isDisabled">{{getCodeText}}</mt-button>
        </mt-field>
        <mt-field class="inputItem" label="旧密码" placeholder="请输入旧密码" type="password" v-model="oldPwd"></mt-field>
        <mt-field class="inputItem" label="新密码" placeholder="请输入新密码" type="password" v-model="newPwd"></mt-field>
        <mt-field class="inputItem" label="确认新密码" placeholder="请再次输入新密码" type="password" v-model="confirmPwd"></mt-field>
      </div>
      <div class="checkType div">
        <mt-checklist
          title=""
          v-model="checked"
          :options="options2">
        </mt-checklist>
        <span class="checkTypeRight" @click="showNotice">
          <img src="../../assets/icon/helpPwd.svg" width="20" height="20">
        </span>
      </div>
      <div class="btn_box">
        <mt-button class="btn" type="primary" @click="submitForm">提交</mt-button>
      </div>
    </div>
  </div>
</template>

<script>
import { jssdk, sendSmsCode, verifyHasMobile, modifyPassword } from '@/api/auth'
import { Toast, MessageBox } from 'mint-ui'

export default {
  name: 'modifyPassword',
  head () {
    return {
      title: '修改密码'
    }
  },
  data () {
    return {
      checked: ['0'],
      options2: [{
        label: '将此微信用于“河北大学微门户”权限验证',
        value: '0'
      }],
      join: true,
      account: '',
      userName: '',
      oldPwd: '',
      newPwd: '',
      confirmPwd: '',
      phone: '',
      verifyCode: '',
      getCodeText: '获取验证码',
      isDisabled: false,
      noPhone: false,
      weWorkVerify: true
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
              this.noPhone = false
              MessageBox.confirm(
                '您已完善手机号，手机号码为' + resp.data.replace(/(.{3}).*(.{4})/, '$1****$2') + '，是否使用此手机号？请确保手机号与本人微信绑定的手机号相同。',
                '温馨提示',
                {
                  cancelButtonText: '更换手机号'
                }
              ).then(action => {
                console.log(action)
              }).catch(err => {
                if (err === 'cancel') {
                  this.noPhone = true
                }
              })
            }
            if (resp.status === 211) {
              Toast({
                message: resp.message,
                position: 'bottom',
                duration: 2000
              })
            } else if (resp.status === 210) {
              const instance = Toast({
                message: resp.message,
                position: 'bottom'
              })
              setTimeout(() => {
                instance.close()
                this.noPhone = true
              }, 2000)
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
    showNotice () {
      MessageBox.alert(
        '1.微信验证用于关联您在河北大学微门户中的身份，为您开放更多个性化应用权限。<br />2.请使用河北大学统一认证用户信息验证您的身份。'
      ).then(action => {
        console.log(action)
      })
    },
    submitForm () {
      const phone = /^(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/
      if (this.account === '') {
        Toast({
          message: '请输入账号',
          position: 'bottom',
          duration: 1000
        })
        return
      }
      if (this.userName === '') {
        Toast({
          message: '请输入姓名',
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
      if (this.oldPwd === '') {
        this.$toast('请输入旧密码')
        return
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
      if (this.checked[0] === '0') {
        this.join = true
      } else {
        this.join = false
      }
      modifyPassword(this.account, this.userName, this.oldPwd, this.newPwd, this.confirmPwd, this.phone, this.verifyCode, this.weWorkVerify, this.join).then(resp => {
        if (resp.status === 200) {
          Toast({
            message: '提交成功,即将关闭窗口',
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
    background: none;
    .registerForm {
      .inputItem:last-child {
        /*border-bottom: 0.5px solid #d9d9d9;*/
      }
      .get_code {
        font-size: 0.7rem;
      }
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
  /* 单选 */
  label.bui-radios-label input {
    position: absolute;
    opacity: 0;
    visibility: hidden;
  }

  label.bui-radios-label .bui-radios {
    display: inline-block;
    position: relative;
    width: 13px;
    height: 13px;
    background: #FFFFFF;
    border: 1px solid #979797;
    border-radius: 50%;
    vertical-align: -2px;
  }

  label.bui-radios-label input:checked + .bui-radios:after {
    position: absolute;
    content: "";
    width: 7px;
    height: 7px;
    background-color: #fff;
    border-radius: 50%;
    top: 3px;
    left: 3px;
  }

  label.bui-radios-label input:checked + .bui-radios {
    background: #00B066;
    border: 1px solid #00B066;
  }

  label.bui-radios-label input:disabled + .bui-radios {
    background-color: #e8e8e8;
    border: solid 1px #979797;
  }

  label.bui-radios-label input:disabled:checked + .bui-radios:after {
    background-color: #c1c1c1;
  }

  label.bui-radios-label.bui-radios-anim .bui-radios {
    -webkit-transition: background-color ease-out .3s;
    transition: background-color ease-out .3s;
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
