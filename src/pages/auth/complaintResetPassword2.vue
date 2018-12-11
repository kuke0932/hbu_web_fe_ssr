<template>
  <div>
    <div class="container" >
      <mt-field label="手机号码" placeholder="请输入手机号码"  v-model="phone" ></mt-field>
      <mt-field label="验证码" v-model="verifyCode" placeholder="请输入验证码">
        <mt-button class="get_code" type="primary" size="small" @click="getSmsCode" :disabled="isDisabled">{{getCodeText}}</mt-button>
      </mt-field>
      <mt-field label="身份证号" placeholder="请输入身份证号" v-model="idCardNo"></mt-field>
      <mt-field label="手持身份证" class="upLoadImgs" v-remove-input>
        <div class="imgItem" id="img0" style="float: left;" @click="chooseImg">
          <div v-show="!handIdCard" class="text">点击拍摄图片</div>
          <img v-show="handIdCard" :src="handIdCard" alt="" style="width: 100%;">
          <div v-show='handIdCard' class="mask" @click.prevent.stop="deleteImg"></div>
        </div>
        <div @click="showHandIdCardExamplePopup" class="tip">查看示例</div>
      </mt-field>
    </div>
    <mt-popup class="imgs" v-model="handIdCardExampleVisible">
      <!--<div class="saveImg"></div>-->
      <img src="/img/sample375.jpg">
    </mt-popup>
    <div class="next">
      <mt-button type="primary"  style="width:100%;" @click="submit">提交</mt-button>
    </div>
  </div>
</template>

<script>
import { Toast, MessageBox } from 'mint-ui'
import { jssdk, sendSmsCode, complaintResetPassword } from '@/api/auth'

export default {
  name: 'complaintResetPassword',
  head () {
    return {
      title: '找回密码'
    }
  },
  data () {
    return {
      sessionId: '',
      phone: '',
      verifyCode: '',
      idCardNo: '',
      handIdCard: '', // 手持身份证
      getCodeText: '获取验证码',
      isDisabled: false,
      handIdCardExampleVisible: false
    }
  },
  mounted () {
    jssdk(encodeURIComponent(location.href)).then(resp => {
      window.wx.config({
        beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
        // debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        jsApiList: ['chooseImage', 'getLocalImgData', 'closeWindow', 'hideOptionMenu', 'hideMenuItems'], // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
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
    this.sessionId = this.$route.query.sessionId
  },
  directives: {
    'remove-input' (el, binding, vnode) {
      const mtinput = el.querySelector('input')
      mtinput.parentNode.removeChild(mtinput)
    }
  },
  methods: {
    showHandIdCardExamplePopup () {
      this.handIdCardExampleVisible = true
    },
    chooseImg () {
      const that = this
      window.wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
        defaultCameraMode: 'batch', // 表示进入拍照界面的默认模式，目前有normal与batch两种选择，normal表示普通单拍模式，batch表示连拍模式，不传该参数则为normal模式。（注：用户进入拍照界面仍然可自由切换两种模式）
        success: function (res) {
          const localIds = res.localIds // 返回选定照片的本地ID列表，
          // andriod中localId可以作为img标签的src属性显示图片；
          // 而在IOS中需通过上面的接口getLocalImgData获取图片base64数据，从而用于img标签的显示
          window.wx.getLocalImgData({
            localId: localIds[0], // 图片的localID
            success: function (res) {
              let localData = res.localData // localData是图片的base64数据，可以用img标签显示
              if (localData.substring(0, 20).indexOf('data:image') === -1) {
                localData = 'data:image/png;base64,' + localData
              }
              that.handIdCard = localData
            }
          })
        }
      })
    },
    deleteImg () {
      const that = this
      MessageBox.confirm('确定删除吗?').then(action => {
        if (action === 'confirm') {
          that.handIdCard = ''
        }
      })
    },
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
    submit () {
      const phone = /^(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/
      if (this.phone === '') {
        Toast({
          message: '请输入手机号',
          duration: 1000
        })
        return
      }
      if (!phone.test(this.phone)) {
        Toast({
          message: '手机号格式错误',
          duration: 1000
        })
        return
      }
      if (this.verifyCode === '') {
        Toast({
          message: '请输入验证码',
          duration: 1000
        })
        return
      }
      if (this.idCardNo === '') {
        Toast({
          message: '请输入身份证号码',
          duration: 1000
        })
        return
      }
      if (this.handIdCard === '') {
        Toast({
          message: '请上传手持身份证照片',
          duration: 1000
        })
        return
      }
      complaintResetPassword(this.sessionId, this.phone, this.verifyCode, this.idCardNo, this.handIdCard).then(resp => {
        const instance = Toast({
          message: '申诉成功,即将关闭窗口'
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
<style scoped>
  .container {
    margin-bottom: 50px;
  }
  .next{
    position: fixed;
    bottom: 0;
    width: 100%;
  }
  .imgItem {
    position: relative;
    margin: 10px 0;
    width: 10rem;
    min-height: 7rem;
    border: 1px dashed #ccc;
    border-radius: 0.5rem;
    overflow: hidden;
    background: url("../../assets/icon/uploader.svg") center 2.2rem no-repeat;
    background-color: #fff;
    /*box-shadow: 8px 8px 5px #aaa;*/
  }
  .text {
    position: absolute;
    top: 0.8rem;
    left: 50%;
    margin-left: -43px;
    font-size: 0.9rem;
    color: #aaa;
  }
  .mask {
    z-index: auto;
    position: absolute;
    top: 0;
    left:0;
    width:100%;
    height: 100%;
    background: rgba(0,0,0, 0.5) center no-repeat;
    background-image: url("../../assets/icon/delete.svg");
  }
  .upLoadImgs input{
    display: none;
  }
  .tip{
    float: left;
    margin: 10px 0;
    min-height: 2rem;
    line-height: 2rem;
    text-indent: 0.5rem;
    font-size: 0.9rem;
    color: #cccccc;
  }
  .imgs{
    width: 100%;
  }
  .imgs img{
    display: block;
    width: 100%;
    height: auto;
  }
  .saveImg{
    width: 100%;
    height: 200px;
    background: url(/img/sample375.jpg) no-repeat center center;
    background-size: contain;
  }
  .mask {
    z-index: auto;
    position: absolute;
    top: 0;
    left:0;
    width:100%;
    height: 100%;
    background: rgba(0,0,0, 0.5) center no-repeat;
    background-image: url("../../assets/icon/delete.svg");
  }
</style>
