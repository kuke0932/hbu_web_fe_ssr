<template>
  <div>
    <div>
      <mt-field label="账号" placeholder="请输入账号"  v-model="account"></mt-field>
      <mt-field label="姓名" v-model="userName" readonly></mt-field>
      <mt-field label="手机号" v-model="phone" readonly></mt-field>
      <mt-field label="身份证号" v-model="idCardNo" readonly></mt-field>
    </div>
    <div class="btn_box">
      <mt-button class="btn" type="primary"  @click="init">初始化</mt-button>
      <mt-button class="btn" type="default" @click="resetForm">清空</mt-button>
    </div>
  </div>
</template>

<script>
import { Toast, MessageBox } from 'mint-ui'
import { jssdk } from '@/api/auth'
import { getUserInfoById, initPassword } from '@/api/passwordInit'

// 节流函数
const delay = (() => {
  let timer = 0
  return function (callback, ms) {
    clearTimeout(timer)
    timer = setTimeout(callback, ms)
  }
})()
export default {
  name: 'initPassword',
  head () {
    return {
      title: '初始化密码'
    }
  },
  data () {
    return {
      account: '',
      userName: '',
      phone: '',
      idCardNo: ''
    }
  },
  mounted () {
    this.token = this.$route.query.token
    window.sessionStorage.setItem('x-auth-token', this.token)
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
    account () {
      delay(() => {
        if (this.account) {
          getUserInfoById(this.account).then(resp => {
            this.userName = resp.data.name
            this.phone = resp.data.mobile
            this.idCardNo = resp.data.idCardNo
          }).catch(e => {
            this.userName = ''
            this.phone = ''
            this.idCardNo = ''
          })
        } else {
          this.userName = ''
          this.phone = ''
          this.idCardNo = ''
        }
      }, 1000)
    }
  },
  methods: {
    resetForm () {
      this.account = ''
    },
    init () {
      const that = this
      if (this.account === '') {
        Toast({
          message: '请输入账号',
          duration: 2000
        })
        return
      }
      MessageBox.confirm('确定初始化吗?').then(action => {
        if (action === 'confirm') {
          initPassword(that.account, that.userName, that.idCardNo).then(resp => {
            if (resp.status === 200) {
              Toast({
                message: '初始化成功,即将关闭窗口',
                position: 'bottom',
                duration: 1000
              })
              setTimeout(() => {
                window.wx.closeWindow()
              }, 1000)
            }
          }).catch(e => { console.log(e) })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .btn_box {
    position: fixed;
    width: 100%;
    bottom: 0;
    .btn{
      width: 49%;
      display: inline-block;
    }
  }
</style>
