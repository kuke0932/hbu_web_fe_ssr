<template>
  <div id="auditList">
    <div class="container">
      <mt-navbar v-model="selected" class="navbar">
        <mt-tab-item id="one">待审核</mt-tab-item>
        <mt-tab-item id="two">已审核</mt-tab-item>
      </mt-navbar>
      <mt-tab-container v-model="selected" style="margin-top: 10px">
        <mt-tab-container-item id="one">
          <div v-if="unAuditList.length === 0 && !noMoreData && !loading" style="height: 0;">- 暂无数据 -</div>
          <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: (wrapperHeight) + 'px' }">
            <mt-loadmore :top-method="loadTop"
                         @top-status-change="handleTopChange"
                         @translate-change="translateChange"
                         ref="loadmore"
                         :style="{ minHeight: (wrapperHeight) + 'px' }">
              <ul class="page-loadmore-list"
                  v-infinite-scroll="loadMore"
                  :infinite-scroll-immediate-check="true"
                  infinite-scroll-disabled="loading"
                  infinite-scroll-distance="10">
                <li v-for="(item, index) in unAuditList" class="page-loadmore-listitem divBar" :key="index" @click="goDetail(item.id)">
                  <div class="divLeft">账号：<span>{{ item.account }}</span></div>
                  <div>手机号码：<span>{{ item.mobile }}</span></div>
                  <div class="divLeft">姓名：<span>{{ item.userName }}</span></div>
                  <div>申请时间：<span>{{ item.createTime }}</span></div>
                  <div class="IDNumber">身份证号：<span>{{ item.idCardNo }}</span></div>
                </li>
              </ul>
              <div slot="top" class="mint-loadmore-top">
                <span v-show="topStatus !== 'loading'" :class="{ 'is-rotate': topStatus === 'drop' }">↓</span>
              </div>
              <div slot="bottom" class="mint-loadmore-bottom" style="margin-bottom: 0!important;">
                <span v-show="noMoreData">无更多数据</span>
                <div v-show="loading" class="page-infinite-loading">
                  <mt-spinner type="fading-circle"></mt-spinner>
                  加载中...
                </div>
              </div>
            </mt-loadmore>
          </div>
        </mt-tab-container-item>
        <mt-tab-container-item id="two">
          <div v-if="auditList.length === 0 && !noMoreData1 && !loading1" style="height: 0;">- 暂无数据 -</div>
          <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: (wrapperHeight) + 'px' }">
            <mt-loadmore :top-method="loadTop"
                         @top-status-change="handleTopChange"
                         @translate-change="translateChange"
                         ref="loadmore1"
                         :style="{ minHeight: (wrapperHeight) + 'px' }">

              <ul class="page-loadmore-list"
                  v-infinite-scroll="loadMore"
                  :infinite-scroll-immediate-check="true"
                  infinite-scroll-disabled="loading"
                  infinite-scroll-distance="10">
                <li v-for="(item, index) in auditList" class="page-loadmore-listitem divBar" :key="index" @click="goDetail(item.id)">
                  <div class="divLeft">账号：<span>{{ item.account }}</span></div>
                  <div>手机号码：<span>{{ item.mobile }}</span></div>
                  <div class="divLeft">姓名：<span>{{ item.userName }}</span></div>
                  <div>申请时间：<span>{{ item.createTime }}</span></div>
                  <div class="IDNumber">身份证号：<span>{{ item.idCardNo }}</span></div>
                  <div class="auditStatus">审核状态：<span>{{ item.auditStatus === 2 ? '审核通过': '审核未通过' }}</span></div>
                </li>
              </ul>
              <div slot="top" class="mint-loadmore-top">
                <span v-show="topStatus1 !== 'loading'" :class="{ 'is-rotate': topStatus1 === 'drop' }">↓</span>
              </div>
              <div slot="bottom" class="mint-loadmore-bottom" style="margin-bottom: 0!important;">
                <span v-show="noMoreData1">无更多数据</span>
                <div v-show="loading1" class="page-infinite-loading">
                  <mt-spinner type="fading-circle"></mt-spinner>
                  加载中...
                </div>
              </div>
            </mt-loadmore>
          </div>
        </mt-tab-container-item>
      </mt-tab-container>
    </div>
  </div>
</template>

<script>
// import { Toast } from 'mint-ui'
import { auditList, unAuditList } from '@/api/complaintPassword'

