<template>
    <div id="books">
      <div class="searchInfo">
        <div class="cell1">
          <mt-cell v-model="searchTypeValue" is-link @click.native="showSearchType = true"></mt-cell>
        </div>
        <div class="cell2">
          <mt-field placeholder="输入搜索内容" v-model.trim="searchContent">
            <mt-button type="primary" size="small" @click.native="searchBooks">搜索</mt-button>
          </mt-field>
        </div>
        <div class="cell3">
          <!--<img src="../../assets/icon/select.svg" alt="">-->
        </div>
      </div>
      <div v-if="booksList.length === 0 && loading !== true" style="margin-top: 50px;text-align: center;color: #666;line-height: 50px; height: 50px;">
        - 请输入内容进行搜索 -
      </div>
      <div v-else class="page-loadmore-wrapper" ref="wrapper" :style="{ height: (wrapperHeight) + 'px' }">
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
            <li v-for="(item, index) in booksList" class="page-loadmore-listitem roomItem" :key="index" @click="goDetail(item)">
              <p class="firstTitle">{{item.title}}</p>
              <p><span>作者：</span>{{item.authors}}</p>
              <p><span>标准号：</span>{{item.isn}}</p>
              <p><span>出版社：</span>{{item.publisher}} - {{item.pubDate}}</p>
              <i class="tip"><img src="../../assets/icon/go.svg" alt=""></i>
            </li>
          </ul>

          <div slot="top" class="mint-loadmore-top">
            <span v-show="topStatus !== 'loading'" :class="{ 'is-rotate': topStatus === 'drop' }">↓</span>
            <!--<span v-show="topStatus === 'loading'">-->
              <!--<mt-spinner type="snake"></mt-spinner>-->
            <!--</span>-->
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
      <mt-popup
        style="width: 100%;"
        v-model="showSearchType"
        position="bottom">
        <div class="confirm_cancel">
          <span  @click="showSearchType = false">取消</span>
          <span @click="confirm">确定</span>
        </div>
        <mt-picker style="clear: both"  :slots="searchTypeList" @change="chooseSearchType" value-key="value"></mt-picker>
      </mt-popup>
    </div>
</template>

<script>
import { listBook } from '@/api/educational'
import { Toast } from 'mint-ui'
// 节流函数
// const delay = (() => {
//   let timer = 0
//   return function (callback, ms) {
//     clearTimeout(timer)
//     timer = setTimeout(callback, ms)
//   }
// })()
const cachedData = {}

export default {
  name: 'books',
  head () {
    return {
      title: '馆藏查询'
    }
  },
  data () {
    return {
      searchTypeList: [
        {
          flex: 1,
          values: [
            {
              id: 1,
              value: '关键词'
            },
            {
              id: 2,
              value: 'ISBN码'
            },
            {
              id: 3,
              value: '索书号'
            }
          ],
          className: 'slot1',
          textAlign: 'center'
        }
      ],
      pickerValue: '',
      searchType: 1,
      searchTypeValue: '关键词',
      searchContent: '',
      showSearchType: false,
      noMoreData: false,
      wrapperHeight: 0,
      pageNum: 1,
      pageSize: 10,
      booksList: [],
      translate: 0,
      topStatus: '',
      loading: false,
      bookDetail: {}
    }
  },
  watch: {
    // searchContent () {
    //   delay(() => {
    //     this.reloadData()
    //   }, 1000)
    // },
    // translate () {
    //   this.$nextTick(() => {
    //     this.resetTransform()
    //   })
    // }
  },
  asyncData (context) {
    if (cachedData.data) {
      return { ...cachedData.data }
    } else {
      return {}
    }
  },
  created () {
  },
  mounted () {
    this.wrapperHeight = document.documentElement.clientHeight - 50
  },
  methods: {
    chooseSearchType (picker, values) {
      this.pickerValue = values[0]
    },
    confirm () {
      this.searchType = this.pickerValue.id
      this.searchTypeValue = this.pickerValue.value
      this.showSearchType = false
    },
    searchBooks () {
      if (this.searchContent === '') {
        Toast({
          message: '请输入搜索内容',
          position: 'middle',
          duration: 1000
        })
        return
      }
      this.reloadData()
    },
    goDetail (item) {
      cachedData.data = this._data
      this.$router.push({ path: '/portal/bookDetails', query: { bookInfo: item } })
    },
    fetchData (searchContent, searchType, pageNum, pageSize) {
      return listBook(searchContent, searchType, pageNum, pageSize)
    },
    translateChange (translate) {
      this.translate = translate
    },
    loadMore () {
      if (!this.noMoreData) {
        this.loading = true
        return this.fetchData(this.searchContent, this.searchType, this.pageNum, this.pageSize).then(resp => {
          this.booksList = this.booksList.concat(resp.data)
          if (resp.data.length < this.pageSize) {
            this.noMoreData = true
          }
          this.loading = false
          this.pageNum++
        }).catch((e) => {
          this.loading = false
          console.log(e)
        })
      } else {
        return Promise.reject(new Error('no data'))
      }
    },
    handleTopChange (status) {
      this.topStatus = status
    },
    loadTop () {
      this.reloadData().then((resp) => {
        this.$refs.loadmore.onTopLoaded()
      }).catch(e => {
        this.$refs.loadmore.onTopLoaded()
        console.log(e)
      })
    },
    // resetTransform () {
    //   // eslint-disable-next-line
    //   // if (this.translate == '0' || this.translate == '50' || this.translate == '-50') {
    //   const loadmore = document.querySelector('.is-dropped')
    //   if (loadmore && loadmore.style.transform) {
    //     console.log(loadmore.style.transform)
    //     loadmore.style.transform = ''
    //   }
    //   // }
    // },
    reloadData () {
      this.noMoreData = false
      this.pageNum = 1
      this.booksList = []
      return this.loadMore()
    }
  }
}
</script>

<style scoped lang="less">
  .searchInfo{
    width: 100%;
    height: 48px;
    position: fixed;
    top: 0;
    color: #888;
    z-index: 100;
    .cell1 {
      width: 30%;
      height: 100%;
      position: absolute;
      left: 0;
      border-right: 1px solid whitesmoke;
      box-sizing: border-box;
      .searchType {
        width: 100%;
        height: 100%;
        border: 0;
        outline: none;
        font-size: 0.9rem;
        color: #888;
        border-top: 0.3px solid #ddd;
      }
    }
    .cell2 {
      width: 70%;
      position: absolute;
      right: 0;
      border-right: 1px solid whitesmoke;
      box-sizing: border-box;
    }
    .cell3 {
      width: 0;
      height: 100%;
      position: absolute;
      right: 0;
      background: #fff;
      border-top: 0.3px solid #ddd;
      justify-content: center;
      align-items: center;
      display: flex;
    }
  }
  .roomList{
    list-style: none;
    .roomItem{
      margin: 8px 20px;
      border-radius: 6px;
      padding: 0.6rem 1rem;
      background: #fff;
      position: relative;
      .firstTitle {
        font-size: 1.1rem;
        font-weight: bold;
        border-left: 3px solid #26a2ff;
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
          width: 60px;
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
    margin-top: 50px;
    /*overflow: auto;*/
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
