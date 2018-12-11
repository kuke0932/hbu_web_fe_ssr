<template>
    <div id="resetPassword1">
      <div class="formDiv">
        <div>
          <mt-field label="账号" placeholder="请输入账号"  v-model="account" @blur.native.capture="getTypes"></mt-field>
        </div>
        <div>
          <mt-field label="姓名" placeholder="请输入姓名" v-model="userName"></mt-field>
        </div>
        <div class="checkType div">
          <mt-cell class="checkTypeLeft" title="验证方式" v-model="checkType" is-link @click.native="choseTypes"></mt-cell>
          <span class="checkTypeRight" @click="getHelp">
            <img src="../../assets/icon/helpPwd.svg" width="24" height="24">
          </span>
        </div>
      </div>
      <mt-popup v-model="popupVisible" position="bottom" style="width: 100%;">
        <div class="confirm_cancel">
          <span @click="cancel">取消</span>
          <span @click="confirm">确定</span>
        </div>
        <mt-picker style="clear: both" :slots="checkTypeList" @change="onValuesChange" value-key="cname"></mt-picker>
      </mt-popup>
      <mt-popup style="width: 100%;" v-model="showHelp">
        <div class="introduce" v-if="checkTypeVal === 1">
          <h5>该功能通过手机号验证码方式，重置统一认证用户密码，在校教工学生可使用此功能。</h5>
          <h5>该流程分两个步骤，分别如下：</h5>
          <p>1.输入账号及姓名，初步校验用户信息。</p>
          <p>2.系统发送验证码给预留手机，输入验证码，重置新密码。</p>
        </div>
        <div class="introduce" v-if="checkTypeVal === 0">
          <h5>该功能通过人脸识别方式，重置统一认证用户密码，在校教工学生可使用此功能。</h5>
          <h5>该流程分两个步骤，分别如下：</h5>
          <p>1.输入账号及姓名，初步校验用户信息。</p>
          <p>2.请于光线充足条件下，拍摄3张现场头像照片用于人脸识别比对。</p>
          <p>3.人脸比对通过后，用户可输入并输重置新密码。</p>
        </div>
        <div class="introduce" v-if="checkTypeVal === 2">
          <h5>该功能通过人工申诉方式，重置统一认证用户密码，在校教工学生可使用此功能。</h5>
          <h5>该流程分三个步骤，分别如下：</h5>
          <p>1.输入账号及姓名，初步校验用户信息。</p>
          <p>2.输入手机号，获取验证码，上传手持身份证照片以及输入身份号进行申诉。</p>
        </div>
      </mt-popup>
      <div class="btn_box">
        <mt-button type="primary" style="width:100%;" @click="nextStep">下一步</mt-button>
      </div>
    </div>
</template>

