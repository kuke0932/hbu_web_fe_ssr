<template>
  <div id="borrowReturn">
    <!--<div class="search">-->
      <!--<div class="cell1">-->
        <!--<mt-cell v-model="beginTimeSelected" is-link @click.native="openBeginTimePicker"></mt-cell>-->
      <!--</div>-->
      <!--<div class="cell2">-->
        <!--<mt-cell v-model="endTimeSelected" is-link @click.native="openEndTimePicker"></mt-cell>-->
      <!--</div>-->
    <!--</div>-->
    <mt-navbar v-model="selected" class="navbar">
      <mt-tab-item id="one">未还记录</mt-tab-item>
      <mt-tab-item id="two">历史记录</mt-tab-item>
    </mt-navbar>
    <mt-tab-container v-model="selected" style="margin-top: 10px">
      <mt-tab-container-item id="one">
        <div v-if="borrowList.length === 0 && !noMoreData && !loading" style="height: 0;">- 暂无数据 -</div>
        <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: (wrapperHeight) + 'px' }">
          <mt-loadmore :top-method="loadTop"
                       @top-status-change="handleTopChange"
                       @translate-change="translateChange"
                       ref="loadmore"
                       :style="{ minHeight: (wrapperHeight) + 'px' }">
            <ul class="page-loadmore-list roomList"
                v-infinite-scroll="loadMore"
                :infinite-scroll-immediate-check="true"
                infinite-scroll-disabled="loading"
                infinite-scroll-distance="10">
              <li v-for="(item, index) in borrowList" class="page-loadmore-listitem roomItem" :key="index">
                <p class="firstTitle">{{item.bookTitle}}</p>
                <p><span>借书日期：</span>{{item.bookDateCheckout}}</p>
                <p><span>应还日期：</span>{{item.bookDateDue}}</p>
                <!--<p><span>实还日期：</span>{{item.shrq}}</p>-->
                <!--<i class="tip"><img src="../../assets/icon/go.svg" alt=""></i>-->
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
        <div v-if="historyList.length === 0 && !noMoreData1 && !loading1" style="height: 0;">- 暂无数据 -</div>
        <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: (wrapperHeight) + 'px' }">
          <mt-loadmore :top-method="loadTop"
                       @top-status-change="handleTopChange"
                       @translate-change="translateChange"
                       ref="loadmore1"
                       :style="{ minHeight: (wrapperHeight) + 'px' }">
            <ul class="page-loadmore-list roomList"
                v-infinite-scroll="loadMore"
                :infinite-scroll-immediate-check="true"
                infinite-scroll-disabled="loading"
                infinite-scroll-distance="10">
              <li v-for="(item, index) in historyList" class="page-loadmore-listitem roomItem" :key="index">
                <p class="firstTitle">{{item.bookTitle}}</p>
                <p><span>借书日期：</span>{{item.bookDateCheckout}}</p>
                <p><span>应还日期：</span>{{item.bookDateDue}}</p>
                <!--<p><span>实还日期：</span>{{item.shrq}}</p>-->
                <!--<i class="tip"><img src="../../assets/icon/go.svg" alt=""></i>-->
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
    <mt-datetime-picker
      ref="picker1"
      v-model="beginTime"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日"
      :endDate="new Date()"
      type="date"
      @confirm="choseBeginTime">
    </mt-datetime-picker>
    <mt-datetime-picker
      ref="picker2"
      v-model="endTime"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日"
      :endDate="new Date()"
      type="date"
      @confirm="choseEndTime">
    </mt-datetime-picker>
  </div>
</template>

<script>
import { myBorrowedBook } from '@/api/educational'
import { Toast } from 'mint-ui'

