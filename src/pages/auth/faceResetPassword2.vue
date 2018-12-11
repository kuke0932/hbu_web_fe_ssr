<template>
    <div>
      <p class="noticeInfor">
        我们将拍摄您的两张头像信息，用于校验您的身份信息。
      </p>
      <div class="img_box">
        <div class="imgItem" id="img0" @click="choose(0)">
          <p v-show='!imgUrl[0]' class="text">开始了啊，严肃点</p>
          <img v-show="imgUrl[0]" :src="imgUrl[0]" alt="" style="width: 100%;">
          <div v-show='imgUrl[0]' class="mask" @click.prevent.stop="deleteImg(0)"></div>
        </div>
        <div class="imgItem" id="img1" @click="choose(1)">
          <p v-show='!imgUrl[1]'  class="text">笑一笑，心情好</p>
          <img v-show="imgUrl[1]" :src="imgUrl[1]" alt="" style="width: 100%;">
          <div v-show='imgUrl[1]' class="mask" @click.prevent.stop="deleteImg(1)"></div>
        </div>
        <!--<div class="imgItem" id="img2" @click="choose(2)">-->
          <!--<div v-show='!imgUrl[2]'  class="text">拍摄第三张头像照片</div>-->
          <!--<img v-show="imgUrl[2]" :src="imgUrl[2]" alt="" style="width: 100%;">-->
          <!--<div v-show='imgUrl[2]' class="mask" @click.prevent.stop="deleteImg(2)"></div>-->
        <!--</div>-->
      </div>
      <div class="btn_box">
        <mt-button type="primary" style="width:100%;" @click="nextStep">下一步</mt-button>
      </div>
    </div>
</template>

<script>
import { jssdk, faceResetPassword2 } from '@/api/auth'
import { Toast, MessageBox } from 'mint-ui'
export default {
  name: 'faceResetPassword2',
  head () {
    return {
      title: '找回密码'
    }
  },
  data () {
    return {
      screenHeight: 1000,
      sessionId: '',
      specialty: '',
      classGrade: '',
      imgUrl: ['', '', '']
    }
  },
  mounted () {
    this.screenHeight = window.screen.height
    console.log(location.href)
    jssdk(encodeURIComponent(location.href)).then(resp => {
      window.wx.config({
        beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
        // debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        jsApiList: ['chooseImage', 'getLocalImgData', 'hideOptionMenu'], // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        ...resp.data
      })
    })
    // window.wx.ready(() => {
    //   // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
    //   // 隐藏右上角菜单
    //   window.wx.hideOptionMenu()
    // })
    this.sessionId = this.$route.query.sessionId
    this.resetImgDivSize(9 / 16)
  },
  methods: {
    choose (num) {
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
              that.$set(that.imgUrl, num, localData)
            }
          })
        }
      })
    },
    deleteImg (num) {
      const that = this
      MessageBox.confirm('确定删除吗?').then(action => {
        if (action === 'confirm') {
          that.$set(that.imgUrl, num, '')
        }
      })
    },
    nextStep () {
      if (this.imgUrl[0] === '' || this.imgUrl[1] === '') {
        Toast({
          message: '请上传2幅图片',
          duration: 1000
        })
        return
      }
      faceResetPassword2(this.sessionId, this.imgUrl[0], this.imgUrl[1], '').then(resp => {
        if (resp.status === 200) {
          this.$router.push({ path: '/auth/faceResetPassword3', query: { sessionId: resp.data.sessionId, hasMobile: resp.data.hasMobile } })
        } else {
          Toast({
            message: resp.message,
            duration: 2000
          })
        }
      })
    },
    resetImgDivSize (ratio) {
      const imgItems = document.querySelectorAll('.imgItem')
      for (let i = 0; i < imgItems.length; i++) {
        imgItems[i].style.minHeight = (imgItems[i].offsetWidth * ratio) + 'px'
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .noticeInfor {
    font-size: 0.9rem;
    padding: .4rem 1.5rem;
    color: #999;
    text-align: left;
  }
  .img_box {
    width: 100%;
    padding: 0 0 4rem 0;
    color: #bbb;
    .imgItem:first-child {
      margin-top: 0;
    }
    .imgItem {
      position: relative;
      margin:1rem auto;
      width: 80%;
      border: 1px dashed #ccc;
      border-radius: 0.5rem;
      overflow: hidden;
      background: url("../../assets/icon/uploader.svg") center no-repeat;
      background-color: #fff;
      box-shadow: 8px 8px 5px #aaa;
      .text {
        /*position: absolute;*/
        /*top: 1rem;*/
        /*left: 50%;*/
        /*margin-left: -72px;*/
        margin-top: 20px;
      }
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

  }
  .btn_box {
    position: fixed;
    width: 100%;
    bottom: 0;
  }
</style>