<script>
import { Toast, MessageBox } from 'mint-ui'
import { jssdk, getResetPasswordTypes, resetPassword1 } from '@/api/auth'
export default {
  name: 'resetPassword1',
  head () {
    return {
      title: '找回密码'
    }
  },
  data () {
    return {
      account: '',
      userName: '',
      checkType: '请选择验证方式',
      checkTypeVal: '',
      showHelp: false,
      popupVisible: false,
      checkTypeList: [],
      selectData: [],
      hasMobile: false,
      hasHeadImg: false,
      mobile: '',
      sessionId: '',
      recommendTypeIndex: ''
    }
  },
  mounted () {
    jssdk(encodeURIComponent(location.href)).then(resp => {
      window.wx.config({
        beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
        // debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        jsApiList: ['chooseImage', 'getLocalImgData', 'hideOptionMenu', 'hideMenuItems'], // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        ...resp.data
      })
    })
    window.wx.ready(() => {
      // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
      // 隐藏右上角菜单
      window.wx.hideOptionMenu()
      // window.wx.hideMenuItems({
      //   menuList: ['menuItem:refresh'] // 要隐藏的菜单项，所有menu项见附录3
      // })
    })
  },
  methods: {
    getTypes () {
      setTimeout(() => {
        if (this.account) {
          this.checkType = ''
          getResetPasswordTypes(this.account).then(resp => {
            if (resp.status === 211) {
              MessageBox({
                title: '提示',
                message: resp.message
              })
              return
            }
            this.hasMobile = resp.data.hasMobile
            this.hasHeadImg = resp.data.hasHeadImg
            this.mobile = resp.data.mobile
            this.recommendTypeIndex = resp.data.recommendTypeIndex
            this.$set(this.checkTypeList, 0, this.getRecommendTypeList(resp.data.recommendTypeIndex))
            this.$nextTick(() => {
              const pickers = document.querySelectorAll('.picker .picker-item')
              if (!this.hasMobile) {
                pickers[1].style.color = 'lightgray'
              } else {
                pickers[1].style.color = ''
              }
              if (!this.hasHeadImg) {
                pickers[0].style.color = 'lightgray'
              } else {
                pickers[0].style.color = ''
              }
            })
          })
        } else {
          this.userName = ''
        }
      }, 200)
    },
    getRecommendTypeList (recommendTypeIndex) {
      const list = [{
        key: 0,
        cname: '人脸识别'
      }, {
        key: 1,
        cname: '手机号'
      }, {
        key: 2,
        cname: '人工申诉'
      }]
      list[recommendTypeIndex]['cname'] += '（推荐）'
      this.checkTypeVal = recommendTypeIndex
      this.checkType = list[recommendTypeIndex].cname
      this.selectData = list[recommendTypeIndex]
      return {
        flex: 1,
        defaultIndex: recommendTypeIndex,
        values: list,
        className: 'slot1',
        textAlign: 'center'
      }
    },
    choseTypes () {
      if (this.account === '') {
        Toast({
          message: '请先输入账号',
          duration: 2000
        })
        return
      }
      this.popupVisible = true
    },
    getHelp () {
      if (this.checkTypeVal === '') {
        Toast({
          message: '请先选择验证方式',
          duration: 1000
        })
        return
      }
      this.showHelp = true
    },
    onValuesChange (picker, values) {
      this.selectData = values
    },
    cancel () {
      this.popupVisible = false
    },
    confirm () {
      if (!this.selectData || !this.selectData[0]) {
        this.popupVisible = false
        return
      }
      if (this.hasMobile === false && this.selectData[0].key === 0) {
        MessageBox({
          title: '提示',
          message: '尚未绑定手机号，请选择其他方式'
        })
        return
      }
      if (this.hasHeadImg === false && this.selectData[0].key === 1) {
        MessageBox({
          title: '提示',
          message: '尚未上传头像，请选择其他方式'
        })
        return
      }
      this.checkType = this.selectData[0].cname
      this.checkTypeVal = this.selectData[0].key
      this.popupVisible = false
    },
    nextStep () {
      if (this.account === '') {
        Toast({
          message: '请输入账号',
          duration: 2000
        })
        return
      }
      if (this.userName === '') {
        Toast({
          message: '请输入姓名',
          duration: 2000
        })
        return
      }
      if (this.checkTypeVal === '') {
        Toast({
          message: '请选择验证方式',
          duration: 2000
        })
        return
      }
      const openIdOrUserId = this.$route.query.openIdOrUserId
      resetPassword1(this.account, this.userName, openIdOrUserId).then((resp) => {
        this.sessionId = resp.data.sessionId
        sessionStorage.setItem('inWechat', resp.data.inWeChat || false)
        if (this.checkTypeVal === 0) {
          this.$router.push({ path: '/auth/faceResetPassword2', query: { sessionId: this.sessionId } })
        }
        if (this.checkTypeVal === 1) {
          this.$router.push({ path: '/auth/forgetPassword2', query: { mobile: this.mobile, sessionId: this.sessionId } })
        }
        if (this.checkTypeVal === 2) {
          this.$router.push({ path: '/auth/complaintResetPassword2', query: { sessionId: this.sessionId } })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .formDiv {
    .checkType{
      display: flex;
      .checkTypeLeft{
        flex:10;
      }
      .checkTypeRight{
        flex:2;
        background: #fff;
        background-image: linear-gradient(180deg, #d9d9d9, #d9d9d9 50%, transparent 50%);
        background-size: 120% 1px;
        background-repeat: no-repeat;
        background-position: top left;
        background-origin: content-box;
        align-items: center;
        box-sizing: border-box;
        display: flex;
        font-size: 16px;
        line-height: 1;
        min-height: inherit;
        overflow: hidden;
        width: 100%;
      }
    }
  }
  .btn_box {
    position: fixed;
    width: 100%;
    bottom: 0;
  }

  .introduce{
    padding: 20px 20px 10px 20px;
    text-align: left;
    color: #888;
    h5:last-child{
      margin-bottom: 10px;
    }
    p {
      font-size: 14px;
      margin-top: 5px;
    }
  }
</style>