export default {
  name: 'borrowReturn',
  head () {
    return {
      title: '借阅记录'
    }
  },
  data () {
    return {
      selected: 'one',
      beginTime: new Date(),
      endTime: new Date(),
      beginTimeFormat: '',
      endTimeFormat: '',
      beginTimeSelected: '选择开始日期',
      endTimeSelected: '选择结束日期',
      beginTimeVisible: false,
      endTimeVisible: false,
      borrowPageNum: 1,
      borrowPageSize: 10,
      borrowList: [],
      historyPageNum: 1,
      historyPageSize: 10,
      historyList: [],
      noMoreData: false,
      noMoreData1: false,
      wrapperHeight: 0,
      translate: 0,
      translate1: 0,
      topStatus: '',
      topStatus1: '',
      loading: false,
      loading1: false

    }
  },
  watch: {
    translate () {
      this.$nextTick(() => {
        this.resetTransform()
      })
    }
  },
  created () {
  },
  mounted () {
    this.wrapperHeight = document.documentElement.clientHeight - 60
    this.token = this.$route.query.token
    window.sessionStorage.setItem('x-auth-token', this.token)
    myBorrowedBook(0, null, null, this.borrowPageNum, this.borrowPageSize).then(resp => {
      this.borrowList = resp.data
    })
    myBorrowedBook(1, null, null, this.historyPageNum, this.historyPageSize).then(resp => {
      this.historyList = resp.data
    })
  },
  methods: {
    openBeginTimePicker () {
      this.$refs.picker1.open()
    },
    openEndTimePicker () {
      this.$refs.picker2.open()
    },
    isTen (num) {
      return num < 10 ? '0' + num : num
    },
    choseBeginTime (e) {
      if (this.endTimeFormat) {
        if (e > this.endTimeFormat) {
          Toast({
            message: '开始日期不能大于结束日期',
            position: 'middle',
            duration: 1000
          })
          return
        }
      }
      this.beginTimeFormat = e
      const year = e.getFullYear()
      const month = e.getMonth() + 1
      const date = e.getDate()
      this.beginTimeSelected = year + '-' + this.isTen(month) + '-' + this.isTen(date)
    },
    choseEndTime (e) {
      if (this.beginTimeFormat) {
        if (e < this.beginTimeFormat) {
          Toast({
            message: '结束日期不能小于开始日期',
            position: 'middle',
            duration: 1000
          })
          return
        }
      }
      this.endTimeFormat = e
      const year = e.getFullYear()
      const month = e.getMonth() + 1
      const date = e.getDate()
      this.endTimeSelected = year + '-' + this.isTen(month) + '-' + this.isTen(date)
    },
    searchBooks () {
      if (this.beginTimeSelected === '选择开始日期') {
        Toast({
          message: '请选择开始日期',
          position: 'middle',
          duration: 1000
        })
        return
      }
      if (this.endTimeSelected === '选择结束日期') {
        Toast({
          message: '请选择结束日期',
          position: 'middle',
          duration: 1000
        })
        return
      }
      this.reloadData()
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
          return myBorrowedBook(0, null, null, this.borrowPageNum, this.borrowPageSize).then(resp => {
            this.borrowList = this.borrowList.concat(resp.data)
            if (resp.data.length < this.borrowPageSize) {
              this.noMoreData = true
            }
            this.loading = false
            this.borrowPageNum++
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
          return myBorrowedBook(1, null, null, this.historyPageNum, this.historyPageSize).then(resp => {
            this.historyList = this.historyList.concat(resp.data)
            if (resp.data.length < this.historyPageSize) {
              this.noMoreData1 = true
            }
            this.loading1 = false
            this.historyPageNum++
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
        this.borrowPageNum = 1
        this.borrowList = []
        this.noMoreData = false
      } else {
        this.historyPageNum = 1
        this.historyList = []
        this.noMoreData1 = false
      }
      return this.loadMore()
    }
  }
}
</script>

<style scoped lang="less">
  .search{
    width: 100%;
    height: 48px;
    position: fixed;
    top: 0;
    color: #888;
    .cell1 {
      width: 50%;
      height: 100%;
      position: absolute;
      left: 0;
      border-right: 1px solid whitesmoke;
      box-sizing: border-box;
    }
    .cell2 {
      width: 50%;
      position: absolute;
      right: 0;
      box-sizing: border-box;
    }
  }
  .roomList{
    list-style: none;
    .roomItem:nth-child(odd) {
      background: #4caf50;
    }
    .roomItem:nth-child(even) {
      background: #26a2ff;
    }
    .roomItem{
      margin: 8px 20px;
      border-radius: 6px;
      padding: 0.6rem 1rem;
      position: relative;
      color: #fff;
      .firstTitle {
        /*border-left: 3px solid #ddd;*/
        font-size: 1.1rem;
        font-weight: bold;
        padding-left: 0.8rem;
        margin-left: -1rem;
      }
      p {
        text-align: left;
        font-size: 0.9rem;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        span{
          width: 70px;
          display: inline-block;
        }
      }
      .tip{
        position: absolute;
        right: 0.5rem;
        top: 40%;
        width: 2rem;
        height: 2rem;
        img {
          width: 1.5rem;
          height: 1.5rem;
        }
      }
    }
  }
  // 上拉下拉相关
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
    /*margin-top: 100px;*/
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
