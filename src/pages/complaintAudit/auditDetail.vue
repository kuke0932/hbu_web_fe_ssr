<template>
  <div >
    <div class="container auditDetail" id="auditDetail">
      <mt-cell title="账号" v-model="detail.account"></mt-cell>
      <mt-cell title="姓名" v-model="detail.userName"></mt-cell>
      <mt-cell title="手机号码" v-model="detail.mobile"></mt-cell>
      <mt-cell title="身份证号" v-model="detail.idCardNo"></mt-cell>
      <mt-cell title="手持身份证" class="handID">
        <div :style="{width: (windowWidth * 0.6) +'px'}">
          <div :style="{width: (windowWidth * 0.4) +'px', height:'100px'}">
            <img @click="showPopup(detail.handIdCard)" :src="detail.handIdCard" style="width: 100px;height: 100px;float: right">
            <!--<img class="img" src="/img/1.jpg" @click="showPopup">-->
          </div>
        </div>
      </mt-cell>
      <mt-cell title="申请时间" v-model="detail.createTime"></mt-cell>
      <mt-cell title="申请IP地址" v-model="detail.complaintIp"></mt-cell>
      <mt-cell title="审核状态" v-model="detail.auditStatusText"></mt-cell>
      <mt-cell title="审核人" v-model="detail.auditUserName"></mt-cell>
      <mt-cell title="审核时间" v-model="detail.updateTime"></mt-cell>
      <mt-cell title="审核IP地址" v-model="detail.auditIp"></mt-cell>
      <mt-cell title="申请者终端类型" v-model="detail.terminalType"></mt-cell>
      <mt-cell title="申请者浏览器类型" v-model="detail.browserType"></mt-cell>
      <mt-cell title="申请者浏览器内核" v-model="detail.browserKernel"></mt-cell>
      <mt-cell v-if="detail.auditStatus === 3" title="不通过原因" v-model="detail.reason"></mt-cell>
    </div>
    <mt-popup class="imgs" v-model="showImg">
      <swiper  v-if="showImg" :options="swiperOption" ref="imgOverview" style="height: 100%;">
        <swiper-slide>
          <div class="swiper-zoom-container">
            <img class="img" :style="imgStyle" :src="detail.handIdCard">
            <!--<img class="img" :style="imgStyle" src="/img/123.jpg">-->
          </div>
        </swiper-slide>
      </swiper>
      <div style="margin-top: 10px">
        <img v-if="showImg" src="../../assets/icon/closeImg.svg" alt="" @click="closeBox">
      </div>
    </mt-popup>
    <div v-if="detail.auditStatus === 1" style="width: 100%;height: 3rem;"></div>
    <div class="next">
      <mt-button class="btn" type="primary" v-if="detail.auditStatus === 1" @click="auditPass">审核通过</mt-button>
      <mt-button class="btn" type="danger" v-if="detail.auditStatus === 1" @click="auditNoPass">审核不通过</mt-button>
    </div>
    <mt-popup
      v-model="noPassReasonListPopup">
      <mt-radio class="radioClass"
        title="请选择不通过原因"
        v-model="selectedReason"
        :options="['照片不清晰', '人证不符', '手动输入']">
      </mt-radio>
      <mt-field v-if="selectedReason === '手动输入'" label="" placeholder="请填写原因" type="textarea" rows="4" v-modal="noPassReasonByType"></mt-field>
      <mt-button style="margin-bottom: 10px;" type="danger" @click="btnSubmit">提交</mt-button>
    </mt-popup>
  </div>
</template>

<script>
import { MessageBox } from 'mint-ui'
import { auditDetail, audit } from '@/api/complaintPassword'
export default {
  name: 'auditDetail',
  head () {
    return {
      title: '申诉详情'
    }
  },
  data () {
    return {
      windowWidth: 0,
      imgStyle: {},
      detail: {},
      showImg: false,
      swiperOption: {
        width: 0,
        zoom: true,
        initialSlide: 0
      },
      noPassReasonListPopup: false,
      selectedReason: '',
      noPassReasonByType: ''
    }
  },
  mounted () {
    this.windowWidth = window.screen.width
    this.swiperOption.width = window.innerWidth
    this.imgStyle = {
      height: (document.documentElement.clientHeight - 120) + 'px'
    }
    this.id = this.$route.query.id
    auditDetail(this.id).then(resp => {
      this.detail = resp.data
      this.detail.handIdCard = URL.createObjectURL(this.dataURLtoBlob(resp.data.handIdCard))
      this.detail.auditStatusText = this.detail.auditStatus === 1 ? '待审核' : this.detail.auditStatus === 2 ? '审核通过' : this.detail.auditStatus === 3 ? '审核不通过' : ''
    })
  },
  updated () {
  },
  watch: {
    'showImg': function (e) {
      if (e === true) {
        this.stop()
        // const state = {
        //   title: 'title',
        //   url: '/complaintAudit/auditDetail'
        // }
        // window.history.pushState(state, null, '#/complaintAudit/auditDetail')
        // window.addEventListener('popstate', function (e) {
        //   this.showImg = false
        // }, false)
      } else {
        // window.removeEventListener('popstate', function (e) {
        //   e.preventDefault()
        // }, false)
        this.move()
      }
    }
  },
  methods: {
    showPopup () {
      this.showImg = true
    },
    closeBox () {
      this.showImg = false
    },
    auditPass () {
      audit(this.id, 2, '').then(resp => {
        this.detail.auditStatus = 2
        this.detail.auditStatusText = '审核通过'
      })
    },
    auditNoPass () {
      this.noPassReasonListPopup = true
    },
    btnSubmit () {
      if (this.selectedReason !== '手动输入') {
        this.noPassReasonByType = this.selectedReason
      }
      if (this.selectedReason === '') {
        MessageBox.alert('请选择不通过原因!', '提示')
      } else if (this.noPassReasonByType === '') {
        MessageBox.alert('请手动填写不通过原因!', '提示')
      }
      audit(this.id, 3, this.noPassReasonByType).then(resp => {
        this.detail.auditStatus = 3
        this.detail.auditStatusText = '审核不通过'
        this.detail.reason = this.noPassReasonByType
      })
    },
    dataURLtoBlob (dataurl) {
      const arr = dataurl.split(',')
      const mime = arr[0].match(/:(.*?);/)[1]
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new Blob([u8arr], { type: mime })
    },
    /* 滑动限制 */
    stop () {
      const mo = function (e) { e.preventDefault() }
      document.body.style.overflow = 'hidden'
      document.addEventListener('touchmove', mo, false)// 禁止页面滑动
    },
    /* 取消滑动限制 */
    move () {
      const mo = function (e) { e.preventDefault() }
      document.body.style.overflow = '' // 出现滚动条
      document.removeEventListener('touchmove', mo, false)
    }
  }
}
</script>
<style scoped lang="less">
  .next{
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    text-align: center;
    .btn{
      width: 50%;
      border-radius: 0;
      float: left;
    }
  }
  .mint-popup{
    padding: 0 20px;
  }
</style>
<style>
  .radioClass .mint-radiolist-title{
    font-size: 17px;
  }
  .handID .mint-cell-wrapper .mint-cell-value{
    padding: 10px 0;
  }
  .imgs{
    margin: 0 auto;
    background: inherit!important;
  }
</style>