export default {
  name: 'auditList',
  head () {
    return {
      title: '申诉列表'
    }
  },
  data () {
    return {
      selected: 'one',
      unAuditPageSize: 10,
      unAuditPageNum: 1,
      auditPageSize: 10,
      auditPageNum: 1,
      auditList: [],
      unAuditList: [],
      wrapperHeight: 0,
      loading: false,
      loading1: false,
      translate: 0,
      translate1: 0,
      topStatus: '',
      topStatus1: '',
      noMoreData: false,
      noMoreData1: false
    }
  },
  created () {
  },
  mounted () {
    this.wrapperHeight = document.documentElement.clientHeight - 60
    this.token = this.$route.query.token
    window.sessionStorage.setItem('x-auth-token', this.token)
    unAuditList(null, this.unAuditPageNum, this.unAuditPageSize).then(resp => {
      this.unAuditList = resp.data.rows
    })
    auditList(null, this.auditPageNum, this.auditPageSize).then(resp => {
      this.auditList = resp.data.rows
    })
  },
  watch: {
    translate () {
      this.$nextTick(() => {
        this.resetTransform()
      })
    }
  },
  methods: {
    goDetail (id) {
      // 跳转页面并把id传过去
      this.$router.push({ path: '/complaintAudit/auditDetail', query: { id: id } })
    },
    translateChange (translate) {
      if (this.selected === 'one') {
        this.translate = translate
      } else {
        this.translate1 = translate
      }
    },
    loadMore () {
      if (this.selected === 'one') {
        if (!this.noMoreData) {
          this.loading = true
          return unAuditList(null, this.unAuditPageNum, this.unAuditPageSize).then(resp => {
            this.unAuditList = this.unAuditList.concat(resp.data.rows)
            if (resp.data.rows.length < this.unAuditPageSize) {
              this.noMoreData = true
            }
            this.loading = false
            this.unAuditPageNum++
            return resp
          }).catch((e) => {
            this.loading = false
          })
        } else {
          return Promise.reject(new Error('no data'))
        }
      }
      if (this.selected === 'two') {
        if (!this.noMoreData1) {
          this.loading1 = true
          return auditList(null, this.auditPageNum, this.auditPageSize).then(resp => {
            this.auditList = this.auditList.concat(resp.data.rows)
            if (resp.data.rows.length < this.auditPageSize) {
              this.noMoreData1 = true
            }
            this.loading1 = false
            this.auditPageNum++
            return resp
          }).catch((e) => {
            this.loading1 = false
          })
        } else {
          return Promise.reject(new Error('no data'))
        }
      }
    },
    handleTopChange (status) {
      if (this.selected === 'one') {
        this.topStatus = status
      } else {
        this.topStatus1 = status
      }
    },
    loadTop () {
      this.reloadData().then(() => {
        if (this.selected === 'one') {
          this.$refs.loadmore.onTopLoaded()
        } else {
          this.$refs.loadmore1.onTopLoaded()
        }
      }).catch(e => {
        if (this.selected === 'one') {
          this.$refs.loadmore.onTopLoaded()
        } else {
          this.$refs.loadmore1.onTopLoaded()
        }
      })
    },
    resetTransform () {
      // eslint-disable-next-line
      // if (this.translate == '0' || this.translate == '50' || this.translate == '-50') {
      const loadmore = document.querySelector('.is-dropped')
      if (loadmore && loadmore.style.transform) {
        loadmore.style.transform = ''
      }
      // }
    },
    reloadData () {
      if (this.selected === 'one') {
        this.unAuditPageNum = 1
        this.unAuditList = []
        this.noMoreData = false
      } else {
        this.auditPageNum = 1
        this.auditList = []
        this.noMoreData1 = false
      }
      return this.loadMore()
    }
  }
}
</script>
<style scoped>
  .divBar{
    width: 96%;
    padding: 0.5rem 2%;
    background: #ffffff;
    margin-bottom: 5px;
    overflow: hidden;
  }
  .divBar>div{
    width: 57%;
    height: 1.5rem;
    line-height: 1.5rem;
    float: left;
    text-align: left;
    text-indent: 10px;
    font-size: 0.8rem;
  }
  .divBar>div.divLeft{
    width: 43%;
  }
  .divBar>div.IDNumber{
    width: 100%;
  }
  /*上拉下拉相关*/
   .loading-background, .mint-loadmore-top span {
     -webkit-transition: .2s linear;
     transition: .2s linear
   }
  .mint-loadmore-top span {
    display: inline-block;
    vertical-align: middle
  }
  .mint-loadmore-top span.is-rotate {
    -webkit-transform: rotate(180deg);
    transform: rotate(180deg)
  }
  .page-loadmore .mint-spinner {
    display: inline-block;
    vertical-align: middle
  }
  .page-loadmore-desc {
    text-align: center;
    color: #666;
    padding-bottom: 5px
  }
  /*.page-loadmore-desc:last-of-type,
  .page-loadmore-listitem {
    border-bottom: 1px solid #eee
  }
  .page-loadmore-listitem {
    height: 50px;
    line-height: 50px;
    text-align: center
  }
  .page-loadmore-listitem:first-child {
    border-top: 1px solid #eee
  }*/
  .page-loadmore-wrapper {
    /*margin-top: 95px;*/
    overflow: auto;
    -webkit-overflow-scrolling: touch
  }
  .mint-loadmore-bottom span {
    display: inline-block;
    -webkit-transition: .2s linear;
    transition: .2s linear;
    vertical-align: middle
  }
  .mint-loadmore-bottom span.is-rotate {
    -webkit-transform: rotate(180deg);
    transform: rotate(180deg)
  }
</style>
